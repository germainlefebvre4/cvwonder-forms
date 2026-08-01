import { Switch } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { useUiPrefsStore } from '../../store/uiPrefs'

export function ThemeToggle() {
  const { t } = useTranslation()
  const theme = useUiPrefsStore((state) => state.theme)
  const setTheme = useUiPrefsStore((state) => state.setTheme)
  const isDark = theme === 'dark'

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-neutral-600 dark:text-neutral-400">{t('theme.toggleLabel')}</span>
      <Switch.Root
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        className="relative h-5 w-9 rounded-full bg-neutral-300 outline-none data-[state=checked]:bg-brand-600 dark:bg-neutral-700 dark:data-[state=checked]:bg-brand-400"
      >
        <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-[18px]" />
      </Switch.Root>
      <span className="w-10 text-neutral-600 dark:text-neutral-400">{isDark ? t('theme.dark') : t('theme.light')}</span>
    </div>
  )
}
