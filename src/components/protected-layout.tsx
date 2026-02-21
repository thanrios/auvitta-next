/**
 * Protected Layout Client Component
 * Ensures authenticated routes can't be accessed without token
 */

'use client'

import { useAuthProtection } from '@/hooks'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

/**
  * Layout component that protects its children by checking authentication status.
  *
  * @param {React.ReactNode} children - The child components to be rendered inside the layout.
  * @return {JSX.Element} The protected layout component.
  */
export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isProtected, isLoadingAuth } = useAuthProtection()

  if (isLoadingAuth) {
    return <div className="flex items-center justify-center min-h-screen" />
  }

  if (!isProtected) {
    return null
  }

  return <>{children}</>
}
