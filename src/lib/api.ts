/**
 * API Client Configuration
 * Axios instance with authentication interceptors
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { getCurrentLocale } from '@/i18n/locale'
import type { ApiError } from '@/types/common.types'

// Get API URL from environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Track if we're currently refreshing a token
let isRefreshing = false
// Queue of failed requests waiting for token refresh
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: Error) => void
}> = []

// Process the queue after token refresh
const processQueue = (error: Error | null = null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token!)
    }
  })
  failedQueue = []
}

// Request interceptor - add JWT token to headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage (only in browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip token refresh logic for authentication endpoints
      // These endpoints are meant to fail with 401 (e.g., wrong password)
      const authEndpoints = ['/auth/token/', '/auth/token/refresh/', '/auth/register/']
      const isAuthEndpoint = authEndpoints.some(endpoint =>
        originalRequest.url?.includes(endpoint)
      )

      if (isAuthEndpoint) {
        // Let the error bubble up to be handled by the calling code
        return Promise.reject(error)
      }

      // Check if this is the refresh endpoint itself
      if (originalRequest.url?.includes('/auth/refresh/')) {
        // Refresh token is invalid, logout user
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      // Get refresh token
      const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refresh_token')
        : null

      if (!refreshToken) {
        // No refresh token, logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/api/v1/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access, refresh } = response.data

        // Save new tokens
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access)
          if (refresh) {
            localStorage.setItem('refresh_token', refresh)
          }
        }

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`
        }

        // Process the queue with new token
        processQueue(null, access)
        isRefreshing = false

        // Retry the original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'), null)
        isRefreshing = false

        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Helper function to handle API errors
export const getErrorMessage = (error: unknown): string => {
  const locale = getCurrentLocale()
  const localizedErrors = {
    'pt-BR': {
      resourceNotFound: 'Recurso não encontrado',
      internalServer: 'Erro interno do servidor',
      requestTimeout: 'Tempo de requisição esgotado',
      network: 'Erro de conexão. Verifique sua internet.',
      unexpected: 'Ocorreu um erro inesperado',
    },
    'en-US': {
      resourceNotFound: 'Resource not found',
      internalServer: 'Internal server error',
      requestTimeout: 'Request timed out',
      network: 'Connection error. Check your internet.',
      unexpected: 'An unexpected error occurred',
    },
  } as const

  const localeErrors = localizedErrors[locale]

  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError

    // Check for detail message
    if (apiError?.detail) {
      return apiError.detail
    }

    // Check for message
    if (apiError?.message) {
      return apiError.message
    }

    // Check for field errors
    if (apiError?.errors) {
      const firstError = Object.values(apiError.errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0]
      }
    }

    // Default error messages
    if (error.response?.status === 404) {
      return localeErrors.resourceNotFound
    }
    if (error.response?.status === 500) {
      return localeErrors.internalServer
    }
    if (error.code === 'ECONNABORTED') {
      return localeErrors.requestTimeout
    }
    if (error.code === 'ERR_NETWORK') {
      return localeErrors.network
    }

    return error.message || localeErrors.unexpected
  }

  if (error instanceof Error) {
    return error.message
  }

  return localeErrors.unexpected
}

export default apiClient
