'use client'

import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { authClient } from '@/entities/user/api/auth-client'

/**
 * useLoginSocial Hook
 * OAuth sign-in via the Better Auth client. `authClient.signIn.social`
 * redirects the browser to the provider; the backend then sets the HttpOnly
 * session cookie and sends the user back to `callbackURL`.
 *
 * `callbackURL` must be an absolute URL: the backend emits it verbatim as the
 * final `Location` header, so a relative path would resolve against the API
 * origin instead of this app.
 */
export function useLoginSocial() {
  const t = useTranslations('Auth')

  return useMutation({
    mutationFn: async ({
      provider,
      callbackURL,
    }: {
      provider: 'google'
      callbackURL: string
    }) => {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL,
      })
      if (error) throw error
    },
    onError: () => {
      // Redirect failures land here; OAuth denial surfaces after redirect.
      toast.error(t('loginFailed'), {
        description: t('socialLoginFailed'),
      })
    },
  })
}
