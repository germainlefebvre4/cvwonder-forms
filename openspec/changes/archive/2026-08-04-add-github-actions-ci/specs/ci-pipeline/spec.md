## Purpose

Automatically verifies that every proposed and merged change to the codebase lints cleanly, builds successfully, and passes its test suite, so regressions are caught before they reach `main`.

## ADDED Requirements

### Requirement: Verification on pull requests
The system SHALL run the CI pipeline on every pull request targeting the `main` branch.

#### Scenario: Pull request opened against main
- **WHEN** a pull request is opened or updated with `main` as its target branch
- **THEN** the CI pipeline runs against the pull request's head commit

### Requirement: Verification on push to main
The system SHALL run the CI pipeline on every push to the `main` branch.

#### Scenario: Commit pushed directly to main
- **WHEN** a commit is pushed to `main` (including a merge commit)
- **THEN** the CI pipeline runs against that commit

### Requirement: Lint check
The system SHALL verify the codebase against the project's lint rules as part of the pipeline.

#### Scenario: Lint violations present
- **WHEN** the pipeline runs and the codebase contains lint violations
- **THEN** the lint check fails and is reported as a failed status on the commit or pull request

#### Scenario: No lint violations
- **WHEN** the pipeline runs and the codebase has no lint violations
- **THEN** the lint check passes

### Requirement: Build check
The system SHALL verify that the codebase type-checks and builds successfully as part of the pipeline.

#### Scenario: Type error or build failure present
- **WHEN** the pipeline runs and the codebase fails to type-check or produce a build
- **THEN** the build check fails and is reported as a failed status on the commit or pull request

#### Scenario: Build succeeds
- **WHEN** the pipeline runs and the codebase type-checks and builds without error
- **THEN** the build check passes

### Requirement: Test check
The system SHALL run the automated test suite as part of the pipeline.

#### Scenario: Failing tests present
- **WHEN** the pipeline runs and one or more tests fail
- **THEN** the test check fails and is reported as a failed status on the commit or pull request

#### Scenario: All tests pass
- **WHEN** the pipeline runs and all tests pass
- **THEN** the test check passes

### Requirement: Independent parallel checks
The system SHALL run the lint, build, and test checks independently of one another, so that the failure of one check does not prevent the others from running or reporting their own result.

#### Scenario: One check fails while others succeed
- **WHEN** the lint check fails and the build and test checks would otherwise succeed
- **THEN** the build and test checks still run to completion and report their own pass status, independent of the lint failure

### Requirement: Superseded run cancellation
The system SHALL cancel an in-progress pipeline run for a pull request when a new commit is pushed to that same pull request, so that only the latest commit's results are reported.

#### Scenario: New commit pushed while a run is in progress
- **WHEN** a pipeline run is in progress for a pull request and a new commit is pushed to that pull request's branch
- **THEN** the in-progress run for the previous commit is cancelled and a new run starts for the latest commit
