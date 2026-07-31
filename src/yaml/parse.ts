import { parse } from 'yaml'
import type { JsonObject } from '../schema/types'

/** Parses YAML text into a CV document object. Throws on invalid YAML or a non-object root. */
export function parseYaml(text: string): JsonObject {
  const result = parse(text)
  if (result == null || typeof result !== 'object' || Array.isArray(result)) {
    throw new Error('Expected a YAML mapping at the document root')
  }
  return result as JsonObject
}
