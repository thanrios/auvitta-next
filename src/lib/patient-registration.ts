import type { PatientFormData } from '@/lib/validations/patient'
import {
  AddressType,
  BiologicalSex,
  DocumentType,
  PhoneType,
  RelationshipType,
  type ApiBiologicalSex,
  type GuardianCreateRequest,
  type LinkGuardianRequest,
  type PatientCreateRequest,
  type PersonAddressCreateRequest,
  type PersonDocumentCreateRequest,
  type PersonEmailCreateRequest,
  type PersonLookupByDocumentRequest,
  type PersonPhoneCreateRequest,
} from '@/types/patient.types'

type GuardianFormValue = PatientFormData['guardians'][number]
type AddressFormValue = PatientFormData['identification']['contact']['address']
type PhoneFormValue = PatientFormData['identification']['contact']['phones'][number]
type DocumentFormValue = PatientFormData['identification']['documents'][number]

function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function mapFormSexToApi(value: PatientFormData['identification']['sex']): ApiBiologicalSex | undefined {
  if (value === 'masculino') {
    return BiologicalSex.MALE
  }

  if (value === 'feminino') {
    return BiologicalSex.FEMALE
  }

  return undefined
}

function mapFormDocumentTypeToApi(value?: DocumentFormValue['type'] | GuardianFormValue['document']['type']) {
  switch (value) {
    case 'cpf':
      return DocumentType.CPF
    case 'rg':
      return DocumentType.RG
    case 'passaporte':
      return DocumentType.PASSPORT
    default:
      return undefined
  }
}

function mapFormRelationshipTypeToApi(value: GuardianFormValue['type']): RelationshipType {
  switch (value) {
    case 'mae':
      return RelationshipType.MOTHER
    case 'pai':
      return RelationshipType.FATHER
    case 'tutor':
      return RelationshipType.LEGAL_GUARDIAN
    default:
      return RelationshipType.OTHER
  }
}

function normalizeCountryCode(value: string): string {
  return onlyDigits(value)
}

function normalizePhoneNumber(value: string): string {
  return onlyDigits(value)
}

function hasAddressData(address: AddressFormValue): boolean {
  return [
    address.postalCode,
    address.street,
    address.number,
    address.complement,
    address.neighborhood,
    address.city,
    address.state,
  ].some((value) => Boolean(value?.trim()))
}

function mapDocumentFormValue(document: DocumentFormValue): PersonDocumentCreateRequest | null {
  const documentType = mapFormDocumentTypeToApi(document.type)
  const documentNumber = onlyDigits(document.number ?? '')

  if (!documentType || !documentNumber) {
    return null
  }

  return {
    document_type: documentType,
    document_number: documentNumber,
    is_main: documentType === DocumentType.CPF,
  }
}

function mapGuardianDocumentFormValue(guardian: GuardianFormValue): PersonDocumentCreateRequest | null {
  const documentType = mapFormDocumentTypeToApi(guardian.document.type)
  const documentNumber = onlyDigits(guardian.document.number ?? '')

  if (!documentType || !documentNumber) {
    return null
  }

  return {
    document_type: documentType,
    document_number: documentNumber,
    is_main: true,
  }
}

function isSameDocument(
  left: PersonDocumentCreateRequest,
  right: PersonDocumentCreateRequest
): boolean {
  return left.document_type === right.document_type && left.document_number === right.document_number
}

export function getPatientLookupDocument(
  values: PatientFormData
): PersonLookupByDocumentRequest | undefined {
  const primaryDocument = values.identification.documents
    .map(mapDocumentFormValue)
    .find((document): document is PersonDocumentCreateRequest => Boolean(document))

  if (!primaryDocument) {
    return undefined
  }

  return {
    document_type: primaryDocument.document_type,
    document_number: primaryDocument.document_number,
  }
}

export function getGuardianLookupDocument(
  guardian: GuardianFormValue
): PersonLookupByDocumentRequest | undefined {
  const document = mapGuardianDocumentFormValue(guardian)

  if (!document) {
    return undefined
  }

  return {
    document_type: document.document_type,
    document_number: document.document_number,
  }
}

export function buildPatientCreateRequest(
  values: PatientFormData,
  personId?: string
): PatientCreateRequest {
  if (personId) {
    return {
      person: {
        id: personId,
      },
    }
  }

  const documents = values.identification.documents
    .map(mapDocumentFormValue)
    .filter((document): document is PersonDocumentCreateRequest => Boolean(document))

  return {
    person: {
      full_name: values.identification.fullName.trim(),
      birth_date: values.identification.birthDate || undefined,
      biological_sex: mapFormSexToApi(values.identification.sex),
      documents: documents.length > 0 ? [documents[0]] : undefined,
    },
  }
}

export function buildPatientAdditionalDocuments(
  values: PatientFormData,
  usedLookupDocument?: PersonLookupByDocumentRequest
): PersonDocumentCreateRequest[] {
  const documents = values.identification.documents
    .map(mapDocumentFormValue)
    .filter((document): document is PersonDocumentCreateRequest => Boolean(document))

  if (!usedLookupDocument) {
    return documents.slice(1)
  }

  return documents.filter(
    (document) =>
      !isSameDocument(document, {
        document_type: usedLookupDocument.document_type,
        document_number: usedLookupDocument.document_number,
        is_main: true,
      })
  )
}

export function buildGuardianCreateRequest(
  guardian: GuardianFormValue,
  personId?: string
): GuardianCreateRequest {
  if (personId) {
    return {
      person: {
        id: personId,
      },
    }
  }

  const document = mapGuardianDocumentFormValue(guardian)

  return {
    person: {
      full_name: guardian.name.trim(),
      documents: document ? [document] : undefined,
    },
  }
}

export function buildGuardianLinkRequest(
  guardian: GuardianFormValue,
  guardianId: string
): LinkGuardianRequest {
  return {
    guardian_id: guardianId,
    relationship_type: mapFormRelationshipTypeToApi(guardian.type),
    is_primary_responsible: guardian.isPrimary,
    is_financial_responsible: guardian.isPrimary,
    is_legal_guardian: true,
  }
}

export function buildPhoneCreateRequests(phones: PhoneFormValue[]): PersonPhoneCreateRequest[] {
  return phones
    .filter((phone) => Boolean(phone.number?.trim()))
    .map((phone) => ({
      country_code: normalizeCountryCode(phone.countryCode || '55'),
      phone_number: normalizePhoneNumber(phone.number ?? ''),
      phone_type: PhoneType.MOBILE,
      is_whatsapp: phone.isWhatsapp,
      is_primary: phone.isPrimary,
    }))
}

export function buildEmailCreateRequest(email?: string): PersonEmailCreateRequest | undefined {
  if (!email?.trim()) {
    return undefined
  }

  return {
    email: email.trim().toLowerCase(),
    is_primary: true,
  }
}

export function buildAddressCreateRequest(
  address: AddressFormValue
): PersonAddressCreateRequest | undefined {
  if (!hasAddressData(address)) {
    return undefined
  }

  return {
    address_type: AddressType.RESIDENTIAL,
    street: address.street.trim(),
    number: address.number.trim(),
    complement: address.complement?.trim() || undefined,
    neighborhood: address.neighborhood.trim(),
    postal_code: onlyDigits(address.postalCode),
    state: address.state.trim().toUpperCase(),
    city: address.city.trim(),
    is_primary: true,
  }
}