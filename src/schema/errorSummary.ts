import { getAtPath } from './pathUtils'
import { fieldLabelKey } from '../i18n'
import type { FieldDescriptor, JsonObject, Path } from './types'
import type { ValidationIssue } from './validator'

type Translate = (key: string, params?: Record<string, unknown>) => string

/** Converts a dot-joined `errorsByPath` key (e.g. "career.0.companyName") back into a concrete `Path`. */
export function instancePathToPath(instancePath: string): Path {
  return instancePath.split('.').map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment))
}

/** Splits an instance path into its schema path (property keys only, for `fieldLabelKey`) and the
 * 1-based index of every repeatable entry it passes through, in the order encountered. */
function parseInstancePath(instancePath: string): { schemaPath: string[]; entryIndices: number[] } {
  const schemaPath: string[] = []
  const entryIndices: number[] = []
  for (const segment of instancePath.split('.')) {
    if (/^\d+$/.test(segment)) {
      entryIndices.push(Number(segment) + 1)
    } else {
      schemaPath.push(segment)
    }
  }
  return { schemaPath, entryIndices }
}

/** Human display label for an error's origin, e.g. "Carrière — entrée 2 › Nom de l'entreprise". */
export function errorOriginLabel(t: Translate, instancePath: string): string {
  const { schemaPath, entryIndices } = parseInstancePath(instancePath)
  const sectionLabel = t(fieldLabelKey(schemaPath.slice(0, 1)))
  const fieldLabel = schemaPath.length > 1 ? t(fieldLabelKey(schemaPath)) : undefined
  const parts = [
    ...entryIndices.map((index) => t('errorSummary.entry', { index })),
    ...(fieldLabel ? [fieldLabel] : []),
  ]
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
