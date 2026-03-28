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
  persons: {
    lookup: withTrailingSlash('/persons/lookup'),
  },
  patients: {
    base: withTrailingSlash('/patients'),
    byId: (id: string) => withTrailingSlash(`/patients/${id}`),
    phones: (patientId: string) => withTrailingSlash(`/patients/${patientId}/phones`),
    phoneById: (patientId: string, phoneId: string) =>
      withTrailingSlash(`/patients/${patientId}/phones/${phoneId}`),
    addresses: (patientId: string) => withTrailingSlash(`/patients/${patientId}/addresses`),
    addressById: (patientId: string, addressId: string) =>
      withTrailingSlash(`/patients/${patientId}/addresses/${addressId}`),
    documents: (patientId: string) => withTrailingSlash(`/patients/${patientId}/documents`),
    documentById: (patientId: string, documentId: string) =>
      withTrailingSlash(`/patients/${patientId}/documents/${documentId}`),
    emails: (patientId: string) => withTrailingSlash(`/patients/${patientId}/emails`),
    emailById: (patientId: string, emailId: string) =>
      withTrailingSlash(`/patients/${patientId}/emails/${emailId}`),
    guardians: (patientId: string) => withTrailingSlash(`/patients/${patientId}/guardians`),
    linkGuardian: (patientId: string) => withTrailingSlash(`/patients/${patientId}/guardians/link`),
    guardianById: (patientId: string, guardianId: string) =>
      withTrailingSlash(`/patients/${patientId}/guardians/${guardianId}`),
  },
  guardians: {
    base: withTrailingSlash('/guardians'),
    byId: (id: string) => withTrailingSlash(`/guardians/${id}`),
    phones: (guardianId: string) => withTrailingSlash(`/guardians/${guardianId}/phones`),
    phoneById: (guardianId: string, phoneId: string) =>
      withTrailingSlash(`/guardians/${guardianId}/phones/${phoneId}`),
    addresses: (guardianId: string) => withTrailingSlash(`/guardians/${guardianId}/addresses`),
    addressById: (guardianId: string, addressId: string) =>
      withTrailingSlash(`/guardians/${guardianId}/addresses/${addressId}`),
    documents: (guardianId: string) => withTrailingSlash(`/guardians/${guardianId}/documents`),
    documentById: (guardianId: string, documentId: string) =>
      withTrailingSlash(`/guardians/${guardianId}/documents/${documentId}`),
    emails: (guardianId: string) => withTrailingSlash(`/guardians/${guardianId}/emails`),
    emailById: (guardianId: string, emailId: string) =>
      withTrailingSlash(`/guardians/${guardianId}/emails/${emailId}`),
    patients: (guardianId: string) => withTrailingSlash(`/guardians/${guardianId}/patients`),
    linkPatient: (guardianId: string) => withTrailingSlash(`/guardians/${guardianId}/patients/link`),
    patientById: (guardianId: string, patientId: string) =>
      withTrailingSlash(`/guardians/${guardianId}/patients/${patientId}`),
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
