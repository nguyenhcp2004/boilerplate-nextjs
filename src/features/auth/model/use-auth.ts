'use client'

import { useCallback } from 'react'
import { useAuthStore } from '@/entities/user'
import { useRouter } from '@/shared/config/i18n/navigation'
import { ROUTES } from '@/shared/config/routes'

/**
 * useAuth Hook
 * Authentication business logic layer
 * Wraps entity store and adds auth-specific functionality
 */
export function useAuth() {
  const router = useRouter()
  const { user, isAuthenticated, clearSession } = useAuthStore()

  /**
   * Logout user and redirect to login
   */
  const logout = useCallback(() => {
    clearSession()
    localStorage.removeItem('sessionToken')
    router.push(ROUTES.signIn)
  }, [clearSession, router])

  /**
   * Require authentication
   * Redirects to login if not authenticated
   */
  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.signIn)
    }
  }, [isAuthenticated, router])

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string) => {
    return user?.role === role
  }

  /**
   * Check if user is admin
   */
  const isAdmin = () => hasRole('admin')

  return {
    user,
    isAuthenticated,
    logout,
    requireAuth,
    hasRole,
    isAdmin,
  }
}
