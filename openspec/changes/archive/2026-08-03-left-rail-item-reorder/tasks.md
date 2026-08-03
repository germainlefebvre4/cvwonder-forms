## 1. Setup

- [x] 1.1 Add `@dnd-kit/core` and `@dnd-kit/sortable` to `package.json` and install

## 2. Shared rail styling

- [x] 2.1 In `src/components/form/fields/inputStyles.ts`, add shared classes for the left rail container and the drag handle (sized/spaced to work in both `RepeatableObjectList`'s card layout and `PrimitiveArrayField`'s row layout), reusing `iconButtonClass` for the ↑/↓ buttons
- [x] 2.2 Add a `hidden lg:flex`-style class variant for the drag handle so it is not rendered below the desktop breakpoint

## 3. RepeatableObjectList reorder rail + drag

- [x] 3.1 Restructure each item's markup in `RepeatableObjectList.tsx` so the card is a horizontal flex: a left rail (drag handle + ↑/↓ buttons) and the existing header/fields content to its right
- [x] 3.2 Remove the ↑/↓ buttons from the current top-right header row (keep "Remove" there)
- [x] 3.3 Wrap the item list in a dnd-kit `DndContext` + `SortableContext` (`verticalListSortingStrategy`), scoped to this list instance only, keyed by item index
- [x] 3.4 Make each item a sortable node (`useSortable`) and render the drag handle with its listeners/attributes
- [x] 3.5 On `DragEnd`, compute the target index and call the existing `moveItem(path, fromIndex, toIndex)` store action
- [x] 3.6 Render an insertion-line indicator on the item currently under the dragged one, using the `over` id from `DndContext`

## 4. PrimitiveArrayField reorder rail + drag

- [x] 4.1 Move the existing ↑/↓ button stack in `PrimitiveArrayField.tsx` into the new shared left-rail layout, positioned to the left of the textarea instead of the right
- [x] 4.2 Add the drag handle to the same rail, above the ↑/↓ buttons
- [x] 4.3 Wrap the item list in its own `DndContext` + `SortableContext`, same pattern as `RepeatableObjectList`
- [x] 4.4 On `DragEnd`, call `moveItem(path, fromIndex, toIndex)`
- [x] 4.5 Render the same insertion-line indicator during drag

## 5. Verification

- [x] 5.1 Run the app (`npm run dev`) and manually verify: rail buttons reorder items in both list types; drag-and-drop reorders items to an arbitrary position (not just adjacent swap) in both list types; the drag handle is hidden and only ↑/↓ remain below the `lg` breakpoint; keyboard-only reorder via the ↑/↓ buttons still works with screen-reader labels intact
- [x] 5.2 Run `npm run lint` and `npm run build` (or project equivalents) to confirm no type/lint errors from the new dependency and layout changes
