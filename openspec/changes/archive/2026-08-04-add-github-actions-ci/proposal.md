## Why

The project has no automated verification: lint, type-checking, build, and tests only run locally if a contributor remembers to. There is no `.github/workflows/` in the repo, so broken code can be merged into `main` unnoticed. As the project grows (OpenSpec-driven changes, external contributions), a GitHub Actions pipeline that checks every pull request and every push to `main` is needed to catch regressions before they land.

## What Changes

- Add a new GitHub Actions workflow (`.github/workflows/ci.yml`) triggered on `pull_request` (targeting `main`) and `push` (to `main`).
- Run three independent, parallel jobs:
  - **lint**: `npm run lint` (oxlint)
  - **build**: `npm run build` (`tsc -b && vite build`) — covers type-checking and bundling
  - **test**: `npm run test` (vitest run)
- Use Node.js 24 and cache npm dependencies (`actions/setup-node` with `cache: npm`) in each job.
- Cancel in-progress runs for the same pull request when new commits are pushed (`concurrency` with `cancel-in-progress: true`).
- No build artifact upload, no deployment step, no branch protection configuration — those are explicitly out of scope for this change.

## Capabilities

### New Capabilities
- `ci-pipeline`: Automated verification (lint, build, test) of every pull request and every push to `main` via GitHub Actions.

### Modified Capabilities
(none)

## Impact

- New file: `.github/workflows/ci.yml`.
- No changes to application code, dependencies, or existing npm scripts — the workflow reuses `lint`, `build`, and `test` scripts already defined in `package.json`.
- Contributors will see three required checks (lint / build / test) on pull requests once the workflow runs; enforcing them as required status checks on `main` is a manual GitHub repo setting, not covered here.
