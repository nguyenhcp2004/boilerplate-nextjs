import { LoginForm } from '@/features/auth'

/**
 * Login screen - route-level composition
 * Thin wrapper: styling/layout only, all logic lives in features/auth
 */
export function LoginPage() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  )
}
