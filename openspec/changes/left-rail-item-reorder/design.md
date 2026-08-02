## Context

`RepeatableObjectList` and `PrimitiveArrayField` (`src/components/form/fields/`) each render a list of items and already call `moveItem(path, fromIndex, toIndex)` from `useCvDocumentStore` for reordering — that action already supports moving to an arbitrary index, not just swapping neighbors. See proposal.md for why the controls are moving and why drag is being added. No drag-and-drop library is currently installed.

## Goals / Non-Goals

**Goals:**
- Reorder controls (↑/↓ and, on wide viewports, a drag handle) live in a left-hand rail on both list components.
- Dragging an item's handle reorders it within its own list, calling the existing `moveItem` action.
- Keyboard/screen-reader users keep a fully accessible way to reorder (the ↑/↓ buttons), independent of drag.

**Non-Goals:**
- No cross-list drag (moving an item from one repeatable section into another).
- No reordering of the top-level document sections (Career, Education, etc.) — only items within a given repeatable array.
- No change to `moveItem`'s signature or the store's persistence behavior.

## Decisions

### Use `@dnd-kit/core` + `@dnd-kit/sortable`
Chosen over hand-rolled HTML5 drag-and-drop because it ships pointer, touch, and keyboard sensors together, and its `SortableContext` + `arrayMove` pattern maps directly onto reordering a flat list backed by index-based state. HTML5 native DnD was rejected: it has no touch support out of the box and its keyboard accessibility would have to be built from scratch, which duplicates what dnd-kit already provides. `react-beautiful-dnd` was rejected as unmaintained.

### One `DndContext`/`SortableContext` per list instance, not one global context
Each `RepeatableObjectList`/`PrimitiveArrayField` instance wraps only its own items in a `SortableContext`, keyed by index. This keeps drag scoped to a single repeatable array (matching the Non-Goal above) without needing to check "same list" logic in a shared drop handler — cross-list drags are simply impossible because each list is its own drag boundary.

### Drag handle calls the same `moveItem(path, fromIndex, toIndex)` as the buttons
On `DragEnd`, compute the old and new index (via `arrayMove`'s index math or the `active`/`over` ids) and call the store's existing `moveItem`. No new store action, no duplicate reducer logic — drag and the ↑/↓ buttons converge on one code path, so both stay in sync by construction.

### Drag handle visibility gated by a Tailwind breakpoint, not JS viewport detection
The handle is rendered with a `hidden lg:flex`-style class rather than a `useMediaQuery` check, consistent with how the rest of the form already gates desktop-only UI (e.g. `SectionNav`'s `lg:` classes). The ↑/↓ buttons have no such class and remain visible at every width. This is a pure CSS toggle: dnd-kit's sensors are still attached underneath, but with no visible/focusable handle there's nothing for a touch or pointer interaction to grab below the breakpoint.

### Insertion-line feedback via dnd-kit's default sortable animation
Use `@dnd-kit/sortable`'s standard `verticalListSortingStrategy` with `animateLayoutChanges`, plus a thin CSS border/line rendered on the item currently under the dragged one (via the `over` id from `DndContext`), rather than a ghost-card-with-opacity approach. This is the smaller diff: it's the default dnd-kit sortable pattern, requires no custom drag overlay positioning math, and matches the "cards shift to make room" behavior already implied by moving items in a flat array.

## Risks / Trade-offs

- **New dependency surface** (`@dnd-kit/core`, `@dnd-kit/sortable`) → Both are widely used, actively maintained, and small; accepted as the standard tool for this problem rather than hand-rolling drag.
- **Two reorder affordances to keep visually coherent** (rail buttons + handle) → Both live in the same rail column in the same order (handle above, then ↑/↓), styled as one visual group, so they read as one control cluster rather than two competing ones.
- **`PrimitiveArrayField`'s textarea-per-item layout is shorter/denser than `RepeatableObjectList`'s cards** → The rail width and control sizing must work for both; reuse one shared rail component/class set (in `inputStyles.ts`) so the two lists don't drift into inconsistent spacing.
