## MODIFIED Requirements

### Requirement: Navigation highlights the section currently in view
The system SHALL highlight the navigation item corresponding to whichever section is currently in view as the user scrolls the form, without requiring the user to click a navigation item first. While a scroll triggered by activating a navigation item is still in progress, the system SHALL keep that item highlighted rather than recomputing the active item from the in-flight scroll position, until either the scroll finishes or the user scrolls the form manually.

#### Scenario: Highlight follows scroll
- **WHEN** a user scrolls the form until the "career" section is the one in view
- **THEN** the "career" navigation item is shown as the active item
- **AND** the previously active navigation item is no longer shown as active

#### Scenario: Highlight stays stable while a clicked section scrolls into view
- **WHEN** a user activates the "certifications" navigation item and the resulting scroll animation is still in progress
- **THEN** the "certifications" navigation item remains the active item for the entire duration of the animation
- **AND** no other navigation item is shown as active at any point during the animation

#### Scenario: Manual scroll during a click-triggered animation regains control
- **WHEN** a user activates a navigation item and then scrolls the form manually before that item's scroll animation finishes
- **THEN** the active item immediately starts following the manual scroll position again, as in the "Highlight follows scroll" scenario
