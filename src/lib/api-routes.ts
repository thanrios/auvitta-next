/**
 * Centralized API routes.
 *
 * Keep environment-dependent host/base URL in .env and keep endpoint paths here.
 */

const withTrailingSlash = (path: string): string => `${path}/`

export const API_BASE_PATH = '/api/v1'

export const API_ROUTES = {
  auth: {
    token: withTrailingSlash('/auth/token'),
    refresh: withTrailingSlash('/auth/refresh'),
    logout: withTrailingSlash('/auth/logout'),
  },
  users: {
    base: withTrailingSlash('/users'),
    me: withTrailingSlash('/users/me'),
    register: withTrailingSlash('/users/register'),
    forgotPassword: withTrailingSlash('/users/forgot-password'),
    setPassword: withTrailingSlash('/users/set-password'),
    byId: (id: string | number) => withTrailingSlash(`/users/${id}`),
  },
  patients: {
    base: withTrailingSlash('/patients'),
    byId: (id: string | number) => withTrailingSlash(`/patients/${id}`),
  },
  appointments: {
    base: withTrailingSlash('/appointments'),
    byId: (id: string | number) => withTrailingSlash(`/appointments/${id}`),
  },
} as const

export const AUTH_IGNORED_401_ENDPOINTS = [
  API_ROUTES.auth.token,
  API_ROUTES.auth.refresh,
  API_ROUTES.users.register,
] as const
