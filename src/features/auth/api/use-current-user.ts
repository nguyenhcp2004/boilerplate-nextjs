'use client'

import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/entities/user/api/auth-client'
import { userApi } from '@/entities/user/api'

/**
 * useCurrentUser Hook
 * Session comes from Better Auth's reactive useSession (cookie-based);
 * no react-query needed — reactive via nanostores.
 */
export function useCurrentUser() {
  return authClient.useSession()
}

/**
 * useUserById Hook
 * Fetches a specific user by ID from the application route
 *
 * @example
 * const { data, isLoading, error } = useUserById('user-123')
 */
export function useUserById(id: string) {
  return useQuery({
    queryKey: ['users', 'detail', id] as const,
    queryFn: () => userApi.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  })
}
