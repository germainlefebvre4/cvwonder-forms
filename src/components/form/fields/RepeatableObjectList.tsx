import { useTranslation } from 'react-i18next'
import type { ArrayFieldDescriptor, Path } from '../../../schema/types'
import type { ValidationIssue } from '../../../schema/validator'
import { buildDefaultValue } from '../../../schema/pathUtils'
import { fieldElementId } from '../../../schema/sectionStatus'
import { fieldLabelKey } from '../../../i18n'
import { useCvDocumentStore, useCvFieldValue } from '../../../store/cvDocument'
import { FieldNode } from '../FieldNode'
import { FieldErrorList } from './FieldErrorList'
import { addButtonClass, iconButtonClass } from './inputStyles'

interface RepeatableObjectListProps {
  descriptor: ArrayFieldDescriptor
  path: Path
  errors?: ValidationIssue[]
}

export function RepeatableObjectList({ descriptor, path, errors }: RepeatableObjectListProps) {
  const { t } = useTranslation()
  const value = useCvFieldValue(path)
  const items = Array.isArray(value) ? value : []
  const addItem = useCvDocumentStore((state) => state.addItem)
  const removeItem = useCvDocumentStore((state) => state.removeItem)
  const moveItem = useCvDocumentStore((state) => state.moveItem)
  const labelKey = fieldLabelKey(descriptor.schemaPath)

  return (
    <fieldset
      id={fieldElementId(path)}
      tabIndex={-1}
      className="flex flex-col gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
    >
      <legend className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {t(labelKey)}
        {descriptor.required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      {items.map((_, index) => (
        <div key={index} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {t(labelKey)} #{index + 1}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                className={iconButtonClass}
                disabled={index === 0}
                onClick={() => moveItem(path, index, index - 1)}
                aria-label={t('actions.moveUp')}
              >
                ↑
              </button>
              <button
                type="button"
                className={iconButtonClass}
                disabled={index === items.length - 1}
                onClick={() => moveItem(path, index, index + 1)}
                aria-label={t('actions.moveDown')}
              >
                ↓
              </button>
              <button type="button" className={iconButtonClass} onClick={() => removeItem(path, index)}>
                {t('actions.remove')}
              </button>
            </div>
          </div>
          <FieldNode descriptor={descriptor.items} path={[...path, index]} hideLabel />
        </div>
      ))}
      <FieldErrorList errors={errors} />
      <button type="button" className={addButtonClass} onClick={() => addItem(path, buildDefaultValue(descriptor.items))}>
        + {t('actions.add')}
      </button>
    </fieldset>
  )
}
