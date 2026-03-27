/**
 * Mapper for patient form hydration and transformation.
 * Converts between API PatientDetail and form PatientFormData.
 */

import {
  mapDocumentTypeToFormValue,
  mapRelationshipTypeToFormValue,
  mapSexToFormValue,
} from '@/lib/enums-mapping'
import { PATIENT_FORM_DEFAULT_VALUES } from '@/lib/patient-form-defaults'
import type { PatientFormData } from '@/lib/validations/patient'
import type { PatientDetail } from '@/types/patient.types'

/**
 * Maps PatientDetail from API to PatientFormData for form hydration.
 * Used in edit mode to populate form with existing patient data.
 *
 * @param patient - PatientDetail from API
 * @returns PatientFormData ready for useForm hydration
 */
export function mapPatientDetailToFormValues(
  patient: PatientDetail
): PatientFormData {
  const firstAddress = patient.addresses[0]
  const firstEmail = patient.emails[0]
  const mappedDocuments =
    patient.documents.length > 0
      ? patient.documents.map((document) => ({
          type: mapDocumentTypeToFormValue(document.document_type),
          number: document.document_number ?? '',
        }))
      : [{ type: 'cpf' as const, number: '' }]

  return {
    identification: {
      fullName: patient.full_name ?? '',
      socialName: '',
      birthDate: patient.birth_date ?? '',
      sex: mapSexToFormValue(patient.biological_sex),
      documents: mappedDocuments,
      contact: {
        email: firstEmail?.email ?? '',
        phones: patient.phones.map((phone) => ({
          countryCode: phone.country_code ? `+${phone.country_code}` : '+55',
          number: phone.phone_number ?? '',
          isWhatsapp: phone.is_whatsapp,
          isPrimary: phone.is_primary,
        })),
        address: {
          postalCode: firstAddress?.postal_code ?? '',
          street: firstAddress?.street ?? '',
          number: firstAddress?.number ?? '',
          complement: firstAddress?.complement ?? '',
          neighborhood: firstAddress?.neighborhood ?? '',
          city: firstAddress?.city ?? '',
          state: firstAddress?.state ?? '',
        },
      },
    },
    guardians: patient.guardians.map((guardian) => {
      const guardianDocument = guardian.documents?.[0]
      const guardianPhone = guardian.phones?.[0]
      const guardianAddress = guardian.addresses?.[0]

      return {
        name: guardian.full_name ?? '',
        type: mapRelationshipTypeToFormValue(guardian.relationship_type),
        isPrimary: guardian.is_primary_responsible,
        document: {
          type: guardianDocument
            ? mapDocumentTypeToFormValue(guardianDocument.document_type)
            : undefined,
          number: guardianDocument?.document_number ?? '',
        },
        contact: {
          email: '',
          phones: [
            {
              countryCode: guardianPhone?.country_code
                ? `+${guardianPhone.country_code}`
                : '+55',
              number: guardianPhone?.phone_number ?? '',
              isWhatsapp: guardianPhone?.is_whatsapp ?? false,
              isPrimary: guardianPhone?.is_primary ?? true,
            },
          ],
          address: {
            postalCode: guardianAddress?.postal_code ?? '',
            street: guardianAddress?.street ?? '',
            number: guardianAddress?.number ?? '',
            complement: guardianAddress?.complement ?? '',
            neighborhood: guardianAddress?.neighborhood ?? '',
            city: guardianAddress?.city ?? '',
            state: guardianAddress?.state ?? '',
          },
        },
      }
    }),
    contact: PATIENT_FORM_DEFAULT_VALUES.contact,
    administrative: PATIENT_FORM_DEFAULT_VALUES.administrative,
  }
}
