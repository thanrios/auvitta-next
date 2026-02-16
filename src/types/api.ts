/**
 * API Types - Central Export
 *
 * This file re-exports all types for backward compatibility.
 *
 * Prefer importing from specific type files:
 * - auth.types.ts - User and authentication types
 * - patient.types.ts - Patient types
 * - appointment.types.ts - Appointment/scheduling types
 * - common.types.ts - Shared API types (errors, pagination, etc)
 */

// Re-export all types for backward compatibility
export * from './auth.types'
export * from './patient.types'
export * from './appointment.types'
export * from './common.types'

