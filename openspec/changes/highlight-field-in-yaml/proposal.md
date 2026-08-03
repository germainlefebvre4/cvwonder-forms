## Why

The YAML preview and the form currently show the same document but have no visual link between them: a user editing, say, a specific career entry has no quick way to see which lines of the generated YAML that entry corresponds to, short of reading the whole preview. Highlighting the matching YAML text when the user interacts with a form field closes that gap.

## What Changes

- Hovering any form field (a scalar input, an object group, or a repeatable-list item) highlights the corresponding line range in the YAML preview with a background color, for as long as the cursor stays over that field.
- Clicking a form field applies the same background-color highlight, but persistently (until another field is hovered or clicked), and scrolls the YAML preview so the highlighted range is visible.
- Highlighting resolves to the exact line range for the hovered/clicked field's schema path, including inside repeated array items (e.g. a specific `career` entry), not just top-level sections.
- A field with no corresponding YAML output (e.g. an empty, not-yet-filled optional field) highlights nothing.
- One-directional only: interacting with the YAML preview itself does not affect the form.

## Capabilities

### New Capabilities
- `yaml-field-highlight`: Synchronizes form field hover/click with a background-color highlight of the corresponding YAML text in the preview pane.

### Modified Capabilities
(none)

## Impact

- `src/components/preview/YamlPreview.tsx`: needs to render a highlighted line range and expose/consume shared highlight state.
- `src/yaml/serialize.ts` (or a new module alongside it): needs to produce a path → line-range map alongside the serialized YAML text, derived by walking the pruned document together with the `yaml` package's parsed AST (`parseDocument`) of the generated text.
- `src/components/form/FieldNode.tsx` and the field components it dispatches to (`TextField`, `NumberField`, `SliderField`, `ObjectGroup`, `RepeatableObjectList`, `PrimitiveArrayField`): need a shared hover/click integration point keyed by field `path`.
- New shared UI state (hovered path + persistently selected path), likely a small store alongside the existing `store/` modules, read by `YamlPreview` and written by the field components.
- No API, schema, or persisted-data changes.
