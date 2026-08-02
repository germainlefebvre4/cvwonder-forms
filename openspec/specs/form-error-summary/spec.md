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
Activating the error counter SHALL reveal a list of every currently counted validation error, each identifying the section it belongs to (and, for a repeatable section, which entry) and the reason the field is invalid.

#### Scenario: List identifies section, entry, and reason
- **WHEN** the user activates the error counter while the second entry of the "career" section has a missing required field
- **THEN** the list shows an entry naming the "career" section, its second entry specifically, and the reason the field is invalid

#### Scenario: List order matches form order
- **WHEN** the user activates the error counter
- **THEN** the listed errors appear in the same top-to-bottom order as their sections appear in the form

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
