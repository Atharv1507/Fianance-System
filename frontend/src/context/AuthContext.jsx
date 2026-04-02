import { createContext, useContext, useMemo, useState } from 'react'
import { mockUser } from '../mock/data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // TODO: replace with API call
  const [user, setUser] = useState(mockUser)

  const login = () => {
    // TODO: replace with API call
    setUser(mockUser)
  }

  const logout = () => {
    // TODO: replace with API call
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
