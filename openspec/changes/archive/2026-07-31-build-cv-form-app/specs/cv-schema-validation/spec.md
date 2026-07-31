## Purpose

Helps users produce a CV Wonder file that will actually be accepted by the CV Wonder renderer, by validating their data against the same JSON Schema CV Wonder uses.

## ADDED Requirements

### Requirement: Validate against the vendored schema
The system SHALL validate the current CV document against the vendored CV Wonder JSON Schema.

#### Scenario: Valid document passes
- **WHEN** the CV document satisfies all schema constraints
- **THEN** no validation errors are reported

### Requirement: Inline error surfacing during editing
The system SHALL surface schema validation errors next to the relevant form field, identifying which field is invalid and why.

#### Scenario: Missing required field flagged
- **WHEN** a required field (e.g. `person.name`) is empty
- **THEN** the system displays a validation error localized to that field

### Requirement: Validate on import
The system SHALL validate a document immediately after a YAML file is imported and surface any resulting errors the same way as during editing.

#### Scenario: Import of schema-invalid document
- **WHEN** an imported YAML file parses successfully but does not satisfy the schema (e.g. missing `person.name`)
- **THEN** the system reports the resulting validation errors against the populated form
