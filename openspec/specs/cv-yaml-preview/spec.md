# cv-yaml-preview Specification

## Purpose

Gives users immediate visual feedback on the YAML their form input will produce, without needing to export the file first.

## Requirements

### Requirement: Live preview reflects current form state
The system SHALL display a YAML preview pane that reflects the current in-memory CV document, updated as the user edits any form field.

#### Scenario: Edit updates preview
- **WHEN** a user changes any form field
- **THEN** the YAML preview pane updates to reflect the new value without requiring a manual refresh or export action

### Requirement: Preview omits empty or unset optional data
The system SHALL exclude properties and sections that are empty or unset from the rendered YAML preview, rather than emitting empty strings, objects, or arrays for fields the user has not filled in.

#### Scenario: Untouched optional section omitted
- **WHEN** a user has not entered any certifications
- **THEN** the YAML preview does not contain a `certifications` key

### Requirement: Long lines wrap instead of scrolling horizontally
The system SHALL wrap YAML preview lines that exceed the width of the preview pane onto additional visual lines, rather than requiring horizontal scrolling to read the full line.

#### Scenario: Long value stays readable without horizontal scroll
- **WHEN** the YAML preview contains a line longer than the width of the preview pane (e.g. a long mission description)
- **THEN** the line wraps onto additional visual lines within the pane
- **AND** no horizontal scrollbar is needed to read the full content of that line

### Requirement: User can copy the previewed YAML to the clipboard
The system SHALL provide a control near the YAML preview pane that, when activated, copies the full current YAML output (the same content the preview pane renders) to the system clipboard.

#### Scenario: Copy captures the current document
- **WHEN** a user activates the copy control
- **THEN** the system clipboard contains the complete YAML text currently shown in the preview pane, including any sections the user has filled in

#### Scenario: Copy confirmation is shown
- **WHEN** a user activates the copy control and the copy succeeds
- **THEN** the control displays a temporary confirmation (e.g. "Copied!") in place of its normal label
- **AND** the control reverts to its normal label after a short delay without requiring further user action

#### Scenario: Copy failure does not silently pass as success
- **WHEN** a user activates the copy control and the clipboard write fails (e.g. clipboard access denied by the browser)
- **THEN** the system does not display the success confirmation

### Requirement: Preview header shows the active schema version, linked to its source
The system SHALL display the active vendored schema version (e.g. `v0.10.1`) in the YAML preview pane's header, as a link to that version's schema source on the upstream `cvwonder` GitHub repository, opened in a new tab.

#### Scenario: Version link reflects the active schema
- **WHEN** the YAML preview pane renders
- **THEN** its header shows the exact version string the application resolved as the active schema (matching what document validation and form rendering use)

#### Scenario: Activating the link opens the schema source
- **WHEN** a user activates the version link
- **THEN** a new browser tab opens to the GitHub page showing that version's `schema.json` file at its corresponding Git tag
