export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }
export type JsonObject = { [key: string]: JsonValue }

/** A concrete path into a CVDocument (property keys and array indices). */
export type Path = (string | number)[]

interface BaseFieldDescriptor {
  /** Property key at this level (empty for the root and for array items). */
  key: string
  /** Schema-level path (property keys only, no array indices) - used as the i18n lookup key. */
  schemaPath: string[]
  required: boolean
  description?: string
}

export interface StringFieldDescriptor extends BaseFieldDescriptor {
  kind: 'string'
  format?: 'email' | 'uri'
  minLength?: number
  /** True for the CV Wonder `anyOf: [{maxLength: 0}, {format}]` optional-but-validated pattern. */
  optionalFormat?: boolean
}

export interface IntegerFieldDescriptor extends BaseFieldDescriptor {
  kind: 'integer'
  minimum?: number
  maximum?: number
}

export interface ObjectFieldDescriptor extends BaseFieldDescriptor {
  kind: 'object'
  properties: FieldDescriptor[]
}

export interface ArrayFieldDescriptor extends BaseFieldDescriptor {
  kind: 'array'
  items: FieldDescriptor
  minItems?: number
}

export type FieldDescriptor =
  | StringFieldDescriptor
  | IntegerFieldDescriptor
  | ObjectFieldDescriptor
  | ArrayFieldDescriptor
