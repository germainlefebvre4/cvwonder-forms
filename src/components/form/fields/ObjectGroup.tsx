import { useTranslation } from 'react-i18next'
import type { ObjectFieldDescriptor, Path } from '../../../schema/types'
import { fieldLabelKey } from '../../../i18n'
import { FieldNode } from '../FieldNode'

interface ObjectGroupProps {
  descriptor: ObjectFieldDescriptor
  path: Path
  hideLabel?: boolean
}

export function ObjectGroup({ descriptor, path, hideLabel }: ObjectGroupProps) {
  const { t } = useTranslation()
  return (
    <fieldset className="flex flex-col gap-4">
      {!hideLabel && (
        <legend className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
          {t(fieldLabelKey(descriptor.schemaPath))}
        </legend>
      )}
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
        {descriptor.properties.map((property) => (
          <div
            key={property.key}
            className={property.kind === 'object' || property.kind === 'array' ? 'sm:col-span-2' : ''}
          >
            <FieldNode descriptor={property} path={[...path, property.key]} />
          </div>
        ))}
      </div>
    </fieldset>
  )
}
