import cvSchema from '../../schemas/cvwonder.v0.10.1.json'
import { buildDocumentSections } from './walker'

export const documentSections = buildDocumentSections(cvSchema)

export * from './types'
export * from './pathUtils'
export * from './validator'
export { cvSchema }
