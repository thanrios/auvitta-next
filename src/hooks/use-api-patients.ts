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
  PatientCreateRequest,
  PatientUpdateRequest,
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
 * Fetches a single patient by ID.
 *
 * @param id - Patient ID (number or string)
 * @returns Query object with patient data, loading and error states
 */
export function usePatient(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.patients.detail(id),
    queryFn: async () => {
      return api.get<Patient>(API_ROUTES.patients.byId(id))
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
 * @param id -Patient ID to update (number or string)
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useUpdatePatient(id: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PatientUpdateRequest) => {
      return api.patch<Patient>(API_ROUTES.patients.byId(id), data)
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
    mutationFn: async (id: number | string) => {
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
