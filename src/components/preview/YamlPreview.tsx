import { useEffect, useMemo, useRef } from 'react'
import { useCvDocumentStore } from '../../store/cvDocument'
import { useYamlHighlightStore } from '../../store/yamlHighlight'
import { serializeToYamlWithRanges } from '../../yaml/serialize'
import { highlightYamlLine } from './yamlHighlight'

export function YamlPreview() {
  const cvDocument = useCvDocumentStore((state) => state.document)
  const hoveredPath = useYamlHighlightStore((state) => state.hoveredPath)
  const selectedPath = useYamlHighlightStore((state) => state.selectedPath)
  const { yamlText, ranges } = useMemo(() => serializeToYamlWithRanges(cvDocument), [cvDocument])
  const lines = yamlText.length > 0 ? yamlText.split('\n') : []

  const activePath = hoveredPath ?? selectedPath
  const activeRange = activePath ? ranges.get(activePath) : undefined

  const lineElements = useRef<(HTMLDivElement | null)[]>([])

  // Scrolling is tied to `selectedPath` (click) only - hovering never moves the preview's scroll.
  useEffect(() => {
    if (!selectedPath) return
    const range = ranges.get(selectedPath)
    if (!range) return
    lineElements.current[range.startLine - 1]?.scrollIntoView({ block: 'nearest' })
  }, [selectedPath, ranges])

  return (
    <pre className="h-full overflow-y-auto overflow-x-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm whitespace-pre-wrap dark:border-neutral-800 dark:bg-neutral-950">
      <code className="font-mono break-words [overflow-wrap:anywhere]">
        {lines.map((line, index) => {
          const lineNumber = index + 1
          const isHighlighted = Boolean(
            activeRange && lineNumber >= activeRange.startLine && lineNumber <= activeRange.endLine,
          )
          return (
            <div
              key={index}
              ref={(element) => {
                lineElements.current[index] = element
              }}
              className={isHighlighted ? 'bg-brand-100 dark:bg-brand-900/40' : undefined}
              dangerouslySetInnerHTML={{ __html: highlightYamlLine(line) || '&nbsp;' }}
            />
          )
        })}
      </code>
    </pre>
  )
}
