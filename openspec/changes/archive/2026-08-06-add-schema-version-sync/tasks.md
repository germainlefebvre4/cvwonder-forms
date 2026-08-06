## 1. Central active-version reference

- [x] 1.1 Add `schemas/active-version.json` with `{ "version": "v0.10.1" }`, matching the currently vendored file.
- [x] 1.2 Add `src/schema/activeSchema.ts` that eagerly globs `schemas/cvwonder.*.json` via `import.meta.glob`, resolves the active file using `active-version.json`, exports `activeSchema`, and throws a clear error if the referenced file is missing.
- [x] 1.3 Update `src/schema/index.ts` to consume `activeSchema` from `./activeSchema` instead of importing `schemas/cvwonder.v0.10.1.json` directly.
- [x] 1.4 Update `src/schema/validator.ts` to consume `activeSchema` from `./activeSchema` instead of importing `schemas/cvwonder.v0.10.1.json` directly.
- [x] 1.5 Run the existing test suite (`npm test`) to confirm `src/schema/schema.test.ts` and validator-related tests still pass unchanged.

## 2. Remove stray vendored file

- [x] 2.1 Delete the untracked `schemas/cvwonder-v0.10.2.json`.

## 3. Schema update script (`schema-version-sync`)

- [x] 3.1 Add `scripts/update-schema.mjs`: takes a `cvwonder` Git tag as its argument, fetches `https://raw.githubusercontent.com/germainlefebvre4/cvwonder/refs/tags/<tag>/internal/validator/schema.json`.
- [x] 3.2 On a non-200 response, fail with a clear error and make no filesystem changes.
- [x] 3.3 On success: read the current `schemas/active-version.json` to identify the previously-active vendored file, write the fetched content to `schemas/cvwonder.<tag>.json`, update `schemas/active-version.json` to the new tag, then delete the previously-active vendored file (skip deletion if the new tag matches the current one, i.e. no-op re-run).
- [x] 3.4 Add an `npm run schema:update -- <tag>` script entry in `package.json` wired to `scripts/update-schema.mjs`.

## 4. Pre-commit consistency check (`schema-vendoring-consistency`)

- [x] 4.1 Add `scripts/check-schema-consistency.mjs`: reads `schemas/active-version.json` (post-commit value), fails with a clear error if `schemas/cvwonder.<version>.json` does not exist on disk.
- [x] 4.2 Extend the same script to: (a) fail if the active version is changing from `HEAD` without its new vendored file staged in the same commit, and (b) fail if any staged `schemas/cvwonder.*.json` file's version doesn't match the active version (before or after the commit).
- [x] 4.3 Register `scripts/check-schema-consistency.mjs` as a `repo: local` hook in the existing `.pre-commit-config.yaml` (not a separate Node hook manager, to avoid two tools racing for `.git/hooks/pre-commit`).
- [x] 4.4 Verify the hook blocks a version switch without its vendored file, blocks an orphaned mismatched vendored file, and allows both a first-time pointer introduction and a genuine switch shipped together.

## 5. Documentation

- [x] 5.1 Update `AGENTS.md`'s schema reference to describe fetching a specific `cvwonder` tag via `npm run schema:update -- <tag>`, replacing the current pointer at `refs/heads/main`.
