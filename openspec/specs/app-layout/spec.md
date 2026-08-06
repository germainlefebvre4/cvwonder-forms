# app-layout Specification

## Purpose

Defines how horizontal space on the main editing screen is distributed between the section nav, the form, and the YAML preview across viewport sizes, so the form gets a fair share of available width instead of an arbitrary even split.

## Requirements

### Requirement: Form column has a fixed reading width
The system SHALL render the form column at a fixed width at viewport widths of `1024px` and above, sized for comfortable reading, rather than sizing it proportionally to the available viewport width.

#### Scenario: Form width unchanged as viewport grows
- **WHEN** the viewport widens from `1280px` to `2256px`
- **THEN** the form column's width stays the same

### Requirement: YAML preview column grows to fill remaining width
The system SHALL give the YAML preview column whatever width remains after the section nav and form columns are sized, growing as the viewport widens, with no overall page width cap limiting that growth.

#### Scenario: Preview widens with the viewport
- **WHEN** the viewport widens from `1280px` to `2560px`
- **THEN** the YAML preview column's width increases correspondingly
- **AND** the section nav and form columns' widths do not change

#### Scenario: Preview keeps growing on ultra-wide viewports
- **WHEN** the viewport is wider than the previous `100rem` page width cap
- **THEN** the YAML preview column continues to widen rather than being capped
- **AND** no additional outer margin is introduced beyond the page's standard edge padding

### Requirement: YAML preview column has a minimum width
The system SHALL enforce a minimum width on the YAML preview column so it does not shrink below a usable size as the viewport narrows toward the `1024px` breakpoint.

#### Scenario: Preview stops shrinking at its floor width
- **WHEN** the viewport narrows toward `1024px`
- **THEN** the YAML preview column's width does not shrink below its defined minimum

### Requirement: Section nav widens only on very wide viewports
The system SHALL keep the section nav column at its base fixed width for viewport widths from `1024px` up to a defined very-wide threshold, and switch it to a larger fixed width above that threshold.

#### Scenario: Nav stays at base width at laptop and standard desktop widths
- **WHEN** the viewport is between `1024px` and the very-wide threshold
- **THEN** the section nav column stays at its base fixed width

#### Scenario: Nav widens above the very-wide threshold
- **WHEN** the viewport widens past the very-wide threshold
- **THEN** the section nav column switches to its wider fixed width

### Requirement: Three-column layout remains usable at laptop widths
The system SHALL display the section nav, form, and YAML preview columns side by side without horizontal overflow or overlap at all viewport widths from `1024px` and above.

#### Scenario: Laptop-width viewport shows all three columns without overflow
- **WHEN** the viewport width is `1280px`
- **THEN** the section nav, form, and YAML preview columns are all visible side by side
- **AND** no horizontal scrollbar appears on the page

#### Scenario: Ultra-wide viewport shows all three columns without overflow
- **WHEN** the viewport width is `2560px`
- **THEN** the section nav, form, and YAML preview columns are all visible side by side
- **AND** no horizontal scrollbar appears on the page
