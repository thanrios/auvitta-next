/**
 * Dashboard Types
 * Local types specific to the dashboard page
 */

import type { User } from '@/types/auth.types'
import type { Patient } from '@/types/patient.types'
import type { Appointment } from '@/types/appointment.types'

// ============================================================================
// Dashboard Specific Types
// ============================================================================

export interface DashboardStats {
  total_patients: number
  total_appointments: number
  appointments_today: number
  appointments_this_week: number
  appointments_this_month: number
  active_patients: number
}

export interface RecentActivity {
  id: number
  type: 'appointment' | 'patient' | 'user'
  description: string
  timestamp: string
  user?: User
  patient?: Patient
  appointment?: Appointment
}

export interface DashboardWidget {
  id: string
  title: string
  type: 'stats' | 'chart' | 'list' | 'calendar'
  data: unknown
  position: {
    x: number
    y: number
    width: number
    height: number
  }
}
