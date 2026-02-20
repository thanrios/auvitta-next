import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import {
  DEFAULT_LOCALE,
  isAppLocale,
  LOCALE_COOKIE_NAME,
  type AppLocale,
} from './config'

function getLocaleFromAcceptLanguage(acceptLanguage: string | null): AppLocale {
// TODO - Ajustar para quando salvarmos a informação via BD
//   if (!acceptLanguage) {
//     return DEFAULT_LOCALE
//   }

//   const normalized = acceptLanguage.toLowerCase()

//   if (normalized.includes('en')) {
//     return 'en-US'
//   }

  return DEFAULT_LOCALE
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const localeFromCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value
  const locale = localeFromCookie && isAppLocale(localeFromCookie)
    ? localeFromCookie
    : getLocaleFromAcceptLanguage(headerStore.get('accept-language'))

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
