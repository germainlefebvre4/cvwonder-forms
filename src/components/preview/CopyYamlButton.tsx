import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCvDocumentStore } from '../../store/cvDocument'
import { serializeToYaml } from '../../yaml/serialize'
import { iconButtonClass } from '../form/fields/inputStyles'

const CONFIRMATION_DURATION_MS = 1500

export function CopyYamlButton() {
  const { t } = useTranslation()
  const cvDocument = useCvDocumentStore((state) => state.document)
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  const handleClick = () => {
    navigator.clipboard
      .writeText(serializeToYaml(cvDocument))
      .then(() => {
        setCopied(true)
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setCopied(false), CONFIRMATION_DURATION_MS)
      })
      .catch(() => {
        // Clipboard access denied or unavailable - no confirmation to show.
      })
  }

  return (
    <button type="button" className={iconButtonClass} onClick={handleClick}>
      {copied ? t('actions.copied') : t('actions.copy')}
    </button>
  )
}
