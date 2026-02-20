import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NextIntlClientProvider } from 'next-intl'
import ptBRMessages from '@/messages/pt-BR.json'

/**
 * Mock providers for testing components that use React Query
 */
export function TestProviders({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <NextIntlClientProvider locale="pt-BR" messages={ptBRMessages}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
