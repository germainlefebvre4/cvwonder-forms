import { useMemo } from 'react'
import { useCvDocumentStore } from './cvDocument'
import { validateDocument, type ValidationResult } from '../schema/validator'

export function useCvValidation(): ValidationResult {
  const document = useCvDocumentStore((state) => state.document)
  return useMemo(() => validateDocument(document), [document])
}
