## Why

The language dropdown in the top header opens using Radix Select's default `item-aligned` positioning, which aligns the currently selected item over the trigger instead of anchoring the menu below it. This makes the open menu visually overlap the trigger and neighboring header controls (Import/Export/Theme toggle), which reads as broken. Additionally, the open menu has no visual indicator of which language is currently active, so users can't tell their current selection at a glance once the trigger is hidden behind the overlapping menu.

## What Changes

- Anchor the language dropdown menu below its trigger using Radix Select's `popper` positioning instead of the default `item-aligned` positioning, eliminating the overlap with the trigger and adjacent header controls.
- Add a visible selected-state indicator (checkmark) to the language option matching the currently active language when the dropdown is open.
- Style the active language option distinctly from the default and hover/keyboard-highlighted states so it remains identifiable without relying on hover.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `app-i18n`: adds requirements that the language switcher menu must not overlap other header controls when opened, and must visibly indicate the currently active language while open.

## Impact

- `src/components/layout/LanguageSwitch.tsx`: add `position="popper"` (and `sideOffset`) to `Select.Content`, add `Select.ItemIndicator` per item, extend item styling for the selected state.
- No changes to `src/store/uiPrefs.ts` (language type/state untouched) or to any other component.
