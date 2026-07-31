## Purpose

Lets users work in the visual mode, light or dark, that is most comfortable for them.

## ADDED Requirements

### Requirement: Light and dark theme available
The system SHALL provide a light theme and a dark theme for the interface.

#### Scenario: Switch to dark mode
- **WHEN** a user selects dark mode
- **THEN** the interface, including the form and preview pane, is rendered using the dark theme's colors

### Requirement: Theme selection persists across sessions
The system SHALL remember the user's selected theme across page reloads within the same browser.

#### Scenario: Reload keeps theme
- **WHEN** a user selects dark mode and reloads the page
- **THEN** the interface is still displayed in dark mode
