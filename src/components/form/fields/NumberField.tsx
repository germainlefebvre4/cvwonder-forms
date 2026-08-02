import type { IntegerFieldDescriptor, Path } from '../../../schema/types'
import type { ValidationIssue } from '../../../schema/validator'
import { fieldLabelKey } from '../../../i18n'
import { fieldElementId } from '../../../schema/sectionStatus'
import { useCvDocumentStore, useCvFieldValue } from '../../../store/cvDocument'
import { FieldWrapper } from './FieldWrapper'
import { textInputClass } from './inputStyles'

interface NumberFieldProps {
  descriptor: IntegerFieldDescriptor
  path: Path
  errors?: ValidationIssue[]
}

export function NumberField({ descriptor, path, errors }: NumberFieldProps) {
  const id = fieldElementId(path)
  const value = useCvFieldValue(path)
  const setValue = useCvDocumentStore((state) => state.setValue)
  const unsetValue = useCvDocumentStore((state) => state.unsetValue)

  return (
    <FieldWrapper
      labelKey={fieldLabelKey(descriptor.schemaPath)}
      required={descriptor.required}
      errors={errors}
      htmlFor={id}
    >
      <input
        id={id}
        type="number"
        min={descriptor.minimum}
        max={descriptor.maximum}
        value={typeof value === 'number' ? value : ''}
        onChange={(event) => {
          if (event.target.value === '') {
            unsetValue(path)
          } else {
            setValue(path, Number(event.target.value))
          }
        }}
        className={textInputClass}
      />
    </FieldWrapper>
  )
}
