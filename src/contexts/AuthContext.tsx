import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const USER_KEY = 'flow-user'

type AuthContextValue = {
  userEmail: string | null
  login: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem(USER_KEY),
  )

  const login = useCallback((email: string) => {
    localStorage.setItem(USER_KEY, email)
    setUserEmail(email)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY)
    setUserEmail(null)
  }, [])

  const value = useMemo(
    () => ({ userEmail, login, logout }),
    [userEmail, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
