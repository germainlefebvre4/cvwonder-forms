import { useRef, useState } from 'react'
import { Popover } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { useErrorSummaryEntries, type ErrorSummaryEntry } from '../../store/errorSummary'

/** Global, always-visible error counter with an on-demand list of every current error's origin and reason. */
export function ErrorSummary() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const entries = useErrorSummaryEntries()
  const isValid = entries.length === 0
  // Set right before an entry activation closes the popover, so `onCloseAutoFocus` knows to leave
  // focus on the field we just moved it to instead of Radix's default of returning it to the trigger.
  const skipCloseAutoFocusRef = useRef(false)

  function activate(entry: ErrorSummaryEntry) {
    const field = document.getElementById(entry.fieldElementId)
    skipCloseAutoFocusRef.current = true
    field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    field?.focus()
    setOpen(false)
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        disabled={isValid}
        aria-label={isValid ? t('errorSummary.valid') : t('errorSummary.toggleLabel', { count: entries.length })}
        className={
          isValid
            ? 'flex items-center gap-2 rounded-full border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-600 shadow-sm outline-none disabled:cursor-default dark:border-emerald-800 dark:bg-neutral-900 dark:text-emerald-400'
            : 'flex items-center gap-2 rounded-full border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm outline-none disabled:cursor-default disabled:opacity-40 focus:ring-2 focus:ring-brand-400 enabled:hover:bg-red-50 dark:border-red-800 dark:bg-neutral-900 dark:text-red-400 dark:enabled:hover:bg-red-950'
        }
      >
        {isValid ? (
          <span
            aria-hidden="true"
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-semibold text-white"
          >
            ✓
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white"
          >
            {entries.length}
          </span>
        )}
        <span className="hidden lg:inline">
          {isValid ? t('errorSummary.valid') : t('errorSummary.toggleLabel', { count: entries.length })}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          onCloseAutoFocus={(event) => {
            if (!skipCloseAutoFocusRef.current) return
            event.preventDefault()
            skipCloseAutoFocusRef.current = false
          }}
          className="z-50 max-h-80 w-72 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1.5 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          <ul className="flex flex-col gap-0.5">
            {entries.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => activate(entry)}
                  className="block w-full rounded-md px-2 py-1.5 text-left text-sm outline-none hover:bg-neutral-100 focus:bg-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                >
                  <span className="block font-medium text-neutral-800 dark:text-neutral-200">{entry.label}</span>
                  <span className="block text-xs text-red-500">{entry.reason}</span>
                </button>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
