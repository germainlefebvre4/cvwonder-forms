import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr.json'
import en from './locales/en.json'
import type { ValidationIssue } from '../schema/validator'

// Flat keys (e.g. "fields.career.missions.position") mirror the schema's own
// property path, so keySeparator is disabled: a key is looked up verbatim
// instead of being walked as nested JSON, which lets a group label like
// "fields.career" and a leaf label "fields.career.companyName" coexist.
void i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: 'fr',
  fallbackLng: 'en',
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
})

export function fieldLabelKey(schemaPath: string[]): string {
  return `fields.${schemaPath.join('.')}`
}

/** Maps an ajv validation issue to a localized message key + interpolation params. */
export function validationMessage(issue: ValidationIssue): { key: string; params?: Record<string, unknown> } {
  switch (issue.keyword) {
    case 'required':
    case 'minLength':
      return { key: 'validation.error.required' }
    case 'format':
      return { key: 'validation.error.format', params: { format: issue.params.format } }
    case 'minimum':
    case 'exclusiveMinimum':
      return { key: 'validation.error.minimum', params: { limit: issue.params.limit } }
    case 'maximum':
    case 'exclusiveMaximum':
      return { key: 'validation.error.maximum', params: { limit: issue.params.limit } }
    case 'minItems':
      return { key: 'validation.error.minItems', params: { limit: issue.params.limit } }
    case 'type':
      return { key: 'validation.error.type' }
    default:
      return { key: 'validation.error.generic' }
  }
}

export default i18n
