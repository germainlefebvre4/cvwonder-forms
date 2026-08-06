# schema-version-sync Specification

## Purpose

Lets a developer pull a specific published `cvwonder` schema version into this repository through a single reproducible local command, instead of manually downloading a file and hand-editing source imports.

## Requirements

### Requirement: Vendor a schema version by Git tag
The system SHALL provide a local command that, given a `cvwonder` Git tag, fetches that tag's `schema.json` from the upstream `cvwonder` repository and vendors it into this repository as the active schema.

#### Scenario: Successful vendoring of a valid tag
- **WHEN** a developer runs the update command with an existing `cvwonder` tag (e.g. `v0.10.2`)
- **THEN** the system fetches that tag's `schema.json` from the upstream repository, writes it to `schemas/cvwonder.v0.10.2.json`, and updates the active-version record so the application resolves this file as the active schema

#### Scenario: Unknown or unpublished tag
- **WHEN** a developer runs the update command with a tag that does not exist in the upstream `cvwonder` repository
- **THEN** the system fails with a clear error and does not modify any vendored file or the active-version record

### Requirement: Superseded schema file is removed on switch
The system SHALL remove the previously-active vendored schema file when a new version is successfully vendored, so at most one vendored schema file exists at rest.

#### Scenario: Switching from one version to another
- **WHEN** the update command successfully vendors a new tag and the active-version record previously pointed at a different, existing vendored file
- **THEN** that previous vendored file is deleted as part of the same run

### Requirement: Single active-version reference
The system SHALL expose exactly one reference that determines which vendored schema file the application uses, consumed identically by schema-driven form rendering and by document validation.

#### Scenario: Application resolves the active schema
- **WHEN** the application starts
- **THEN** both form rendering and document validation resolve their schema data from the same active-version reference, without either independently naming a schema file
