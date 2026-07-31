const KEY_LINE = /^(\s*)((?:- )?)([A-Za-z0-9_]+)(:)(.*)$/

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Lightweight line-based YAML highlighter (keys, list dashes, comments) for the
 * generated preview, avoiding a full syntax-highlighting dependency for output
 * that is always plain scalars/lists/mappings (no anchors, tags, or flow style).
 */
export function highlightYamlLine(line: string): string {
  if (/^\s*#/.test(line)) {
    return `<span class="text-neutral-400 italic dark:text-neutral-500">${escapeHtml(line)}</span>`
  }

  const match = line.match(KEY_LINE)
  if (!match) return escapeHtml(line)

  const [, indent, dash, key, colon, rest] = match
  const dashHtml = dash ? '<span class="text-neutral-400 dark:text-neutral-500">- </span>' : ''
  return (
    escapeHtml(indent) +
    dashHtml +
    `<span class="text-violet-700 dark:text-violet-400">${escapeHtml(key)}</span>` +
    `<span class="text-neutral-400 dark:text-neutral-500">${colon}</span>` +
    `<span class="text-emerald-700 dark:text-emerald-400">${escapeHtml(rest)}</span>`
  )
}
