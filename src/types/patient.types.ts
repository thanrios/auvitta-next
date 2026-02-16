/**
 * Patient Types
 * Types for patient management
 */

// ============================================================================
// Patient
// ============================================================================

export interface PatientAddress {
  street: string
  city: string
  state: string
  zip_code: string
}

export interface Patient {
  id: number
  full_name: string
  date_of_birth: string
  document_number: string
  phone: string
  email: string
  address: PatientAddress
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PatientCreateRequest {
  full_name: string
  date_of_birth: string
  document_number: string
  phone: string
  email: string
  address: PatientAddress
}

export type PatientUpdateRequest = Partial<PatientCreateRequest>
