import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useUiPrefsStore } from './store/uiPrefs'
import { SchemaFormRenderer } from './components/form/SchemaFormRenderer'
import { useFieldHighlightTracking } from './components/form/useFieldHighlightTracking'
import { YamlPreview } from './components/preview/YamlPreview'
import { CopyYamlButton } from './components/preview/CopyYamlButton'
import { ImportButton } from './components/io/ImportButton'
import { ExportButton } from './components/io/ExportButton'
import { ThemeToggle } from './components/layout/ThemeToggle'
import { LanguageSwitch } from './components/layout/LanguageSwitch'
import { SectionNav } from './components/layout/SectionNav'

function App() {
  const { t, i18n } = useTranslation()
  const theme = useUiPrefsStore((state) => state.theme)
  const language = useUiPrefsStore((state) => state.language)

  useFieldHighlightTracking()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    void i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-3 sm:px-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <h1 className="text-lg font-semibold">{t('app.title')}</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('app.tagline')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ImportButton />
          <ExportButton />
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </header>
      <main className="grid grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-[13rem_minmax(0,42rem)_minmax(20rem,1fr)] 2xl:grid-cols-[16rem_minmax(0,42rem)_minmax(20rem,1fr)]">
        <SectionNav />
        <SchemaFormRenderer />
        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">{t('nav.preview')}</h2>
            <CopyYamlButton />
          </div>
          <YamlPreview />
        </div>
      </main>
    </div>
  )
}

export default App
