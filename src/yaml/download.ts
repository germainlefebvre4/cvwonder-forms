/** Triggers a client-side download of `content` as a file - no server round-trip. */
export function downloadTextFile(filename: string, content: string, mimeType = 'text/yaml;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
