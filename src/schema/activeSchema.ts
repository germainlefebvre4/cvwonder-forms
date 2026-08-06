import activeVersion from '../../schemas/active-version.json'
import type { SchemaNode } from './walker'

const vendoredSchemas = import.meta.glob('../../schemas/cvwonder.*.json', {
  eager: true,
  import: 'default',
}) as Record<string, SchemaNode>

const activeSchemaPath = `../../schemas/cvwonder.${activeVersion.version}.json`
const activeSchema = vendoredSchemas[activeSchemaPath]

if (!activeSchema) {
  throw new Error(`Active schema version "${activeVersion.version}" has no matching file in schemas/`)
}

export { activeSchema }
