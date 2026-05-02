const VERSION = 1

export const projectSqlScriptsStorageKey = (projectId: string) =>
  `flow-project-sql-scripts:${projectId}`

export type ProjectSqlScript = {
  id: string
  name: string
  description: string
  sql: string
  createdAt: string
  updatedAt: string
}

type Persisted = {
  v: number
  scripts: ProjectSqlScript[]
}

export function loadProjectSqlScripts(projectId: string): ProjectSqlScript[] {
  try {
    const raw = localStorage.getItem(projectSqlScriptsStorageKey(projectId))
    if (!raw) return []
    const data = JSON.parse(raw) as Partial<Persisted>
    if (!data || data.v !== VERSION || !Array.isArray(data.scripts)) return []
    return data.scripts.filter(
      (s) =>
        s &&
        typeof s.id === 'string' &&
        typeof s.name === 'string' &&
        typeof s.description === 'string' &&
        typeof s.sql === 'string',
    )
  } catch {
    return []
  }
}

export function saveProjectSqlScripts(
  projectId: string,
  scripts: ProjectSqlScript[],
): void {
  try {
    const payload: Persisted = { v: VERSION, scripts }
    localStorage.setItem(
      projectSqlScriptsStorageKey(projectId),
      JSON.stringify(payload),
    )
  } catch (err) {
    console.warn('[sql-scripts] Não foi possível salvar:', err)
  }
}

export function removeProjectSqlScripts(projectId: string): void {
  try {
    localStorage.removeItem(projectSqlScriptsStorageKey(projectId))
  } catch (err) {
    console.warn('[sql-scripts] Não foi possível remover:', err)
  }
}

export function newScriptId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `sql-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
