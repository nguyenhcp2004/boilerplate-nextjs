import http from '@/shared/lib/http'
import type { User } from '../model/types'

/**
 * User API - Application user routes on the NestJS backend (cookie-authed).
 * Auth flows (sign-in/up/out, password, email) live in the Better Auth
 * client: ./auth-client.ts. This module only covers /api/v1/users/*.
 */
export const userApi = {
  /**
   * Get user by ID
   */
  getById: (id: string) => http.get<User>(`/api/v1/users/${id}`),

  /**
   * Get list of users (paginated)
   */
  list: () => http.get<User[]>('/api/v1/users'),
} as const
