## 1. Stable field DOM ids

- [ ] 1.1 Add a `fieldElementId(path)` helper (e.g. in `src/schema/sectionStatus.ts` or a new `src/schema/fieldElementId.ts`), mirroring `sectionElementId`, producing an id like `cv-field-career-0-companyName` from a `Path`.
- [ ] 1.2 Apply `fieldElementId(path)` as the `id` of the focusable control in `TextField`, `NumberField`, `SliderField`, `PrimitiveArrayField`, and `RepeatableObjectList`, replacing or supplementing the current `useId()` usage (keep label/`htmlFor` association working).

## 2. Error origin mapping

- [ ] 2.1 Add a helper that turns an `errorsByPath` instance path (e.g. `["career", 0, "companyName"]`) into a schema path (strip numeric segments) for `fieldLabelKey` lookup, plus the 1-based index of any repeatable entry encountered.
- [ ] 2.2 Add a helper that renders the combined display label from the above (e.g. "Carrière — entrée 2 › Nom de l'entreprise"), using a new i18n template for the "section — entrée N" part.
- [ ] 2.3 Add a helper that builds the full ordered error list: for each top-level section in `documentSections` order whose `resolveSectionStatus(...)` is `'error'`, include its `errorsByPath` entries (in document order for repeatable entries), each paired with its display label, reason (`validationMessage`), and `fieldElementId`.

## 3. Error summary component

- [ ] 3.1 Add `ErrorSummary` component (e.g. `src/components/layout/ErrorSummary.tsx`) rendering the always-visible counter, driven by the error list from task 2.3 (count = list length).
- [ ] 3.2 Add an on-demand popover/dropdown to `ErrorSummary` listing every entry (label + reason), opened by click or keyboard activation (Enter/Space) on the counter, closed by: selecting an entry, `Escape`, or an outside click/focus loss.
- [ ] 3.3 Wire entry activation to `scrollIntoView` + `.focus()` on the target field (via `fieldElementId`), then close the popover.
- [ ] 3.4 Cap the popover's height with its own internal scroll so a long list doesn't grow past the viewport.

## 4. Layout integration

- [ ] 4.1 Desktop (`lg:` and above): mount `ErrorSummary` at the top of `SectionNav`'s existing sticky container in `src/components/layout/SectionNav.tsx`.
- [ ] 4.2 Mobile (below `lg:`): render `ErrorSummary` as a small `position: fixed` floating badge (e.g. bottom-right, respecting safe-area insets), sharing the same counter/list/activation logic as desktop via a responsive layout prop, not a separate implementation.
- [ ] 4.3 Confirm neither placement shifts or resizes existing layout (section nav, form, preview) when the popover opens/closes.

## 5. Localization

- [ ] 5.1 Add the error counter's accessible label and the "section — entrée N" template to `src/i18n/locales/fr.json` and `src/i18n/locales/en.json`.

## 6. Verification

- [ ] 6.1 Run `npm run lint` and `npm test` and fix any resulting issues.
- [ ] 6.2 Manually walk through the spec scenarios for `form-error-summary` using the dev server: blank form shows zero errors; counter stays visible while scrolled on desktop and mobile; opening the list shows correct section/entry/reason for a repeatable-section error; activating an entry scrolls to and focuses the exact field and closes the list; typing never auto-opens the list; Escape/outside-click closes without side effects.
