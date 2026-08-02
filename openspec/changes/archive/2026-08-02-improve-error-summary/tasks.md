## 1. Functional per-entry error labels

- [x] 1.1 Rework `parseInstancePath` in `src/schema/errorSummary.ts` to walk the instance path once, recording `{ schemaPath, index }` for every numeric segment - `schemaPath` being the accumulated schema path at that point (the array's own `descriptor.schemaPath`), not just a flat list of index numbers.
- [x] 1.2 Update `errorOriginLabel` to render each recorded level as `` `${t(fieldLabelKey(level.schemaPath))} #${level.index}` `` (e.g. "Missions #1"), replacing the `t('errorSummary.entry', { index })` calls.
- [x] 1.3 Fold the leading `"Section — "` prefix into the first level when it duplicates: if the first recorded level's `schemaPath` equals `schemaPath.slice(0, 1)`, omit the separate `sectionLabel` prefix and start the chain with that level's own rendered segment instead.
- [x] 1.4 Remove the now-unused `errorSummary.entry` key from `src/i18n/locales/fr.json` and `src/i18n/locales/en.json`.
- [x] 1.5 Add/update unit tests for `errorOriginLabel` covering: a nested case (`career.1.missions.0.position` → "Career #2 › Missions #1 › Position"), a nested case where the top level is inside an object (`technicalSkills.domains.0.competencies.1.level` → "Technical skills — Domains #1 › Competencies #2 › Level"), a section-level array field error with no leaf field (`career.1.missions` → "Career #2 › Missions"), and an unaffected object-section case (`person.email` → "Personal information — Email").

## 2. Remove the header validation counter

- [x] 2.1 Delete `src/components/layout/ValidationSummary.tsx` and its mount point in `src/App.tsx`.
- [x] 2.2 Remove `validation.summaryTitle`, `validation.errorCount_one`, and `validation.errorCount_other` from `src/i18n/locales/fr.json` and `src/i18n/locales/en.json`. Keep `validation.noErrors`'s copy available for reuse in task 3 (re-scope its key, e.g. to `errorSummary.valid`).

## 3. Explicit valid state in the error summary

- [x] 3.1 In `src/components/layout/ErrorSummary.tsx`, add a visually distinct valid/success rendering of the trigger when `entries.length === 0` (e.g. green styling, a checkmark, and copy confirming the document is valid), reusing the former `validation.noErrors` copy under its new key.
- [x] 3.2 Keep the trigger `disabled` in the valid state (nothing to open) and ensure the `aria-label` reflects the valid state rather than "0 errors, show list".

## 4. Verification

- [x] 4.1 Run `npm run lint` and `npm test` and fix any resulting issues.
- [x] 4.2 Manually walk through the dev server: a career entry with a nested mission error shows the correct functional label; a domains/competencies error shows the section-prefixed label; the header no longer shows a validation counter; a blank/valid form shows the error summary's new valid state; fixing all errors transitions the badge from error to valid state live.
