// ROUTES, API_PATHS, ERROR_CODES, CONFIG,... thường nên là object as const
// Role, Status, Fixed Options,... thường là enum cho dễ đọc, dễ check.

export const ROUTES = {
  homePage: '/',
  signIn: '/login',
  signUp: '/signup',
  user: '/user'
}

export const CALLBACK_URL = 'callbackUrl'
