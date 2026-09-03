/**
 * User Entity Types
 * Domain models for the User entity
 *
 * Session identity comes from Better Auth — see api/auth-client.ts.
 * These types cover application user records from /api/v1/users/*.
 */

export interface User {
  id: string
  email: string
  name?: string
  username?: string
  bio?: string
  image?: string
  role?: 'user' | 'admin' | 'moderator'
  emailVerified?: boolean
  createdAt: string
  updatedAt: string
}
