import { Select } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { useUiPrefsStore, type Language } from '../../store/uiPrefs'

const itemClass =
  'cursor-pointer rounded px-2 py-1 text-sm outline-none data-[highlighted]:bg-brand-100 dark:data-[highlighted]:bg-brand-950'

export function LanguageSwitch() {
  const { t } = useTranslation()
  const language = useUiPrefsStore((state) => state.language)
  const setLanguage = useUiPrefsStore((state) => state.setLanguage)

  return (
    <Select.Root value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <Select.Trigger
        aria-label={t('language.toggleLabel')}
        className="flex items-center gap-1 rounded-md border border-neutral-300 px-2 py-1 text-sm outline-none dark:border-neutral-700"
      >
        <Select.Value />
        <Select.Icon>▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-900">
          <Select.Viewport className="p-1">
            <Select.Item value="fr" className={itemClass}>
              <Select.ItemText>{t('language.fr')}</Select.ItemText>
            </Select.Item>
            <Select.Item value="en" className={itemClass}>
              <Select.ItemText>{t('language.en')}</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
