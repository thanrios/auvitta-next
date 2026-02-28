/**
 * Providers Index
 * Combines all application providers
 */

'use client'

import { type ReactNode } from 'react'
import { QueryProvider } from './query-provider'
import { AuthProvider } from './auth-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { LoadingOverlayProvider } from './loading-overlay-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingOverlayProvider>{children}</LoadingOverlayProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
