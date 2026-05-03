const STORAGE_KEY = 'flow-json-viewer:document:v1'

export function loadJsonViewerDocument(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw == null || raw.trim() === '') return null
    try {
      const p = JSON.parse(raw)
      return JSON.stringify(p, null, 2)
    } catch {
      return raw
    }
  } catch {
    return null
  }
}

export function saveJsonViewerDocument(text: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, text)
  } catch {
    /* ignore */
  }
}
