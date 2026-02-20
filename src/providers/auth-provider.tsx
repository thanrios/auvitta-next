/**
 * Authentication Provider
 * Initializes authentication state on app mount and syncs tokens with cookies
 * Monitors for cookie expiration and performs automatic logout
 */

'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
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

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length))
    }
  }
  return null
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const finishLoading = useAuthStore((state) => state.finishLoading)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const logout = useAuthStore((state) => state.logout)
  const accessToken = useAuthStore((state) => state.accessToken)

  // 1. Inicializa auth uma vez no mount
  useEffect(() => {
    initializeAuth()
    // Garante que finalize loading após um tempo máximo de 3 segundos
    const timeout = setTimeout(() => {
      finishLoading()
    }, 3000)
    return () => clearTimeout(timeout)
  }, [initializeAuth, finishLoading])

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

  // 3. Monitora se cookies foram limpos externamente (ex: browser DevTools, limpeza automática)
  //    Se estava autenticado mas o cookie desapareceu, faz logout automático
  useEffect(() => {
    if (isLoading || !isAuthenticated) return

    const interval = setInterval(() => {
      const cookieToken = getCookie('access_token')
      // Se o Zustand acha que está autenticado mas o cookie foi limpo,
      // precisamos fazer logout para sincronizar
      if (!cookieToken && isAuthenticated) {
        logout()
        router.push('/login')
      }
    }, 5000) // Verifica a cada 5 segundos

    return () => clearInterval(interval)
  }, [isLoading, isAuthenticated, logout, router])

  return <>{children}</>
}