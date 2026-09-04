'use client'

import { useCallback } from 'react'
import { authClient } from '@/entities/user/api/auth-client'
import { useRouter } from '@/shared/config/i18n/navigation'
import { ROUTES } from '@/shared/config/routes'

/**
 * useAuth Hook
 * Session state comes from Better Auth's reactive useSession (nanostores);
 * the session is an HttpOnly cookie owned by the NestJS backend.
 */
export function useAuth() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const isAuthenticated = !!user

  const logout = useCallback(async () => {
    await authClient.signOut()
    router.push(ROUTES.signIn)
  }, [router])

  const requireAuth = useCallback(() => {
    if (!isPending && !isAuthenticated) {
      router.push(ROUTES.signIn)
    }
  }, [isPending, isAuthenticated, router])

  return {
    user,
    session,
    isAuthenticated,
    isPending,
    logout,
    requireAuth,
  }
}
