## Why

The repository has no formal release process: `package.json` is frozen at `0.0.0`, there is no `CHANGELOG.md`, and the one existing tag (`v0.1.0`) was cut manually with an empty changelog and no attached artifacts. External projects now consume `cvwonder-forms` by pulling a tagged commit and building it themselves, so they need a trustworthy SemVer contract and a readable history of changes per version. Formalizing release management around GitHub Flow, Conventional Commits, and SemVer removes the guesswork from "what changed" and "is this safe to upgrade to."

## What Changes

- Add a required PR check that validates the **pull request title** against the Conventional Commits format (e.g. `feat: add xyz`, `fix(scope): ...`). PR body/description is not validated. This is the correct enforcement point because the repository only allows squash-merge, so the PR title becomes the single commit message on `main`.
- Introduce `release-please` as the release automation engine:
  - On every push to `main`, it maintains a standing "Release PR" that accumulates a version bump (SemVer) and a generated `CHANGELOG.md` entry, computed from the Conventional Commit history (i.e. squashed PR titles) since the last release.
  - The existing manually-created `v0.1.0` tag is treated as the release baseline (release-please starts computing from commits after this tag; its empty changelog is not backfilled).
  - Merging the Release PR is the explicit act of "cutting" a release: release-please creates the corresponding git tag and GitHub Release with the generated changelog body.
  - A `BREAKING CHANGE` commit bumps the **major** version even while the project is in the `0.x` range, instead of only bumping minor. This is release-please's actual default behavior (confirmed against its source); the config pins it explicitly so `1.0.0` arrives naturally the first time a real breaking change ships, without depending on an implicit default that could change.
- Add a new workflow, triggered when release-please creates a **tag**, that builds the project (`npm run build`) and attaches the resulting `dist/` output as a `dist.zip` asset on the corresponding GitHub Release. This is a secondary/convenience artifact — the primary release contract for consumers remains the tagged source and its changelog, since consumers pull-and-build rather than consume prebuilt output.

## Capabilities

### New Capabilities
- `conventional-commit-enforcement`: Validates that every pull request targeting `main` has a title conforming to the Conventional Commits specification, and blocks the check from passing otherwise.
- `release-automation`: Computes SemVer version bumps and a changelog from Conventional Commit history via `release-please`, maintains a Release PR, and on merge creates the git tag and GitHub Release; also covers building and attaching a `dist.zip` artifact to the release once its tag exists.

### Modified Capabilities
- None. `ci-pipeline` (lint/build/test verification) is a separate, unaffected concern.

## Impact

- New GitHub Actions workflows:
  - PR title validation (runs on pull request opened/edited/synchronized events).
  - `release-please` workflow (runs on push to `main`).
  - Release asset build workflow (runs on tag/release creation), producing and uploading `dist.zip`.
- `package.json` version field moves from a hand-set placeholder to being managed by `release-please`.
- New `CHANGELOG.md` at the repo root, maintained automatically.
- No changes required to branch merge strategy (squash-only is already configured); no existing branch protection rule exists today, so the new PR title check runs but is not yet marked "required" at the GitHub settings level unless configured separately.
- External consumers gain a reliable tag → changelog → SemVer contract, including guaranteed major bumps on breaking changes even before `1.0.0`.
