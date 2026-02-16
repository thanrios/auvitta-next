/**
 * API Hooks
 * Custom hooks for API operations using TanStack Query
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api-client'
import { getErrorMessage } from '@/lib/api'

import type {
  Patient,
  PatientCreateRequest,
  PatientUpdateRequest,
} from '@/types/patient.types'
import type {
  Appointment,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
} from '@/types/appointment.types'
import type { PaginatedResponse } from '@/types/common.types'

// ============================================================================
// Patients
// ============================================================================

/**
 * Fetch all patients (paginated)
 */
export function usePatients(page = 1, search = '') {
  return useQuery({
    queryKey: ['patients', page, search],
    queryFn: async () => {
      return api.get<PaginatedResponse<Patient>>('/patients/', {
        params: { page, search },
      })
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Fetch single patient by ID
 */
export function usePatient(id: number | string) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: async () => {
      return api.get<Patient>(`/patients/${id}/`)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Create new patient
 */
export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PatientCreateRequest) => {
      return api.post<Patient>('/patients/', data)
    },
    onSuccess: () => {
      // Invalidate patients list to refetch
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
    onError: (error) => {
      console.error('Create patient error:', getErrorMessage(error))
    },
  })
}

/**
 * Update patient
 */
export function useUpdatePatient(id: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PatientUpdateRequest) => {
      return api.patch<Patient>(`/patients/${id}/`, data)
    },
    onSuccess: (updatedPatient) => {
      // Update cache for single patient
      queryClient.setQueryData(['patients', id], updatedPatient)
      // Invalidate patients list
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
    onError: (error) => {
      console.error('Update patient error:', getErrorMessage(error))
    },
  })
}

/**
 * Delete patient
 */
export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      return api.delete(`/patients/${id}/`)
    },
    onSuccess: () => {
      // Invalidate patients list
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
    onError: (error) => {
      console.error('Delete patient error:', getErrorMessage(error))
    },
  })
}

// ============================================================================
// Appointments
// ============================================================================

/**
 * Fetch all appointments (paginated)
 */
export function useAppointments(page = 1, filters?: {
  patient_id?: number
  doctor_id?: number
  status?: string
  date?: string
}) {
  return useQuery({
    queryKey: ['appointments', page, filters],
    queryFn: async () => {
      return api.get<PaginatedResponse<Appointment>>('/appointments/', {
        params: { page, ...filters },
      })
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Fetch single appointment by ID
 */
export function useAppointment(id: number | string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: async () => {
      return api.get<Appointment>(`/appointments/${id}/`)
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Create new appointment
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AppointmentCreateRequest) => {
      return api.post<Appointment>('/appointments/', data)
    },
    onSuccess: () => {
      // Invalidate appointments list
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error) => {
      console.error('Create appointment error:', getErrorMessage(error))
    },
  })
}

/**
 * Update appointment
 */
export function useUpdateAppointment(id: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AppointmentUpdateRequest) => {
      return api.patch<Appointment>(`/appointments/${id}/`, data)
    },
    onSuccess: (updatedAppointment) => {
      // Update cache for single appointment
      queryClient.setQueryData(['appointments', id], updatedAppointment)
      // Invalidate appointments list
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error) => {
      console.error('Update appointment error:', getErrorMessage(error))
    },
  })
}

/**
 * Cancel appointment
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      return api.patch<Appointment>(`/appointments/${id}/`, {
        status: 'CANCELLED',
      })
    },
    onSuccess: () => {
      // Invalidate appointments list
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error) => {
      console.error('Cancel appointment error:', getErrorMessage(error))
    },
  })
}

// ============================================================================
// Example: How to use these hooks in a component
// ============================================================================

/*
'use client'

import { usePatients, useCreatePatient } from '@/hooks/use-api'

export function PatientsPage() {
  const { data, isLoading, error } = usePatients(1)
  const createPatient = useCreatePatient()

  const handleCreate = () => {
    createPatient.mutate({
      full_name: 'John Doe',
      email: 'john@example.com',
      // ... other fields
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.results.map((patient) => (
        <div key={patient.id}>{patient.full_name}</div>
      ))}
      <button onClick={handleCreate}>Create Patient</button>
    </div>
  )
}
*/
