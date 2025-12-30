export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface Session {
  token: string
  user: User
}
