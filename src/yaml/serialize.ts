import { stringify } from 'yaml'
import type { JsonValue } from '../schema/types'

/** Recursively drops empty strings, empty arrays/objects, null and undefined. */
function pruneEmpty(value: JsonValue): JsonValue | undefined {
  if (value === '' || value == null) return undefined
  if (Array.isArray(value)) {
    const items = value.map(pruneEmpty).filter((item): item is JsonValue => item !== undefined)
    return items.length > 0 ? items : undefined
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, child]) => [key, pruneEmpty(child)] as const)
      .filter((entry): entry is [string, JsonValue] => entry[1] !== undefined)
    return entries.length > 0 ? Object.fromEntries(entries) : undefined
  }
  return value
}

/** Serializes the CV document to YAML, omitting fields the user has not filled in. */
export function serializeToYaml(document: JsonValue): string {
  const pruned = pruneEmpty(document)
  return pruned === undefined ? '' : stringify(pruned)
}
