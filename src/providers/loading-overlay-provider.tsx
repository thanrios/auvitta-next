'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LoadingOverlay } from '@/components/ui/loading-overlay'

interface LoadingOverlayContextValue {
  isLoading: boolean
  showLoading: () => void
  hideLoading: () => void
  withLoading: <T>(promise: Promise<T>) => Promise<T>
}

const LoadingOverlayContext = createContext<LoadingOverlayContextValue | null>(null)

interface LoadingOverlayProviderProps {
  children: ReactNode
}

function buildRouteKey(pathname: string, search: string): string {
  return search ? `${pathname}?${search}` : pathname
}

export function LoadingOverlayProvider({ children }: LoadingOverlayProviderProps) {
  const t = useTranslations('ui.loading')
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [manualLoadingCount, setManualLoadingCount] = useState(0)
  const [isRouteLoading, setIsRouteLoading] = useState(false)

  const pendingRouteUrlRef = useRef<string | null>(null)
  const routeFallbackTimeoutRef = useRef<number | null>(null)
  const routeFinishTimeoutRef = useRef<number | null>(null)

  const clearRouteTimeouts = useCallback(() => {
    if (routeFallbackTimeoutRef.current) {
      window.clearTimeout(routeFallbackTimeoutRef.current)
      routeFallbackTimeoutRef.current = null
    }

    if (routeFinishTimeoutRef.current) {
      window.clearTimeout(routeFinishTimeoutRef.current)
      routeFinishTimeoutRef.current = null
    }
  }, [])

  const showLoading = useCallback(() => {
    setManualLoadingCount((currentCount) => currentCount + 1)
  }, [])

  const hideLoading = useCallback(() => {
    setManualLoadingCount((currentCount) => Math.max(0, currentCount - 1))
  }, [])

  const withLoading = useCallback(
    async <T,>(promise: Promise<T>): Promise<T> => {
      showLoading()
      try {
        return await promise
      } finally {
        hideLoading()
      }
    },
    [hideLoading, showLoading]
  )

  useEffect(() => {
    const currentUrl = buildRouteKey(pathname, searchParams.toString())

    if (pendingRouteUrlRef.current && pendingRouteUrlRef.current === currentUrl) {
      if (routeFallbackTimeoutRef.current) {
        window.clearTimeout(routeFallbackTimeoutRef.current)
        routeFallbackTimeoutRef.current = null
      }

      routeFinishTimeoutRef.current = window.setTimeout(() => {
        setIsRouteLoading(false)
        pendingRouteUrlRef.current = null
        routeFinishTimeoutRef.current = null
      }, 220)
    }
  }, [pathname, searchParams])

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const targetElement = event.target
      if (!(targetElement instanceof Element)) return

      const anchorElement = targetElement.closest('a[href]')
      if (!(anchorElement instanceof HTMLAnchorElement)) return
      if (anchorElement.target === '_blank' || anchorElement.hasAttribute('download')) return

      const href = anchorElement.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return
      }

      const nextUrl = new URL(anchorElement.href)
      const currentUrl = new URL(window.location.href)
      const hasRouteChanged =
        nextUrl.origin !== currentUrl.origin ||
        nextUrl.pathname !== currentUrl.pathname ||
        nextUrl.search !== currentUrl.search

      if (!hasRouteChanged) return

      clearRouteTimeouts()
      pendingRouteUrlRef.current = buildRouteKey(nextUrl.pathname, nextUrl.searchParams.toString())
      setIsRouteLoading(true)

      routeFallbackTimeoutRef.current = window.setTimeout(() => {
        setIsRouteLoading(false)
        pendingRouteUrlRef.current = null
        routeFallbackTimeoutRef.current = null
      }, 6000)
    }

    document.addEventListener('click', handleDocumentClick, true)

    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
      pendingRouteUrlRef.current = null
      clearRouteTimeouts()
    }
  }, [clearRouteTimeouts])

  const isLoading = manualLoadingCount > 0 || isRouteLoading

  const contextValue = useMemo<LoadingOverlayContextValue>(
    () => ({
      isLoading,
      showLoading,
      hideLoading,
      withLoading,
    }),
    [hideLoading, isLoading, showLoading, withLoading]
  )

  return (
    <LoadingOverlayContext.Provider value={contextValue}>
      {children}
      <LoadingOverlay isVisible={isLoading} label={t('label')} />
    </LoadingOverlayContext.Provider>
  )
}

export function useLoadingOverlayContext(): LoadingOverlayContextValue {
  const context = useContext(LoadingOverlayContext)

  if (!context) {
    throw new Error('useLoadingOverlayContext must be used within LoadingOverlayProvider')
  }

  return context
}
