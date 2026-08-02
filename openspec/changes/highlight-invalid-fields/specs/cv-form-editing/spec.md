## ADDED Requirements

### Requirement: Invalid text-style fields are highlighted with a glow
In addition to the existing error text shown below a field, the system SHALL display a persistent colored glow around the input box of any text-style field (single-line text input, numeric input, or repeatable text entry) that currently has a validation error.

#### Scenario: Glow appears while the field is invalid
- **WHEN** a text-style field currently has a validation error
- **THEN** a persistent colored glow is shown around that field's own input box, in addition to its existing error text

#### Scenario: Glow clears once the field becomes valid
- **WHEN** a field that previously had a validation error is corrected to a valid value
- **THEN** the glow highlight is removed from that field

#### Scenario: Applies consistently across text-style field types
- **WHEN** a single-line text input, a numeric input, or a repeatable text entry each have a validation error
- **THEN** the same glow highlight treatment is applied to all of them

#### Scenario: Focus indicator matches the glow on an invalid field
- **WHEN** a field that currently has the glow highlight receives keyboard focus
- **THEN** the focus indicator is shown in the same warning color as the glow, instead of the field's default focus color
