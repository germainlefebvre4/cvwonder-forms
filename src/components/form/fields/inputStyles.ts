const textInputBaseClass =
  'rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-base lg:text-sm text-neutral-900 shadow-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100'

const textInputErrorClass =
  'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.45)] focus:border-red-500 focus:ring-1 focus:ring-red-500 dark:border-red-400 dark:shadow-[0_0_10px_rgba(248,113,113,0.3)] dark:focus:border-red-400 dark:focus:ring-red-400'

export function textInputClass(hasError: boolean): string {
  return hasError ? `${textInputBaseClass} ${textInputErrorClass}` : textInputBaseClass
}

export const iconButtonClass =
  'rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800'

export const addButtonClass =
  'self-start rounded-md border border-brand-300 px-3 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-950'

export const railClass = 'flex flex-col items-center gap-1 pt-0.5'

export const dragHandleClass =
  'hidden lg:flex cursor-grab touch-none items-center justify-center rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 active:cursor-grabbing dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'

export const dragOverIndicatorClass = 'border-t-2 border-brand-500 dark:border-brand-400'
