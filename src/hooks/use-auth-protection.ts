/**
 * Hook para proteger rotas que requerem autenticação
 * Redireciona para login se não houver token
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

export function useAuthProtection() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    // Se terminou de carregar e não está autenticado, redirecionar
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Retorna se está protegido (carregou e tem autenticação)
  return {
    isProtected: !isLoading && isAuthenticated,
    isLoadingAuth: isLoading,
  }
}
