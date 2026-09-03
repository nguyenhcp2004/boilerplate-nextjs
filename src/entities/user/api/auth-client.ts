import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { env } from '@/shared/lib/env'

/**
 * Better Auth client bound to the NestJS backend (`/api/auth/*`).
 * Sessions are HttpOnly cookies — the token never reaches JS.
 *
 * Additional user fields mirror the backend's betterAuth({ user: { additionalFields } }).
 * Hand-declared to avoid a cross-repo type dependency; update both sides when
 * fields change.
 */
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_ENDPOINT,
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    inferAdditionalFields({
      user: {
        username: { type: 'string', required: false },
        bio: { type: 'string', required: false },
      },
    }),
  ],
})
