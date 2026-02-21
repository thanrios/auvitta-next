/**
 * React Query hooks for appointment data management.
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api-client'
import { getErrorMessage } from '@/lib/api'
import { API_ROUTES } from '@/lib/api-routes'
import { QUERY_KEYS } from '@/lib/query-keys'

import type {
  Appointment,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
} from '@/types/appointment.types'
import type { PaginatedResponse } from '@/types/common.types'

interface AppointmentFilters {
  patient_id?: number
  doctor_id?: number
  status?: string
  date?: string
}

/**
 * Fetches a paginated list of appointments with optional filtering.
 *
 * @param page - Page number for pagination (default: 1)
 * @param filters - Optional filters for appointments (patient_id, doctor_id, status, date)
 * @returns Query object with appointments list, loading and error states
 */
export function useAppointments(page = 1, filters?: AppointmentFilters) {
  return useQuery({
    queryKey: QUERY_KEYS.appointments.list(page, filters),
    queryFn: async () => {
      return api.get<PaginatedResponse<Appointment>>(
        API_ROUTES.appointments.base,
        { params: { page, ...filters } }
      )
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Fetches a single appointment by ID.
 *
 * @param id - Appointment ID (number or string)
 * @returns Query object with appointment data, loading and error states
 */
export function useAppointment(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.appointments.detail(id),
    queryFn: async () => {
      return api.get<Appointment>(API_ROUTES.appointments.byId(id))
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Creates a new appointment.
 *
 * Invalidates the appointments list query on success to keep cache synchronized.
 *
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AppointmentCreateRequest) => {
      return api.post<Appointment>(API_ROUTES.appointments.base, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments.all })
    },
    onError: (error) => {
      console.error('Create appointment error:', getErrorMessage(error))
    },
  })
}

/**
 * Updates an existing appointment.
 *
 * Updates the appointment detail cache and invalidates the list query on success.
 *
 * @param id - Appointment ID to update (number or string)
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useUpdateAppointment(id: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AppointmentUpdateRequest) => {
      return api.patch<Appointment>(API_ROUTES.appointments.byId(id), data)
    },
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(QUERY_KEYS.appointments.detail(id), updatedAppointment)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments.all })
    },
    onError: (error) => {
      console.error('Update appointment error:', getErrorMessage(error))
    },
  })
}

/**
 * Cancels an existing appointment by setting its status to 'CANCELLED'.
 *
 * Invalidates the appointments list query on success to keep cache synchronized.
 *
 * @returns Mutation object with mutate/mutateAsync functions, loading and error states
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      return api.patch<Appointment>(API_ROUTES.appointments.byId(id), {
        status: 'CANCELLED',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.appointments.all })
    },
    onError: (error) => {
      console.error('Cancel appointment error:', getErrorMessage(error))
    },
  })
}
