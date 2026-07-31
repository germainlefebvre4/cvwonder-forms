import { useTranslation } from 'react-i18next'
import type { ValidationIssue } from '../../../schema/validator'
import { validationMessage } from '../../../i18n'

export function FieldErrorList({ errors }: { errors?: ValidationIssue[] }) {
  const { t } = useTranslation()
  if (!errors?.length) return null
  return (
    <>
      {errors.map((issue, index) => {
        const { key, params } = validationMessage(issue)
        return (
          <p key={`${issue.keyword}-${index}`} className="text-xs text-red-500">
            {t(key, params)}
          </p>
        )
      })}
    </>
  )
}
