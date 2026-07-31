import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCvDocumentStore } from '../../store/cvDocument'
import { parseYaml } from '../../yaml/parse'
import { addButtonClass } from '../form/fields/inputStyles'

export function ImportButton() {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const replaceDocument = useCvDocumentStore((state) => state.replaceDocument)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    try {
      const text = await file.text()
      const document = parseYaml(text)
      replaceDocument(document)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button type="button" className={addButtonClass} onClick={() => inputRef.current?.click()}>
        {t('actions.import')}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".yaml,.yml,text/yaml"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void handleFile(file)
          event.target.value = ''
        }}
      />
      {error && (
        <p className="max-w-64 text-xs text-red-500">{t('validation.importParseError', { message: error })}</p>
      )}
    </div>
  )
}
