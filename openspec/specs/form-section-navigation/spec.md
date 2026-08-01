# form-section-navigation Specification

## Purpose

Lets users jump directly to any form section and see at a glance which sections still need attention, instead of having to scroll through the entire form to find or check a section.

## Requirements

### Requirement: Navigation lists all top-level sections in form order
The system SHALL display a navigation element listing every top-level form section, in the same order the sections appear in the form.

#### Scenario: Nav order matches form order
- **WHEN** the form loads
- **THEN** the navigation lists `company`, `person`, `socialNetworks`, `abstract`, `career`, `technicalSkills`, `sideProjects`, `certifications`, `languages`, `education` in that order

### Requirement: Selecting a navigation item scrolls to its section
The system SHALL scroll the form to bring a section into view when the user activates its corresponding navigation item, without unmounting or hiding any other section.

#### Scenario: Jump to a section
- **WHEN** a user activates the "certifications" navigation item
- **THEN** the form scrolls so the certifications section is in view
- **AND** all other sections remain present in the form and can still be scrolled to directly

### Requirement: Navigation highlights the section currently in view
The system SHALL highlight the navigation item corresponding to whichever section is currently in view as the user scrolls the form, without requiring the user to click a navigation item first.

#### Scenario: Highlight follows scroll
- **WHEN** a user scrolls the form until the "career" section is the one in view
- **THEN** the "career" navigation item is shown as the active item
- **AND** the previously active navigation item is no longer shown as active

### Requirement: Navigation item shows a per-section content status
The system SHALL show, for each section, whether it currently has no content, has content, or contains a validation error, with the error status taking priority over the content status when both apply.

#### Scenario: Empty section shows no content indicator
- **WHEN** a user has not entered any data in the "certifications" section
- **THEN** the "certifications" navigation item shows the empty/no-content status

#### Scenario: Filled section shows content indicator
- **WHEN** a user has entered at least one certification
- **THEN** the "certifications" navigation item shows the has-content status

#### Scenario: Section with a validation error shows error indicator
- **WHEN** a section contains a field with a validation error
- **THEN** that section's navigation item shows the error status
- **AND** the error status is shown even if the section also has content elsewhere

### Requirement: Required section only shows an error status after interaction
The system SHALL NOT show the error status for a required section that has no content until the user has interacted with that section, so that a freshly loaded blank form shows no error statuses.

#### Scenario: Blank form shows no errors on load
- **WHEN** the form is loaded with no prior data and the user has not yet interacted with any section
- **THEN** no navigation item shows the error status, even for required sections such as "person"

#### Scenario: Error appears after leaving a required section incomplete
- **WHEN** a user interacts with the required "person" section and leaves a required field empty
- **THEN** the "person" navigation item shows the error status

### Requirement: Navigation adapts to narrow viewports
Below a `1024px` viewport width, the system SHALL render the navigation as a horizontally scrollable row instead of a vertical sidebar, while preserving the same scroll-spy highlighting and per-section status behavior.

#### Scenario: Narrow viewport shows horizontal navigation
- **WHEN** the viewport width is below `1024px`
- **THEN** the navigation is rendered as a horizontally scrollable row above the form
- **AND** activating an item and scrolling the form still update the active item and per-section statuses as on wider viewports
