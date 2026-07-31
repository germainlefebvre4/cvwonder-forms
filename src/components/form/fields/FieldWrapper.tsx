import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ValidationIssue } from '../../../schema/validator'
import { FieldErrorList } from './FieldErrorList'

interface FieldWrapperProps {
  labelKey: string
  required?: boolean
  errors?: ValidationIssue[]
  htmlFor?: string
  children: ReactNode
}

export function FieldWrapper({ labelKey, required, errors, htmlFor, children }: FieldWrapperProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t(labelKey)}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      <FieldErrorList errors={errors} />
    </div>
  )
}
