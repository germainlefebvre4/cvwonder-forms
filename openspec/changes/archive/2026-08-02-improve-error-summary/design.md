## Context

See `proposal.md` for motivation. Relevant current state:

- `errorOriginLabel(t, instancePath)` (`src/schema/errorSummary.ts`) turns a dot-joined `errorsByPath` key (e.g. `"career.1.missions.0.position"`) into a display string. It currently splits the path into a `schemaPath` (property keys only) and a flat list of `entryIndices` (every numeric segment, 1-based), then renders each index as `t('errorSummary.entry', { index })` - a single generic "entry N" string reused at every nesting depth, with no notion of which array a given index belongs to.
- `RepeatableObjectList` (`src/components/form/fields/RepeatableObjectList.tsx:44-46`) already labels each entry's own card as `` {t(labelKey)} #{index + 1} ``, where `labelKey = fieldLabelKey(descriptor.schemaPath)` - the array's own i18n label (e.g. "Career", "Missions", "Domains", "Competencies"). This is the label the user actually sees on the entry they're being pointed at, and is not currently reused by `errorOriginLabel`.
- The schema (`schemas/cvwonder.v0.10.1.json`) has exactly two places where a repeatable array sits inside another repeatable array: `career[].missions[]` and `technicalSkills.domains[].competencies[]`. Everywhere else (`sideProjects`, `certifications`, `languages`, `education`, `abstract`) a top-level section is itself a single repeatable array.
- `documentSections` (`src/schema/index.ts`) gives each top-level section a `kind` (`'object' | 'array'`, among others per `src/schema/types.ts`). Whether a section's own top-level descriptor is `'array'` is exactly the condition under which its own label would otherwise be repeated (see Decisions below).
- `ValidationSummary` (`src/components/layout/ValidationSummary.tsx`), mounted in `App.tsx:34`, reads `errorCount` directly off `useCvValidation()` - the raw ajv error count, with no touched-section suppression. `ErrorSummary` (`src/store/errorSummary.ts`) independently filters through `resolveSectionStatus`, which suppresses an error on a required, empty, untouched section. These are two independently-computed counts that can legitimately disagree; removing `ValidationSummary` removes the disagreement rather than reconciling it.
- `ErrorSummary`'s trigger (`src/components/layout/ErrorSummary.tsx:24-37`) already disables itself when `entries.length === 0`, but visually it's just a grayed-out red badge showing "0" - there is no positive/success visual state.

## Goals / Non-Goals

**Goals:**
- Every error label in the list matches, verbatim, the label the user already sees on the entry it points to.
- No visual redundancy when a section's own top-level content is the repeatable list.
- A single, unambiguous validation indicator in the UI, with both a clear error state and a clear valid state.

**Non-Goals:**
- No change to which errors are counted or when they're suppressed (`resolveSectionStatus`, `sectionHasError` untouched) - only how they're labeled and where the count is displayed.
- No change to `src/schema/validator.ts` or ajv error production.
- No redesign of the popover/list interaction model (open/close/activation) established by `add-error-summary`.

## Decisions

### Per-level labels resolved from the array each index belongs to, not a flat generic list
Rework `parseInstancePath` to walk the instance path once, tracking the accumulated schema path as it goes. Every time it hits a numeric segment, it records `{ schemaPath: [...accumulatedSoFar], index }` - `accumulatedSoFar` at that point is exactly the array's own `descriptor.schemaPath`, the same value `RepeatableObjectList` already passes to `fieldLabelKey`. Each recorded level renders as `` `${t(fieldLabelKey(level.schemaPath))} #${level.index}` `` (e.g. "Missions #1"), replacing the single `t('errorSummary.entry', { index })` call used at every depth today.
- Alternative considered: keep a flat `entryIndices: number[]` and pass along a parallel array of "container labels" computed separately - rejected as more bookkeeping for the same result; recording the schema path at the point of each index is simpler and self-describing.

### Fold the section label into the first level when they'd duplicate
`errorOriginLabel` still computes `sectionLabel = t(fieldLabelKey(schemaPath.slice(0, 1)))` for the leading `"Section — "` prefix. Before rendering it, compare the first recorded level's `schemaPath` (if any) to `schemaPath.slice(0, 1)`: if they're equal (the section's own top-level descriptor is the repeatable array, e.g. `career`, `sideProjects`), skip the separate prefix and let that first level's own rendered segment (e.g. "Career #2") lead the chain instead. Every other section (where the first repeatable level is nested inside an object, e.g. `technicalSkills.domains`) keeps today's `"Section — "` prefix unchanged, since there's no duplication to fold.
- Alternative considered: a generic "never repeat two adjacent identical labels" rule (compares each level to the previous, not just the first to the section) - rejected as solving a problem the schema doesn't have (no case nests an array two levels inside itself) and adding a rule that's harder to reason about than the specific, correct-today check.

### Reuse the array's own (plural) label rather than introduce singular forms
"Missions #1", not "Mission 1". This costs zero new i18n strings (every label already exists as `fields.*`) and guarantees the error list can never drift from what `RepeatableObjectList` shows on the card itself, since both read the exact same key.
- Alternative considered: add a singular `itemLabel` key per repeatable array for more natural phrasing ("Mission 1") - rejected: doubles the translation surface (new key × 2 locales × every repeatable array) for a wording preference, and risks the two surfaces disagreeing again if only one is updated in the future.

### Delete `ValidationSummary` outright rather than reconcile its count
Rather than pointing `ValidationSummary` at the same filtered count `ErrorSummary` uses (which would keep two components rendering the same number in two places), remove `ValidationSummary` and its mount point entirely. `ErrorSummary` already provides a count and, with the new valid state, a positive confirmation - nothing is lost, and there's only one place the count can be computed incorrectly in the future.
- Alternative considered: point `ValidationSummary` at `useErrorSummaryEntries().length` - rejected once the valid-state addition was decided, since it would leave near-duplicate copy in two places (header text vs. sidebar/floating badge) with no reason for both to exist.

### Valid state lives inside `ErrorSummary`'s existing trigger, not a separate component
When `entries.length === 0`, the trigger swaps its red error-styled badge/count for a green confirmation (icon/color/copy), reusing the copy previously shown by `ValidationSummary` (`validation.noErrors`, re-scoped to an `errorSummary.*` key). The trigger stays `disabled` in this state - there is nothing to open.
- Alternative considered: keep a separate small "valid" indicator component alongside `ErrorSummary` - rejected as reintroducing a second element for the same piece of state the removal was meant to consolidate.

## Risks / Trade-offs

- **[Risk]** Deleting `ValidationSummary` is a visible, breaking UI change (marked **BREAKING** in the proposal) - anyone relying on the header wording specifically loses it. → **Mitigation**: the same information (count and valid/invalid state) remains visible via `ErrorSummary`, now with an explicit valid state it didn't have before.
- **[Risk]** Folding the section label into the first repeatable level only when they match exactly means a future schema change that nests a section-level array differently could silently stop folding (or wrongly fold) without a test catching it. → **Mitigation**: the spec scenario "Section label is not repeated when it duplicates the first repeatable level" is a concrete, testable case (`career`, `sideProjects`, etc.) that a unit test can pin directly.
