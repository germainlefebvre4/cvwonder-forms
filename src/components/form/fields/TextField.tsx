import { useId } from 'react'
import type { Path, StringFieldDescriptor } from '../../../schema/types'
import type { ValidationIssue } from '../../../schema/validator'
import { fieldLabelKey } from '../../../i18n'
import { useCvDocumentStore, useCvFieldValue } from '../../../store/cvDocument'
import { FieldWrapper } from './FieldWrapper'
import { textInputClass } from './inputStyles'

interface TextFieldProps {
  descriptor: StringFieldDescriptor
  path: Path
  errors?: ValidationIssue[]
}

export function TextField({ descriptor, path, errors }: TextFieldProps) {
  const id = useId()
  const value = useCvFieldValue(path)
  const setValue = useCvDocumentStore((state) => state.setValue)
  const inputType = descriptor.format === 'email' ? 'email' : descriptor.format === 'uri' ? 'url' : 'text'

  return (
    <FieldWrapper
      labelKey={fieldLabelKey(descriptor.schemaPath)}
      required={descriptor.required}
      errors={errors}
      htmlFor={id}
    >
      <input
        id={id}
        type={inputType}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => setValue(path, event.target.value)}
        className={textInputClass}
      />
    </FieldWrapper>
  )
}
