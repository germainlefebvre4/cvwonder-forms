## Context

See `proposal.md` for motivation. Relevant current state:

- `useCvValidation()` exposes `errorsByPath: Record<string, ValidationIssue[]>`, keyed by dot-joined instance path (e.g. `"career.0.companyName"`), and `errorCount`.
- `src/schema/sectionStatus.ts` already derives a per-section status (`empty` / `filled` / `error`) from `errorsByPath` plus `touchedSections` (from the CV document store), suppressing `error` for a required, untouched, empty section - the exact "no errors on a blank form" rule this change must also respect.
- `sectionElementId(sectionKey)` gives sections a stable, predictable DOM id (`cv-section-<key>`) used today for the section nav's scroll-spy and click-to-scroll. Individual fields have no equivalent: `TextField`/`NumberField`/etc. each call React's `useId()`, which is opaque and not derivable from a path.
- `fieldLabelKey(schemaPath)` maps a *schema* path (no array indices) to an i18n key (e.g. `fields.career.companyName`). `errorsByPath`'s keys are *instance* paths (with array indices for repeatable sections), so there is currently no helper that turns an instance path into a human label while also preserving which repeatable entry it came from.
- `validationMessage(issue)` maps an ajv issue keyword to a localized message key/params (e.g. "this field is required") - this is the "reason" half of "where and why"; it does not currently carry the field's own label, since inline errors render right below the field itself and don't need to restate its name.
- `SectionNav` is `lg:sticky lg:top-6` on desktop (≥1024px) and a plain (non-sticky) horizontally scrollable pill row below that breakpoint.
- Decided in exploration (recorded here, not repeated as open questions): desktop and mobile both in scope, desktop is priority; clicking an error jumps to the exact field, not just its section; the counter itself is always visible, the detailed list is on-demand; the feature must never disrupt editing (no modal, no auto-open, no forced scroll except on explicit activation); repeatable-section entries must be distinguished by index in the list.

## Goals / Non-Goals

**Goals:**
- A global error counter visible at any scroll position, on desktop and mobile.
- An on-demand list of every counted error, naming its section, repeatable entry (if applicable), and reason.
- Activating a list entry scrolls to and focuses the exact field, then closes the list.
- Zero disruption: nothing opens, scrolls, or steals focus without explicit user action.

**Non-Goals:**
- No change to validation logic, rules, or what counts as an error (`schema/validator.ts` untouched).
- No change to the existing inline per-field error display (`FieldErrorList`) - this adds a second, complementary path to the same errors, it doesn't replace the first.
- No change to the section nav's own per-section status dots or their behavior.
- No rich filtering/sorting/search within the error list - a flat, form-ordered list is sufficient for the scenarios in scope.

## Decisions

### Desktop placement: pinned to the existing sticky sidebar, not a new sticky header
The counter renders at the top of `SectionNav`'s existing `lg:sticky` container instead of introducing a second sticky/fixed element (e.g. a sticky page header). The sidebar is already pinned on desktop, so this is a pure addition to an existing mount point.
- Alternative considered: make the page `<header>` (which hosts today's plain error count) sticky - rejected because it would pin the whole header bar (title, import/export, theme/language switches) permanently on screen, a bigger layout change than this feature needs, and redundant with the sidebar already being sticky.

### Mobile placement: a small fixed floating badge, not a sticky pill row
Below `1024px`, the counter renders as a compact `position: fixed` badge (e.g. bottom-right corner) rather than making the section-nav pill row sticky.
- Alternative considered: pin the mobile pill row (`position: sticky top-0`) - rejected because it would permanently consume vertical space on a small viewport, which cuts against the "must not disrupt app usage" requirement; a floating badge only expands into a list on demand and otherwise occupies a small fixed footprint.

### Stable, path-derived DOM id per field
Add a `fieldElementId(path)` helper (mirroring `sectionElementId`), producing an id like `cv-field-career-0-companyName` from a field's `Path`. Applied to the actual focusable control (`<input>`, etc.) in `TextField`, `NumberField`, `SliderField`, `PrimitiveArrayField`, and `RepeatableObjectList`, replacing or supplementing the current `useId()`-generated id used for label association.
- Alternative considered: keep `useId()` and maintain a separate `Map<path, HTMLElement>` ref registry populated via callback refs - rejected as more moving parts (registration/cleanup on mount/unmount) than a deterministic string id that both `htmlFor`/`id` and the jump-to-field logic can compute independently without any registry.

### Error-to-label mapping with repeatable-entry index
A new helper walks an instance path (e.g. `["career", 0, "companyName"]`), strips numeric segments to get the schema path for `fieldLabelKey` lookup (section + field labels), and separately renders any numeric segment as a 1-based ordinal ("entrée 1", "entrée 2") inserted at the point it occurs in the path. Combined into one display string, e.g. "Carrière — entrée 2 › Nom de l'entreprise". A new i18n key holds the "section — entrée N" template so it's localized like everything else.

### Which errors are counted/listed: reuse per-section status, not a second suppression rule
Rather than re-implementing the touched/required suppression logic, the error list is built by first computing each top-level section's status via the existing `resolveSectionStatus` (same helper the section nav uses); only `errorsByPath` entries whose top-level section currently resolves to `'error'` are included in the counter and list. This guarantees the two surfaces (section dots and global summary) can never disagree about whether a given error currently "counts".

### Interaction model: popover/dropdown, not a persistent panel
The list is a popover anchored to the counter, opened by click or keyboard activation (Enter/Space) and closed by: selecting an entry, `Escape`, or an outside click/focus loss. It does not auto-open on error changes, and typing in a field never opens or closes it. The dropdown has its own internal `overflow-y-auto` with a capped max-height so a long error list scrolls within itself rather than growing the popover past the viewport.

### List order: same as form order
Entries are grouped/ordered by `documentSections` order (matching the section nav), then by document order within a repeatable section (entry 1 before entry 2), for predictability with the existing nav.

## Risks / Trade-offs

- **[Risk]** Adding a stable id to every field increases the surface every field component must carry. → **Mitigation**: centralize the id computation in one helper (`fieldElementId`) called the same way `sectionElementId` already is, so it's a single, small addition per component rather than bespoke per-field logic.
- **[Risk]** A `position: fixed` badge on small viewports can overlap content or an on-screen keyboard. → **Mitigation**: anchor it clear of primary interactive zones (e.g. bottom-right, respecting safe-area insets); this is a visual-polish concern to verify manually (§ manual walkthrough in tasks), not a spec-level behavior.
- **[Risk]** Deriving "which errors count" from per-section status (rather than directly from `errorsByPath`) means the global list is only ever as fine-grained as the section-level touched rule - e.g. it cannot show one field's error while suppressing a sibling field's error within the same touched-vs-untouched boundary. → **Mitigation**: this matches the already-shipped section nav behavior exactly (no new suppression semantics to design or explain); revisit only if a future change asks for per-field (not per-section) touched tracking.
