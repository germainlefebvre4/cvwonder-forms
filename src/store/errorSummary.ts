import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { documentSections } from '../schema'
import { validationMessage } from '../i18n'
import { collectErrorPaths, errorOriginLabel, instancePathToPath } from '../schema/errorSummary'
import { fieldElementId, getSectionContentStatus, resolveSectionStatus, sectionHasError } from '../schema/sectionStatus'
import { useCvDocumentStore } from './cvDocument'
import { useCvValidation } from './validation'

export interface ErrorSummaryEntry {
  id: string
  label: string
  reason: string
  fieldElementId: string
}

/**
 * Every currently counted validation error, in form order, for the global error summary. Reuses
 * `resolveSectionStatus` (the same helper the section nav uses) so a section's errors only ever
 * appear here once they'd also show as an error dot in the nav - no second suppression rule.
 */
export function useErrorSummaryEntries(): ErrorSummaryEntry[] {
  const { t } = useTranslation()
  const document = useCvDocumentStore((state) => state.document)
  const touchedSections = useCvDocumentStore((state) => state.touchedSections)
  const { errorsByPath } = useCvValidation()

  return useMemo(() => {
    const entries: ErrorSummaryEntry[] = []
    for (const section of documentSections) {
      const contentStatus = getSectionContentStatus(document, section.key)
      const hasError = sectionHasError(errorsByPath, section.key)
      const status = resolveSectionStatus(contentStatus, hasError, touchedSections.has(section.key))
      if (status !== 'error') continue

      for (const path of collectErrorPaths(section, [section.key], document, errorsByPath)) {
        for (const issue of errorsByPath[path]) {
          const { key, params } = validationMessage(issue)
          entries.push({
            id: `${path}#${entries.length}`,
            label: errorOriginLabel(t, path),
            reason: t(key, params),
            fieldElementId: fieldElementId(instancePathToPath(path)),
          })
        }
      }
    }
    return entries
  }, [document, touchedSections, errorsByPath, t])
}
