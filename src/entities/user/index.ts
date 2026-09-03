/**
 * User Entity - Public API
 * Exports all user-related functionality
 */

// API layer (data source)
export * from './api'
export { authClient } from './api/auth-client'

// Model layer (business logic)
export * from './model/types'
