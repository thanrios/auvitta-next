/**
 * Authentication Store
 * Zustand store for managing authentication state
 */

import { create } from 'zustand'
import type { User } from '@/types/auth.types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setTokens: (access: string, refresh: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user
    }),

  setTokens: (access, refresh) => {
    // Save tokens to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    }

    set({
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true
    })
  },

  setLoading: (loading) =>
    set({ isLoading: loading }),

  logout: () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    })
  },

  initializeAuth: () => {
    // Load tokens from localStorage
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      const userStr = localStorage.getItem('user')

      if (accessToken && refreshToken) {
        const user = userStr ? JSON.parse(userStr) : null

        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        set({ isLoading: false })
      }
    }
  },
}))

// Helper functions
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token')
  }
  return null
}

export const isAuthenticated = () => {
  return !!getAccessToken()
}
