/**
 * Protected Layout Client Component
 * Ensures authenticated routes can't be accessed without token
 */

'use client'

import { useAuthProtection } from '@/hooks/use-auth-protection'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isProtected, isLoadingAuth } = useAuthProtection()

  // Se ainda está carregando, mostrar nada (evita flash de conteúdo)
  if (isLoadingAuth) {
    return <div className="flex items-center justify-center min-h-screen" />
  }

  // Se não está protegido, não renderizar nada (hook vai redirecionar)
  if (!isProtected) {
    return null
  }

  return <>{children}</>
}
