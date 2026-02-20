/**
 * Hook for switching between locales
 * Updates the NEXT_LOCALE cookie and reloads the page
 */

'use client'

import { useCallback } from 'react'
import { LOCALE_COOKIE_NAME } from '@/i18n/config'

export function useLocaleSwitch() {
  const switchLocale = useCallback((locale: string) => {
    // Set the locale cookie
    const expires = new Date()
    expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000) // 1 year
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale};expires=${expires.toUTCString()};path=/;SameSite=Lax`

    // Reload the page to apply the new locale
    window.location.reload()
  }, [])

  return { switchLocale }
}
