## Why

The active CV Wonder JSON Schema version is hardcoded as two independent relative imports (`src/schema/index.ts` and `src/schema/validator.ts`), both pointing at `schemas/cvwonder.v0.10.1.json`. There is no single place that says "this is the active version," no reproducible way to pull a new version from the upstream `cvwonder` repository, and vendored files already show drift: an untracked `schemas/cvwonder-v0.10.2.json` exists with an inconsistent filename convention and no corresponding published tag upstream (it was fetched from `main` HEAD, not a release). Moving to a new schema version today means manually downloading a file, guessing a version number, and editing two import sites by hand with nothing to catch a mismatch.

## What Changes

- Add a local script (`npm run schema:update -- <tag>`) that fetches `schema.json` from the upstream `cvwonder` repository at a specific Git tag (`raw.githubusercontent.com/germainlefebvre4/cvwonder/refs/tags/<tag>/internal/validator/schema.json`), vendors it as `schemas/cvwonder.<tag>.json`, and updates the single active-version reference used by the app.
- Introduce one central reference for "the active vendored schema version," consumed by both `src/schema/index.ts` and `src/schema/validator.ts`, replacing the two independent hardcoded relative imports.
- Add a pre-commit hook that blocks a commit if the active-version reference points at a `schemas/cvwonder.*.json` file that does not exist, or if a `schemas/*.json` file is staged without the active-version reference being updated in the same commit.
- Remove the untracked `schemas/cvwonder-v0.10.2.json` (fetched from `main` HEAD, not tied to any published `cvwonder` tag); a future move to a v0.10.2-equivalent schema goes through the new tag-based script instead.
- Update `AGENTS.md`'s schema reference to describe the tag-based vendoring mechanism, replacing the current pointer at `refs/heads/main`.
- Standardize vendored schema filenames on the existing dot convention (`cvwonder.vX.Y.Z.json`), matching `cvwonder.v0.10.1.json`.

## Capabilities

### New Capabilities
- `schema-version-sync`: a local script that fetches a specific `cvwonder` Git tag's `schema.json`, vendors it under `schemas/`, and updates the single reference the app uses to select its active schema version.
- `schema-vendoring-consistency`: a pre-commit check that blocks commits where the active-version reference and the vendored `schemas/` files have drifted apart.

### Modified Capabilities

(none — `cv-form-editing` and `cv-schema-validation` keep consuming "the active vendored schema"; how that file is selected and vendored is an implementation detail, not a change to their observable requirements)

## Impact

- New: a Node script under version control (exact location decided in `design.md`), a corresponding `package.json` script entry, and a pre-commit hook mechanism (tool choice decided in `design.md` — no git hook manager is currently installed in this repo).
- Modified: `src/schema/index.ts`, `src/schema/validator.ts` (consume the new central reference instead of duplicated direct imports), `AGENTS.md`.
- Removed: `schemas/cvwonder-v0.10.2.json` (untracked).
- No changes to end-user-facing form/validation behavior.
