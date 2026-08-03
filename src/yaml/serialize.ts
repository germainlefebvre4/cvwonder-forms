import { isMap, isNode, isScalar, isSeq, parseDocument, stringify } from 'yaml'
import { isEmptyValue } from '../schema/pathUtils'
import type { JsonValue, Path } from '../schema/types'

/** Recursively drops empty strings, empty arrays/objects, null and undefined. */
function pruneEmpty(value: JsonValue): JsonValue | undefined {
  if (value == null || isEmptyValue(value)) return undefined
  if (Array.isArray(value)) {
    const items = value.map(pruneEmpty).filter((item): item is JsonValue => item !== undefined)
    return items.length > 0 ? items : undefined
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, child]) => [key, pruneEmpty(child)] as const)
      .filter((entry): entry is [string, JsonValue] => entry[1] !== undefined)
    return entries.length > 0 ? Object.fromEntries(entries) : undefined
  }
  return value
}

/** Serializes the CV document to YAML, omitting fields the user has not filled in. */
export function serializeToYaml(document: JsonValue): string {
  const pruned = pruneEmpty(document)
  return pruned === undefined ? '' : stringify(pruned)
}

export interface YamlLineRange {
  startLine: number
  endLine: number
}

/** Starting character offset of each line (0-based), used to convert an AST node's
 * character-offset range into 1-based line numbers. */
function buildLineStarts(text: string): number[] {
  const starts = [0]
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === '\n') starts.push(index + 1)
  }
  return starts
}

/** 1-based number of the line containing the given character offset. */
function lineAt(offset: number, lineStarts: number[]): number {
  let low = 0
  let high = lineStarts.length - 1
  while (low < high) {
    const mid = Math.ceil((low + high) / 2)
    if (lineStarts[mid] <= offset) low = mid
    else high = mid - 1
  }
  return low + 1
}

function recordRange(
  path: Path,
  range: readonly [number, number, number],
  lineStarts: number[],
  ranges: Map<string, YamlLineRange>,
): void {
  const [start, , end] = range
  ranges.set(path.join('.'), {
    startLine: lineAt(start, lineStarts),
    endLine: lineAt(Math.max(start, end - 1), lineStarts),
  })
}

/**
 * Walks the pruned document and the `yaml` AST of its serialized text together, recording
 * each node's line range keyed by the same dot-path convention as `errorsByPath`. Assumes the
 * same restricted shape `pruneEmpty` does (objects, arrays, scalars only - no anchors, tags,
 * or flow style), since a repeated key name (e.g. `company` across `career` entries) can only
 * be told apart by walking the tree in lockstep with the AST, not by scanning text.
 */
function walkRanges(
  value: JsonValue,
  node: unknown,
  path: Path,
  lineStarts: number[],
  ranges: Map<string, YamlLineRange>,
): void {
  if (Array.isArray(value)) {
    if (!isSeq(node)) return
    value.forEach((item, index) => {
      const itemNode = node.items[index]
      if (!isNode(itemNode) || !itemNode.range) return
      const childPath = [...path, index]
      recordRange(childPath, itemNode.range, lineStarts, ranges)
      walkRanges(item, itemNode, childPath, lineStarts, ranges)
    })
    return
  }
  if (value != null && typeof value === 'object') {
    if (!isMap(node)) return
    for (const [key, child] of Object.entries(value)) {
      const pair = node.items.find((candidate) => isScalar(candidate.key) && candidate.key.value === key)
      if (!pair || !isScalar(pair.key) || !pair.key.range) continue
      const valueNode = isNode(pair.value) ? pair.value : null
      const end = valueNode?.range?.[2] ?? pair.key.range[2]
      const childPath = [...path, key]
      recordRange(childPath, [pair.key.range[0], end, end], lineStarts, ranges)
      walkRanges(child, valueNode, childPath, lineStarts, ranges)
    }
  }
}

/** Same output as `serializeToYaml`, plus a path -> line-range map for highlighting the YAML
 * text that corresponds to a hovered/clicked form field. */
export function serializeToYamlWithRanges(document: JsonValue): {
  yamlText: string
  ranges: Map<string, YamlLineRange>
} {
  const pruned = pruneEmpty(document)
  const yamlText = pruned === undefined ? '' : stringify(pruned)
  const ranges = new Map<string, YamlLineRange>()
  if (pruned !== undefined) {
    walkRanges(pruned, parseDocument(yamlText).contents, [], buildLineStarts(yamlText), ranges)
  }
  return { yamlText, ranges }
}
