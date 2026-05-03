const STORAGE_KEY = 'flow-json-viewer:left-width-px:v1'

/** Largura inicial da coluna do editor (px). */
export const JSON_VIEWER_DEFAULT_EDITOR_WIDTH = 440

const MIN_EDITOR = 280
const MIN_GRAPH = 260
const HANDLE = 6

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

export function loadJsonViewerEditorWidth(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const n = raw == null ? NaN : parseInt(raw, 10)
    if (!Number.isFinite(n)) return JSON_VIEWER_DEFAULT_EDITOR_WIDTH
    return clamp(n, MIN_EDITOR, 4000)
  } catch {
    return JSON_VIEWER_DEFAULT_EDITOR_WIDTH
  }
}

export function saveJsonViewerEditorWidth(px: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(clamp(Math.round(px), MIN_EDITOR, 4000)))
  } catch {
    /* ignore */
  }
}

/** Ajusta à largura atual do container (janela redimensionada). */
export function clampJsonViewerEditorWidth(
  px: number,
  containerWidth: number,
): number {
  if (!Number.isFinite(containerWidth) || containerWidth <= 0) {
    return clamp(px, MIN_EDITOR, JSON_VIEWER_DEFAULT_EDITOR_WIDTH)
  }
  const maxEditor = Math.max(MIN_EDITOR, containerWidth - MIN_GRAPH - HANDLE)
  return clamp(Math.round(px), MIN_EDITOR, maxEditor)
}
