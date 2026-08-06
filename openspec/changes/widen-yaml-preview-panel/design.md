## Context

The three-column layout lives entirely in `src/App.tsx` as Tailwind arbitrary-value grid classes on `<main>` — there's no separate CSS file defining it:

```
lg:grid-cols-[13rem_minmax(0,1fr)_26rem]
2xl:grid-cols-[16rem_minmax(0,1fr)_26rem]
```

plus `mx-auto max-w-[100rem]` capping the whole grid. The nav column (`SectionNav`) and preview column (`YamlPreview`) render as siblings of the form column (`SchemaFormRenderer`) inside that grid — none of the three components apply their own width; they just fill their grid track. See proposal.md - Why for the motivation.

## Goals / Non-Goals

**Goals:**
- Make the YAML preview column the one that grows with the viewport.
- Give the form column a fixed, comfortable reading width instead.
- Let the preview column keep growing on ultra-wide viewports by removing the outer page width cap.

**Non-Goals:**
- No changes to `YamlPreview.tsx`, `SchemaFormRenderer.tsx`, or `SectionNav.tsx` internals — the fix is entirely in the grid template on `<main>`.
- No resizable/draggable divider between columns (out of scope per the explore-mode discussion — user chose a fixed reallocation, not a drag handle).
- No change to the section nav's own width behavior (`13rem`/`16rem` breakpoint switch stays as-is).
- No change to sub-`1024px` (stacked, single-column) behavior.

## Decisions

**Form column: fixed `42rem` via `minmax(0,42rem)`.**
`42rem` (~672px) is a standard comfortable prose/reading width, matching the intent of the original "fair share, not proportional" design (see the current `app-layout` spec's purpose line) but now applied to the form instead of leaving it uncapped. Wrapping it in `minmax(0,...)` (rather than bare `42rem`) keeps the same overflow-safety the middle track already had, so a very narrow allotment can't force horizontal scroll.

Alternative considered: let the form size itself intrinsically (e.g. `max-content`) — rejected because form field widths vary a lot by content and would make the column's width unpredictable/jumpy as users navigate sections.

**YAML preview column: flexible via `minmax(20rem,1fr)`.**
Swaps the previous fixed/flexible roles directly: preview now takes the `1fr` role the form used to have, with a `20rem` floor so it doesn't get crushed on the narrow end of the `lg`/`2xl` range (this is the new "minimum width" requirement in the spec delta).

Alternative considered: give the preview a fixed *larger* width (e.g. `40rem`) instead of making it flexible — rejected because it doesn't satisfy the actual ask ("prendre le reste de la page à sa droite" / take the rest of the page) and would need re-tuning at every new breakpoint instead of just working across all widths.

**Remove `max-w-[100rem]` entirely rather than raising it.**
Two options existed: raise the cap (e.g. `max-w-[160rem]`) or drop it. Since the form is now fixed-width and the nav is fixed-width, the only column left to benefit from extra viewport width is the flexible YAML preview — there's no longer a reason to stop it from growing. Removing the cap keeps the design simple (one fewer magic number) and matches "prendre le reste de la page" literally: the preview fills all remaining width down to the page's existing edge padding (`p-4 sm:p-6`), on any viewport size.

Alternative considered: keep a very large cap as a safety net against pathological ultra-wide monitors — rejected as premature; the `20rem`-floor/`1fr` preview column and fixed nav/form columns already bound the layout's failure modes (the CSS `pre`'s own `overflow-x-hidden`/wrapping still applies), so there's no known breakage this would guard against.

## Risks / Trade-offs

- [Removing the width cap could make the YAML preview extremely wide on very large or multi-monitor setups, arguably hurting readability of long unwrapped lines] → `YamlPreview.tsx` already wraps content (`whitespace-pre-wrap`) rather than relying on horizontal scroll, so extra width just means fewer wrapped lines, not runaway line lengths. If real-world feedback says otherwise, a `max-w` cap on the `1fr` track (e.g. `minmax(20rem,60rem)`) is a one-line follow-up.
- [`42rem` for the form is a judgment call, not something derived from existing content] → It's a widely-used reading-width convention (close to Tailwind's own `max-w-2xl`/`max-w-prose` range) and easy to retune if it feels off in practice; it's an isolated constant in one Tailwind class.
- [Behavioral change is visible to anyone with muscle memory for the old layout] → Called out as a **BREAKING** (behavioral) note in the proposal; no data or API is affected, only visual layout.

## Migration Plan

Single-file change (`src/App.tsx`), no data migration. Update the grid template and drop `max-w-[100rem]` in one commit; verify visually at `1024px`, `1280px`, `1536px` (`2xl`), and an ultra-wide width (e.g. `2560px`) per the spec's scenarios. Rollback is a straight revert of that one class-string change.
