## Context

`src/schema/index.ts` and `src/schema/validator.ts` each independently `import` the same vendored JSON file by its literal relative path (`../../schemas/cvwonder.v0.10.1.json`). Vite/Rollup requires a static, literal string for a JSON import to bundle it at build time — a runtime variable (`import(schemaPath)`) cannot be used for a top-level synchronous import the way the app consumes it today. Any design has to work within that constraint: "the active version" cannot be a value read from disk at runtime and then used to pick which JSON module loads: it has to be resolved at build/dev time.

Node in this repo is v24 (global `fetch` available; no HTTP client dependency needed for the update script). The repo already uses the `pre-commit` framework (`.pre-commit-config.yaml`, Python-based) for other hooks (`trailing-whitespace`, `end-of-file-fixer`, etc.) — no Node-based git hook manager (husky, simple-git-hooks) is otherwise installed, and none should be added given `pre-commit` already owns this role.

See `proposal.md` for motivation.

## Goals / Non-Goals

**Goals:**
- One file is the single source of truth for "which vendored schema version is active" — both `src/schema/index.ts` and `src/schema/validator.ts` resolve the same schema data through it.
- Switching versions never requires hand-editing an import path or duplicating an edit across files.
- The update script and the pre-commit check share the same, simple notion of "active version" (a plain version string), so neither has to parse TypeScript.

**Non-Goals:**
- Runtime schema fetching or user-facing version switching (ruled out in proposal.md — vendoring stays build-time only).
- Retaining multiple vendored versions on disk simultaneously as a supported feature (still one active version; see Decisions for why old files are removed on switch).
- A CI job that auto-detects new upstream tags (explicitly deferred; the script is manually invoked).

## Decisions

### Active-version pointer as a plain JSON file, resolved via `import.meta.glob`

`schemas/active-version.json` holds `{ "version": "v0.10.1" }`. `src/schema/activeSchema.ts` eagerly globs every `schemas/cvwonder.*.json` file with Vite's `import.meta.glob(..., { eager: true, import: 'default' })`, then indexes into that map using the path built from `active-version.json`'s `version` field:

```ts
import activeVersion from '../../schemas/active-version.json'
const modules = import.meta.glob('../../schemas/cvwonder.*.json', { eager: true, import: 'default' })
const path = `../../schemas/cvwonder.${activeVersion.version}.json`
export const activeSchema = modules[path]
if (!activeSchema) {
  throw new Error(`Active schema version "${activeVersion.version}" has no matching file in schemas/`)
}
```

`src/schema/index.ts` and `src/schema/validator.ts` both import `activeSchema` from this module instead of the JSON file directly.

This means switching versions is a single JSON field write (`active-version.json`), never a source-file edit — the update script's job shrinks to "write the new vendored file, write the pointer," and there is nothing for a codemod to get wrong. A missing/mismatched file fails loudly (thrown error) the moment the module is evaluated, rather than silently bundling a stale schema.

**Alternative considered**: keep the literal import in `activeSchema.ts` and have the update script rewrite that import line (regex/codemod) to point at the new file. Rejected — a second, redundant "source of truth" (the import string) would exist alongside whatever the script/hook uses to decide the target version, and text-rewriting a source file from a script is more fragile than writing a JSON field.

### Old vendored file is deleted when the update script switches versions

When `schema:update` vendors a new tag, it deletes the previously-active `schemas/cvwonder.*.json` file (read from the pointer before overwriting it) as part of the same run, so `schemas/` never accumulates stale, unreferenced versions — the exact clutter that motivated this change (the untracked, tag-less `cvwonder-v0.10.2.json`).

**Alternative considered**: leave old files in place and let the user `git rm` them manually. Rejected — this is precisely the manual step that was already being skipped in practice.

### Pre-commit hook via the existing `pre-commit` framework, as a `local` hook

The repo already runs `pre-commit` (`.pre-commit-config.yaml`) for other hooks. Adding a Node-based hook manager (husky, simple-git-hooks) alongside it would mean two separate tools racing to own `.git/hooks/pre-commit` — whichever installs last wins, silently dropping the other (this is exactly what happened when `pre-commit install` was run after `simple-git-hooks` had already set the hook: it backed up the prior script as `.git/hooks/pre-commit.legacy` and took over). Instead, the check is a `repo: local` entry in the existing `.pre-commit-config.yaml`, using `language: system` to invoke Node directly without pre-commit trying to manage a language runtime for it:

```yaml
  - repo: local
    hooks:
      - id: check-schema-consistency
        name: Check CV Wonder schema vendoring consistency
        entry: node scripts/check-schema-consistency.mjs
        language: system
        pass_filenames: false
```

**Alternative considered**: `simple-git-hooks` (the original decision in this document). Reverted — it was chosen without noticing the repo already had `pre-commit` installed; running two git-hook managers side by side is strictly worse than using the one already in place.

The hook runs the same small Node script (`scripts/check-schema-consistency.mjs`, plain Node — no TS build step available pre-commit) that:
1. Reads `schemas/active-version.json`'s `version` (the post-commit value: the staged blob via `git show :schemas/active-version.json` if staged, else the working-tree value).
2. Fails if `schemas/cvwonder.<version>.json` does not exist on disk.
3. Reads the last-committed version from `HEAD` (via `git show HEAD:schemas/active-version.json`, tolerating its absence). If the version is changing, fails unless the new version's vendored file (`schemas/cvwonder.<new-version>.json`) is staged in this commit — a switch must ship its file, not just point at one that will land later.
4. Inspects staged files (`git diff --cached --name-only`) for anything matching `schemas/cvwonder.*.json`; fails if any staged vendored file's version is neither the active version nor the version being switched to — this is what would have let the original orphaned `cvwonder-v0.10.2.json` land.

This intentionally does NOT require the vendored file to be co-staged when the active version isn't changing (e.g. first introducing `active-version.json` pointing at an already-committed, unmodified vendored file) — existence is what's checked in that case, not staging.

### `schema:update` script fetches by tag, not by branch

`scripts/update-schema.mjs <tag>` fetches `https://raw.githubusercontent.com/germainlefebvre4/cvwonder/refs/tags/<tag>/internal/validator/schema.json` (confirmed reachable), writes it to `schemas/cvwonder.<tag>.json`, updates `schemas/active-version.json`, and removes the previously-active file. It fails clearly if the tag doesn't exist upstream (non-200 response) rather than silently vendoring nothing.

## Risks / Trade-offs

- **[Risk]** `import.meta.glob` eagerly bundles every file matching `schemas/cvwonder.*.json`, not just the active one — if a stray extra file is ever committed, it would be bundled into the app even though unused. → **Mitigation**: this is exactly what the pre-commit hook's staged-files check guards against; and the update script's own delete-on-switch step keeps `schemas/` down to one file in the common path.
- **[Risk]** Deleting the previous vendored file on every update is a one-way move within a given run — recovering an old version means checking it out from Git history. → **Mitigation**: acceptable, since Git history is exactly where "old versions" belong once superseded; nothing here deletes Git history, only the working tree's stale copy.
- **[Risk]** The check only runs for contributors who have run `pre-commit install` locally (already true for this repo's existing hooks; not specific to this change) — a clone that skips it won't get the hook. → **Mitigation**: inherent to any local git-hook manager; out of scope to solve further here.

## Migration Plan

- Add `schemas/active-version.json` set to `v0.10.1` (the current, already-vendored version) and `src/schema/activeSchema.ts`; repoint `index.ts`/`validator.ts` to it. No behavior change at this step.
- Delete the untracked `schemas/cvwonder-v0.10.2.json`.
- Add the update script and the pre-commit check script, and register it as a `local` hook in the existing `.pre-commit-config.yaml`.
- Update `AGENTS.md`.
