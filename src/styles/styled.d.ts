import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    mode: 'light' | 'dark'
    bg: string
    surface: string
    surfaceHover: string
    text: string
    textMuted: string
    border: string
    primary: string
    primaryMuted: string
    sidebarBg: string
    sidebarActive: string
    sidebarText: string
    headerBg: string
    overlay: string
    shadow: string
    chartGrid: string
    chartAxis: string
  }
}
