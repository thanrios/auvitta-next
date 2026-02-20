/**
 * Authentication Store
 * Zustand store for managing authentication state
 */

import { create } from 'zustand'
import type { User } from '@/types/auth.types'

// ─── Cookie helpers ──────────────────────────────────────────────────────────
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

// ─── Store ───────────────────────────────────────────────────────────────────

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
  finishLoading: () => void
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // começa true até initializeAuth rodar

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setTokens: (access, refresh) => {
    if (typeof window !== 'undefined') {
      // localStorage (leitura client-side)
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      // cookie (leitura pelo proxy/middleware)
      setCookie('access_token', access)
      setCookie('refresh_token', refresh)
    }

    set({
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
    })
  },

  setLoading: (loading) => set({ isLoading: loading }),

  finishLoading: () => set({ isLoading: false }),

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')

      deleteCookie('access_token')
      deleteCookie('refresh_token')
    }

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('access_token')
      const refreshToken = localStorage.getItem('refresh_token')
      const userStr = localStorage.getItem('user')

      if (accessToken && refreshToken) {
        let user = null

        // Safely parse user data from localStorage
        try {
          user = userStr ? JSON.parse(userStr) : null
        } catch (error) {
          console.error('Failed to parse user data from localStorage:', error)
          // Clear corrupted user data
          localStorage.removeItem('user')
        }

        // Garante que os cookies existem (caso o usuário tenha limpado só os cookies)
        setCookie('access_token', accessToken)
        setCookie('refresh_token', refreshToken)

        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ isLoading: false })
      }
    }
  },
}))

// ─── Helpers standalone ──────────────────────────────────────────────────────

export const getAccessToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

export const getRefreshToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null

export const isAuthenticated = () => !!getAccessToken()