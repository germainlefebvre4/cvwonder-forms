import { describe, expect, it } from 'vitest'
import { buildDefaultValue, documentSections } from './index'
import { validateDocument } from './validator'
import type { ArrayFieldDescriptor, ObjectFieldDescriptor, StringFieldDescriptor } from './types'

function section(key: string) {
  const found = documentSections.find((s) => s.key === key)
  if (!found) throw new Error(`missing section ${key}`)
  return found
}

describe('buildDocumentSections', () => {
  it('produces one section per top-level schema property, in schema order', () => {
    expect(documentSections.map((s) => s.key)).toEqual([
      'company',
      'person',
      'socialNetworks',
      'abstract',
      'career',
      'technicalSkills',
      'sideProjects',
      'certifications',
      'languages',
      'education',
    ])
  })

  it('only marks person as required at the top level', () => {
    expect(section('person').required).toBe(true)
    expect(section('company').required).toBe(false)
    expect(section('education').required).toBe(false)
  })

  it('marks person.name as required and person.email as an optional-format field', () => {
    const person = section('person') as ObjectFieldDescriptor
    const name = person.properties.find((p) => p.key === 'name')!
    const email = person.properties.find((p) => p.key === 'email') as StringFieldDescriptor
    expect(name.required).toBe(true)
    expect(email.kind).toBe('string')
    expect(email.optionalFormat).toBe(true)
    expect(email.format).toBe('email')
  })

  it('marks career[].companyName/missions as required, and missions[].position/company as required', () => {
    const career = section('career') as ArrayFieldDescriptor
    const careerItem = career.items as ObjectFieldDescriptor
    const companyName = careerItem.properties.find((p) => p.key === 'companyName')!
    const missions = careerItem.properties.find((p) => p.key === 'missions') as ArrayFieldDescriptor
    expect(companyName.required).toBe(true)
    expect(missions.required).toBe(true)
    expect(missions.minItems).toBe(1)

    const missionItem = missions.items as ObjectFieldDescriptor
    const position = missionItem.properties.find((p) => p.key === 'position')!
    const location = missionItem.properties.find((p) => p.key === 'location')!
    expect(position.required).toBe(true)
    expect(location.required).toBe(false)
  })

  it('keeps education fields optional (no required array on that item)', () => {
    const education = section('education') as ArrayFieldDescriptor
    const item = education.items as ObjectFieldDescriptor
    expect(item.properties.every((p) => !p.required)).toBe(true)
  })

  it('captures the 0-100 integer range on technicalSkills competency levels', () => {
    const technicalSkills = section('technicalSkills') as ObjectFieldDescriptor
    const domains = technicalSkills.properties.find((p) => p.key === 'domains') as ArrayFieldDescriptor
    const domainItem = domains.items as ObjectFieldDescriptor
    const competencies = domainItem.properties.find((p) => p.key === 'competencies') as ArrayFieldDescriptor
    const competencyItem = competencies.items as ObjectFieldDescriptor
    const level = competencyItem.properties.find((p) => p.key === 'level')!
    expect(level.kind).toBe('integer')
    if (level.kind === 'integer') {
      expect(level.minimum).toBe(0)
      expect(level.maximum).toBe(100)
    }
  })
})

describe('buildDefaultValue', () => {
  it('pre-seeds a new career entry with one empty mission (structure only, no leaf values)', () => {
    const career = section('career') as ArrayFieldDescriptor
    const value = buildDefaultValue(career.items) as { companyName?: string; missions: unknown[] }
    expect(value.companyName).toBeUndefined()
    expect(value.missions).toHaveLength(1)
    expect(value.missions[0]).toEqual({})
  })

  it('does not pre-seed non-required arrays', () => {
    expect(buildDefaultValue(section('abstract'))).toEqual([])
  })
})

describe('validateDocument', () => {
  it('rejects an empty document (person is required)', () => {
    const result = validateDocument({})
    expect(result.valid).toBe(false)
    expect(result.errorsByPath['person']).toBeDefined()
  })

  it('accepts the minimal valid document', () => {
    const result = validateDocument({ person: { name: 'Jane Doe' } })
    expect(result.valid).toBe(true)
    expect(result.errorCount).toBe(0)
  })

  it('accepts an empty person.email but rejects an invalid one', () => {
    expect(validateDocument({ person: { name: 'Jane Doe', email: '' } }).valid).toBe(true)

    const invalid = validateDocument({ person: { name: 'Jane Doe', email: 'not-an-email' } })
    expect(invalid.valid).toBe(false)
    expect(invalid.errorsByPath['person.email']).toBeDefined()
  })

  it('rejects a career entry missing its required missions', () => {
    const result = validateDocument({
      person: { name: 'Jane Doe' },
      career: [{ companyName: 'Acme' }],
    })
    expect(result.valid).toBe(false)
    expect(result.errorsByPath['career.0.missions']).toBeDefined()
  })

  it('accepts a fully-formed career entry', () => {
    const result = validateDocument({
      person: { name: 'Jane Doe' },
      career: [
        {
          companyName: 'Acme',
          missions: [{ position: 'Developer', company: 'Acme' }],
        },
      ],
    })
    expect(result.valid).toBe(true)
  })

  it('rejects a technical skill level outside 0-100', () => {
    const result = validateDocument({
      person: { name: 'Jane Doe' },
      technicalSkills: { domains: [{ name: 'Backend', competencies: [{ name: 'Go', level: 150 }] }] },
    })
    expect(result.valid).toBe(false)
    expect(result.errorsByPath['technicalSkills.domains.0.competencies.0.level']).toBeDefined()
  })

  it('rejects a language entry missing level', () => {
    const result = validateDocument({
      person: { name: 'Jane Doe' },
      languages: [{ name: 'French' }],
    })
    expect(result.valid).toBe(false)
    expect(result.errorsByPath['languages.0.level']).toBeDefined()
  })

  it('accepts an education entry with no fields set', () => {
    const result = validateDocument({
      person: { name: 'Jane Doe' },
      education: [{}],
    })
    expect(result.valid).toBe(true)
  })
})
