## ADDED Requirements

### Requirement: Preview header shows the active schema version, linked to its source
The system SHALL display the active vendored schema version (e.g. `v0.10.1`) in the YAML preview pane's header, as a link to that version's schema source on the upstream `cvwonder` GitHub repository, opened in a new tab.

#### Scenario: Version link reflects the active schema
- **WHEN** the YAML preview pane renders
- **THEN** its header shows the exact version string the application resolved as the active schema (matching what document validation and form rendering use)

#### Scenario: Activating the link opens the schema source
- **WHEN** a user activates the version link
- **THEN** a new browser tab opens to the GitHub page showing that version's `schema.json` file at its corresponding Git tag
