import { beforeAll, describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { errorOriginLabel } from './errorSummary'

const t = i18n.t.bind(i18n)

beforeAll(() => i18n.changeLanguage('en'))

describe('errorOriginLabel', () => {
  it('labels a nested array-in-array error with each level\'s own functional label', () => {
    expect(errorOriginLabel(t, 'career.1.missions.0.position')).toBe('Career #2 › Missions #1 › Position')
  })

  it('keeps the section prefix when the first repeatable level is nested inside an object', () => {
    expect(errorOriginLabel(t, 'technicalSkills.domains.0.competencies.1.level')).toBe(
      'Technical skills — Domains #1 › Competencies #2 › Level',
    )
  })

  it('labels a section-level array field error with no leaf field', () => {
    expect(errorOriginLabel(t, 'career.1.missions')).toBe('Career #2 › Missions')
  })

  it('keeps the section prefix for an unaffected object-section field error', () => {
    expect(errorOriginLabel(t, 'person.email')).toBe('Personal information — Email')
  })
})
