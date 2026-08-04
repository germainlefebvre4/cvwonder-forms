## 1. Workflow file

- [x] 1.1 Create `.github/workflows/ci.yml` with `name:`, `on.pull_request.branches: [main]`, `on.push.branches: [main]`, and the top-level `concurrency` block (`group: ci-${{ github.workflow }}-${{ github.ref }}`, `cancel-in-progress: true`)
- [x] 1.2 Add the `lint` job: checkout (`actions/checkout@v4`) → `actions/setup-node@v4` (`node-version: 24`, `cache: npm`) → `npm ci` → `npm run lint`
- [x] 1.3 Add the `build` job: same checkout/setup-node/`npm ci` steps → `npm run build`
- [x] 1.4 Add the `test` job: same checkout/setup-node/`npm ci` steps → `npm run test`
- [x] 1.5 Confirm the three jobs have no `needs:` between them (run independently in parallel)

## 2. Validation

- [x] 2.1 Validate the workflow YAML syntax (e.g. `actionlint`, or a linter/editor YAML check) before committing
- [x] 2.2 Push a branch with an open pull request against `main` and confirm all three checks (`lint`, `build`, `test`) appear and run in parallel
- [x] 2.3 Confirm a push of a new commit to that same PR branch cancels the previous in-progress run
- [x] 2.4 Intentionally break one job (e.g. a lint violation) on a scratch branch/PR and confirm only that check fails while the other two still pass
- [x] 2.5 Merge/push to `main` directly (or confirm via the PR merge) and verify the workflow also runs on the `push` trigger
