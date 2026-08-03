## 1. Path → line-range mapping

- [ ] 1.1 Add a function alongside `serializeToYaml` (`src/yaml/serialize.ts`) that also returns a `Map`/plain object of path key → `{startLine, endLine}`, built by walking the pruned document together with the `yaml` package's `parseDocument` AST of the generated text
- [ ] 1.2 Handle objects, arrays, and scalars in the walk (the same restricted shape `pruneEmpty` already assumes), keyed with the same path-string convention used elsewhere (e.g. `errorsByPath`, `path.join('.')`)
- [ ] 1.3 Unit tests in `src/yaml/yaml.test.ts` (or a new sibling test file): top-level field, nested object field, a field inside one of several array items with a repeated key name (e.g. `company` across multiple `career` entries), and a field with no output (path absent from the map)

## 2. Shared highlight state

- [ ] 2.1 Add a small store (e.g. `src/store/yamlHighlight.ts`) holding `hoveredPath: string | null` and `selectedPath: string | null`, with actions to set/clear each
- [ ] 2.2 Guard the hover-clear action so leaving a field only clears `hoveredPath` if it still matches that field's own path (avoids a stale clear racing a newly-entered field)

## 3. Form-side hook

- [ ] 3.1 Add a `useFieldHighlight(path)` hook returning `onMouseEnter` / `onMouseLeave` / `onClick` handlers wired to the store from task 2
- [ ] 3.2 Apply the hook's handlers to the existing root element of `TextField`, `NumberField`, `SliderField`, `ObjectGroup`, `RepeatableObjectList`, and `PrimitiveArrayField` (no new wrapper element)

## 4. YAML preview highlighting

- [ ] 4.1 In `YamlPreview`, compute the path → range map (task 1) alongside the existing `yamlText`/`lines` memo
- [ ] 4.2 Resolve the active range from `hoveredPath ?? selectedPath` (task 2) and apply a background-color class to the `<div>`s for lines within that range
- [ ] 4.3 On a change to `selectedPath` (click), scroll the preview pane so the highlighted range is visible
- [ ] 4.4 Confirm a field with no entry in the range map (empty/unset) results in no highlight

## 5. Verification

- [ ] 5.1 Run the app and manually verify: hovering a scalar field, an object group, and a repeatable-list item each highlight only their own YAML range; hovering one array item among several highlights only that item
- [ ] 5.2 Manually verify click persists the highlight and scrolls the preview, and that a subsequent hover elsewhere temporarily overrides it before reverting to the clicked field's highlight on mouse-out
- [ ] 5.3 Manually verify interacting with the YAML preview pane itself never changes form state or scroll position
- [ ] 5.4 Run the existing test suite and linter to confirm no regressions
