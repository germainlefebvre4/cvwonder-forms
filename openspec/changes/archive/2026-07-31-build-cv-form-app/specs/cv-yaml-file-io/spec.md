## Purpose

Lets users bring an existing CV Wonder YAML file into the form for editing, and take their edited CV back out as a YAML file, entirely on their own device.

## ADDED Requirements

### Requirement: Import populates the form from a YAML file
The system SHALL let a user select a local YAML file and populate the form and underlying CV document from its parsed contents.

#### Scenario: Successful import
- **WHEN** a user selects a valid CV Wonder YAML file
- **THEN** the form sections are populated with the values from that file

#### Scenario: Malformed YAML import
- **WHEN** a user selects a file that is not valid YAML
- **THEN** the system reports a parse error and does not modify the current form state

### Requirement: Export downloads the current CV document as YAML
The system SHALL let a user download the current CV document, serialized as YAML, as a local file.

#### Scenario: Successful export
- **WHEN** a user triggers export
- **THEN** a YAML file containing the current CV document is downloaded to the user's device

### Requirement: Import and export require no server round-trip
The system SHALL perform YAML parsing, serialization, file reading, and file download entirely within the browser, without transmitting the CV document to any server.

#### Scenario: Offline import and export
- **WHEN** the user has no network connectivity
- **THEN** import and export continue to work
