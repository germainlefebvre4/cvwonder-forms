import { useEffect } from 'react'
import { useYamlHighlightStore } from '../../store/yamlHighlight'

/** Resolves the schema path of the most specific field under `target`, or `null` if the
 * nearest relevant ancestor is a plain control (`button`/`a`) rather than a field - e.g. an
 * array's add/remove/move/drag-handle button, which is a DOM descendant of that array's own
 * `data-field-path` fieldset but shouldn't select the array. */
export function resolveFieldPath(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null
  const match = target.closest('[data-field-path], button, a')
  return match?.hasAttribute('data-field-path') ? match.getAttribute('data-field-path') : null
}

/**
 * Delegated hover/click tracking for the YAML highlight, registered once instead of per-field
 * listeners. Native `mouseenter`/`mouseleave` don't bubble, so returning from a nested field to
 * the unoccupied area of its own already-entered enclosing container fires no new event to
 * restore the container's highlight. Resolving fresh from the DOM on every `mouseover`/`click`
 * (which do bubble) avoids that: there's no "leave" case to get wrong, and an outside click
 * (the YAML pane, a button, empty page area) resolves to `null` and clears the selection for
 * free, with no separate "is this outside a field" check.
 */
export function useFieldHighlightTracking(): void {
  const setHovered = useYamlHighlightStore((state) => state.setHovered)
  const setSelected = useYamlHighlightStore((state) => state.setSelected)

  useEffect(() => {
    function handleMouseOver(event: MouseEvent) {
      setHovered(resolveFieldPath(event.target))
    }
    function handleMouseOut(event: MouseEvent) {
      if (event.relatedTarget === null) setHovered(null)
    }
    function handleClick(event: MouseEvent) {
      setSelected(resolveFieldPath(event.target))
    }

    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      document.removeEventListener('click', handleClick)
    }
  }, [setHovered, setSelected])
}
