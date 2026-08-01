## 1. Accent color

- [x] 1.1 Add a `brand` color scale to the `@theme` block in `src/index.css`, seeded from cvwonder.fr's extracted hex values (light `#3578e5` / dark `#4e92ff` as the base step, plus `-dark`/`-darkest` hover/active steps).
- [x] 1.2 Replace every `violet-*` utility class with the matching `brand-*` step in `src/components/form/fields/inputStyles.ts`, `src/components/form/fields/SliderField.tsx`, `src/components/layout/ThemeToggle.tsx`, `src/components/layout/LanguageSwitch.tsx`, and `src/components/preview/yamlHighlight.ts`.
- [x] 1.3 Grep `src/` for `violet-` to confirm no occurrence remains.

## 2. YAML preview line wrapping

- [x] 2.1 In `src/components/preview/YamlPreview.tsx`, change the `<pre>` element's classes so long lines wrap (`whitespace-pre-wrap`/`break-words` or `overflow-wrap: anywhere`) instead of relying on horizontal `overflow-auto`, keeping vertical scrolling for tall documents.
- [x] 2.2 Manually verify with a long value (e.g. a long mission description) that the line wraps within the pane and no horizontal scrollbar appears, in both light and dark mode.

## 3. Section status logic

- [x] 3.1 Extract the emptiness check already used by `pruneEmpty` in `src/yaml/serialize.ts` into a small reusable helper (e.g. `isEmptyValue`) usable both by the serializer and the nav, without changing serializer behavior.
- [x] 3.2 Add a helper that computes each top-level section's content status (`empty` | `filled`) from the current CV document using the extracted emptiness check.
- [x] 3.3 Add a helper that computes each top-level section's error status from `useCvValidation()`'s `errorsByPath`, matching path segments under that section's key.
- [x] 3.4 Add lightweight, non-persisted UI state tracking which top-level sections have been "touched" (a store mutation - `setValue`/`addItem`/`removeItem`/`moveItem` - occurred under that section's path).
- [x] 3.5 Combine the three signals into one per-section status (`empty` / `filled` / `error`), where `error` only applies to a required section once it is touched, and `error` otherwise takes priority over `filled`.

## 4. Section navigation component

- [x] 4.1 Add stable DOM ids to each section rendered by `SchemaFormRenderer` (derived from `section.key`) so the nav can scroll to and observe them.
- [x] 4.2 Build a nav component listing all `documentSections` in order, using each section's existing i18n label (`fieldLabelKey`), with a status indicator per item per the design.
- [x] 4.3 Wire an `IntersectionObserver` across all section elements to drive the nav's active-item highlight while scrolling, using a single-active-guaranteed strategy (see design.md Risks).
- [x] 4.4 Wire nav item activation (click/keyboard) to scroll the corresponding section into view.
- [x] 4.5 Add a responsive layout to the nav component: vertical list at `1024px` and above, horizontally scrollable pill row below `1024px`, sharing the same active/status logic.

## 5. Layout integration

- [x] 5.1 Update `src/App.tsx`'s `<main>` grid from the current 2-column (form/preview) layout to a 3-column layout (nav/form/preview) at the `lg:` breakpoint, placing the pill-row variant of the nav above the form below that breakpoint.
- [x] 5.2 Confirm the preview column's width and stickiness are unchanged by the new column (still capped at half the screen width).

## 6. Localization

- [x] 6.1 Add any nav-specific strings (e.g. status announcements for screen readers) to `src/i18n/locales/fr.json` and `src/i18n/locales/en.json`; reuse existing `fields.<section>` keys for section names.

## 7. Verification

- [x] 7.1 Run `npm run lint` and `npm test` and fix any resulting issues.
- [x] 7.2 Manually walk through the spec scenarios for `form-section-navigation` (blank form shows no errors, touching a required section surfaces its error, filled/empty/error indicators update live, mobile pill row works) using the dev server.
