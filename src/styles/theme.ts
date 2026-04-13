import type { DefaultTheme } from 'styled-components'

export const lightTheme: DefaultTheme = {
  mode: 'light',
  bg: '#f1f3f9',
  surface: '#ffffff',
  surfaceHover: '#f8fafc',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  primary: '#4f46e5',
  primaryMuted: 'rgba(79, 70, 229, 0.12)',
  /** Mesma família do header/cards: faixa clara sobre o fundo cinza da área principal. */
  sidebarBg: '#ffffff',
  sidebarActive: 'rgba(79, 70, 229, 0.14)',
  sidebarText: '#0f172a',
  headerBg: 'rgba(255, 255, 255, 0.85)',
  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
  chartGrid: '#e2e8f0',
  chartAxis: '#64748b',
}

export const darkTheme: DefaultTheme = {
  mode: 'dark',
  bg: '#0b1120',
  surface: '#111827',
  surfaceHover: '#1f2937',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  border: '#1e293b',
  primary: '#818cf8',
  primaryMuted: 'rgba(129, 140, 248, 0.15)',
  sidebarBg: '#020617',
  sidebarActive: 'rgba(99, 102, 241, 0.4)',
  sidebarText: '#e2e8f0',
  headerBg: 'rgba(17, 24, 39, 0.85)',
  overlay: 'rgba(0, 0, 0, 0.55)',
  shadow: '0 1px 3px rgba(0, 0, 0, 0.35)',
  chartGrid: '#334155',
  chartAxis: '#94a3b8',
}
