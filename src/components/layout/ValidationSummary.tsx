import { useTranslation } from 'react-i18next'
import { useCvValidation } from '../../store/validation'

export function ValidationSummary() {
  const { t } = useTranslation()
  const { errorCount } = useCvValidation()

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium text-neutral-700 dark:text-neutral-300">{t('validation.summaryTitle')}:</span>
      {errorCount === 0 ? (
        <span className="text-emerald-600 dark:text-emerald-400">{t('validation.noErrors')}</span>
      ) : (
        <span className="text-red-500">{t('validation.errorCount', { count: errorCount })}</span>
      )}
    </div>
  )
}
