#!/usr/bin/env node
import { readFile, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const schemasDir = path.join(repoRoot, 'schemas')
const activeVersionPath = path.join(schemasDir, 'active-version.json')

function vendoredSchemaPath(version) {
  return path.join(schemasDir, `cvwonder.${version}.json`)
}

async function main() {
  const tag = process.argv[2]
  if (!tag) {
    console.error('Usage: npm run schema:update -- <cvwonder-git-tag>\nExample: npm run schema:update -- v0.10.2')
    process.exitCode = 1
    return
  }

  const url = `https://raw.githubusercontent.com/germainlefebvre4/cvwonder/refs/tags/${tag}/internal/validator/schema.json`
  const response = await fetch(url)
  if (!response.ok) {
    console.error(
      `Failed to fetch schema for tag "${tag}" (${response.status} ${response.statusText}).\n` +
        `Checked: ${url}\nNo files were changed — confirm the tag exists in https://github.com/germainlefebvre4/cvwonder/tags.`,
    )
    process.exitCode = 1
    return
  }
  const schemaContents = await response.text()

  const activeVersionRaw = await readFile(activeVersionPath, 'utf-8')
  const previousVersion = JSON.parse(activeVersionRaw).version

  await writeFile(vendoredSchemaPath(tag), schemaContents)
  await writeFile(activeVersionPath, JSON.stringify({ version: tag }, null, 2) + '\n')

  if (previousVersion && previousVersion !== tag) {
    const previousPath = vendoredSchemaPath(previousVersion)
    if (existsSync(previousPath)) {
      await rm(previousPath)
      console.log(`Removed superseded schemas/cvwonder.${previousVersion}.json`)
    }
  }

  console.log(`Vendored cvwonder schema ${tag} to schemas/cvwonder.${tag}.json and set it as the active version.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
