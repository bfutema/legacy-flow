const storageKey = (projectId: string) => `flow-project-timeline:v1:${projectId}`

export type ProjectTimelineOverlay =
  | { cleared: true }
  | { start: string; end: string }

export function loadProjectTimeline(projectId: string): ProjectTimelineOverlay | null {
  try {
    const raw = localStorage.getItem(storageKey(projectId))
    if (!raw) return null
    const data = JSON.parse(raw) as Record<string, unknown>
    if (data && typeof data === 'object' && data.cleared === true) {
      return { cleared: true }
    }
    if (
      typeof data?.start === 'string' &&
      typeof data?.end === 'string' &&
      data.start &&
      data.end
    ) {
      return { start: data.start, end: data.end }
    }
    return null
  } catch {
    return null
  }
}

export function saveProjectTimelineCleared(projectId: string): void {
  try {
    localStorage.setItem(storageKey(projectId), JSON.stringify({ cleared: true }))
    window.dispatchEvent(new Event('flow-project-meta-changed'))
  } catch (err) {
    console.warn('[projeto] Não foi possível salvar timeline:', err)
  }
}

export function saveProjectTimelineRange(
  projectId: string,
  start: string,
  end: string,
): void {
  try {
    localStorage.setItem(storageKey(projectId), JSON.stringify({ start, end }))
    window.dispatchEvent(new Event('flow-project-meta-changed'))
  } catch (err) {
    console.warn('[projeto] Não foi possível salvar timeline:', err)
  }
}

export function removeProjectTimeline(projectId: string): void {
  try {
    localStorage.removeItem(storageKey(projectId))
  } catch (err) {
    console.warn('[projeto] Não foi possível remover timeline:', err)
  }
}
