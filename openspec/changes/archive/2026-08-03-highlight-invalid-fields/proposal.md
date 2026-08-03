## Why

An invalid field is currently signaled only by a small red text line appearing below it. In dense or repeatable sections (e.g. a `career` entry with several missions), that text is easy to miss when scanning the form for what needs fixing, especially since the input itself looks identical whether valid or invalid. A persistent glow (halo) around the invalid field's own box makes it scannable at a glance, reinforcing rather than replacing the existing text.

## What Changes

- Add a persistent red glow (soft colored box-shadow) around any text-style input that currently has a validation error, shown under the same condition that already makes its error text appear (no new touched/dirty state).
- Apply this consistently to every field sharing the current shared input style: `TextField`, `NumberField`, and the repeatable `PrimitiveArrayField` textarea.
- When an invalid field also has keyboard focus, its focus ring switches from the neutral brand color to red, so the two signals reinforce instead of visually competing.
- Provide a dark-mode-appropriate glow (lower saturation/opacity) alongside the light-mode one, matching the existing dark: variant pattern used throughout `inputStyles.ts`.

## Capabilities

### Modified Capabilities
- `cv-form-editing`: the existing requirement that an invalid field "is flagged as invalid" is refined to specify a persistent glow highlight around the field's own input box, in addition to the existing error text.

## Impact

- `src/components/form/fields/inputStyles.ts`: `textInputClass` becomes error-aware (or gains an error variant) to add the glow and the red focus ring.
- `src/components/form/fields/TextField.tsx`, `NumberField.tsx`, `PrimitiveArrayField.tsx`: select the error-variant class when their `errors` prop is non-empty.
- No changes to validation logic, state management, or error message content.
