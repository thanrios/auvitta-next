/**
 * API hooks built on TanStack Query.
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

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PatientCreateRequest) => {
      return api.post<Patient>('/patients/', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
    onError: (error) => {
      console.error('Create patient error:', getErrorMessage(error))
    },
  })
}

export function useUpdatePatient(id: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: PatientUpdateRequest) => {
      return api.patch<Patient>(`/patients/${id}/`, data)
    },
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(['patients', id], updatedPatient)
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
    onError: (error) => {
      console.error('Update patient error:', getErrorMessage(error))
    },
  })
}

export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      return api.delete(`/patients/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
    onError: (error) => {
      console.error('Delete patient error:', getErrorMessage(error))
    },
  })
}

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

export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AppointmentCreateRequest) => {
      return api.post<Appointment>('/appointments/', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error) => {
      console.error('Create appointment error:', getErrorMessage(error))
    },
  })
}

export function useUpdateAppointment(id: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AppointmentUpdateRequest) => {
      return api.patch<Appointment>(`/appointments/${id}/`, data)
    },
    onSuccess: (updatedAppointment) => {
      queryClient.setQueryData(['appointments', id], updatedAppointment)
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error) => {
      console.error('Update appointment error:', getErrorMessage(error))
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      return api.patch<Appointment>(`/appointments/${id}/`, {
        status: 'CANCELLED',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error) => {
      console.error('Cancel appointment error:', getErrorMessage(error))
    },
  })
}

