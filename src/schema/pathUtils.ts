import type { FieldDescriptor, JsonObject, JsonValue, Path } from './types'

/** True for '', null, undefined, an empty array, or an object whose properties are all empty - the
 * same notion of "no content" the YAML serializer uses when it omits a value from the output. */
export function isEmptyValue(value: JsonValue | undefined): boolean {
  if (value === '' || value == null) return true
  if (Array.isArray(value)) return value.every(isEmptyValue)
  if (typeof value === 'object') return Object.values(value).every(isEmptyValue)
  return false
}

export function getAtPath(document: JsonValue, path: Path): JsonValue | undefined {
  let current: JsonValue | undefined = document
  for (const segment of path) {
    if (current == null || typeof current !== 'object') return undefined
    current = Array.isArray(current)
      ? current[segment as number]
      : (current as JsonObject)[segment as string]
  }
  return current
}

/** Immutably sets `value` at `path`, creating intermediate objects/arrays as needed. */
export function setAtPath(document: JsonValue, path: Path, value: JsonValue): JsonValue {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (typeof head === 'number') {
    const arr = Array.isArray(document) ? [...document] : []
    while (arr.length <= head) arr.push(rest.length === 0 ? value : ({} as JsonObject))
    arr[head] = setAtPath(arr[head] ?? (rest[0] !== undefined && typeof rest[0] === 'number' ? [] : {}), rest, value)
    return arr
  }
  const obj: JsonObject =
    document != null && typeof document === 'object' && !Array.isArray(document) ? { ...document } : {}
  obj[head] = setAtPath(obj[head] ?? (rest[0] !== undefined && typeof rest[0] === 'number' ? [] : {}), rest, value)
  return obj
}

/** Removes the array element at `path` (path must point at an array). */
export function removeAtPath(document: JsonValue, path: Path, index: number): JsonValue {
  const current = getAtPath(document, path)
  if (!Array.isArray(current)) return document
  const next = current.filter((_, i) => i !== index)
  return setAtPath(document, path, next)
}

/** Moves an array element at `path` from one index to another. */
export function moveAtPath(document: JsonValue, path: Path, fromIndex: number, toIndex: number): JsonValue {
  const current = getAtPath(document, path)
  if (!Array.isArray(current)) return document
  const next = [...current]
  const [item] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, item)
  return setAtPath(document, path, next)
}

/** Deletes the property at `path` from its parent object (used to "clear" an optional numeric field). */
export function unsetAtPath(document: JsonValue, path: Path): JsonValue {
  if (path.length === 0) return document
  const parentPath = path.slice(0, -1)
  const key = path[path.length - 1]
  const parent = getAtPath(document, parentPath)
  if (parent == null || typeof parent !== 'object' || Array.isArray(parent) || typeof key !== 'string') {
    return document
  }
  const rest = { ...(parent as JsonObject) }
  delete rest[key]
  return setAtPath(document, parentPath, rest)
}

/** Appends `value` to the array at `path`. */
export function appendAtPath(document: JsonValue, path: Path, value: JsonValue): JsonValue {
  const current = getAtPath(document, path)
  const next = Array.isArray(current) ? [...current, value] : [value]
  return setAtPath(document, path, next)
}

/**
 * Builds the value for a newly-added array item. Only pre-seeds *structure*
 * a required nested array with a minItems floor (so e.g. a new career entry
 * gets one empty mission, because `career[].missions` is required with
 * minItems: 1). Required scalar leaves (a required string or integer) are
 * deliberately left unset rather than defaulted to '' / minimum: the field
 * still renders fine against an absent key, and leaving it unset means the
 * YAML preview won't show a value the user never actually entered.
 */
export function buildDefaultValue(descriptor: FieldDescriptor): JsonValue {
  switch (descriptor.kind) {
    case 'string':
      return ''
    case 'integer':
      return descriptor.minimum ?? 0
    case 'array':
      return descriptor.required && (descriptor.minItems ?? 0) > 0 ? [buildDefaultValue(descriptor.items)] : []
    case 'object': {
      const obj: JsonObject = {}
      for (const prop of descriptor.properties) {
        if (!prop.required || prop.kind === 'string' || prop.kind === 'integer') continue
        const value = buildDefaultValue(prop)
        const isNonTrivial = Array.isArray(value) ? value.length > 0 : Object.keys(value as JsonObject).length > 0
        if (isNonTrivial) obj[prop.key] = value
      }
      return obj
    }
  }
}
