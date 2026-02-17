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

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  // 1. Inicializa auth uma vez no mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // 2. Só sincroniza o cookie APÓS o initializeAuth() terminar (isLoading = false)
  //    Sem esse guard, quando o login falha o accessToken fica null e o effect
  //    deletava o cookie imediatamente — fazendo o proxy redirecionar para /login
  //    e causando um reload completo que apagava a mensagem de erro.
  useEffect(() => {
    if (isLoading) return

    if (accessToken && isAuthenticated) {
      setCookie('access_token', accessToken, 7)
    } else {
      deleteCookie('access_token')
    }
  }, [accessToken, isAuthenticated, isLoading])

  return <>{children}</>
}