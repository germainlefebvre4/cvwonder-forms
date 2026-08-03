import type { Path } from '../../schema/types'

/** Marks a field's own root element with its schema path, resolved by the delegated
 * hover/click tracking in `useFieldHighlightTracking` rather than per-node listeners. */
export function useFieldHighlight(path: Path): { 'data-field-path': string } {
  return { 'data-field-path': path.join('.') }
}
