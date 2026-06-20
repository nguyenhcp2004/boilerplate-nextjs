import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from '../src/shared/config/i18n/routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: {
      // Shared segments
      ...(await import(`../src/shared/segments/common/${locale}.json`)).default,
      // Feature segments
      ...(await import(`../src/features/home/i18n/${locale}.json`)).default,
      ...(await import(`../src/features/auth/i18n/${locale}.json`)).default
    }
  }
})
