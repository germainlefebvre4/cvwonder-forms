## ADDED Requirements

### Requirement: Text-style inputs avoid mobile browser auto-zoom

Below the desktop breakpoint, the system SHALL render text-style input fields (single-line text input, numeric input, and repeatable text entry) at a font size of at least `16px`, so that mobile browsers that auto-zoom the page on focus of a smaller-font field do not trigger that zoom.

#### Scenario: Text input font size prevents auto-zoom on a narrow viewport

- **WHEN** the viewport is narrower than the desktop breakpoint
- **AND** a user focuses a single-line text input, numeric input, or repeatable text entry field
- **THEN** the focused field's computed font size is at least `16px`

#### Scenario: Desktop appearance unchanged

- **WHEN** the viewport is at or above the desktop breakpoint
- **THEN** text-style input fields keep their existing font size
