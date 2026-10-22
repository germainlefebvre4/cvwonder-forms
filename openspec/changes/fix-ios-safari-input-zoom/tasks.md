## 1. Shared input styling

- [x] 1.1 In `src/components/form/fields/inputStyles.ts`, update `textInputBaseClass` (used by `textInputClass`) so text-style inputs render at `16px` (Tailwind `text-base`) below the desktop breakpoint, and keep the current `14px` (`text-sm`) at/above the desktop breakpoint (e.g. `text-base lg:text-sm`).

## 2. Repeatable text entry

- [x] 2.1 Confirm the `<textarea>` in `src/components/form/fields/PrimitiveArrayField.tsx` consumes `textInputClass`; if it sets its own font-size class instead, apply the same mobile/desktop font-size treatment there.

## 3. Verification

- [x] 3.1 Run the app and inspect a text input, a numeric input, and the repeatable text entry at a viewport narrower than the desktop breakpoint: computed font size must be at least `16px`.
- [x] 3.2 Inspect the same fields at/above the desktop breakpoint: appearance must be unchanged (still `14px`).
- [x] 3.3 Run `npm run lint` and `npm run test`.
