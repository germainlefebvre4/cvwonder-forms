## Context

See `proposal.md` - Why/What Changes for motivation. Relevant constraints already in place in this repo:
- GitHub squash-merge is the only allowed merge strategy (`mergeCommitAllowed`/`rebaseMergeAllowed` are both disabled) - so a PR title becomes the sole commit message on `main`.
- No branch protection rule currently exists on `main`.
- A manual `v0.1.0` tag/release already exists (empty changelog body, no assets) and is treated as the baseline, not backfilled.
- `package.json` is `"private": true` - there is no npm publish step today and none is being added.
- External consumers pull a tagged commit and build it themselves; they do not consume a pre-hosted deployment of this app.

## Goals / Non-Goals

**Goals:**
- Make the PR title the single, enforced source of truth for Conventional Commit type/scope/breaking-marker.
- Drive version/changelog/tag/release entirely from that history via `release-please`, with an explicit human action (merging the Release PR) to cut a release.
- Guarantee a major bump on breaking changes even pre-`1.0.0`.
- Attach a `dist.zip` convenience artifact once a release's tag exists, without making it part of the release's critical path.

**Non-Goals:**
- No `npm publish` / registry distribution - the package stays private; consumers build from source.
- No validation of PR body/description content.
- No change to the existing `ci-pipeline` capability (lint/build/test) - this is an independent set of checks.
- No retroactive changelog generation for `v0.1.0` or any pre-baseline history.

## Decisions

**release-please, `node` release-type, single-package (non-manifest-multi-package) mode.**
`node` release-type keeps `package.json`'s `version` field in sync with each computed release (something a bare `simple` strategy would not do), without adding any npm-publish behavior - publish is a separate opt-in step this change deliberately does not add. Manifest mode (multi-package) is unnecessary since this is a single-package repo; a plain `release-please-config.json` + `.release-please-manifest.json` pair seeded with `"." : "0.1.0"` is enough to establish the baseline.

**PR title enforcement via a dedicated, well-established Action (e.g. `amannn/action-semantic-pull-request`) rather than a hand-rolled regex script.**
Conventional Commits grammar has edge cases (optional scope, `!` breaking marker, allowed type lists) that a maintained action already handles correctly; reimplementing this is unnecessary surface area for a solo-maintainer repo. The action is pinned to a specific commit SHA (not a floating tag/major version) to limit third-party supply-chain exposure, consistent with treating third-party Actions as untrusted code.

**Breaking-change-as-major pre-1.0 is release-please's default behavior, pinned explicitly rather than left implicit.**
Inspection of `release-please`'s `DefaultVersioningStrategy` (`bumpMinorPreMajor` defaults to `false`) confirms a breaking-change commit already bumps the **major** version regardless of `isPreMajor` status - the minor-bump-pre-1.0 behavior is an opt-in (`bump-minor-pre-major: true`), not the default. Since this repo's consumers build from source at a pinned tag and a real breaking change should be as visible as a major bump even before `1.0.0`, `release-please-config.json` sets `bump-minor-pre-major: false` and `bump-patch-for-minor-pre-major: false` explicitly. This changes nothing behaviorally versus an empty config, but keeps the intent visible in version control and guards against the behavior silently changing if a future `release-please` version flips its own default.

**Release-artifact build triggers on the `release: published` event, not on a raw tag push.**
release-please's merge of the Release PR creates the git tag *and* the GitHub Release object together in one action. Triggering on `release: published` targets exactly that moment and naturally excludes any stray manually-pushed tag that isn't accompanied by a release-please-created release, avoiding accidental/duplicate build runs.

**Branch protection on `main` requiring the new PR-title check is part of this change's rollout, not a follow-up.**
The user explicitly wants Conventional Commits *enforced*, not just checked. A status check that isn't marked "required" in branch protection can still be merged past when failing, which would not satisfy that intent. Configuring this is a one-time repository setting (via GitHub UI or `gh api`), tracked as a task in `tasks.md` alongside the workflow files.

## Risks / Trade-offs

- [Risk] Third-party Actions (`amannn/action-semantic-pull-request`, `googleapis/release-please-action`) are supply-chain dependencies → Mitigation: pin both to a specific commit SHA, not a floating tag.
- [Risk] A future contributor sets `bump-minor-pre-major: true` (e.g. copying config from another project) and silently reintroduces minor-only bumps for breaking changes pre-1.0 → Mitigation: the explicit `false` values are version-controlled and the rationale is recorded here in `design.md`; the spec's "Breaking changes bump major even before 1.0.0" requirement makes the intended behavior explicit and testable.
- [Risk] The `dist.zip` build could fail after a release is already published, leaving a release without its convenience asset → Mitigation: this is accepted by design (see spec scenario "Tag created without a successful build") since the primary consumer contract is the tagged source, not the zip; the failed workflow run surfaces in the repo's Actions tab.
- [Risk] No branch protection exists today, so until it is configured the PR-title check is advisory only → Mitigation: configuring branch protection is included as an explicit task in this change, not deferred.

## Migration Plan

1. Add `release-please-config.json` and `.release-please-manifest.json` seeded with the current baseline (`0.1.0`), plus the three new GitHub Actions workflows (PR title check, release-please, release-asset build). None of this affects the existing `ci-pipeline` workflow.
2. Merge this change's own PR using a conforming title, to dogfood the new title check immediately.
3. Configure branch protection on `main` to require the PR-title-check status check (one-time repository setting).
4. Confirm the first standing Release PR appears after the next conforming `feat:`/`fix:` merge, and that merging it produces a tag, a GitHub Release with changelog, and (once the asset workflow runs) a `dist.zip` asset.
5. Rollback, if ever needed, is non-destructive: disable/remove the three workflows and the branch protection requirement. `release-please` does not rewrite history - it only opens PRs and creates tags/releases - so no destructive git operations are involved in adopting or reverting this change.

## Open Questions

- Should changelog sections hide "non-releasable" commit types (e.g. `chore:`, `ci:`) entirely, or list them under a low-visibility section? This only affects changelog formatting/config, not the enforcement or versioning behavior already specified, so it can be tuned during implementation without revisiting the spec.
