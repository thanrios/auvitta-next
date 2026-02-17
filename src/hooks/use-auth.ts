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

export function useAuth() {
  const router = useRouter()
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setTokens,
    logout: logoutStore,
  } = useAuthStore()

  // ── Login ──────────────────────────────────────────────────────────────────

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return api.post<LoginResponse>('/auth/token/', credentials)
    },
    retry: false,
    onSuccess: (data) => {
      setTokens(data.access, data.refresh)
      setUser(data.user)

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      router.push('/dashboard')
    },
    // onError deliberadamente vazio: o erro fica em loginMutation.error
    // e é exposto como loginError abaixo — sem reset automático que fazia
    // o alerta piscar e sumir.
  })

  // ── Register ───────────────────────────────────────────────────────────────

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return api.post<User>('/users/register/', data)
    },
    retry: false,
    onSuccess: () => {
      router.push('/login?registered=true')
    },
    onError: (error) => {
      console.error('Registration error:', getErrorMessage(error))
    },
  })

  // ── Logout ─────────────────────────────────────────────────────────────────

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        return api.post('/auth/logout/', { refresh: refreshToken })
      }
    },
    onSettled: () => {
      logoutStore()
      router.push('/login')
    },
  })

  // ── Password reset ─────────────────────────────────────────────────────────

  const passwordResetMutation = useMutation({
    mutationFn: async (data: PasswordResetRequest) => {
      return api.post('/auth/password-reset/', data)
    },
    onError: (error) => {
      console.error('Password reset error:', getErrorMessage(error))
    },
  })

  // ── Current user query ─────────────────────────────────────────────────────

  const { data: currentUser, refetch: refetchUser } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      return api.get<User>('/users/me/')
    },
    enabled: isAuthenticated && !user,
    staleTime: 5 * 60 * 1000,
  })

  if (currentUser && !user) {
    setUser(currentUser)
  }

  // ── Login wrapper ──────────────────────────────────────────────────────────
  // Não chama reset() antes do mutate: isso limpava o erro imediatamente e
  // causava o efeito de "piscar". O TanStack Query já sobrescreve o estado
  // de erro quando um novo mutate começa (status → 'pending').

  const login = (credentials: LoginRequest) => {
    loginMutation.mutate(credentials)
  }

  // ── Return ─────────────────────────────────────────────────────────────────

  return {
    // State
    user: user || currentUser,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending,

    // Login
    login,
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
    passwordResetError: passwordResetMutation.error
      ? getErrorMessage(passwordResetMutation.error)
      : null,

    // Utilities
    refetchUser,
  }
}