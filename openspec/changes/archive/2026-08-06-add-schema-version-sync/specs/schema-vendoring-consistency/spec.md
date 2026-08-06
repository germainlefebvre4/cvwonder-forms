## Purpose

Prevents the active-version reference and the vendored schema files under `schemas/` from silently drifting apart, by checking their consistency before a commit lands.

## ADDED Requirements

### Requirement: Block commits referencing a missing vendored file
The system SHALL prevent a commit from completing if the active-version record points at a vendored schema file that does not exist.

#### Scenario: Active-version record points nowhere
- **WHEN** a developer attempts to commit while the active-version record's version has no matching file under `schemas/`
- **THEN** the commit is blocked with an error identifying the missing file

### Requirement: Block a version switch that omits its vendored file
The system SHALL prevent a commit from completing if the active-version record's version is changing from its last-committed value, unless the vendored schema file for the new version is staged in the same commit.

#### Scenario: Active-version bumped without vendoring the new file
- **WHEN** a developer stages `schemas/active-version.json` with a version different from the last commit, and does not stage a matching `schemas/cvwonder.<new-version>.json`
- **THEN** the commit is blocked with an error explaining that switching the active version requires vendoring its file in the same commit

#### Scenario: A genuine switch is allowed
- **WHEN** a developer stages `schemas/active-version.json` with a new version together with the matching new `schemas/cvwonder.<new-version>.json`
- **THEN** the commit proceeds

### Requirement: Block vendoring a file that isn't the active version
The system SHALL prevent a commit from completing if it stages a `schemas/cvwonder.*.json` file whose version does not match the active-version record's version (before or after the commit).

#### Scenario: Orphaned vendored file staged
- **WHEN** a developer stages a new or modified `schemas/cvwonder.*.json` file whose version is neither the currently active version nor the version the commit is switching to
- **THEN** the commit is blocked with an error explaining that a vendored file must match the active-version record

#### Scenario: Adding the active-version record for an already-vendored, unmodified file is allowed
- **WHEN** a developer stages `schemas/active-version.json` alone, pointing at a `schemas/cvwonder.*.json` file that already exists and is not itself staged
- **THEN** the commit proceeds, since no version switch and no mismatched vendored file are staged
