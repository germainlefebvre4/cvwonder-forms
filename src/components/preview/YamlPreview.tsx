import { useMemo } from 'react'
import { useCvDocumentStore } from '../../store/cvDocument'
import { serializeToYaml } from '../../yaml/serialize'
import { highlightYamlLine } from './yamlHighlight'

export function YamlPreview() {
  const cvDocument = useCvDocumentStore((state) => state.document)
  const yamlText = useMemo(() => serializeToYaml(cvDocument), [cvDocument])
  const lines = yamlText.length > 0 ? yamlText.split('\n') : []

  return (
    <pre className="h-full overflow-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950">
      <code className="font-mono">
        {lines.map((line, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} dangerouslySetInnerHTML={{ __html: highlightYamlLine(line) || '&nbsp;' }} />
        ))}
      </code>
    </pre>
  )
}
