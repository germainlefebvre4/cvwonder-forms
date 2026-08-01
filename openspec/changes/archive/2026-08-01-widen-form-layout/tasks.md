## 1. Layout grid update

- [x] 1.1 In `src/App.tsx`, raise the `<main>` container's max width from `max-w-7xl` (`80rem`) to `100rem`.
- [x] 1.2 Change the `lg:` grid template columns from `[13rem_1fr_1fr]` to a fixed nav / flexible form / fixed preview arrangement: `[13rem_minmax(0,1fr)_26rem]`.
- [x] 1.3 Add a `2xl:` grid template columns override widening the nav column to `16rem`: `2xl:grid-cols-[16rem_minmax(0,1fr)_26rem]`.
- [x] 1.4 Confirm the preview column's existing `lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start` wrapper still applies correctly at its new fixed width (no layout classes on that wrapper need to change, only the grid template column sizing it sits in).

## 2. Verification

- [x] 2.1 Run `npm run lint` and `npm test` and fix any resulting issues.
- [x] 2.2 Manually verify in the dev server at `1024px`, `1280px`, `1536px`, and `2256px` viewport widths: nav/form/preview are all visible with no horizontal scrollbar, the form column visibly grows between `1280px` and `1536px`, the nav column widens at `1536px`, and the form stops growing past `1600px` (excess becomes outer margin).
- [x] 2.3 Manually confirm the sub-`1024px` stacked/pill-row layout (governed by `form-section-navigation`) is unaffected.
