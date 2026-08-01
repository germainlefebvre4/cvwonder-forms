import { isEmptyValue } from './pathUtils'
import type { JsonObject } from './types'

export type SectionContentStatus = 'empty' | 'filled'
export type SectionStatus = SectionContentStatus | 'error'

/** DOM id of a top-level section's <section> element, shared between the form and the section nav. */
export function sectionElementId(sectionKey: string): string {
  return `cv-section-${sectionKey}`
}

/** Whether a top-level section currently has any content, per the same rule the YAML serializer uses to decide what to emit. */
export function getSectionContentStatus(document: JsonObject, sectionKey: string): SectionContentStatus {
  return isEmptyValue(document[sectionKey]) ? 'empty' : 'filled'
}

/** Whether any validation error's path falls under this section (the section key itself, or a nested path). */
export function sectionHasError(errorsByPath: Record<string, unknown>, sectionKey: string): boolean {
  return Object.keys(errorsByPath).some((path) => path === sectionKey || path.startsWith(`${sectionKey}.`))
}

/**
 * Combines content and error state into the single status a nav item displays. An error on an
 * otherwise-empty, not-yet-touched section (a required section nobody has looked at yet) is
 * suppressed so a freshly loaded form doesn't show errors before the user has done anything.
 */
export function resolveSectionStatus(
  contentStatus: SectionContentStatus,
  hasError: boolean,
  touched: boolean,
): SectionStatus {
  if (hasError && (contentStatus !== 'empty' || touched)) return 'error'
  return contentStatus
}
