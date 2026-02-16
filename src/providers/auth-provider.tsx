/**
 * Authentication Provider
 * Initializes authentication state on app mount and syncs tokens with cookies
 */

'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuthStore } from '@/lib/auth-store'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Helper function to set cookie
 */
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

/**
 * Helper function to delete cookie
 */
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Sync access token with cookies for middleware
  useEffect(() => {
    if (accessToken && isAuthenticated) {
      setCookie('access_token', accessToken, 7)
    } else {
      deleteCookie('access_token')
    }
  }, [accessToken, isAuthenticated])

  return <>{children}</>
}
