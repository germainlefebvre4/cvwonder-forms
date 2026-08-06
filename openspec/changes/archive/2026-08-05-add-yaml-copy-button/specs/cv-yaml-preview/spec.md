## ADDED Requirements

### Requirement: User can copy the previewed YAML to the clipboard
The system SHALL provide a control near the YAML preview pane that, when activated, copies the full current YAML output (the same content the preview pane renders) to the system clipboard.

#### Scenario: Copy captures the current document
- **WHEN** a user activates the copy control
- **THEN** the system clipboard contains the complete YAML text currently shown in the preview pane, including any sections the user has filled in

#### Scenario: Copy confirmation is shown
- **WHEN** a user activates the copy control and the copy succeeds
- **THEN** the control displays a temporary confirmation (e.g. "Copied!") in place of its normal label
- **AND** the control reverts to its normal label after a short delay without requiring further user action

#### Scenario: Copy failure does not silently pass as success
- **WHEN** a user activates the copy control and the clipboard write fails (e.g. clipboard access denied by the browser)
- **THEN** the system does not display the success confirmation
