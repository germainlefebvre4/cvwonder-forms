## Purpose

Protects users from losing their in-progress CV if they accidentally close or refresh the page.

## ADDED Requirements

### Requirement: Autosave in-progress document locally
The system SHALL automatically persist the current CV document to local browser storage as the user edits it, without requiring an explicit save action.

#### Scenario: Refresh preserves progress
- **WHEN** a user edits the form and then reloads the page in the same browser
- **THEN** the form is repopulated with the values they had entered before the reload

### Requirement: Local persistence only
The system SHALL store the autosaved document only in the user's browser and SHALL NOT transmit it to any server.

#### Scenario: No network activity on autosave
- **WHEN** the autosave triggers
- **THEN** no network request is made to persist the document
