/**
 * Authentication Hook
 * Custom hook for authentication operations
 */

'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'
import api from '@/lib/api-client'
import { getErrorMessage } from '@/lib/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  PasswordResetRequest,
  User,
} from '@/types/auth.types'

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, setUser, setTokens, logout: logoutStore } = useAuthStore()

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return api.post<LoginResponse>('/auth/token/', credentials)
    },
    retry: false, // Don't retry login attempts
    onSuccess: (data) => {
      // Save tokens
      setTokens(data.access, data.refresh)

      // Save user
      setUser(data.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Redirect to dashboard
      router.push('/dashboard')
    },
    onError: (error) => {
      console.error('Login error:', getErrorMessage(error))
    },
  })

  /**
   * Register mutation
   */
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return api.post<User>('/users/register/', data)
    },
    retry: false, // Don't retry registration attempts
    onSuccess: () => {
      // Redirect to login after successful registration
      router.push('/login?registered=true')
    },
    onError: (error) => {
      console.error('Registration error:', getErrorMessage(error))
    },
  })

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        return api.post('/auth/logout/', { refresh: refreshToken })
      }
    },
    onSettled: () => {
      // Clear state regardless of success/failure
      logoutStore()
      // Redirect to login
      router.push('/login')
    },
  })

  /**
   * Password reset request mutation
   */
  const passwordResetMutation = useMutation({
    mutationFn: async (data: PasswordResetRequest) => {
      return api.post('/auth/password-reset/', data)
    },
    onError: (error) => {
      console.error('Password reset error:', getErrorMessage(error))
    },
  })

  /**
   * Get current user query
   */
  const { data: currentUser, refetch: refetchUser } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      return api.get<User>('/users/me/')
    },
    enabled: isAuthenticated && !user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update user in store when fetched
  if (currentUser && !user) {
    setUser(currentUser)
  }

  return {
    // State
    user: user || currentUser,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending,

    // Login
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? getErrorMessage(loginMutation.error) : null,

    // Register
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error ? getErrorMessage(registerMutation.error) : null,

    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // Password reset
    requestPasswordReset: passwordResetMutation.mutate,
    requestPasswordResetAsync: passwordResetMutation.mutateAsync,
    isRequestingPasswordReset: passwordResetMutation.isPending,
    passwordResetError: passwordResetMutation.error ? getErrorMessage(passwordResetMutation.error) : null,

    // Utilities
    refetchUser,
  }
}
