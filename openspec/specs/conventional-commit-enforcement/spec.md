# conventional-commit-enforcement Specification

## Purpose

Ensures every commit that lands on `main` (via squash-merge) has a message that conforms to the Conventional Commits specification, so downstream release automation can reliably parse version bumps and changelog entries from history.

## Requirements

### Requirement: Pull request title validation
The system SHALL validate that a pull request's title conforms to the Conventional Commits format (`<type>[optional scope][!]: <description>`) whenever the pull request targets the `main` branch.

#### Scenario: Title uses a valid Conventional Commits type
- **WHEN** a pull request is opened or updated with a title such as `feat: add xyz` or `fix(scope): correct abc`
- **THEN** the title validation check passes

#### Scenario: Title does not conform to Conventional Commits
- **WHEN** a pull request is opened or updated with a title that has no valid type prefix (e.g. `Update stuff`)
- **THEN** the title validation check fails and is reported as a failed status on the pull request

### Requirement: Re-validation on title or commit changes
The system SHALL re-run the pull request title validation whenever the pull request's title is edited or a new commit is pushed to it.

#### Scenario: Title edited after initial failure
- **WHEN** a pull request's title previously failed validation and is edited to a conforming title
- **THEN** the title validation check re-runs and passes

#### Scenario: New commit pushed without title change
- **WHEN** a new commit is pushed to an open pull request whose title already conforms
- **THEN** the title validation check re-runs and still passes

### Requirement: Body and description are not validated
The system SHALL NOT enforce any format or content requirement on the pull request's body/description as part of this check.

#### Scenario: Empty or free-form pull request body
- **WHEN** a pull request has a conforming title and an empty, missing, or free-form body
- **THEN** the title validation check passes regardless of the body content

### Requirement: Breaking change marker recognized
The system SHALL recognize a `!` immediately before the `:` in the pull request title (e.g. `feat!: ...`) as a valid indicator of a breaking change, without requiring additional body content.

#### Scenario: Title marks a breaking change
- **WHEN** a pull request title is `feat!: remove legacy field` or includes a scope such as `fix(api)!: change response shape`
- **THEN** the title validation check passes and the breaking-change marker is recognized
