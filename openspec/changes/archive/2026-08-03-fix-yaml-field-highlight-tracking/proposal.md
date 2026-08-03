## Why

The just-shipped field-to-YAML highlight has two defects found in manual use: moving the pointer from a nested field back up to its own enclosing group (without ever leaving that group) loses the highlight entirely instead of showing the group's own range, and there is no way to deselect a clicked field short of clicking another field.

## What Changes

- Fix: moving the pointer from a nested field to the unoccupied area of its enclosing group or repeatable-list item (still inside that container) now highlights the container's own YAML range, instead of clearing the highlight.
- Fix: this requires replacing the current per-node, independent `mouseenter`/`mouseleave` handlers (attached separately on every field component) with a single delegated pointer-tracking mechanism that resolves "the most specific field under the pointer" fresh on every movement.
- New: clicking anywhere that is not a form field (the YAML preview pane, add/remove/reorder buttons, page header, empty page area) clears the current click-selection.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `yaml-field-highlight`: "Hovering a field highlights its YAML text" gains a scenario for moving from a nested field back to its enclosing container without leaving it. A new requirement covers clearing the click-selection on an outside click.

## Impact

- `src/components/form/useFieldHighlight.ts`: replaced by (or reimplemented as) delegated pointer tracking rather than per-node listeners.
- `src/store/yamlHighlight.ts`: `clearHovered(path)` guard logic no longer needed once hover is resolved centrally instead of via independent leave events.
- `src/components/form/fields/{FieldWrapper,ObjectGroup,RepeatableObjectList,TextField,NumberField,SliderField,PrimitiveArrayField}.tsx`: each currently wires its own `onMouseEnter`/`onMouseLeave`/`onClick` - needs a single shared attribute (e.g. `data-field-path`) instead, with one delegated listener elsewhere.
- Likely one new delegated-listener host (e.g. in `SchemaFormRenderer` or `App`) and one new document-level (or app-root) click listener for the outside-click deselection.
- No API, schema, or persisted-data changes.
