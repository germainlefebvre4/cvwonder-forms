## MODIFIED Requirements

### Requirement: On-demand error list names each error's origin and reason
Activating the error counter SHALL reveal a list of every currently counted validation error, each identifying its origin using the same functional label already shown on the corresponding entry's own card in the form (not a generic term such as "entry"), plus the reason the field is invalid.

#### Scenario: List identifies section, entry, and reason using functional labels
- **WHEN** the user activates the error counter while the second entry of the "career" section has a missing required "position" field within its first mission
- **THEN** the list shows an entry whose label uses the same terms shown on the form's own entry cards (e.g. "Career #2 › Missions #1 › Position"), not a generic term such as "entry 2 › entry 1"
- **AND** the entry also shows the reason the field is invalid

#### Scenario: Section label is not repeated when it duplicates the first repeatable level
- **WHEN** a section's own top-level content is itself the repeatable entries (e.g. the "career" or "sideProjects" section, as opposed to a section that merely contains a repeatable field)
- **THEN** the error label starts directly with that entry's own label and number (e.g. "Career #2 › Company name") instead of repeating the section's name before it

#### Scenario: List order matches form order
- **WHEN** the user activates the error counter
- **THEN** the listed errors appear in the same top-to-bottom order as their sections appear in the form

## ADDED Requirements

### Requirement: Counter shows an explicit valid state when there are no errors
When there are zero counted validation errors, the counter SHALL present an explicit, visually distinct confirmation that the document is valid, rather than a zero count styled the same way as an error state.

#### Scenario: No errors shows a valid confirmation
- **WHEN** there are zero counted validation errors (e.g. a freshly loaded blank form, or every error has since been fixed)
- **THEN** the counter displays an explicit confirmation that the document is valid, instead of an error-styled zero count

### Requirement: Error summary is the sole persistent validation indicator
The system SHALL NOT display any other persistent, always-visible validation error count outside the error summary.

#### Scenario: No duplicate counter elsewhere in the UI
- **WHEN** the application is displayed, regardless of the current validation state
- **THEN** no separate, persistent validation error counter is shown outside the error summary
