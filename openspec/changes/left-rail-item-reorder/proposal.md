## Why

The up/down reorder buttons for repeatable items (career entries, education, competencies, etc.) currently sit inside the attribute box itself — top-right in `RepeatableObjectList`, stacked to the right of the textarea in `PrimitiveArrayField`. They are easy to miss and slow to reach. Moving them into a dedicated left-hand rail makes reordering more visible and consistently placed, and adding drag-and-drop lets users reorder directly instead of clicking one row at a time.

## What Changes

- Move the ↑/↓ reorder buttons out of the attribute box and into a left-hand rail for both `RepeatableObjectList` and `PrimitiveArrayField` items.
- Add a drag handle to that same rail, using `@dnd-kit` (core + sortable), letting users drag an item to reorder it within its own list. The ↑/↓ buttons remain alongside the handle — drag doesn't replace them.
- Drag reordering calls the existing `moveItem(path, fromIndex, toIndex)` store action, so it can move an item directly to any position, not just swap with a neighbor.
- During a drag, show an insertion line between cards at the drop position, with neighboring cards shifting to make room.
- Below the `lg` breakpoint, hide the drag handle and keep only the ↑/↓ buttons — touch-drag inside a scrolling page is unreliable, so mobile stays button-only.
- New dependency: `@dnd-kit/core` and `@dnd-kit/sortable`.

## Capabilities

### Modified Capabilities
- `cv-form-editing`: the existing "repeatable sections support add, remove, and reorder" requirement gains a defined reorder-control placement (left rail) and a drag-and-drop reorder mechanism, in addition to the existing button-based reorder.

## Impact

- `src/components/form/fields/RepeatableObjectList.tsx` and `PrimitiveArrayField.tsx`: layout restructuring (left rail) and drag-and-drop wiring.
- `src/components/form/fields/inputStyles.ts`: new shared classes for the rail/drag handle.
- `package.json`: adds `@dnd-kit/core` and `@dnd-kit/sortable`.
- No change to `src/store/cvDocument.ts` — `moveItem` already supports arbitrary index moves.
