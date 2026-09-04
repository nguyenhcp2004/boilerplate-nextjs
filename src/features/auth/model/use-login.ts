'use client'

import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { authClient } from '@/entities/user/api/auth-client'
import { useRouter } from '@/shared/config/i18n/navigation'
import { ROUTES } from '@/shared/config/routes'

/**
 * useLogin Hook
 * Email + password sign-in via the Better Auth client (HttpOnly cookie
 * session on the NestJS backend). Mutation wrapper kept for isPending.
 */

// Better Auth base error codes that need user-facing copy (see
// @better-auth/core error codes). Everything else falls back to loginFailed.
const SIGN_IN_ERROR_KEYS: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'invalidCredentials',
  INVALID_EMAIL: 'invalidCredentials',
  INVALID_PASSWORD: 'invalidCredentials',
  USER_NOT_FOUND: 'invalidCredentials',
  USER_EMAIL_NOT_FOUND: 'invalidCredentials',
  EMAIL_NOT_VERIFIED: 'emailNotVerified',
  TOO_MANY_REQUESTS: 'tooManyAttempts',
}

export function useLogin() {
  const router = useRouter()
  const t = useTranslations('Auth')

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { error } = await authClient.signIn.email(credentials)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success(t('loginSuccess'))
      router.push(ROUTES.homePage)
    },
    onError: (error: unknown) => {
      const code =
        typeof error === 'object' && error && 'code' in error
          ? String((error as { code?: unknown }).code)
          : undefined
      const i18nKey = code ? SIGN_IN_ERROR_KEYS[code] : undefined
      toast.error(t('loginFailed'), {
        description: i18nKey ? t(i18nKey) : t('loginFailed'),
      })
    },
  })
}
