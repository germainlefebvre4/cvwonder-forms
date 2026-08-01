## Why

The main editing screen caps its total width at `max-w-7xl` (1280px) and splits the remaining space evenly between the form and the YAML preview (`1fr 1fr`). On any screen wider than 1280px, all the extra width is wasted as empty margin instead of being given to the form, and even within that 1280px the form only gets an even split with a preview pane that doesn't need that much room (YAML lines already wrap, per `improve-form-ux`). This makes the form feel cramped for a 10-section, sometimes-deeply-nested CV, especially on laptop and wide-screen displays. `improve-form-ux` explicitly scoped the ratio and width out (documented there as a non-goal); this change revisits that decision now that the section nav and preview wrapping it shipped are in place.

## What Changes

- Give the section nav, form, and YAML preview columns independent sizing instead of one shared `1fr 1fr` split:
  - The YAML preview becomes a fixed comfortable reading width instead of a flexible 1fr column (it doesn't need to grow - wrapped lines are already readable at a moderate width).
  - The form column becomes the flexible column, taking whatever width the nav and preview don't use.
  - The section nav stays a fixed width, widening slightly only on very wide viewports.
- Raise the overall page width cap (currently `max-w-7xl` / 1280px) so the form actually gains the freed-up space on wide screens instead of it becoming outer margin, while keeping a reasonable upper bound so the form doesn't stretch edge-to-edge on ultra-wide monitors.
- No change to which sections exist, how fields are laid out within a section (still a 2-column field grid via `ObjectGroup`), or to the nav's scroll-spy/status behavior - this is purely about how much horizontal space each of the three columns gets.

## Capabilities

### New Capabilities
- `app-layout`: The responsive column layout of the main editing screen - how width is distributed between the section nav, the form, and the YAML preview across viewport sizes, and the overall page width cap.

### Modified Capabilities
(none - `form-section-navigation` and `cv-yaml-preview` cover nav behavior and preview content rendering respectively, not column widths; this change only touches the layout arrangement around them)

## Impact

- `src/App.tsx`: the `<main>` grid changes from `mx-auto max-w-7xl ... lg:grid-cols-[13rem_1fr_1fr]` to a wider max-width with the preview column as a fixed width, the nav column fixed (widening at a larger breakpoint), and the form column as the flexible remainder.
- No component logic changes required in `SectionNav`, `SchemaFormRenderer`, or `YamlPreview` - this is a layout/CSS-only change to `App.tsx`'s grid definition.
- Supersedes the "no change to the preview/form column width ratio, no resizable split" non-goal recorded in `openspec/changes/improve-form-ux/design.md`.
