/**
 * Common API Types
 * Shared types and utilities for API communication
 */

// ============================================================================
// API Error
// ============================================================================

export interface ApiError {
  detail?: string
  message?: string
  errors?: Record<string, string[]>
  [key: string]: unknown
}

// ============================================================================
// Pagination
// ============================================================================

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ============================================================================
// API Response
// ============================================================================

export type ApiResponse<T> = {
  data: T
  status: number
  statusText: string
}
