import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from '../styles/theme'

const STORAGE_KEY = 'flow-theme'

type ThemeMode = 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeModeContext = createContext<ThemeContextValue | null>(null)

function readStoredMode(): ThemeMode {
  const v = localStorage.getItem(STORAGE_KEY)
  if (v === 'dark' || v === 'light') return v
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches)
    return 'dark'
  return 'light'
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode())

  const toggleTheme = useCallback(() => {
    setMode((m) => {
      const next: ThemeMode = m === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ mode, toggleTheme }),
    [mode, toggleTheme],
  )

  const theme = mode === 'light' ? lightTheme : darkTheme

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) {
    throw new Error('useThemeMode must be used within AppThemeProvider')
  }
  return ctx
}
