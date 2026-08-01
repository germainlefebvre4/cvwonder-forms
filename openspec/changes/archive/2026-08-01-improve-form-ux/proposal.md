## Why

The form is a single long column of stacked sections with no way to jump directly to one, the YAML preview forces horizontal scrolling on any long line (e.g. a mission description), and the accent color (violet) has no relationship to the CV Wonder brand the generated CVs are rendered under. These three gaps make the editing experience feel disconnected and harder to navigate than a 10-section form needs to be.

## What Changes

- Add a section navigation sidebar to the left of the form, listing all top-level schema sections (`company`, `person`, `socialNetworks`, `abstract`, `career`, `technicalSkills`, `sideProjects`, `certifications`, `languages`, `education`).
  - Clicking a sidebar item scrolls the form to that section (scroll-spy); the sidebar highlights whichever section is currently in view as the user scrolls, without hiding or unmounting other sections.
  - Each item shows a status: neutral/empty (untouched, no content yet), filled (has content that would appear in the YAML output), or error (contains a validation error) — error takes priority over filled. A required section only shows the error state after the user has interacted with it, not on initial load of a blank form.
  - Below `1024px`, the sidebar becomes a horizontally scrollable row of pills above the form, with the same scroll-spy and status behavior.
- Change the YAML preview pane to wrap long lines instead of triggering horizontal scroll, so long values (descriptions, mission text) stay fully readable within the pane's existing width (still capped at half the screen width).
- Replace the violet accent color with a blue accent inspired by cvwonder.fr's brand color, applied to the same elements that currently use violet (buttons, focus rings, active switch, "add item" affordances). No other part of the neutral palette or the light/dark theme mechanics changes.

## Capabilities

### New Capabilities
- `form-section-navigation`: A sidebar (or, on narrow screens, a pill bar) that lists all form sections, lets users jump to one, tracks which section is currently in view while scrolling, and shows a filled/empty/error status per section.

### Modified Capabilities
- `cv-yaml-preview`: Add a requirement that long lines wrap within the preview pane instead of causing horizontal overflow.

## Impact

- `src/App.tsx`: layout changes from a 2-column grid (form / preview) to a 3-column arrangement (section nav / form / preview) on desktop, collapsing to a stacked layout with a pill bar on narrow screens.
- New component(s) under `src/components/layout/` (or a new `src/components/nav/`) for the section nav list/pill bar, plus a scroll-spy mechanism (`IntersectionObserver`) to track the active section.
- Section status derivation reuses the existing per-path validation (`useCvValidation`'s `errorsByPath`, keyed by path) and the same "has content" notion the YAML serializer already applies when omitting empty sections (`src/yaml/serialize.ts`).
- `src/components/preview/YamlPreview.tsx`: remove the horizontal-scroll behavior on the `<pre>` block in favor of line wrapping.
- Accent color: `src/index.css` (Tailwind v4 `@theme` tokens) plus every current use of `violet-*` utility classes (`src/components/form/fields/inputStyles.ts`, `src/components/form/fields/SliderField.tsx`, `src/components/layout/ThemeToggle.tsx`, `src/components/layout/LanguageSwitch.tsx`, `src/components/preview/yamlHighlight.ts`).
- `src/i18n/locales/{fr,en}.json`: new labels for the section nav (reuses existing `fields.<section>` keys for section names; adds any nav-specific strings, e.g. status text for screen readers).
