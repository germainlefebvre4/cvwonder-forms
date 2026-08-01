## Context

See `proposal.md` - Why/What Changes for motivation. Relevant current state:

- `SchemaFormRenderer` renders one `<section>` per entry of `documentSections` (schema-derived, order fixed) inside a single scrollable column; there is no per-section DOM anchor or nav today.
- `App.tsx` lays the page out as a 2-column CSS grid (`lg:grid-cols-2`): form column, sticky preview column. Below `lg:` (1024px) it stacks to one column.
- Per-field validation errors are already available as `errorsByPath`, keyed by dot-joined path (e.g. `"person.name"`), from `useCvValidation()`.
- `serializeToYaml` already has a `pruneEmpty` step that drops a value if it is `''`, `null`, `undefined`, an empty array, or an object with no non-empty properties - this is exactly the "does this section have content" test the nav needs, just not currently exported standalone.
- The violet accent is applied via stock Tailwind utility classes (`violet-300`..`violet-700`) directly in JSX/`inputStyles.ts`/`yamlHighlight.ts`; there is no custom color token layer in `src/index.css` (Tailwind v4, config lives in CSS via `@theme`, not a `tailwind.config.*` file).
- Decided in exploration (recorded here, not repeated as open questions): scroll-spy over a wizard/stepper; wrap-only for the preview (no ratio or resize change); accent-only color change (no dark-mode background/gradient change); required-section errors suppressed until interaction; mobile nav is a horizontal pill row.

## Goals / Non-Goals

**Goals:**
- Add section navigation (desktop sidebar / mobile pill row) with scroll-spy and a per-section status (empty / has-content / error).
- Make long YAML preview lines wrap instead of forcing horizontal scroll.
- Swap the violet accent for a blue tied to cvwonder.fr's actual brand color.

**Non-Goals:**
- No change to the preview/form column width ratio, no resizable split.
- No change to dark-mode background colors or reuse of cvwonder.fr's hero gradient - accent-only.
- No change to how sections are validated or what counts as an error - only how error state is surfaced in the new nav and when it's allowed to show.
- No drag-and-drop reordering of nav items or sections (out of scope; existing move-up/move-down on repeatable items is untouched).

## Decisions

### Scroll-spy via IntersectionObserver, not route/step state
Each section (`SchemaFormRenderer`'s per-section `<section>`) gets a `ref` and a stable DOM id derived from its `section.key`. A single `IntersectionObserver` (set up once, observing all section elements) tracks which section is most visible and drives the nav's "active" highlight. Clicking a nav item calls `scrollIntoView` on the target section; no route change, no unmounting.
- Alternative considered: a wizard/stepper with one section mounted at a time - rejected in exploration because it breaks the "compare multiple sections while checking the live preview" workflow the app is built around.
- Alternative considered: `scroll`-event + manual offset math instead of `IntersectionObserver` - rejected as more code and more failure-prone (has to account for sticky header height, resize, etc.) for no behavioral benefit.

### Per-section status derived from existing state, not tracked separately
- **Has content**: extract `pruneEmpty` (or an equivalent single-section check) so it can be called as `hasContent(document[section.key])`, reusing the exact rule the YAML serializer already uses to decide what appears in the output. This keeps "what counts as filled" defined in one place.
- **Error**: derive from `errorsByPath` by checking whether any key starts with `section.key` (as a path segment, e.g. `person` or `person.email`, not just a string prefix like `personal`).
- **Error takes priority over has-content** in the displayed status, per spec.

### Touched tracking for the "no errors on a blank form" rule
A required section must not show the error status until the user has "interacted" with it. Interaction is defined as: **the user has changed at least one field within that section** (i.e., any store mutation - `setValue`/`addItem`/`removeItem`/`moveItem` - whose path's first segment is that section's key), tracked as a `Set<string>` of touched section keys in a small piece of UI-only state (not persisted, not part of the CV document).
- Alternative considered: mark a section "touched" once its scroll-spy observer reports it as visited (in view at least once) - rejected because simply scrolling past a section (e.g. scrolling to `education` at the bottom passes every section) would mark everything touched immediately, defeating the point of suppressing errors on a blank, unedited form.
- Alternative considered: per-field blur tracking (classic form "touched" semantics) - rejected as more plumbing through every field component for a per-section (not per-field) status; the section-level, edit-based signal is enough to satisfy the spec's scenarios.

### Layout: three-column grid on desktop, stacked with a pill row below `1024px`
Reuse the existing `lg:` (1024px) breakpoint that already separates the 2-column desktop layout from the stacked mobile layout, extending it to a 3-column grid (`nav | form | preview`) on desktop. Below `1024px`, the nav renders as a horizontally scrollable row of pills placed above the form, still wired to the same scroll-spy/status logic - i.e., one nav component with a layout prop/responsive CSS, not two separate implementations.

### Accent color: a `brand` token scale in `@theme`, not a straight `violet` → `blue` rename
Define a small custom color scale in `src/index.css` under Tailwind v4's `@theme` block (e.g. `--color-brand-300` … `--color-brand-700`), seeded from the colors actually extracted from cvwonder.fr's stylesheet (light `#3578e5`, dark-mode `#4e92ff`, plus their `-dark`/`-darkest` variants for hover/active states). Every current `violet-*` usage is replaced with the matching `brand-*` step.
- Alternative considered: renaming `violet-500/600/700` to Tailwind's stock `blue-500/600/700` - rejected because stock Tailwind blue (`#2563eb` etc.) doesn't match the researched cvwonder.fr hex values; the whole point of this part of the change is to tie the accent to the real brand color, not to "a blue."

### YAML preview: `pre-wrap` instead of horizontal `overflow-auto`
Change the preview `<pre>` from relying on `overflow-auto` (implicit `white-space: pre`) to `white-space: pre-wrap` with `overflow-wrap: anywhere` (or Tailwind's `break-words`), keeping vertical `overflow-auto` for tall documents. `yamlHighlight.ts` already renders each line as its own block-level `<div>` with inline `<span>`s and no fixed widths, so wrapping is a pure CSS change with no changes needed to the highlighter itself.

## Risks / Trade-offs

- **[Risk]** `IntersectionObserver` thresholds can make the "active" section flicker between two adjacent sections around their shared boundary, especially for short sections. → **Mitigation**: use a single top-anchored threshold (e.g. "whichever observed section's top-most edge is closest to, but above, a fixed offset below the sticky header" or an equivalent single-active-guaranteed strategy) rather than multiple overlapping visibility ratios.
- **[Risk]** Wrapping long lines changes the preview's vertical rhythm (a single logical YAML line can now take multiple visual rows), so the preview's line count no longer matches the source line count 1:1. → **Mitigation**: none needed functionally (nothing in the app keys off visual line numbers today); purely a visual consequence worth noting.
- **[Risk]** Replacing every `violet-*` usage with `brand-*` touches several files (`inputStyles.ts`, `SliderField.tsx`, `ThemeToggle.tsx`, `LanguageSwitch.tsx`, `yamlHighlight.ts`) - a missed occurrence would leave a stray violet element. → **Mitigation**: grep for `violet-` across `src/` as a completion check (task-level, not a spec concern).
