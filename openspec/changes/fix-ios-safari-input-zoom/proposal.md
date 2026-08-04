## Why

On mobile Safari (iOS), tapping into any form text/number field or the multi-line text entry field triggers the browser's automatic page zoom, because those fields render at `14px` (Tailwind `text-sm`). This breaks the layout of the main form page on phones: the page zooms in on focus and the user has to manually zoom back out to keep working. This is the immediate blocker identified while scoping mobile compatibility for CV Wonder Forms.

## What Changes

- Raise the font size of all text-style form inputs (single-line text input, numeric input, and repeatable text entry/textarea) to at least `16px` on viewports narrower than the desktop breakpoint, since iOS Safari only auto-zooms below that threshold.
- Preserve the existing `14px` (`text-sm`) appearance on desktop/wide viewports where the zoom behavior does not apply, so no visual regression is introduced above the breakpoint.
- No layout, spacing, or component structure changes — this is scoped to the shared input font-size styling in `src/components/form/fields/inputStyles.ts` and its consumers.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `cv-form-editing`: adds a requirement that text-style input fields (text input, numeric input, repeatable text entry) render at a font size of at least 16px below the desktop breakpoint, to prevent iOS Safari's auto-zoom-on-focus behavior.

## Impact

- `src/components/form/fields/inputStyles.ts` (`textInputClass`, shared by `TextField`, `NumberField`, and the repeatable text entry in `PrimitiveArrayField`)
- `src/components/form/fields/PrimitiveArrayField.tsx` (textarea styling, if it does not already consume `textInputClass`)
- No changes to layout components (`App.tsx`, `SectionNav.tsx`, `ObjectGroup.tsx`) or to any non-text-style field (e.g. `SliderField`).
