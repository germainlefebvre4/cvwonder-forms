## Why

The YAML preview column is currently locked to a fixed `26rem` width while the form column absorbs all extra viewport width via `minmax(0,1fr)`. On wide screens this leaves the YAML preview cramped and cut off from the extra horizontal space, forcing long lines to wrap heavily even though there's room to spare. The preview should be the column that grows, and the form should keep a comfortable, capped reading width.

## What Changes

- Swap which column is flexible: the form column becomes fixed to a comfortable reading width (~`42rem`); the YAML preview column becomes flexible (`minmax(20rem,1fr)`) and absorbs the remaining width.
- Remove the overall page width cap (`max-w-[100rem]` on `<main>`) so the YAML preview column can keep growing on ultra-wide viewports instead of being clipped by an outer margin.
- **BREAKING** (behavioral, not API): on viewports wider than the old `100rem` cap, the form column no longer grows past its old max width — it now stays at its fixed reading width permanently, and the YAML preview takes the space the form used to occupy.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `app-layout`: Reassigns which column is fixed vs. flexible (form fixed, YAML preview flexible) and removes the overall page width cap, so the YAML preview column keeps growing on wide and ultra-wide viewports.

## Impact

- `src/App.tsx` — the `<main>` grid template (`grid-cols-1 lg:grid-cols-[...] 2xl:grid-cols-[...]`) and its `max-w-[100rem]` class.
- No changes to `YamlPreview.tsx`, `SchemaFormRenderer.tsx`, or `SectionNav.tsx` internals — they already fill whatever width their grid track gives them.
