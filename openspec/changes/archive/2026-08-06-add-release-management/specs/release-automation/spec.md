## Purpose

Automates SemVer version calculation, changelog generation, git tagging, GitHub Release creation, and release-artifact publishing from the Conventional Commit history on `main`, so cutting a release is a single explicit action with a trustworthy, reproducible outcome.

## ADDED Requirements

### Requirement: Standing release pull request
The system SHALL maintain a standing "Release" pull request that accumulates the pending version bump and changelog entries computed from Conventional Commits merged to `main` since the last release.

#### Scenario: Conventional commit merged to main
- **WHEN** a pull request with a `feat:` or `fix:` title is squash-merged into `main`
- **THEN** the release pull request is created if absent, or updated to include the resulting version bump and changelog entry

#### Scenario: Non-releasable commit merged to main
- **WHEN** a pull request with a title type that does not affect versioning (e.g. `chore:`, `ci:`) is squash-merged into `main`
- **THEN** the release pull request's changelog is updated per the tool's configured section rules without altering the computed version bump on its own

### Requirement: SemVer version computed from commit history
The system SHALL compute the next version number using Semantic Versioning rules derived from the Conventional Commit types merged since the last release: a `fix:` bumps the patch version, a `feat:` bumps the minor version, and a breaking-change commit bumps the major version.

#### Scenario: Only fixes since last release
- **WHEN** only `fix:` commits have been merged since the last release
- **THEN** the computed next version bumps the patch component only

#### Scenario: At least one feature since last release
- **WHEN** at least one `feat:` commit has been merged since the last release, with no breaking change
- **THEN** the computed next version bumps the minor component

### Requirement: Breaking changes bump major even before 1.0.0
The system SHALL bump the major version component when a breaking-change commit (marked with `!` or a `BREAKING CHANGE` footer) is merged, regardless of whether the current version is below `1.0.0`.

#### Scenario: Breaking change merged while version is 0.x
- **WHEN** the current released version is `0.4.2` and a commit titled `feat!: ...` (or containing a `BREAKING CHANGE` footer) is merged to `main`
- **THEN** the computed next version bumps the major component (e.g. to `1.0.0`), not the minor component

### Requirement: Release baseline
The system SHALL treat the existing `v0.1.0` tag as the baseline for release computation, considering only commits merged after it, without regenerating or backfilling a changelog for `v0.1.0` itself.

#### Scenario: First automated release after adoption
- **WHEN** release automation computes its first release pull request after being introduced
- **THEN** it includes only commits merged after the `v0.1.0` tag, and does not modify or recreate the `v0.1.0` release

### Requirement: Explicit release cut via release PR merge
The system SHALL only create a new git tag and GitHub Release when the standing release pull request is merged into `main`; pushing ordinary commits to `main` SHALL NOT by itself create a tag or release.

#### Scenario: Release PR merged
- **WHEN** the standing release pull request is merged into `main`
- **THEN** a new git tag matching the computed version and a corresponding GitHub Release with the generated changelog body are created

#### Scenario: Ordinary commit merged without touching the release PR
- **WHEN** a feature or fix pull request is squash-merged into `main` and the release pull request is left unmerged
- **THEN** no new git tag or GitHub Release is created

### Requirement: Build artifact attached on tag creation
The system SHALL build the project and attach the build output as a `dist.zip` asset to the GitHub Release once its corresponding git tag has been created.

#### Scenario: Tag created by a merged release PR
- **WHEN** a new git tag is created as a result of merging the release pull request
- **THEN** the project is built and the resulting `dist.zip` is uploaded as an asset on the matching GitHub Release

#### Scenario: Tag created without a successful build
- **WHEN** the build triggered by a new tag fails
- **THEN** the GitHub Release and git tag remain in place without a `dist.zip` asset, and the build failure is reported
