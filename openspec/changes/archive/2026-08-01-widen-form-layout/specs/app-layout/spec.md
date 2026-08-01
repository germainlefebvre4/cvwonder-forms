## Purpose

Defines how horizontal space on the main editing screen is distributed between the section nav, the form, and the YAML preview across viewport sizes, so the form gets a fair share of available width instead of an arbitrary even split.

## ADDED Requirements

### Requirement: YAML preview column has a fixed width
The system SHALL render the YAML preview column at a fixed width at viewport widths of `1024px` and above, rather than sizing it proportionally to the available viewport width.

#### Scenario: Preview width unchanged as viewport grows
- **WHEN** the viewport widens from `1280px` to `2256px`
- **THEN** the YAML preview column's width stays the same

### Requirement: Form column receives the remaining width, up to a cap
The system SHALL give the form column whatever width remains after the section nav and YAML preview columns are sized, growing as the viewport widens, up to the page's overall width cap.

#### Scenario: Form widens with the viewport below the cap
- **WHEN** the viewport widens from `1280px` to `1600px` (below the overall width cap)
- **THEN** the form column's width increases correspondingly
- **AND** the section nav and YAML preview columns' widths do not change

### Requirement: Overall page width is capped
The system SHALL cap the total width of the section nav, form, and YAML preview columns combined, so that on viewports wider than the cap, the form column stops growing and the excess viewport width is left as outer margin instead of stretching the form further.

#### Scenario: Ultra-wide viewport stops growing the form beyond the cap
- **WHEN** the viewport is wider than the page's overall width cap
- **THEN** the form column's width matches its value at the cap width
- **AND** the additional viewport width appears as margin outside the section nav, form, and YAML preview columns

### Requirement: Section nav widens only on very wide viewports
The system SHALL keep the section nav column at its base fixed width for viewport widths from `1024px` up to a defined very-wide threshold, and switch it to a larger fixed width above that threshold.

#### Scenario: Nav stays at base width at laptop and standard desktop widths
- **WHEN** the viewport is between `1024px` and the very-wide threshold
- **THEN** the section nav column stays at its base fixed width

#### Scenario: Nav widens above the very-wide threshold
- **WHEN** the viewport widens past the very-wide threshold
- **THEN** the section nav column switches to its wider fixed width

### Requirement: Three-column layout remains usable at laptop widths
The system SHALL display the section nav, form, and YAML preview columns side by side without horizontal overflow or overlap at viewport widths from `1024px` up to the overall width cap.

#### Scenario: Laptop-width viewport shows all three columns without overflow
- **WHEN** the viewport width is `1280px`
- **THEN** the section nav, form, and YAML preview columns are all visible side by side
- **AND** no horizontal scrollbar appears on the page
