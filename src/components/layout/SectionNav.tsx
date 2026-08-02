import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { documentSections } from '../../schema'
import { fieldLabelKey } from '../../i18n'
import {
  getSectionContentStatus,
  resolveSectionStatus,
  sectionElementId,
  sectionHasError,
  type SectionStatus,
} from '../../schema/sectionStatus'
import { useCvDocumentStore } from '../../store/cvDocument'
import { useCvValidation } from '../../store/validation'
import { ErrorSummary } from './ErrorSummary'

const statusDotClass: Record<SectionStatus, string> = {
  empty: 'bg-neutral-300 dark:bg-neutral-600',
  filled: 'bg-brand-500 dark:bg-brand-400',
  error: 'bg-red-500',
}

const itemBaseClass =
  'flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm whitespace-nowrap outline-none lg:w-full lg:shrink lg:justify-start lg:rounded-md lg:whitespace-normal'
const itemInactiveClass =
  'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
const itemActiveClass = 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300'

/** Section list/pill-bar navigation: scroll-spy highlight + per-section content/error status. */
export function SectionNav() {
  const { t } = useTranslation()
  const document_ = useCvDocumentStore((state) => state.document)
  const touchedSections = useCvDocumentStore((state) => state.touchedSections)
  const { errorsByPath } = useCvValidation()
  const [activeKey, setActiveKey] = useState<string>(documentSections[0]?.key ?? '')
  const isProgrammaticScroll = useRef(false)
  const clearScrollEndListener = useRef<() => void>(() => {})

  useEffect(() => {
    const elements = documentSections
      .map((section) => document.getElementById(sectionElementId(section.key)))
      .filter((el): el is HTMLElement => el !== null)
    const lastSectionKey = documentSections[documentSections.length - 1]?.key
    if (elements.length === 0 || !lastSectionKey) return

    // How far below the viewport top a section's heading must scroll before it's
    // considered "current" - the standard scrollspy technique of picking the last
    // section whose top has crossed a fixed line, rather than the ambiguous "which
    // sections currently overlap a band" (which can match several short sections
    // at once and pick the wrong one at either end of the page).
    const TRIGGER_OFFSET = 120

    function updateActive() {
      const scrollEl = document.scrollingElement ?? document.documentElement
      // Scrolled to the bottom always means "looking at the last section", even if that
      // section is too short to ever cross the trigger line itself (e.g. an empty form
      // where every remaining section fits on one screen).
      if (scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 2) {
        setActiveKey(lastSectionKey)
        return
      }
      let current = documentSections[0].key
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].getBoundingClientRect().top <= TRIGGER_OFFSET) current = documentSections[i].key
      }
      setActiveKey(current)
    }

    let pendingFrame = 0
    function onScroll() {
      if (pendingFrame) return
      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = 0
        // While a click-triggered scroll animation is in flight, the clicked section stays
        // highlighted instead of being overridden by the live (pre-settled) scroll position.
        if (isProgrammaticScroll.current) return
        updateActive()
      })
    }

    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (pendingFrame) cancelAnimationFrame(pendingFrame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      clearScrollEndListener.current()
    }
  }, [])

  function scrollToSection(sectionKey: string) {
    setActiveKey(sectionKey)
    isProgrammaticScroll.current = true
    clearScrollEndListener.current()
    function onScrollEnd() {
      isProgrammaticScroll.current = false
      window.removeEventListener('scrollend', onScrollEnd)
    }
    window.addEventListener('scrollend', onScrollEnd)
    clearScrollEndListener.current = () => window.removeEventListener('scrollend', onScrollEnd)
    document.getElementById(sectionElementId(sectionKey))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav aria-label={t('nav.sections')} className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-52 lg:shrink-0">
      <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 lg:static lg:right-auto lg:bottom-auto lg:z-auto lg:mb-3">
        <ErrorSummary />
      </div>
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:h-full lg:flex-col lg:gap-1 lg:overflow-y-auto lg:overflow-x-visible lg:pb-0">
        {documentSections.map((section) => {
          const contentStatus = getSectionContentStatus(document_, section.key)
          const hasError = sectionHasError(errorsByPath, section.key)
          const status = resolveSectionStatus(contentStatus, hasError, touchedSections.has(section.key))
          const isActive = activeKey === section.key

          return (
            <li key={section.key}>
              <button
                type="button"
                aria-current={isActive ? 'true' : undefined}
                onClick={() => scrollToSection(section.key)}
                className={`${itemBaseClass} ${isActive ? itemActiveClass : itemInactiveClass}`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${statusDotClass[status]}`} aria-hidden="true" />
                <span>{t(fieldLabelKey(section.schemaPath))}</span>
                <span className="sr-only">{t(`nav.sectionStatus.${status}`)}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
