import type { PrimaryDatabaseType } from '../data/databaseEngines'

const STORAGE_KEY = 'flow-user-projects'
const VERSION = 1

/** Mesmo formato que `Project` — evita import circular com `data/projects`. */
export type StoredProjectRow = {
  id: string
  name: string
  description: string
  updatedAt: string
  primaryDatabase: PrimaryDatabaseType
  primaryColor: string
}

type Payload = {
  v: number
  items: StoredProjectRow[]
}

function isProjectShape(x: unknown): x is StoredProjectRow {
  if (!x || typeof x !== 'object') return false
  const p = x as Record<string, unknown>
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.description === 'string' &&
    typeof p.updatedAt === 'string' &&
    (p.primaryDatabase === 'mysql' ||
      p.primaryDatabase === 'postgresql' ||
      p.primaryDatabase === 'mssql') &&
    typeof p.primaryColor === 'string'
  )
}

export function loadUserProjects(): StoredProjectRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as Partial<Payload>
    if (data.v !== VERSION || !Array.isArray(data.items)) return []
    return data.items.filter(isProjectShape)
  } catch {
    return []
  }
}

export function saveUserProjects(items: StoredProjectRow[]): void {
  try {
    const payload: Payload = { v: VERSION, items }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    window.dispatchEvent(new Event('flow-user-projects-changed'))
  } catch (err) {
    console.warn('[projetos] Não foi possível salvar projetos do usuário:', err)
  }
}

export function removeUserProject(id: string): boolean {
  const list = loadUserProjects()
  const next = list.filter((p) => p.id !== id)
  if (next.length === list.length) return false
  saveUserProjects(next)
  return true
}

export function generateUserProjectId(): string {
  return `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export type NewProjectInput = {
  name: string
  description: string
  primaryDatabase: PrimaryDatabaseType
  primaryColor: string
}
