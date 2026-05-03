import type { Monaco } from '@monaco-editor/react'

/** Mesmos IDs usados no explorador de arquivos (`SubprojectFilesExplorer`). */
export const FLOW_DARK_THEME = 'flow-app-dark'
export const FLOW_LIGHT_THEME = 'flow-app-light'

/** Temas Monaco alinhados ao Flow (claro / escuro da aplicação). */
export function defineFlowMonacoThemes(monaco: Monaco): void {
  monaco.editor.defineTheme(FLOW_DARK_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '64748B' },
      { token: 'keyword', foreground: 'A78BFA' },
      { token: 'string', foreground: '34D399' },
      { token: 'number', foreground: '38BDF8' },
      { token: 'type.identifier', foreground: 'F9A8D4' },
      { token: 'identifier', foreground: 'E2E8F0' },
      { token: 'delimiter', foreground: 'CBD5E1' },
    ],
    colors: {
      'editor.background': '#0B1220',
      'editor.foreground': '#E2E8F0',
      'editorLineNumber.foreground': '#64748B',
      'editorLineNumber.activeForeground': '#A78BFA',
      'editorCursor.foreground': '#A78BFA',
      'editor.selectionBackground': '#1E293B',
      'editor.inactiveSelectionBackground': '#172033',
      'editor.lineHighlightBackground': '#0F172A',
      'editorIndentGuide.background1': '#1E293B',
      'editorIndentGuide.activeBackground1': '#475569',
    },
  })

  monaco.editor.defineTheme(FLOW_LIGHT_THEME, {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '64748B' },
      { token: 'keyword', foreground: '7C3AED' },
      { token: 'string', foreground: '059669' },
      { token: 'number', foreground: '0284C7' },
      { token: 'type.identifier', foreground: 'DB2777' },
      { token: 'identifier', foreground: '0F172A' },
      { token: 'delimiter', foreground: '334155' },
    ],
    colors: {
      'editor.background': '#F8FAFC',
      'editor.foreground': '#0F172A',
      'editorLineNumber.foreground': '#94A3B8',
      'editorLineNumber.activeForeground': '#7C3AED',
      'editorCursor.foreground': '#7C3AED',
      'editor.selectionBackground': '#E2E8F0',
      'editor.inactiveSelectionBackground': '#EEF2F7',
      'editor.lineHighlightBackground': '#F1F5F9',
      'editorIndentGuide.background1': '#E2E8F0',
      'editorIndentGuide.activeBackground1': '#CBD5E1',
    },
  })
}

export function flowMonacoThemeForAppMode(mode: 'light' | 'dark'): string {
  return mode === 'light' ? FLOW_LIGHT_THEME : FLOW_DARK_THEME
}
