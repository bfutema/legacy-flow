const storageKey = (projectId: string) => `flow-project-meta:${projectId}`

export type StoredProjectMetadata = {
  name: string
  description: string
  updatedAt: string
}

export function loadProjectMetadata(
  projectId: string,
): StoredProjectMetadata | null {
  try {
    const raw = localStorage.getItem(storageKey(projectId))
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<StoredProjectMetadata>
    if (
      typeof data.name !== 'string' ||
      typeof data.description !== 'string' ||
      typeof data.updatedAt !== 'string'
    ) {
      return null
    }
    return data as StoredProjectMetadata
  } catch {
    return null
  }
}

export function saveProjectMetadata(
  projectId: string,
  payload: StoredProjectMetadata,
): void {
  try {
    localStorage.setItem(storageKey(projectId), JSON.stringify(payload))
    window.dispatchEvent(new Event('flow-project-meta-changed'))
  } catch (err) {
    console.warn('[projeto] Não foi possível salvar metadados:', err)
  }
}

export function removeProjectMetadata(projectId: string): void {
  try {
    localStorage.removeItem(storageKey(projectId))
    window.dispatchEvent(new Event('flow-project-meta-changed'))
  } catch (err) {
    console.warn('[projeto] Não foi possível remover metadados:', err)
  }
}
