## Why

The error summary added in `add-error-summary` labels each error's origin with a generic, technical term - "entry N" - that doesn't say what an entry actually *is* (e.g. "Career — entry 2 › entry 1 › Position" gives no hint that "entry 2" is a career and "entry 1" is a mission within it). Separately, the page header still shows an older, independent error counter (`ValidationSummary`) that counts every schema error unconditionally, while the error summary counts only touched sections - so the two visible counters can disagree (e.g. "3 errors to fix" in the header vs "2 errors" in the error summary) with no indication why, reading as a bug rather than two different rules.

## What Changes

- Error origin labels in the error summary's list reuse the same functional label already shown on each repeatable entry's own card in the form (e.g. "Career #2", "Missions #1", "Domains #1") instead of the generic "entry N" - e.g. "Career — entry 2 › entry 1 › Position" becomes "Career #2 › Missions #1 › Position".
- When a section's top-level content is itself the repeatable list (career, sideProjects, certifications, languages, education), the section name is no longer repeated before the first entry's own label, since they'd otherwise duplicate (e.g. not "Career — Career #2 › ...", just "Career #2 › ...").
- **BREAKING**: The header's standalone validation counter (`ValidationSummary`, "Validation: N errors to fix") is removed. The error summary becomes the sole persistent, always-visible validation indicator.
- The error summary's counter gains an explicit valid/success state (e.g. a green confirmation) for when there are zero counted errors, replacing the positive "the document is valid" confirmation lost with the removed header counter. Today it only shows a disabled, error-styled zero.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `form-error-summary`: error origin labels use the form's own functional per-entry labels instead of generic "entry N" text, with the section label folded into the first repeatable level when they would otherwise duplicate; the counter gains an explicit valid/success state at zero errors; the error summary becomes the sole persistent validation indicator (no separate counter elsewhere).

## Impact

- `src/schema/errorSummary.ts`: `errorOriginLabel` (and its helpers) reworked to resolve each numeric path segment's label from the array it belongs to (mirroring `fieldLabelKey(descriptor.schemaPath)` as already used in `RepeatableObjectList`), instead of a single generic `errorSummary.entry` i18n key.
- `src/i18n/locales/{fr,en}.json`: remove `errorSummary.entry`; remove `validation.summaryTitle` / `validation.noErrors` / `validation.errorCount_one` / `validation.errorCount_other` (or repurpose `validation.noErrors` as the error summary's new valid-state copy); add nothing new otherwise - all per-entry labels reuse existing `fields.*` keys.
- `src/components/layout/ValidationSummary.tsx`: deleted.
- `src/App.tsx`: remove the `ValidationSummary` mount point from the header.
- `src/components/layout/ErrorSummary.tsx`: add a visually distinct valid/success state (icon/color/copy) for when `entries.length === 0`, keeping the trigger disabled in that state (nothing to list).
- No changes to `src/schema/validator.ts` or validation rules themselves - this only changes how existing errors are labeled and displayed.
