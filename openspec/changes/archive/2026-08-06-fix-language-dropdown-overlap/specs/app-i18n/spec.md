## ADDED Requirements

### Requirement: Language switcher menu does not overlap other controls
The system SHALL render the open language switcher menu anchored below its trigger, without visually overlapping the trigger or other header controls.

#### Scenario: Opening the menu next to other header controls
- **WHEN** a user opens the language switcher menu in the top header
- **THEN** the menu appears anchored below the language switcher trigger
- **AND** the menu does not visually overlap the trigger or adjacent header controls (import, export, theme toggle)

### Requirement: Language switcher menu indicates the active language
The system SHALL visually mark the language option matching the currently selected interface language as active whenever the language switcher menu is open.

#### Scenario: Opening the menu shows the current language
- **WHEN** a user opens the language switcher menu while French is the active interface language
- **THEN** the French option is visually marked as the active selection
- **AND** the English option is not marked as active

#### Scenario: Active language marker follows the selection
- **WHEN** a user switches the interface language from French to English
- **AND** then reopens the language switcher menu
- **THEN** the English option is visually marked as the active selection
