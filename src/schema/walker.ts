import type { FieldDescriptor } from './types'

/** Minimal shape of the JSON Schema (draft-07) nodes this walker understands. */
export interface SchemaNode {
  type?: string
  description?: string
  properties?: Record<string, SchemaNode>
  required?: string[]
  items?: SchemaNode
  minItems?: number
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  format?: string
  anyOf?: SchemaNode[]
}

/**
 * Detects the CV Wonder `anyOf: [{maxLength: 0}, {format}]` pattern used for
 * "optional but validated when non-empty" string fields (person.email, person.site).
 * Returns the format to validate against when the field is non-empty, or null.
 */
function detectOptionalFormat(node: SchemaNode): string | null {
  if (!Array.isArray(node.anyOf) || node.anyOf.length !== 2) return null
  const empty = node.anyOf.find((s) => s.maxLength === 0)
  const formatted = node.anyOf.find((s) => typeof s.format === 'string')
  return empty && formatted ? (formatted.format as string) : null
}

/**
 * Walks a JSON Schema node and produces the field descriptor tree the form
 * renderer and default-value builder consume. `required` reflects whether
 * this property is listed in its *parent's* `required` array.
 */
export function buildFieldDescriptor(
  key: string,
  node: SchemaNode,
  schemaPath: string[],
  required: boolean,
): FieldDescriptor {
  const optionalFormat = detectOptionalFormat(node)
  if (optionalFormat) {
    return {
      kind: 'string',
      key,
      schemaPath,
      required,
      description: node.description,
      format: optionalFormat === 'email' || optionalFormat === 'uri' ? optionalFormat : undefined,
      optionalFormat: true,
    }
  }

  if (node.type === 'object' || node.properties) {
    const requiredKeys = new Set(node.required ?? [])
    const properties = Object.entries(node.properties ?? {}).map(([childKey, childNode]) =>
      buildFieldDescriptor(childKey, childNode, [...schemaPath, childKey], requiredKeys.has(childKey)),
    )
    return {
      kind: 'object',
      key,
      schemaPath,
      required,
      description: node.description,
      properties,
    }
  }

  if (node.type === 'array' || node.items) {
    const itemNode = node.items ?? { type: 'string' }
    return {
      kind: 'array',
      key,
      schemaPath,
      required,
      description: node.description,
      items: buildFieldDescriptor('', itemNode, schemaPath, false),
      minItems: node.minItems,
    }
  }

  if (node.type === 'integer' || node.type === 'number') {
    return {
      kind: 'integer',
      key,
      schemaPath,
      required,
      description: node.description,
      minimum: node.minimum,
      maximum: node.maximum,
    }
  }

  return {
    kind: 'string',
    key,
    schemaPath,
    required,
    description: node.description,
    format: node.format === 'email' || node.format === 'uri' ? node.format : undefined,
    minLength: node.minLength,
  }
}

/** Builds one top-level field descriptor per section (in schema-authored order). */
export function buildDocumentSections(schema: SchemaNode): FieldDescriptor[] {
  const requiredKeys = new Set(schema.required ?? [])
  return Object.entries(schema.properties ?? {}).map(([key, node]) =>
    buildFieldDescriptor(key, node, [key], requiredKeys.has(key)),
  )
}
