# cv-form-editing Specification

## Purpose

Lets users build a CV Wonder document by filling out a form generated from the CV Wonder JSON Schema, instead of having to write or edit YAML by hand.

## Requirements

### Requirement: Form generated from the vendored schema
The system SHALL render one form section per top-level property defined in the vendored CV Wonder JSON Schema (`company`, `person`, `socialNetworks`, `abstract`, `career`, `technicalSkills`, `sideProjects`, `certifications`, `languages`, `education`).

#### Scenario: Sections match schema top-level properties
- **WHEN** the form loads
- **THEN** each top-level object/array property from the schema is presented as a distinct section, in the property order defined in the schema

### Requirement: Field widget matches schema type and constraints
The system SHALL render each schema property as a form field or widget appropriate to its JSON Schema type and constraints (e.g. string → text input, integer with minimum/maximum → bounded numeric input, array of objects → repeatable group of fields).

#### Scenario: Numeric level constrained to schema range
- **WHEN** rendering a technical skill competency's `level` field (integer, minimum 0, maximum 100)
- **THEN** the field only accepts integer values between 0 and 100 inclusive

### Requirement: Repeatable sections support add, remove, and reorder
For schema array properties (`abstract`, `career`, `career[].missions`, `technicalSkills.domains`, `technicalSkills.domains[].competencies`, `sideProjects`, `certifications`, `languages`, `education`), the system SHALL let users add a new item, remove an existing item, and reorder items within the array.

#### Scenario: Add a career entry
- **WHEN** a user adds a new entry to the career section
- **THEN** a new career entry (with at least one mission) is added to the form and to the underlying CV document

#### Scenario: Remove an item
- **WHEN** a user removes an item from a repeatable section
- **THEN** the item is removed from the form and from the underlying CV document, and the remaining items keep their relative order

### Requirement: Optional-with-format fields accept empty or valid values
For schema properties expressed as an `anyOf` of an empty string and a formatted string (e.g. `person.email`, `person.site`), the system SHALL render a single text field that accepts either an empty value or a value matching the specified format, rather than presenting a choice between schemas.

#### Scenario: Empty email accepted
- **WHEN** a user leaves `person.email` blank
- **THEN** the field is accepted without a format error

#### Scenario: Invalid email rejected
- **WHEN** a user enters a non-empty value in `person.email` that is not a valid email address
- **THEN** the field is flagged as invalid

### Requirement: Required fields match the schema's required arrays
The system SHALL mark a field as required in the UI if and only if the corresponding property is listed in the schema's `required` array at that nesting level (e.g. `person.name` is required; `career[].missions[].position` and `career[].missions[].company` are required; `education` entries have no required fields).

#### Scenario: Person name required
- **WHEN** a user leaves `person.name` empty
- **THEN** the form indicates that this field is required

#### Scenario: Education fields optional
- **WHEN** a user leaves all fields of an education entry empty
- **THEN** the form does not report a required-field error for that entry

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
