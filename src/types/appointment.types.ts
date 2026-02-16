/**
 * Appointment Types
 * Types for appointment/scheduling management
 */

import type { Patient } from './patient.types'
import type { User } from './auth.types'

// ============================================================================
// Appointment
// ============================================================================

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export interface Appointment {
  id: number
  patient: Patient
  doctor: User
  scheduled_date: string
  scheduled_time: string
  duration_minutes: number
  status: AppointmentStatus
  notes: string
  created_at: string
  updated_at: string
}

export interface AppointmentCreateRequest {
  patient_id: number
  doctor_id: number
  scheduled_date: string
  scheduled_time: string
  duration_minutes: number
  notes?: string
}

export interface AppointmentUpdateRequest extends Partial<AppointmentCreateRequest> {
  status?: AppointmentStatus
}
