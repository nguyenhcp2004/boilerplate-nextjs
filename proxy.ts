import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'
import { routing } from '@/shared/config/i18n/routing'

// Next 16 proxy (middleware replacement) - must sit at the same level as app/

const handleI18nRouting = createMiddleware(routing)

// Locale-aware sign-in route segments, e.g. /vi/login, /en/login
const SIGN_IN_SEGMENT = 'login'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Optimistic session check (cookie existence only — no verification).
  // The Better Auth server (NestJS) validates the cookie on every API call.
  const hasSessionCookie = !!getSessionCookie(request)

  // Signed-in users have no business on the sign-in page
  if (hasSessionCookie && pathname.includes(`/${SIGN_IN_SEGMENT}`)) {
    const locale = pathname.split('/')[1] || routing.defaultLocale
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  return handleI18nRouting(request)
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(vi|en)/:path*']
}
