import type { User } from '@/types'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => void
  logout: () => void
}