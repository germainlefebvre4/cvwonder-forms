## MODIFIED Requirements

### Requirement: Repeatable sections support add, remove, and reorder
For schema array properties (`abstract`, `career`, `career[].missions`, `technicalSkills.domains`, `technicalSkills.domains[].competencies`, `sideProjects`, `certifications`, `languages`, `education`), the system SHALL let users add a new item, remove an existing item, and reorder items within the array. Reorder controls (move-up, move-down, and, on wide viewports, a drag handle) SHALL be presented in a rail to the left of each item's content, separate from the item's editable fields.

#### Scenario: Add a career entry
- **WHEN** a user adds a new entry to the career section
- **THEN** a new career entry (with at least one mission) is added to the form and to the underlying CV document

#### Scenario: Remove an item
- **WHEN** a user removes an item from a repeatable section
- **THEN** the item is removed from the form and from the underlying CV document, and the remaining items keep their relative order

#### Scenario: Reorder controls appear left of item content
- **WHEN** a repeatable section renders its items
- **THEN** each item's move-up/move-down controls appear in a rail positioned to the left of that item's editable fields, not within or above the fields

#### Scenario: Reorder an item by dragging
- **WHEN** a user drags an item's drag handle to a new position within the same repeatable section
- **THEN** the item moves to that position in the form and in the underlying CV document, and the other items shift accordingly while keeping their relative order

#### Scenario: Drag handle hidden on narrow viewports
- **WHEN** the viewport is narrower than the desktop breakpoint
- **THEN** the item's drag handle is not shown, and the move-up/move-down controls remain available and functional
