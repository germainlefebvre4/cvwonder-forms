## Context

See `proposal.md` for motivation. Relevant current state:

- `App.tsx`'s `<main>` is `mx-auto max-w-7xl grid-cols-1 gap-6 ... lg:grid-cols-[13rem_1fr_1fr]` - below `1024px` it stacks to one column (unchanged by this design); at `1024px` and above it's nav/form/preview with form and preview splitting the remaining width evenly.
- Measured directly: at a `2256px`-wide viewport, `<main>` still renders at its `1280px` cap (`max-w-7xl`), with `~488px` of dead margin on each side and the form and preview columns both landing at `488px` wide.
- `ObjectGroup` already lays fields out in a 2-column grid inside the form column (`sm:grid-cols-2`), so a wider form column mainly means more room per field, not a new internal layout.
- `YamlPreview`'s `<pre>` already wraps long lines (`improve-form-ux`), so the preview's column width is a readability/comfort choice, not a hard requirement driven by unwrapped line length.
- Working reference screen for this change: `2256x1504`, confirmed via direct measurement in-browser (not assumed).

## Goals / Non-Goals

**Goals:**
- Let the form column grow to use space the current even split and `max-w-7xl` cap currently waste on wide viewports.
- Keep the YAML preview at a fixed, comfortable width rather than scaling it with the viewport.
- Keep the layout correct (no overflow, no starved columns) from `1024px` laptop widths up through wide desktop monitors.
- Give the section nav a bit more room on very wide viewports only, per user preference.

**Non-Goals:**
- No resizable/draggable split between columns - fixed and flexible widths only, per the sizing decisions below.
- No change to the sub-`1024px` stacked/pill-row layout, which `form-section-navigation` already governs.
- No change to `ObjectGroup`'s internal 2-column field grid, `SectionNav`'s content/behavior, or `YamlPreview`'s wrapping/highlighting logic.

## Decisions

### Column sizing: fixed nav, fixed preview, flexible form, capped container
Rather than picking one arbitrary top-level `max-w`, each column gets its own sizing rule, and the form (`minmax(0, 1fr)`) simply receives whatever the container has left:

| Breakpoint | Nav | Preview | Form | Container max-width |
|---|---|---|---|---|
| `1024px` (`lg`) to `1536px` (`2xl`) | `13rem` (unchanged) | `26rem` fixed | `1fr` | `100rem` (was `80rem` / `max-w-7xl`) |
| `≥1536px` (`2xl`) | `16rem` | `26rem` fixed | `1fr` | `100rem` |

- **Preview at `26rem` fixed**: narrower than today's even-split `~488px` at the `1280px` cap, but still a comfortable monospace reading width, and wrapping (already shipped) absorbs any line that would otherwise force more width. Chosen over a larger fixed width (e.g. `32rem`+) because the preview doesn't need to grow to stay readable - the point of this change is to give that space to the form instead.
- **Container cap at `100rem` (`1600px`)**: replaces `max-w-7xl`. Big enough that the form visibly benefits on the `2256px` reference screen (form lands at `~912px` instead of `488px`), bounded enough that the form never stretches edge-to-edge on an ultra-wide monitor - satisfies "reasonable cap" without the form's max width being a separate, independently-tuned number. (`1600 - 256 [nav at 2xl] - 416 [preview] - 48 [gaps] = ~880px` for the form, vs `488px` today.)
- **Nav widens only at `2xl` (`1536px`)**: reuses Tailwind's existing `2xl` breakpoint token instead of inventing a custom one. Below it, nav stays at today's `13rem` so laptop/standard-desktop layouts are unaffected by this part of the change.
- **Alternative considered**: keep `max-w-7xl` and only make the preview fixed-width (option "C" from exploration, without "A"). Rejected because on any viewport above `1280px` the container itself was already the bottleneck - the form would gain nothing beyond what the preview's narrower fixed width frees up (`~150px`), which doesn't address the wide-screen waste that motivated this change.
- **Alternative considered**: uncapped form growth (remove the container max-width entirely). Rejected per explicit user preference for a "reasonable cap" - an uncapped form would stretch full-bleed on ultra-wide monitors, which looks broken for a two-column field grid.

### Verifying at the laptop-width floor
At exactly `1024px` (the `lg` breakpoint's minimum, narrower than a real 13-14" laptop's usual `~1280-1440px` CSS width), the new form width (`1024 - 208 - 416 - 48 = ~352px`) comes in slightly under today's even-split value at that same width (`~384px`). This is a minor, boundary-only regression accepted in exchange for a real gain everywhere a laptop is actually used (`1280px`: `1280 - 208 - 416 - 48 = ~608px` vs today's `~488px`); noted as a trade-off below rather than re-tuned away, since chasing the exact `1024px` edge would mean shrinking the preview further than is comfortable.

## Risks / Trade-offs

- **[Risk]** The `1024px` floor case above is marginally narrower for the form than today. → **Mitigation**: none needed - `1024px` is the bare minimum of the `lg` breakpoint, not a realistic laptop viewport width; real laptops (`1280px`+) all gain width under the new sizing.
- **[Risk]** A fixed-width preview means very short YAML documents leave visible empty vertical space in the preview pane at any width, same as today - unchanged by this design, not a new risk.
- **[Risk]** This change reopens a decision (`improve-form-ux`'s "no ratio/resize change" non-goal) that was deliberately scoped out in a still-open change. → **Mitigation**: `proposal.md` records the supersession explicitly so it reads as an intentional revision, not a silent contradiction, when both changes are read together.
