import Ajv, { type ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'
import cvSchemaRaw from '../../schemas/cvwonder.v0.10.1.json'
import type { JsonValue } from './types'

// Compiled against ajv's default (2020-12) vocabulary rather than resolving the
// draft-07 meta-schema: every keyword this schema actually uses (type,
// properties, required, items, minItems, minLength, minimum, maximum, format,
// anyOf, description) means the same thing in both drafts.
const { $schema: _draftSchema, ...cvSchema } = cvSchemaRaw as Record<string, unknown>

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)
const validateFn = ajv.compile(cvSchema)

/** A validation failure, kept as keyword + params (not a rendered message) so the UI can localize it. */
export interface ValidationIssue {
  keyword: string
  params: Record<string, unknown>
}

export interface ValidationResult {
  valid: boolean
  errorCount: number
  /** Issues keyed by dot-joined instance path, e.g. "person.email" or "career.0.companyName". */
  errorsByPath: Record<string, ValidationIssue[]>
}

function errorPath(error: ErrorObject): string {
  let path = error.instancePath.replace(/^\//, '').split('/').filter(Boolean).join('.')
  if (error.keyword === 'required') {
    const missing = (error.params as { missingProperty?: string }).missingProperty
    if (missing) path = path ? `${path}.${missing}` : missing
  }
  return path
}

export function validateDocument(document: JsonValue): ValidationResult {
  const valid = validateFn(document)
  const errorsByPath: Record<string, ValidationIssue[]> = {}
  for (const error of validateFn.errors ?? []) {
    // These two keywords are artifacts of the email/site "empty-or-format" anyOf
    // pattern: `maxLength` is the empty-string branch failing, and the outer
    // `anyOf` composite error just restates "no branch matched" - both are
    // redundant once the branch-specific `format` error is kept.
    if (error.keyword === 'maxLength' || error.keyword === 'anyOf') continue
    const path = errorPath(error)
    ;(errorsByPath[path] ??= []).push({ keyword: error.keyword, params: error.params as Record<string, unknown> })
  }
  const errorCount = Object.values(errorsByPath).reduce((n, issues) => n + issues.length, 0)
  return { valid: !!valid && errorCount === 0, errorCount, errorsByPath }
}
