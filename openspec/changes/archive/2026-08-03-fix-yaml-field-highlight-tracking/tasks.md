## 1. Store simplification

- [x] 1.1 In `src/store/yamlHighlight.ts`, replace `setHovered`/`clearHovered`/`setSelected` with `setHovered(path: string | null)` and `setSelected(path: string | null)`; remove the "clear only if still matches" guard entirely

## 2. Field markup

- [x] 2.1 Change `useFieldHighlight(path)` (`src/components/form/useFieldHighlight.ts`) to return `{ 'data-field-path': string }` instead of mouse/click handlers
- [x] 2.2 Update `TextField`, `NumberField`, `SliderField`, `ObjectGroup`, `RepeatableObjectList`, `PrimitiveArrayField` to spread the new attribute onto the same root elements they already spread the old handlers onto
- [x] 2.3 Remove the now-unused `onMouseEnter`/`onMouseLeave`/`onClick` props from `FieldWrapper` (`src/components/form/fields/FieldWrapper.tsx`); keep its root div as the element carrying `data-field-path` for scalar fields

## 3. Delegated resolver

- [x] 3.1 Add a resolver function that, given a DOM event, walks up via `closest('[data-field-path], button, a')` from `event.target` and returns the matched `data-field-path` value, or `null` if the nearest match is a plain control (`button`/`a`) reached before any `data-field-path` ancestor, or if nothing matches
- [x] 3.2 Register one `mouseover` listener (once, near the app root) that calls `setHovered(resolve(event))`
- [x] 3.3 Register one `mouseout` listener alongside it that calls `setHovered(null)` when `event.relatedTarget === null` (pointer left the viewport)
- [x] 3.4 Register one `click` listener (once, near the app root) that calls `setSelected(resolve(event))`
- [x] 3.5 Remove the old per-field `onMouseEnter`/`onMouseLeave`/`onClick` wiring now superseded by the listeners above (covered by task 2, confirm no leftover references)

## 4. Verification

- [x] 4.1 Manually verify: hover a nested field inside "Personal information" (`person`), then move the pointer to the group's own heading without leaving the group - the highlight switches to the `person` YAML range instead of clearing
- [x] 4.2 Manually verify: hover a `career` entry's own area (not a specific field within it) highlights that entry; hover the `career` list's own legend/whitespace (not any entry) highlights the whole `career` block
- [x] 4.3 Manually verify: click a field, then click the YAML preview pane - selection clears; click a field, then click "+ Add" or a remove/move/drag-handle button - selection clears; click a field, then click the page header - selection clears
- [x] 4.4 Manually verify existing passing scenarios still hold: hovering a field, clicking a field (scrolls + persists), hovering an empty field highlights nothing, YAML pane interaction never affects the form
- [x] 4.5 Run the existing test suite and linter to confirm no regressions
