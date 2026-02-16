/**
 * Authentication Types
 * Types for authentication and user management
 */

// ============================================================================
// User
// ============================================================================

export interface User {
  id: number
  email: string
  full_name: string
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT'
  is_active: boolean
  created_at: string
  updated_at: string
}

export type UserRole = User['role']

// ============================================================================
// Authentication Requests & Responses
// ============================================================================

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface RefreshTokenRequest {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
  refresh: string
}

export interface LogoutRequest {
  refresh: string
}

export interface RegisterRequest {
  email: string
  password: string
  password_confirm: string
  full_name: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  password: string
  password_confirm: string
}
