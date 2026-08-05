## 1. PR title enforcement

- [x] 1.1 Add a GitHub Actions workflow (e.g. `.github/workflows/pr-title.yml`) triggered on `pull_request` (`opened`, `edited`, `synchronize`, `reopened`) targeting `main`
- [x] 1.2 Use a maintained Conventional Commits PR-title-linting action, pinned to a specific commit SHA, configured to validate the title only (no body/description check)
- [x] 1.3 Confirm the workflow recognizes the `!` breaking-change marker (e.g. `feat!: ...`, `fix(scope)!: ...`) as valid
- [x] 1.4 Verify a non-conforming title fails the check and a conforming one passes, using a scratch PR (confirmed live: PR #4, titled `ci: Release management`, passed the check and merged; the reject path was already confirmed by source inspection of `validatePrTitle.js`)

## 2. Release automation bootstrap (release-please)

- [x] 2.1 Add `release-please-config.json` at the repo root configured for a single package with `release-type: node`
- [x] 2.2 Add `.release-please-manifest.json` seeded with `{"." : "0.1.0"}` so `v0.1.0` is treated as the baseline and its history is not recomputed
- [x] 2.3 Explicitly set `bump-minor-pre-major: false` and `bump-patch-for-minor-pre-major: false` in `release-please-config.json` (confirmed via source inspection to already be release-please's default; pinned explicitly so a breaking-change commit is guaranteed to bump major even below `1.0.0`, regardless of future default changes)
- [x] 2.4 Add a GitHub Actions workflow (e.g. `.github/workflows/release-please.yml`) triggered on `push` to `main`, running the release-please action pinned to a specific commit SHA
- [x] 2.5 Verify locally/in a draft PR that the generated Release PR correctly reflects a patch, minor, and breaking-change scenario against the seeded `0.1.0` baseline (e.g. via the action's dry-run/manifest inspection)

## 3. Release asset build

- [x] 3.1 Add a GitHub Actions workflow (e.g. `.github/workflows/release-assets.yml`) triggered on the `release` event with type `published`
- [x] 3.2 In that workflow, check out the tagged commit, install dependencies, and run `npm run build`
- [x] 3.3 Zip the `dist/` output into `dist.zip` and upload it as an asset on the triggering release (e.g. via `gh release upload` or an upload-release-asset action)
- [x] 3.4 Verify that a failed build leaves the tag and GitHub Release intact without a `dist.zip` asset, and surfaces the failure in the Actions tab

## 4. Repository configuration

- [x] 4.1 Configure branch protection on `main` to require the PR-title-check status check before merging (via GitHub UI or `gh api`), so enforcement is not merely advisory
- [x] 4.2 Confirm squash-merge remains the only enabled merge strategy (already configured) so no additional change is needed there

## 5. Rollout verification

- [x] 5.1 Merge this change's own pull request using a Conventional-Commits-conforming title, dogfooding the new title check
- [x] 5.2 After the next conforming `feat:`/`fix:` merge to `main`, confirm the standing Release PR appears with the expected version bump and changelog entry
- [x] 5.3 Merge the Release PR and confirm a git tag, a GitHub Release with generated changelog, and a `dist.zip` asset are all created
