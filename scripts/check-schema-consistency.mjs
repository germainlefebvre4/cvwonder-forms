#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const schemasDir = path.join(repoRoot, 'schemas')
const activeVersionRelPath = 'schemas/active-version.json'
const vendoredSchemaPattern = /^schemas\/cvwonder\.(.+)\.json$/

function vendoredSchemaPath(version) {
  return path.join(schemasDir, `cvwonder.${version}.json`)
}

function git(args, options = {}) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf-8', ...options })
}

/** Version an active-version.json blob resolves to, or null if that revision spec doesn't have one. */
function readVersionAt(revisionSpec) {
  try {
    const raw = git(['show', revisionSpec], { stdio: ['pipe', 'pipe', 'ignore'] })
    return JSON.parse(raw).version
  } catch {
    return null
  }
}

/** Staged changes as { status, file } — file is the post-commit path (the new side of a rename). */
function stagedEntries() {
  return git(['diff', '--cached', '--name-status'])
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, ...paths] = line.split('\t')
      return { status: status[0], file: paths[paths.length - 1] }
    })
}

function main() {
  const staged = stagedEntries()
  const stagedFiles = staged.map((entry) => entry.file)
  const stagedActiveVersion = stagedFiles.includes(activeVersionRelPath)

  const previousVersion = readVersionAt(`HEAD:${activeVersionRelPath}`)
  const newVersion = stagedActiveVersion ? readVersionAt(`:${activeVersionRelPath}`) : previousVersion

  if (!newVersion) {
    console.error(`${activeVersionRelPath} is missing or malformed.`)
    process.exitCode = 1
    return
  }

  if (!existsSync(vendoredSchemaPath(newVersion))) {
    console.error(
      `${activeVersionRelPath} points at "${newVersion}", but schemas/cvwonder.${newVersion}.json does not exist.\n` +
        'Run `npm run schema:update -- <tag>` to vendor a matching schema file, or fix active-version.json.',
    )
    process.exitCode = 1
    return
  }

  // Deletions are excluded: removing a stale/mismatched vendored file is always fine
  // (it's exactly the cleanup this check exists to encourage), never something to block.
  const stagedVendoredSchemas = staged
    .filter((entry) => entry.status !== 'D')
    .map((entry) => ({ entry, match: entry.file.match(vendoredSchemaPattern) }))
    .filter((x) => x.match)
    .map((x) => ({ file: x.entry.file, version: x.match[1] }))

  if (previousVersion && newVersion !== previousVersion) {
    const shipsNewFile = stagedVendoredSchemas.some((s) => s.version === newVersion)
    if (!shipsNewFile) {
      console.error(
        `Active version is switching from "${previousVersion ?? '(none)'}" to "${newVersion}", but ` +
          `schemas/cvwonder.${newVersion}.json is not staged in this commit.\n` +
          'A version switch must vendor its file in the same commit — use `npm run schema:update -- <tag>` which does both.',
      )
      process.exitCode = 1
      return
    }
  }

  const mismatched = stagedVendoredSchemas.filter(
    (s) => s.version !== newVersion && s.version !== previousVersion,
  )
  if (mismatched.length > 0) {
    console.error(
      `Staged ${mismatched.map((s) => s.file).join(', ')}, which does not match the active version ` +
        `("${newVersion}").\nA vendored schema file must match schemas/active-version.json — use ` +
        '`npm run schema:update -- <tag>` to switch versions instead of adding a file by hand.',
    )
    process.exitCode = 1
    return
  }
}

main()
