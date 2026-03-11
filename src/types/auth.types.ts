/**
 * Authentication Types
 * Types for authentication and user management
 */

// ============================================================================
// User
// ============================================================================

export interface User {
  username: string
  person: {
    full_name: string
    biological_sex: number
    biological_sex_label: string
  }
  contacts: {
    documents: {
      document_type: number
      document_type_label: string
      document_number: string
      is_main: boolean
    }[]
    emails: {
      email: string
      is_primary: boolean
    }[]
    phones: {
      country_code: string
      phone_number: string
      phone_type: number
      phone_type_label: string
      is_whatsapp: boolean
      is_primary: boolean
    }[]
  }
  profiles: {
    id: string
    slug: string
    label: string
    is_primary: boolean
  }[]
}

export type UserRole = User['profiles'][0]['label']

// ============================================================================
// Authentication Requests & Responses
// ============================================================================

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access: string
  refresh: string
}

export interface RefreshTokenRequest {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
  refresh?: string
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
