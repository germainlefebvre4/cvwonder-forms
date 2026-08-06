## 1. Menu positioning

- [ ] 1.1 Set `position="popper"` (with an appropriate `sideOffset`) on `Select.Content` in `src/components/layout/LanguageSwitch.tsx` so the menu anchors below the trigger instead of using `item-aligned` positioning
- [ ] 1.2 Manually verify the open menu no longer overlaps the trigger or the Import/Export/Theme header controls at both mobile and desktop widths

## 2. Active language indicator

- [ ] 2.1 Add a `Select.ItemIndicator` (checkmark) to each `Select.Item` in `LanguageSwitch.tsx`
- [ ] 2.2 Extend `itemClass` (or add a dedicated selected-state class) with a `data-[state=checked]` style so the active language is visually distinct from unselected and highlighted items
- [ ] 2.3 Manually verify that opening the menu while French is active marks French (not English), and vice versa after switching languages

## 3. Verification

- [ ] 3.1 Run lint/typecheck/build for the touched file
- [ ] 3.2 Confirm no other component relies on the previous `Select.Content` markup/props before finalizing
