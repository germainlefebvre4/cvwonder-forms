# form-error-summary Specification

## Purpose

Lets users see, from anywhere on the page, how many validation errors remain and jump straight to each one, instead of having to scroll the whole form to find them.

## Requirements

### Requirement: Persistent global error counter
The system SHALL display a count of current validation errors that remains visible regardless of scroll position, on both desktop and mobile viewports.

#### Scenario: Counter visible while scrolled
- **WHEN** the user has scrolled the form away from the top, on desktop or mobile
- **THEN** the error counter remains visible on screen

#### Scenario: Counter reflects live count
- **WHEN** a validation error is fixed by editing the corresponding field
- **THEN** the counter's displayed count decreases accordingly, without requiring a page reload

### Requirement: Counter respects the section navigation's suppression rule
The system SHALL NOT count an error from a required section the user has not yet interacted with, consistent with the section navigation's touched-tracking rule.

#### Scenario: Blank form shows zero errors
- **WHEN** the form is loaded with no prior data and the user has not interacted with any section
- **THEN** the error counter shows zero, even though required sections are empty

#### Scenario: Error counted after interaction
- **WHEN** a user interacts with a required section and leaves a required field empty
- **THEN** that field's error is included in the counter and the error list

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

### Requirement: Activating a list entry jumps to the exact field
Activating an entry in the error list SHALL scroll the form to bring the corresponding field into view and move keyboard focus to it, then close the list.

#### Scenario: Jump to the offending field
- **WHEN** the user activates an entry in the error list
- **THEN** the form scrolls so the corresponding field is in view
- **AND** keyboard focus moves to that field
- **AND** the error list closes

### Requirement: Error summary never interrupts editing
The system SHALL NOT open the error list on its own, force a scroll, or otherwise interrupt the user's current input without an explicit action from the user to open or activate it.

#### Scenario: Typing does not trigger the list
- **WHEN** the user is typing in a field that currently has a validation error
- **THEN** the error list does not open on its own

#### Scenario: List closes without side effects
- **WHEN** the user dismisses the open error list without activating an entry (e.g. clicking elsewhere or pressing Escape)
- **THEN** the list closes and no field is scrolled to or focused
