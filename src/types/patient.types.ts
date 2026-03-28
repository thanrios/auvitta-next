/**
 * Patient Types
 * Types for patient management aligned with Django backend API
 */

// ============================================================================
// Enums
// ============================================================================

export enum BiologicalSex {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3,
}

export type ApiBiologicalSex = BiologicalSex.MALE | BiologicalSex.FEMALE

export enum PatientStatus {
  ACTIVE = 1,
  INACTIVE = 0,
  ARCHIVED = 2,
}

export enum PhoneType {
  MOBILE = 1,
  LANDLINE = 2,
  EMERGENCY = 3,
}

export enum AddressType {
  RESIDENTIAL = 1,
  COMMERCIAL = 2,
  OTHER = 3,
}

export enum DocumentType {
  CPF = 1,
  RG = 2,
  PASSPORT = 3,
  PROFESSIONAL_LICENSE_CRP = 11,
  PROFESSIONAL_LICENSE_OTHER = 19,
}

export enum RelationshipType {
  MOTHER = 1,
  FATHER = 2,
  LEGAL_GUARDIAN = 3,
  OTHER = 4,
}

// ============================================================================
// Person Contact Models
// ============================================================================

export interface PersonPhone {
  id: string
  party?: string
  country_code: string
  phone_number: string
  formatted_phone?: string
  phone_type: PhoneType
  phone_type_display?: string
  is_whatsapp: boolean
  is_primary: boolean
  created_at?: string
  updated_at?: string
}

export interface PersonPhoneCreateRequest {
  country_code: string
  phone_number: string
  phone_type: PhoneType
  is_whatsapp?: boolean
  is_primary?: boolean
}

export interface PersonPhoneUpdateRequest {
  country_code?: string
  phone_number?: string
  phone_type?: PhoneType
  is_whatsapp?: boolean
  is_primary?: boolean
}

export interface PersonAddress {
  id: string
  party?: string
  address_type: AddressType
  address_type_display?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  postal_code: string
  state: string
  city: string
  is_primary: boolean
  created_at?: string
  updated_at?: string
}

export interface PersonAddressCreateRequest {
  address_type: AddressType
  street: string
  number: string
  complement?: string
  neighborhood: string
  postal_code: string
  state: string
  city: string
  is_primary?: boolean
}

export interface PersonAddressUpdateRequest {
  address_type?: AddressType
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  postal_code?: string
  state?: string
  city?: string
  is_primary?: boolean
}

export interface PersonDocument {
  id: string
  party?: string
  document_type: DocumentType
  document_type_display?: string
  document_number: string
  is_main: boolean
  created_at?: string
  updated_at?: string
}

export interface PersonEmail {
  id: string
  party?: string
  email: string
  is_primary: boolean
  created_at?: string
  updated_at?: string
}

export interface PersonEmailCreateRequest {
  email: string
  is_primary?: boolean
}

export interface PersonEmailUpdateRequest {
  email?: string
  is_primary?: boolean
}

export interface PersonDocumentCreateRequest {
  document_type: DocumentType
  document_number: string
  is_main?: boolean
}

export interface PersonDocumentUpdateRequest {
  document_type?: DocumentType
  document_number?: string
  is_main?: boolean
}

// ============================================================================
// Guardian
// ============================================================================

export interface Guardian {
  id: string
  person?: string
  person_id?: string
  full_name: string
  full_name_normalized?: string
  birth_date?: string
  biological_sex?: BiologicalSex
  biological_sex_display?: string
  status: number
  status_display?: string
  created_at: string
  updated_at: string
}

export interface GuardianDetail extends Guardian {
  documents: PersonDocument[]
  phones: PersonPhone[]
  addresses: PersonAddress[]
  emails: PersonEmail[]
  patients: PatientGuardianRelationship[]
}

// ============================================================================
// Patient-Guardian Relationship
// ============================================================================

export interface PatientGuardianRelationship {
  id: string
  patient?: string
  guardian_id: string
  guardian?: string
  guardian_name?: string
  patient_id?: string
  patient_name?: string
  person_id: string
  full_name: string
  full_name_normalized?: string
  relationship_type: RelationshipType
  relationship_type_display?: string
  is_primary_responsible: boolean
  is_financial_responsible: boolean
  is_legal_guardian: boolean
  phones?: PersonPhone[]
  documents?: PersonDocument[]
  addresses?: PersonAddress[]
}

// ============================================================================
// Patient
// ============================================================================

export interface Patient {
  id: string
  age: number | null
  person?: string
  person_id?: string
  full_name: string
  full_name_normalized?: string
  birth_date?: string
  biological_sex?: BiologicalSex
  biological_sex_display?: string
  status: PatientStatus
  status_display?: string
  created_at: string
  updated_at: string
}

export interface PatientDetail extends Patient {
  documents: PersonDocument[]
  phones: PersonPhone[]
  addresses: PersonAddress[]
  emails: PersonEmail[]
  guardians: PatientGuardianRelationship[]
}

// ============================================================================
// Request/Response Types
// ============================================================================

export interface PersonLookupByDocumentRequest {
  document_type: DocumentType
  document_number: string
}

export interface PersonLookupByNameRequest {
  name: string
  birth_date?: string
  biological_sex?: ApiBiologicalSex
}

export interface PersonLookupRole {
  exists: boolean
  id: string | null
  status?: number | null
}

export interface PersonLookupResult {
  person_id: string
  full_name: string
  social_name: string | null
  birth_date: string | null
  biological_sex: ApiBiologicalSex | null
  match_score: number
  roles: {
    patient: PersonLookupRole
    guardian: PersonLookupRole
    professional: PersonLookupRole
    user: PersonLookupRole
  }
}

export interface PersonLookupResponse {
  results: PersonLookupResult[]
  total: number
}

export interface PatientPersonReference {
  id: string
}

export interface PatientPersonCreatePayload {
  full_name: string
  birth_date?: string
  biological_sex?: ApiBiologicalSex
  documents?: PersonDocumentCreateRequest[]
}

export interface PatientCreateRequest {
  person: PatientPersonReference | PatientPersonCreatePayload
}

export interface PatientUpdateRequest {
  person?: {
    full_name?: string
    birth_date?: string
    biological_sex?: ApiBiologicalSex
    phones?: Array<Partial<PersonPhone> & { id?: string }>
    addresses?: Array<Partial<PersonAddress> & { id?: string }>
    documents?: Array<Partial<PersonDocument> & { id?: string }>
    emails?: Array<Partial<PersonEmail> & { id?: string }>
  }
  status?: PatientStatus
}

export interface GuardianCreateRequest {
  person: PatientPersonReference | PatientPersonCreatePayload
  status?: number
}

export interface GuardianUpdateRequest {
  person?: {
    full_name?: string
    birth_date?: string
    biological_sex?: ApiBiologicalSex
    phones?: Array<Partial<PersonPhone> & { id?: string }>
    addresses?: Array<Partial<PersonAddress> & { id?: string }>
    documents?: Array<Partial<PersonDocument> & { id?: string }>
    emails?: Array<Partial<PersonEmail> & { id?: string }>
  }
  status?: number
}

export interface LinkGuardianRequest {
  guardian_id: string
  relationship_type: RelationshipType
  is_primary_responsible?: boolean
  is_financial_responsible?: boolean
  is_legal_guardian?: boolean
}

export interface UpdateGuardianRelationshipRequest {
  relationship_type?: RelationshipType
  is_primary_responsible?: boolean
  is_financial_responsible?: boolean
  is_legal_guardian?: boolean
}

// ============================================================================
// Paginated Response
// ============================================================================

export interface PaginatedPatients {
  count: number
  next: string | null
  previous: string | null
  results: Patient[]
}

export interface PaginatedGuardians {
  count: number
  next: string | null
  previous: string | null
  results: Guardian[]
}
