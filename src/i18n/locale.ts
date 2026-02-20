import {
  DEFAULT_LOCALE,
  isAppLocale,
  LOCALE_COOKIE_NAME,
  type AppLocale,
} from './config'

function parseLocaleFromCookie(rawCookie: string): AppLocale {
  const cookieParts = rawCookie.split(';')

  for (const cookiePart of cookieParts) {
    const [key, value] = cookiePart.trim().split('=')
    if (key === LOCALE_COOKIE_NAME && value && isAppLocale(value)) {
      return value
    }
  }

  return DEFAULT_LOCALE
}

export function getCurrentLocale(): AppLocale {
  if (typeof document === 'undefined') {
    return DEFAULT_LOCALE
  }

  return parseLocaleFromCookie(document.cookie)
}

export function setCurrentLocale(locale: AppLocale): void {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; samesite=lax`
}
