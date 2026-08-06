## REMOVED Requirements

### Requirement: YAML preview column has a fixed width
**Reason**: The preview column should grow to use available space instead of staying fixed; the form column now takes the fixed width.
**Migration**: See ADDED Requirement "YAML preview column grows to fill remaining width".

#### Scenario: Preview width unchanged as viewport grows
- **WHEN** the viewport widens from `1280px` to `2256px`
- **THEN** the YAML preview column's width stays the same

### Requirement: Form column receives the remaining width, up to a cap
**Reason**: The form column should stay at a comfortable, fixed reading width instead of stretching with the viewport; the YAML preview column now absorbs the remaining space.
**Migration**: See ADDED Requirement "Form column has a fixed reading width".

#### Scenario: Form widens with the viewport below the cap
- **WHEN** the viewport widens from `1280px` to `1600px` (below the overall width cap)
- **THEN** the form column's width increases correspondingly
- **AND** the section nav and YAML preview columns' widths do not change

### Requirement: Overall page width is capped
**Reason**: With the form column now fixed-width and the YAML preview column flexible, there is no longer a fixed-width column that needs a cap to stop growing; removing the cap lets the YAML preview keep using extra space on ultra-wide viewports instead of it being left as outer margin.
**Migration**: None required. Pages relying on the previous `100rem` cap (e.g. expecting a fixed maximum content width) should instead expect the YAML preview column to keep growing with the viewport.

#### Scenario: Ultra-wide viewport stops growing the form beyond the cap
- **WHEN** the viewport is wider than the page's overall width cap
- **THEN** the form column's width matches its value at the cap width
- **AND** the additional viewport width appears as margin outside the section nav, form, and YAML preview columns

## ADDED Requirements

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

## MODIFIED Requirements

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
