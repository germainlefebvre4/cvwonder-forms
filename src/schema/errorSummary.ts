import { getAtPath } from './pathUtils'
import { fieldLabelKey } from '../i18n'
import type { FieldDescriptor, JsonObject, Path } from './types'
import type { ValidationIssue } from './validator'

type Translate = (key: string, params?: Record<string, unknown>) => string

/** Converts a dot-joined `errorsByPath` key (e.g. "career.0.companyName") back into a concrete `Path`. */
export function instancePathToPath(instancePath: string): Path {
  return instancePath.split('.').map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment))
}

interface EntryLevel {
  /** The array's own schema path at the point this index was encountered, e.g. `['career', 'missions']`. */
  schemaPath: string[]
  /** 1-based index of the entry within that array. */
  index: number
}

/** Splits an instance path into its schema path (property keys only, for `fieldLabelKey`) and one
 * `EntryLevel` per repeatable entry it passes through, in the order encountered. */
function parseInstancePath(instancePath: string): { schemaPath: string[]; entryLevels: EntryLevel[] } {
  const schemaPath: string[] = []
  const entryLevels: EntryLevel[] = []
  for (const segment of instancePath.split('.')) {
    if (/^\d+$/.test(segment)) {
      entryLevels.push({ schemaPath: [...schemaPath], index: Number(segment) + 1 })
    } else {
      schemaPath.push(segment)
    }
  }
  return { schemaPath, entryLevels }
}

/** Human display label for an error's origin, e.g. "Carrière — Missions #1 › Poste". */
export function errorOriginLabel(t: Translate, instancePath: string): string {
  const { schemaPath, entryLevels } = parseInstancePath(instancePath)
  const fieldLabel = schemaPath.length > 1 ? t(fieldLabelKey(schemaPath)) : undefined
  const levelLabels = entryLevels.map((level) => `${t(fieldLabelKey(level.schemaPath))} #${level.index}`)
  const parts = [...levelLabels, ...(fieldLabel ? [fieldLabel] : [])]

  const sectionPath = schemaPath.slice(0, 1)
  const sectionIsFirstLevel = entryLevels[0]?.schemaPath.join('.') === sectionPath.join('.')
  if (sectionIsFirstLevel) return parts.join(' › ')

  const sectionLabel = t(fieldLabelKey(sectionPath))
  return parts.length > 0 ? `${sectionLabel} — ${parts.join(' › ')}` : sectionLabel
}

/**
 * Walks a section's field descriptor alongside the actual document, in the same order the form
 * renders it, collecting every instance path that currently has an entry in `errorsByPath` -
 * including array-level errors (e.g. a missing required repeatable list) and, for repeatable
 * object lists, one recursive pass per item that actually exists in the document.
 */
export function collectErrorPaths(
  descriptor: FieldDescriptor,
  path: Path,
  document: JsonObject,
  errorsByPath: Record<string, ValidationIssue[]>,
  out: string[] = [],
): string[] {
  const key = path.join('.')
  if (errorsByPath[key]) out.push(key)

  if (descriptor.kind === 'object') {
    for (const property of descriptor.properties) {
      collectErrorPaths(property, [...path, property.key], document, errorsByPath, out)
    }
  } else if (descriptor.kind === 'array' && descriptor.items.kind === 'object') {
    const value = getAtPath(document, path)
    const items = Array.isArray(value) ? value : []
    items.forEach((_, index) => collectErrorPaths(descriptor.items, [...path, index], document, errorsByPath, out))
  }

  return out
}
