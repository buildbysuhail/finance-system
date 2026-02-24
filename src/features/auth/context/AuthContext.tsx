import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthContextType, AuthState } from '@/features/auth/types/auth.types'

const MOCK_USER = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    const stored = localStorage.getItem('auth_user')
    if (stored) {
      return { user: JSON.parse(stored) as typeof MOCK_USER, isAuthenticated: true }
    }
    return initialState
  })

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('auth_user', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }, [state.user])

  const login = (_email: string, _password: string) => {
    setState({ user: MOCK_USER, isAuthenticated: true })
  }

  const logout = () => {
    setState({ user: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
