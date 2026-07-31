# app-i18n Specification

## Purpose

Makes the interface usable for both French- and English-speaking users by letting them choose the display language.

## Requirements

### Requirement: French and English interface languages available
The system SHALL provide French and English translations for all interface labels, buttons, and validation messages.

#### Scenario: Switch to English
- **WHEN** a user selects English as the interface language
- **THEN** form labels, buttons, and validation messages are displayed in English

### Requirement: Language selection persists across sessions
The system SHALL remember the user's selected interface language across page reloads within the same browser.

#### Scenario: Reload keeps language
- **WHEN** a user selects French and reloads the page
- **THEN** the interface is still displayed in French
