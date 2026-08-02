import { useTranslation } from 'react-i18next'
import type { ArrayFieldDescriptor, Path } from '../../../schema/types'
import type { ValidationIssue } from '../../../schema/validator'
import { fieldLabelKey } from '../../../i18n'
import { fieldElementId } from '../../../schema/sectionStatus'
import { useCvDocumentStore, useCvFieldValue } from '../../../store/cvDocument'
import { FieldErrorList } from './FieldErrorList'
import { addButtonClass, iconButtonClass, textInputClass } from './inputStyles'

interface PrimitiveArrayFieldProps {
  descriptor: ArrayFieldDescriptor
  path: Path
  errors?: ValidationIssue[]
}

export function PrimitiveArrayField({ descriptor, path, errors }: PrimitiveArrayFieldProps) {
  const { t } = useTranslation()
  const value = useCvFieldValue(path)
  const items = Array.isArray(value) ? value : []
  const setValue = useCvDocumentStore((state) => state.setValue)
  const addItem = useCvDocumentStore((state) => state.addItem)
  const removeItem = useCvDocumentStore((state) => state.removeItem)
  const moveItem = useCvDocumentStore((state) => state.moveItem)
  const labelKey = fieldLabelKey(descriptor.schemaPath)

  return (
    <fieldset
      id={fieldElementId(path)}
      tabIndex={-1}
      className="flex flex-col gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-400"
    >
      <legend className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t(labelKey)}
        {descriptor.required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <textarea
            rows={2}
            value={typeof item === 'string' ? item : ''}
            onChange={(event) => setValue([...path, index], event.target.value)}
            className={`${textInputClass} flex-1`}
          />
          <div className="flex flex-col gap-1">
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
      ))}
      <FieldErrorList errors={errors} />
      <button type="button" className={addButtonClass} onClick={() => addItem(path, '')}>
        + {t('actions.add')}
      </button>
    </fieldset>
  )
}
