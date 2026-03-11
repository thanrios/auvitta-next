/**
 * User related types
 */

export interface UserListItem {
  uuid: string
  email: string | null
  username?: string | null
  full_name?: string | null
  phone_number?: string | null
  document_number?: string | null
  role?: string | null
  license_number?: string | null
  avatar?: string | null
  mfa_enabled?: boolean
  is_active?: boolean
  created_at?: string | null
  last_login?: string | null
  [key: string]: unknown
}

export type UserListResponse = import('./common.types').PaginatedResponse<UserListItem>
