# yaml-field-highlight Specification

## Purpose
Lets users see, at a glance, which lines of the generated YAML correspond to the form field they're currently pointing at or have selected, instead of having to scan the whole preview by hand.

## Requirements

### Requirement: Hovering a field highlights its YAML text
While the pointer is over any form field - a scalar input, an object group, or a repeatable-list item - the system SHALL apply a background-color highlight to the line range in the YAML preview that corresponds to that field's data, for as long as the pointer remains over the field.

#### Scenario: Highlight appears on hover
- **WHEN** the user moves the pointer over a form field that has corresponding YAML output
- **THEN** the matching line range in the YAML preview is shown with a background-color highlight

#### Scenario: Highlight clears on leaving the field
- **WHEN** the user moves the pointer away from a previously hovered field without hovering or clicking another one
- **THEN** the background-color highlight in the YAML preview is removed

#### Scenario: Hovering a repeated item highlights only that item
- **WHEN** the user hovers one entry of a repeatable section (e.g. the second `career` entry) that has other entries before or after it
- **THEN** only the YAML line range for that specific entry is highlighted, not the other entries of the same list

#### Scenario: Hovering a nested field highlights only the nested range
- **WHEN** the user hovers a single field nested inside a group or repeated item (e.g. one field of a `career` entry)
- **THEN** only that field's own line range is highlighted, not the entire enclosing group or item

#### Scenario: Moving from a nested field back to its enclosing container updates the highlight
- **WHEN** the user moves the pointer from a nested field to a part of its enclosing group or repeatable-list item that is not itself a nested field (e.g. the group's own heading), without the pointer leaving that enclosing container
- **THEN** the highlight switches to the enclosing container's own YAML line range
- **AND** the highlight is not cleared at any point during that move

### Requirement: Clicking a field highlights and scrolls to its YAML text
The system SHALL apply the same background-color highlight as hovering when a form field is clicked, SHALL keep that highlight in place after the pointer leaves the field (until another field is hovered or clicked, or the selection is cleared by an outside click), and SHALL scroll the YAML preview pane so the highlighted range is visible.

#### Scenario: Click highlight persists after the pointer leaves
- **WHEN** the user clicks a form field and then moves the pointer away without hovering or clicking another field
- **THEN** the background-color highlight for the clicked field's YAML text remains visible

#### Scenario: Click scrolls the preview into view
- **WHEN** the user clicks a form field whose corresponding YAML text is currently scrolled out of view in the preview pane
- **THEN** the preview pane scrolls so that text becomes visible

#### Scenario: A later hover shows its own highlight without discarding the click
- **WHEN** the user has a field's click-highlight active and then hovers a different field
- **THEN** the hovered field's line range is highlighted
- **AND** moving the pointer away from that hovered field restores the highlight to the field that was clicked

### Requirement: Clicking outside any field clears the selection
The system SHALL clear the current click-selection when the user clicks anywhere that is not a form field, including the YAML preview pane, section add/remove/reorder controls, and any other page area outside a field.

#### Scenario: Clicking the YAML preview pane clears the selection
- **WHEN** a field's click-selection is active and the user clicks inside the YAML preview pane
- **THEN** the background-color highlight is removed and no field remains selected

#### Scenario: Clicking a form control that is not a field clears the selection
- **WHEN** a field's click-selection is active and the user clicks a control that is not itself a field (e.g. an add, remove, or reorder button)
- **THEN** the background-color highlight is removed and no field remains selected

#### Scenario: Clicking empty page area clears the selection
- **WHEN** a field's click-selection is active and the user clicks page area outside the form and outside the YAML preview (e.g. the header)
- **THEN** the background-color highlight is removed and no field remains selected

### Requirement: A field with no rendered YAML output highlights nothing
The system SHALL NOT highlight any YAML text when the hovered or clicked field's value is currently omitted from the YAML preview (e.g. an empty, not-yet-filled optional field).

#### Scenario: Hovering an empty field highlights nothing
- **WHEN** the user hovers a form field that currently has no value and therefore produces no line in the YAML preview
- **THEN** no line in the YAML preview is highlighted

### Requirement: Highlighting is one-directional
The system SHALL NOT change form state, scroll position, or field appearance in response to interaction with the YAML preview pane; highlighting is driven only by interaction with the form.

#### Scenario: Interacting with the YAML preview does not affect the form
- **WHEN** the user hovers, clicks, or scrolls within the YAML preview pane
- **THEN** no form field's appearance, scroll position, or focus changes as a result
