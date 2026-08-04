## Context

No `.github/workflows/` exists yet. The project is a single-package npm project (`package-lock.json` present) with `lint`, `build`, and `test` npm scripts already defined. Single branch (`main`), no existing deploy pipeline, no branch protection to configure. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Define the workflow file's structure, triggers, and job layout so implementation is a direct translation into YAML.
- Capture the specific technical choices (Node version, caching, concurrency) agreed on so they aren't re-litigated during implementation.

**Non-Goals:**
- Branch protection / required status check configuration (manual GitHub setting, out of scope).
- Build artifact upload or any deployment step.
- Multi-version Node matrix testing.

## Decisions

**Single workflow file, three parallel jobs.** One file `.github/workflows/ci.yml` with jobs `lint`, `build`, `test`, each independent (no `needs:` between them) so a failure in one doesn't block the others from running and reporting their own status. Matches the "Independent parallel checks" requirement in specs/ci-pipeline.

**Triggers.**
```yaml
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
```

**Node version: 24, no matrix.** Single version pinned via `actions/setup-node@v4` with `node-version: 24`. No compatibility matrix needed for a single-maintainer app.

**Dependency install: `npm ci`.** Deterministic install from `package-lock.json`, standard for CI (faster and stricter than `npm install`).

**Caching.** Each job uses `actions/setup-node`'s built-in `cache: npm` (keyed off `package-lock.json`) rather than a separate `actions/cache` step — simplest option, no extra step to maintain.

**Concurrency / cancellation.** Top-level `concurrency` group keyed by workflow + ref, with `cancel-in-progress: true`:
```yaml
concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```
This satisfies the "Superseded run cancellation" requirement — a new push to the same PR branch cancels the previous run for that branch. Pushes to `main` share one queued/cancel group per ref as well, which is acceptable since `main` is linear (no concurrent pushes expected in practice).

**Job commands.** Each job runs `actions/checkout@v4` → `actions/setup-node@v4` → `npm ci` → its one script:
- `lint`: `npm run lint`
- `build`: `npm run build`
- `test`: `npm run test`

No separate type-check step: `npm run build` already runs `tsc -b` before `vite build`, so a type error fails the build job.

## Risks / Trade-offs

- **Shared concurrency group for `main` pushes** → Two rapid pushes to `main` would cancel the first run's checks before they report. Mitigation: acceptable for a single-maintainer, linear-history branch; revisit (split push vs. pull_request into separate concurrency groups) if push volume to `main` increases.
- **No required status checks configured** → Nothing stops a merge even if CI is red. Mitigation: explicitly out of scope per proposal; user will configure branch protection separately if/when desired.
