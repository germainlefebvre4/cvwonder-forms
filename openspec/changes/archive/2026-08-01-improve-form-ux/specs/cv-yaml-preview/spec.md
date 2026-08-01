## ADDED Requirements

### Requirement: Long lines wrap instead of scrolling horizontally
The system SHALL wrap YAML preview lines that exceed the width of the preview pane onto additional visual lines, rather than requiring horizontal scrolling to read the full line.

#### Scenario: Long value stays readable without horizontal scroll
- **WHEN** the YAML preview contains a line longer than the width of the preview pane (e.g. a long mission description)
- **THEN** the line wraps onto additional visual lines within the pane
- **AND** no horizontal scrollbar is needed to read the full content of that line
