import createMiddleware from 'next-intl/middleware'
import { routing } from '@/shared/config/i18n/routing'

// Next 16 proxy (middleware replacement) - must sit at the same level as app/
export default createMiddleware(routing)

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*']
}
