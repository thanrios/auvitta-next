/**
 * Custom hook for patient registration flow.
 * Handles lookup, submission, and guardian creation logic.
 */

import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import api from '@/lib/api-client'
import { API_ROUTES } from '@/lib/api-routes'
import {
  buildAddressCreateRequest,
  buildEmailCreateRequest,
  buildGuardianCreateRequest,
  buildGuardianLinkRequest,
  buildPatientAdditionalDocuments,
  buildPatientCreateRequest,
  buildPhoneCreateRequests,
  getGuardianLookupDocument,
  getPatientLookupDocument,
} from '@/lib/patient-registration'
import { QUERY_KEYS } from '@/lib/query-keys'
import type {
  GuardianDetail,
  PatientDetail,
  PersonLookupResponse,
} from '@/types/patient.types'
import type { PatientFormData } from '@/lib/validations/patient'

interface PersonLookupPayload {
  document_type?: number
  document_number?: string
  name?: string
  birth_date?: string
  biological_sex?: 1 | 2
}

/**
 * Hook managing patient registration submission flow.
 * Handles document lookup, patient/guardian creation, contact assignment.
 */
export function usePatientRegistration() {
  const t = useTranslations('pages.patients.newForm')
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Looks up a person by document or name criteria.
   */
  const lookupPersonByDocument = useCallback(
    async (payload?: PersonLookupPayload) => {
      if (!payload) {
        return undefined
      }

      const response = await api.post<PersonLookupResponse>(
        API_ROUTES.persons.lookup,
        payload
      )
      return response.results[0]
    },
    []
  )

  /**
   * Submits a single guardian: lookup → create if new → link to patient.
   */
  const submitGuardian = useCallback(
    async (patientId: string, guardian: PatientFormData['guardians'][number]) => {
      const guardianLookupDocument = getGuardianLookupDocument(guardian)

      if (!guardianLookupDocument) {
        throw new Error(t('submission.guardianDocumentRequired'))
      }

      const existingGuardian = await lookupPersonByDocument(
        guardianLookupDocument
      )
      let guardianId = existingGuardian?.roles.guardian.id ?? undefined

      if (!guardianId) {
        const guardianPayload = buildGuardianCreateRequest(
          guardian,
          existingGuardian?.person_id
        )
        const createdGuardian = await api.post<GuardianDetail>(
          API_ROUTES.guardians.base,
          guardianPayload
        )
        guardianId = createdGuardian.id
        const createdGuardianId = createdGuardian.id

        const guardianRequests = buildPhoneCreateRequests(
          guardian.contact.phones
        ).map((phone) =>
          api.post(API_ROUTES.guardians.phones(createdGuardianId), phone)
        )

        const guardianEmail = buildEmailCreateRequest(guardian.contact.email)
        const guardianAddress = buildAddressCreateRequest(
          guardian.contact.address
        )

        if (guardianEmail) {
          guardianRequests.push(
            api.post(
              API_ROUTES.guardians.emails(createdGuardianId),
              guardianEmail
            )
          )
        }

        if (guardianAddress) {
          guardianRequests.push(
            api.post(
              API_ROUTES.guardians.addresses(createdGuardianId),
              guardianAddress
            )
          )
        }

        await Promise.all(guardianRequests)
      }

      if (!guardianId) {
        throw new Error(t('submission.createError'))
      }

      await api.post(
        API_ROUTES.patients.linkGuardian(patientId),
        buildGuardianLinkRequest(guardian, guardianId)
      )
    },
    [lookupPersonByDocument, t]
  )

  /**
   * Main submit handler: orchestrates full patient creation flow.
   * Sequence: lookup → create patient → contacts → guardians → invalidate cache
   */
  const submitPatientRegistration = useCallback(
    async (
      values: PatientFormData,
      selectedPersonId?: string
    ): Promise<void> => {
      setIsSubmitting(true)

      try {
        const patientLookupDocument = getPatientLookupDocument(values)
        const existingPatient = await lookupPersonByDocument(
          patientLookupDocument
        )

        if (existingPatient?.roles.patient.exists) {
          throw new Error(t('submission.patientAlreadyExists'))
        }

        // Create patient
        const patientPayload = buildPatientCreateRequest(
          values,
          selectedPersonId ?? existingPatient?.person_id
        )
        const createdPatient = await api.post<PatientDetail>(
          API_ROUTES.patients.base,
          patientPayload
        )

        // Create patient contacts in parallel
        const patientRequests = buildPatientAdditionalDocuments(
          values,
          patientLookupDocument
        ).map((document) =>
          api.post(API_ROUTES.patients.documents(createdPatient.id), document)
        )

        patientRequests.push(
          ...buildPhoneCreateRequests(values.identification.contact.phones).map(
            (phone) =>
              api.post(API_ROUTES.patients.phones(createdPatient.id), phone)
          )
        )

        const patientEmail = buildEmailCreateRequest(
          values.identification.contact.email
        )
        const patientAddress = buildAddressCreateRequest(
          values.identification.contact.address
        )

        if (patientEmail) {
          patientRequests.push(
            api.post(API_ROUTES.patients.emails(createdPatient.id), patientEmail)
          )
        }

        if (patientAddress) {
          patientRequests.push(
            api.post(
              API_ROUTES.patients.addresses(createdPatient.id),
              patientAddress
            )
          )
        }

        await Promise.all(patientRequests)

        // Create guardians sequentially
        for (const guardian of values.guardians ?? []) {
          await submitGuardian(createdPatient.id, guardian)
        }

        // Invalidate cache
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.patients.all,
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [lookupPersonByDocument, submitGuardian, queryClient, t]
  )

  return {
    isSubmitting,
    submitPatientRegistration,
    lookupPersonByDocument,
  }
}
