/**
 * Enum mapping utilities for patient registration forms.
 * Converts between API enum values (numbers) and form display values (strings).
 */

import type { DocumentType, RelationshipType } from '@/types/patient.types'

/**
 * Maps API biological sex value to form display value.
 * @param value - API value (1=male, 2=female, undefined=other)
 * @returns Form value ('masculino', 'feminino', 'outro')
 */
export function mapSexToFormValue(
  value?: number
): 'masculino' | 'feminino' | 'outro' {
  if (value === 1) {
    return 'masculino'
  }

  if (value === 2) {
    return 'feminino'
  }

  return 'outro'
}

/**
 * Maps form sex value to API lookup value.
 * @param value - Form value ('masculino', 'feminino', 'outro')
 * @returns API value (1=male, 2=female, undefined=not specified)
 */
export function mapFormSexToLookupValue(
  value: 'masculino' | 'feminino' | 'outro'
): 1 | 2 | undefined {
  if (value === 'masculino') {
    return 1
  }

  if (value === 'feminino') {
    return 2
  }

  return undefined
}

/**
 * Maps API document type to form display value.
 * @param value - API value (1=CPF, 2=RG, 3=Passport, etc.)
 * @returns Form value ('cpf', 'rg', 'passaporte', 'cnh', 'outro')
 */
export function mapDocumentTypeToFormValue(
  value?: DocumentType
): 'cpf' | 'rg' | 'passaporte' | 'cnh' | 'outro' {
  if (value === 1) {
    return 'cpf'
  }

  if (value === 2) {
    return 'rg'
  }

  if (value === 3) {
    return 'passaporte'
  }

  return 'outro'
}

/**
 * Maps API relationship type to form display value.
 * @param value - API value (1=mother, 2=father, 3=tutor, etc.)
 * @returns Form value ('mae', 'pai', 'tutor', 'outro')
 */
export function mapRelationshipTypeToFormValue(
  value?: RelationshipType
): 'pai' | 'mae' | 'tutor' | 'outro' {
  if (value === 1) {
    return 'mae'
  }

  if (value === 2) {
    return 'pai'
  }

  if (value === 3) {
    return 'tutor'
  }

  return 'outro'
}
