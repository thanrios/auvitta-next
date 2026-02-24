/**
 * React Query hooks for patient data management.
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api-client'
import { getErrorMessage } from '@/lib/api'
import { API_ROUTES } from '@/lib/api-routes'
import { QUERY_KEYS } from '@/lib/query-keys'

import type {
  Patient,
  PatientDetail,
  PatientCreateRequest,
  PatientUpdateRequest,
  PersonPhone,
  PersonPhoneCreateRequest,
  PersonPhoneUpdateRequest,
  PersonAddress,
  PersonAddressCreateRequest,
  PersonAddressUpdateRequest,
  PersonDocument,
  PersonDocumentCreateRequest,
  PersonDocumentUpdateRequest,
  PatientGuardianRelationship,
  LinkGuardianRequest,
  UpdateGuardianRelationshipRequest,
} from '@/types/patient.types'
import type { PaginatedResponse } from '@/types/common.types'

/**
 * Fetches a paginated list of patients with optional search.
 *
 * @param page - Page number for pagination (default: 1)
 * @param search - Optional search term to filter patients by name or identifier
 * @returns Query object with patients list, loading and error states
 */
export function usePatients(page = 1, search = '') {
  return useQuery({
    queryKey: QUERY_KEYS.patients.list(page, search),
    queryFn: async () => {
      return api.get<PaginatedResponse<Patient>>(API_ROUTES.patients.base, {
        params: { page, search },
      })
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Fetches a single patient by ID with all nested data.
 *
 * @param id - Patient ID (string)
 * @returns Query object with patient detail data, loading and error states
 */
export function usePatient(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.detail(id),
    queryFn: async () => {
      return api.get<PatientDetail>(API_ROUTES.patients.byId(id))
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Creates a new patient.
 *
 * Invalidates the patients list query on success to keep cache synchronized.
 *
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PatientCreateRequest) => {
      return api.post<Patient>(API_ROUTES.patients.base, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.all })
    },
    onError: (error) => {
      console.error('Create patient error:', getErrorMessage(error))
    },
  })
}

/**
 * Updates an existing patient.
 *
 * Updates the patient detail cache and invalidates the list query on success.
 *
 * @param id - Patient ID to update (string)
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PatientUpdateRequest) => {
      return api.patch<PatientDetail>(API_ROUTES.patients.byId(id), data)
    },
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(QUERY_KEYS.patients.detail(id), updatedPatient)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.all })
    },
    onError: (error) => {
      console.error('Update patient error:', getErrorMessage(error))
    },
  })
}

/**
 * Deletes an existing patient.
 *
 * Invalidates the patients list query on success to keep cache synchronized.
 *
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(API_ROUTES.patients.byId(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.all })
    },
    onError: (error) => {
      console.error('Delete patient error:', getErrorMessage(error))
    },
  })
}

// ============================================================
// Patient Phones Hooks
// ============================================================

/**
 * Fetches all phones for a patient.
 *
 * @param patientId - Patient ID
 * @returns Query object with phone list, loading and error states
 */
export function usePatientPhones(patientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.phones(patientId),
    queryFn: async () => {
      return api.get<PersonPhone[]>(API_ROUTES.patients.phones(patientId))
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Adds a phone to a patient.
 *
 * @param patientId - Patient ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useAddPatientPhone(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PersonPhoneCreateRequest) => {
      return api.post<PersonPhone>(API_ROUTES.patients.phones(patientId), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.phones(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Add patient phone error:', getErrorMessage(error))
    },
  })
}

/**
 * Updates a patient phone.
 *
 * @param patientId - Patient ID
 * @param phoneId - Phone ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useUpdatePatientPhone(patientId: string, phoneId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PersonPhoneUpdateRequest) => {
      return api.patch<PersonPhone>(API_ROUTES.patients.phoneById(patientId, phoneId), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.phones(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Update patient phone error:', getErrorMessage(error))
    },
  })
}

/**
 * Deletes a patient phone.
 *
 * @param patientId - Patient ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useDeletePatientPhone(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (phoneId: string) => {
      return api.delete(API_ROUTES.patients.phoneById(patientId, phoneId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.phones(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Delete patient phone error:', getErrorMessage(error))
    },
  })
}

// ============================================================
// Patient Addresses Hooks
// ============================================================

/**
 * Fetches all addresses for a patient.
 *
 * @param patientId - Patient ID
 * @returns Query object with address list, loading and error states
 */
export function usePatientAddresses(patientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.addresses(patientId),
    queryFn: async () => {
      return api.get<PersonAddress[]>(API_ROUTES.patients.addresses(patientId))
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Adds an address to a patient.
 *
 * @param patientId - Patient ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useAddPatientAddress(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PersonAddressCreateRequest) => {
      return api.post<PersonAddress>(API_ROUTES.patients.addresses(patientId), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.addresses(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Add patient address error:', getErrorMessage(error))
    },
  })
}

/**
 * Updates a patient address.
 *
 * @param patientId - Patient ID
 * @param addressId - Address ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useUpdatePatientAddress(patientId: string, addressId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PersonAddressUpdateRequest) => {
      return api.patch<PersonAddress>(
        API_ROUTES.patients.addressById(patientId, addressId),
        data
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.addresses(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Update patient address error:', getErrorMessage(error))
    },
  })
}

/**
 * Deletes a patient address.
 *
 * @param patientId - Patient ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useDeletePatientAddress(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (addressId: string) => {
      return api.delete(API_ROUTES.patients.addressById(patientId, addressId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.addresses(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Delete patient address error:', getErrorMessage(error))
    },
  })
}

// ============================================================
// Patient Documents Hooks
// ============================================================

/**
 * Fetches all documents for a patient.
 *
 * @param patientId - Patient ID
 * @returns Query object with document list, loading and error states
 */
export function usePatientDocuments(patientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.documents(patientId),
    queryFn: async () => {
      return api.get<PersonDocument[]>(API_ROUTES.patients.documents(patientId))
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Adds a document to a patient.
 *
 * @param patientId - Patient ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useAddPatientDocument(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PersonDocumentCreateRequest) => {
      return api.post<PersonDocument>(API_ROUTES.patients.documents(patientId), data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.documents(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Add patient document error:', getErrorMessage(error))
    },
  })
}

/**
 * Updates a patient document.
 *
 * @param patientId - Patient ID
 * @param documentId - Document ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useUpdatePatientDocument(patientId: string, documentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PersonDocumentUpdateRequest) => {
      return api.patch<PersonDocument>(
        API_ROUTES.patients.documentById(patientId, documentId),
        data
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.documents(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Update patient document error:', getErrorMessage(error))
    },
  })
}

/**
 * Deletes a patient document.
 *
 * @param patientId - Patient ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useDeletePatientDocument(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (documentId: string) => {
      return api.delete(API_ROUTES.patients.documentById(patientId, documentId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.documents(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Delete patient document error:', getErrorMessage(error))
    },
  })
}

// ============================================================
// Patient Guardians Hooks
// ============================================================

/**
 * Fetches all guardians for a patient.
 *
 * @param patientId - Patient ID
 * @returns Query object with guardian relationships list, loading and error states
 */
export function usePatientGuardians(patientId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.guardians(patientId),
    queryFn: async () => {
      return api.get<PatientGuardianRelationship[]>(API_ROUTES.patients.guardians(patientId))
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Links a guardian to a patient.
 *
 * @param patientId - Patient ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useLinkGuardian(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LinkGuardianRequest) => {
      return api.post<PatientGuardianRelationship>(
        API_ROUTES.patients.linkGuardian(patientId),
        data
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.guardians(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Link guardian error:', getErrorMessage(error))
    },
  })
}

/**
 * Updates a patient-guardian relationship.
 *
 * @param patientId - Patient ID
 * @param guardianId - Guardian ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useUpdateGuardianRelationship(patientId: string, guardianId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateGuardianRelationshipRequest) => {
      return api.patch<PatientGuardianRelationship>(
        API_ROUTES.patients.guardianById(patientId, guardianId),
        data
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.guardians(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Update guardian relationship error:', getErrorMessage(error))
    },
  })
}

/**
 * Unlinks a guardian from a patient.
 *
 * @param patientId - Patient ID
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useUnlinkGuardian(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (guardianId: string) => {
      return api.delete(API_ROUTES.patients.guardianById(patientId, guardianId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.guardians(patientId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(patientId) })
    },
    onError: (error) => {
      console.error('Unlink guardian error:', getErrorMessage(error))
    },
  })
}
