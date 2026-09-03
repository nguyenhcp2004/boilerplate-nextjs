'use client'

import { useMutation } from '@tanstack/react-query'
import { authClient } from '@/entities/user/api/auth-client'

/**
 * useUpdateProfile Hook
 * Better Auth update-user; the client's session store refreshes reactively.
 *
 * @example
 * const { mutate, isPending } = useUpdateProfile()
 * mutate({ name: 'John Doe' })
 */
export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: { name?: string; username?: string; bio?: string; image?: string }) =>
      authClient.updateUser({ ...data }),
  })
}

/**
 * useChangePassword Hook
 * Better Auth change-password. Pass revokeOtherSessions to sign out
 * other devices on success.
 *
 * @example
 * const { mutate, isPending } = useChangePassword()
 * mutate({ currentPassword: 'old', newPassword: 'new', revokeOtherSessions: true })
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: {
      currentPassword: string
      newPassword: string
      revokeOtherSessions?: boolean
    }) => authClient.changePassword(data),
  })
}
