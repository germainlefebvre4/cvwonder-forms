import { describe, expect, it } from 'vitest'
import { serializeToYaml, serializeToYamlWithRanges } from './serialize'
import { parseYaml } from './parse'
import { validateDocument } from '../schema/validator'

describe('serializeToYaml', () => {
  it('omits empty/unset optional data', () => {
    const yaml = serializeToYaml({
      person: { name: 'Jane Doe', email: '' },
      certifications: [],
      career: [{ companyName: '', missions: [] }],
    })
    expect(yaml).toContain('name: Jane Doe')
    expect(yaml).not.toContain('email')
    expect(yaml).not.toContain('certifications')
    expect(yaml).not.toContain('career')
  })

  it('keeps meaningful zero values (e.g. a skill level of 0)', () => {
    const yaml = serializeToYaml({
      person: { name: 'Jane Doe' },
      technicalSkills: { domains: [{ name: 'Backend', competencies: [{ name: 'Go', level: 0 }] }] },
    })
    expect(yaml).toContain('level: 0')
  })
})

describe('serializeToYamlWithRanges', () => {
  const document = {
    person: { name: 'Jane Doe' },
    career: [
      { companyName: 'Acme', missions: [{ position: 'Dev', company: 'Acme' }] },
      { companyName: 'Globex', missions: [{ position: 'Lead', company: 'Globex' }] },
    ],
  }

  it('maps a top-level field to its line', () => {
    const { yamlText, ranges } = serializeToYamlWithRanges(document)
    const lines = yamlText.split('\n')
    const range = ranges.get('career')
    expect(range).toBeDefined()
    expect(lines[range!.startLine - 1]).toBe('career:')
  })

  it('maps a nested object field to its line', () => {
    const { yamlText, ranges } = serializeToYamlWithRanges(document)
    const lines = yamlText.split('\n')
    const range = ranges.get('person.name')
    expect(range).toBeDefined()
    expect(range!.startLine).toBe(range!.endLine)
    expect(lines[range!.startLine - 1]).toContain('name: Jane Doe')
  })

  it('resolves a repeated key name to the line for its own array item', () => {
    const { yamlText, ranges } = serializeToYamlWithRanges(document)
    const lines = yamlText.split('\n')
    const first = ranges.get('career.0.missions.0.company')
    const second = ranges.get('career.1.missions.0.company')
    expect(first).toBeDefined()
    expect(second).toBeDefined()
    expect(first!.startLine).not.toBe(second!.startLine)
    expect(lines[first!.startLine - 1]).toContain('company: Acme')
    expect(lines[second!.startLine - 1]).toContain('company: Globex')
  })

  it('omits a path with no rendered output', () => {
    const { ranges } = serializeToYamlWithRanges({ person: { name: 'Jane Doe', email: '' } })
    expect(ranges.has('person.email')).toBe(false)
  })
})

describe('parseYaml', () => {
  it('round-trips a document through serialize and parse', () => {
    const original = {
      person: { name: 'Jane Doe', email: 'jane@example.com' },
      career: [{ companyName: 'Acme', missions: [{ position: 'Dev', company: 'Acme' }] }],
    }
    const parsed = parseYaml(serializeToYaml(original))
    expect(parsed).toEqual(original)
    expect(validateDocument(parsed).valid).toBe(true)
  })

  it('throws on malformed YAML rather than silently returning something wrong', () => {
    expect(() => parseYaml('person:\n  name: [unterminated')).toThrow()
  })

  it('throws when the document root is not a mapping', () => {
    expect(() => parseYaml('- just\n- a\n- list')).toThrow()
  })
})
