import { activeSchema as cvSchema, activeSchemaVersion } from './activeSchema'
import { buildDocumentSections } from './walker'

export const documentSections = buildDocumentSections(cvSchema)

export * from './types'
export * from './pathUtils'
export * from './validator'
export { cvSchema, activeSchemaVersion }
