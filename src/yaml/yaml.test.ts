import { describe, expect, it } from 'vitest'
import { serializeToYaml } from './serialize'
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
