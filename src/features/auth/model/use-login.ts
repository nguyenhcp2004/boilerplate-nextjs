'use client'

import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { userApi } from '@/entities/user/api'
import { useAuthStore } from '@/entities/user/model/store'
import type { LoginCredentials } from '@/entities/user/model/types'
import { useRouter } from '@/shared/config/i18n/navigation'
import { ROUTES } from '@/shared/config/routes'
import { toast } from 'sonner'

/**
 * useLogin Hook
 * Mutation hook for user login
 * Handles login flow with success/error handling
 */
export function useLogin() {
  const router = useRouter()
  const t = useTranslations('Auth')
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => userApi.login(credentials),
    onSuccess: (response) => {
      const { token, user, expiresIn } = response.payload
      // Store token and session
      localStorage.setItem('sessionToken', token)
      setSession({
        token,
        user,
        expiresAt: Date.now() + expiresIn * 1000,
      })

      // Show success message
      toast.success(t('loginSuccess'))

      // Redirect to home
      router.push(ROUTES.homePage)
    },
    onError: (error: unknown) => {
      toast.error(t('loginFailed'), {
        description: (error as any)?.payload?.message || t('invalidCredentials'),
      })
    },
  })
}
