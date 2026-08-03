## 1. Input style helper

- [x] 1.1 In `src/components/form/fields/inputStyles.ts`, replace the static `textInputClass` string with a function (e.g. `textInputClass(hasError: boolean)`) that composes the base classes with an error-state variant: red border, blurred red glow (`shadow-[...]`, not `ring-*`), and a red `focus:` ring/border instead of the brand color, plus a dimmer `dark:` glow/border.
- [x] 1.2 Keep the non-error branch's output classes identical to today's `textInputClass` so valid fields are visually unchanged.

## 2. Wire up call sites

- [x] 2.1 Update `TextField.tsx` to call `textInputClass(Boolean(errors?.length))` for its `<input>` className.
- [x] 2.2 Update `NumberField.tsx` to call `textInputClass(Boolean(errors?.length))` for its `<input>` className.
- [x] 2.3 Update `PrimitiveArrayField.tsx` to call `textInputClass(Boolean(errors?.length))` per-item for its `<textarea>` className (each array item's own error state, not the field's aggregate).

## 3. Verification

- [x] 3.1 Run the app, make a required field invalid (e.g. clear `person.name`) and confirm the glow appears alongside the existing error text, in both light and dark theme.
- [x] 3.2 Confirm the glow clears immediately once the field is corrected to a valid value.
- [x] 3.3 Confirm an invalid field's focus ring renders red (not the default brand color) while retaining the glow.
- [x] 3.4 Confirm valid fields are pixel-identical to current behavior (no accidental style regression).
- [x] 3.5 Run `npm run lint` and the existing test suite (`npm run test`).
