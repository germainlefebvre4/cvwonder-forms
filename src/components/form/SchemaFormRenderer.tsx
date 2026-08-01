import { documentSections } from '../../schema'
import { sectionElementId } from '../../schema/sectionStatus'
import { FieldNode } from './FieldNode'

/** Renders one card per top-level CV Wonder schema section, in schema-authored order. */
export function SchemaFormRenderer() {
  return (
    <div className="flex flex-col gap-6">
      {documentSections.map((section) => (
        <section
          key={section.key}
          id={sectionElementId(section.key)}
          className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <FieldNode descriptor={section} path={[section.key]} />
        </section>
      ))}
    </div>
  )
}
