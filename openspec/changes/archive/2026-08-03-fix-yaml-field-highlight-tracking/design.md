## Context

See proposal.md for the two defects being fixed. Current implementation (from `yaml-field-highlight`, already shipped):

- `useFieldHighlight(path)` (`src/components/form/useFieldHighlight.ts`) returns `onMouseEnter` / `onMouseLeave` / `onClick`, called independently by `TextField`, `NumberField`, `SliderField`, `ObjectGroup`, `RepeatableObjectList`, and `PrimitiveArrayField`, each spreading the handlers onto its own root element (`FieldWrapper`'s div for scalars, the `<fieldset>` for the others). `RepeatableObjectList` and `PrimitiveArrayField` apply it to their own outer `<fieldset>` (the whole array's path), in addition to each item/property's own nested field carrying its own path further down.
- `useYamlHighlightStore` (`src/store/yamlHighlight.ts`) holds `hoveredPath` and `selectedPath`. `clearHovered(path)` only clears if `hoveredPath` still equals `path` - a guard meant to stop a stale leave event from clobbering a newer hover, but with no way to fall back to an enclosing container's path.
- Native `mouseenter`/`mouseleave` (what the current handlers use) don't bubble: each element's enter/leave fires only when that specific element's own boundary is crossed. Moving from a nested field back to the unoccupied area of its own already-entered enclosing `<fieldset>` crosses no new boundary, so nothing re-fires enter on the container - only the nested field's leave fires, clearing the shared state to `null` with nothing to restore it. This is the root cause of both reported symptoms (hover over "Personal information" appears dead, and generally "moving to the parent zone" not registering) - they're the same mechanism, not two bugs.
- `RepeatableObjectList` / `PrimitiveArrayField` also render interactive controls (add/remove/move buttons, an `@dnd-kit` drag handle) as descendants of their own path-bearing `<fieldset>`.

## Goals / Non-Goals

**Goals:**
- Resolve "which field, if any, is under the pointer/was clicked" freshly from the actual DOM position on every relevant event, instead of relying on which element's enter/leave last fired - so returning to an enclosing container's own area always resolves correctly.
- Make an outside click (YAML pane, add/remove/move/drag controls, empty page area) fall out of the same resolution naturally, rather than adding a separate special case.

**Non-Goals:**
- Changing what "corresponds to a field" means (still the schema `path`, still resolved via the existing `serializeToYamlWithRanges` map) - unaffected by this fix.
- Changing the visual highlight treatment or the click-scrolls-preview behavior - both already correct and unaffected.

## Decisions

### Replace independent per-node listeners with one delegated resolver

Each field-bearing root element gets a `data-field-path` attribute (the same `path.join('.')` string already used as the store key) instead of `onMouseEnter`/`onMouseLeave`/`onClick` props. `useFieldHighlight(path)` changes shape accordingly, returning `{ 'data-field-path': string }` to spread - the same six call sites keep calling it, only what they spread changes.

Two listeners, registered once (e.g. in a small effect near the app root, not per field):
- `mouseover` (bubbles, unlike `mouseenter`) - on every element the pointer moves onto, resolve the nearest relevant ancestor from `event.target` and call `setHovered(resolved)`, where `resolved` is `null` when nothing relevant matches. Because *every* transition - onto a field, onto blank space, onto the YAML pane - fires its own `mouseover` bubbling to the listener, hover state is recomputed fresh each time; there's no separate "leave" case to get wrong.
- `click` - same resolution, calling `setSelected(resolved)`. An outside click (YAML pane, a button, empty page area) resolves to `null` and clears the selection for free, with no separate "is this outside a field" check.

Both listeners share one resolver: walk up from `event.target` via `closest('[data-field-path], button, a')`; if the nearest match has `data-field-path`, that's the resolved path; if the nearest match is a plain interactive control (`button`/`a`) reached *before* any `data-field-path` ancestor, treat it as `null` (no field). This second clause matters concretely: `RepeatableObjectList`/`PrimitiveArrayField`'s add/remove/move/drag-handle buttons are DOM descendants of that component's own path-bearing `<fieldset>` (the whole array's path) - without this clause, clicking "+ Add" would resolve to the array's own path and select it instead of clearing the selection, contradicting the new "clicking a non-field control clears the selection" requirement.

**Alternative considered:** keep per-node `mouseenter`/`mouseleave`, and on leave, walk up the DOM to find the nearest ancestor's own `data-field-path` and restore hover to that instead of `null`. Rejected: this reimplements, by hand, exactly what native event bubbling already gives for free via a delegated `mouseover`/`click` pair - more code for the same result, and still one-off per listener rather than a single shared resolver.

**Alternative considered:** `mousemove` instead of `mouseover` for hover. Rejected: fires continuously as the pointer moves across a single element, not just on transitions - `mouseover` already fires exactly on each element-to-element transition (it bubbles, unlike `mouseenter`), which is the only signal needed here, at a fraction of the event volume.

### Store simplification

`clearHovered(path)`'s "only clear if it still matches" guard existed to protect against a stale leave clobbering a newer enter under the old per-node model. With resolution now centralized and authoritative on every event, that race can't occur - `setHovered`/`setSelected` simply become `(path: string | null) => void`, replacing `setHovered`/`clearHovered`/`setSelected`.

### Pointer leaving the browser viewport

`mouseover` only fires when the pointer moves onto a new element inside the document; if the pointer leaves the viewport entirely (onto browser chrome or another window), no further `mouseover` fires and hover would stay stuck on the last field. Add a `mouseout` check at the same delegation point: when `event.relatedTarget` is `null` (the standard signal for "left the document"), clear hover. This is the one case `mouseover` alone can't cover.

## Risks / Trade-offs

- **[Risk]** The "stop at a button before a data-field-path ancestor" rule only accounts for `button`/`a` today. If a future field container nests some other interactive control between itself and the pointer, that control would incorrectly resolve to the container's field. Mitigation: the current set of controls nested this way (add/remove/move buttons, the drag handle) are all plain `<button>` elements - the rule matches today's actual markup; revisit if a different control type is added inside a container field later.
- **[Trade-off]** Every field-bearing component still needs touching (to switch from handler props to a `data-field-path` attribute), same six files as before - mechanical, but no way around it short of a wrapper element (already rejected in the original design for layout-risk reasons, which still holds).
- **[Risk]** `@dnd-kit`'s own pointer handling on the drag handle button runs independently of these new listeners; since the two are unrelated event registrations (not nested handler calls), a drag gesture doesn't need special handling here - the drag handle is a `<button>`, so it already resolves to "no field" per the rule above, consistent with not selecting the array during a drag.
