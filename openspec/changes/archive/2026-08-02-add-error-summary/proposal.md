## Why

Today, validation errors are only visible in two places: a plain error count in the page header (which scrolls out of view immediately) and inline messages next to each field (only visible once the user has scrolled to that exact field). Nothing persists as the user scrolls, so on a long form there is no way to know how many errors remain, where they are, or why, without hunting section by section — especially on mobile, where even the section nav's status dots aren't sticky.

## What Changes

- Add a global error summary: a small, always-visible error counter that stays on screen regardless of scroll position (desktop: pinned to the top of the existing sticky section nav sidebar; mobile: a compact floating badge).
- Clicking/focusing the counter opens an on-demand dropdown list of every current error, each entry naming its origin (section, and for repeatable sections which entry, e.g. "Carrière — entrée 2") and the human-readable reason (reusing the existing validation message mapping).
- Activating an entry in the list scrolls to and focuses the exact offending field (not just its section), then closes the list.
- The counter and list only ever show errors from sections the user has already interacted with, using the same touched-tracking rule the section nav already applies — a freshly loaded blank form shows zero errors.
- The list/counter never interrupts editing: no modal, no forced scroll, no layout shift of the form itself; it only opens on explicit user action and closes on selection or dismissal.

## Capabilities

### New Capabilities
- `form-error-summary`: A persistent, always-visible error counter with an on-demand list of every current validation error's origin and reason, letting the user jump directly to any offending field from anywhere on the page.

### Modified Capabilities
(none — inline per-field error display, defined in `cv-schema-validation`, is unchanged; this adds a second, complementary way to reach the same errors)

## Impact

- New component(s) under `src/components/layout/` (e.g. `ErrorSummary.tsx`) for the counter + dropdown, plus a responsive variant for the sticky sidebar (desktop) vs. a fixed floating badge (mobile).
- `src/App.tsx` / `src/components/layout/SectionNav.tsx`: mount point for the counter at the top of the existing sticky sidebar.
- Every leaf field component (`TextField`, `NumberField`, `SliderField`, `PrimitiveArrayField`, `RepeatableObjectList`) needs a stable, path-derived DOM id (replacing/augmenting the current `useId()`) so the list can scroll to and focus the exact field, mirroring the existing `sectionElementId` pattern used for sections.
- A new helper to turn an `errorsByPath` instance path (e.g. `"career.0.companyName"`) into a human label with repeatable-entry index (e.g. "Carrière — entrée 1 › Nom de l'entreprise"), built on the existing `fieldLabelKey` mapping.
- Reuses `useCvValidation()`'s `errorsByPath`, the existing `touchedSections` tracking, and the existing `validationMessage` i18n mapping — no changes to validation logic itself.
- `src/i18n/locales/{fr,en}.json`: new strings for the counter's accessible label and the repeatable-entry naming pattern.
