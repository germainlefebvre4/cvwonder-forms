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
