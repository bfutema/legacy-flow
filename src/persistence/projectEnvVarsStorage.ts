const STORAGE_VERSION = 1 as const

export type ProjectEnvVarEntry = {
  /** Id estável para linhas na UI (React). */
  id: string
  /** Nome da variável (normalmente MAIÚSCULAS). */
  key: string
  value: string
}

export type PersistedProjectEnvVars = {
  v: typeof STORAGE_VERSION
  updatedAt: string
  items: ProjectEnvVarEntry[]
}

export function projectEnvVarsStorageKey(projectId: string): string {
  return `flow-project-env-vars:v${STORAGE_VERSION}:${projectId}`
}

/** Padrão típico de variável de ambiente (após trim). */
const KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/

export function validateEnvKey(raw: string): { ok: true; key: string } | { ok: false; message: string } {
  const t = raw.trim()
  if (!t) return { ok: false, message: 'Informe um nome para a variável.' }
  if (!KEY_PATTERN.test(t)) {
    return {
      ok: false,
      message: 'Use letras, números e underscore; comece com letra ou _ (ex.: API_BASE_URL).',
    }
  }
  return { ok: true, key: t.toUpperCase() }
}

export function loadProjectEnvVars(projectId: string): PersistedProjectEnvVars {
  try {
    const raw = localStorage.getItem(projectEnvVarsStorageKey(projectId))
    if (!raw?.trim()) {
      return { v: STORAGE_VERSION, updatedAt: new Date().toISOString(), items: [] }
    }
    const p = JSON.parse(raw) as Partial<PersistedProjectEnvVars>
    if (p.v !== STORAGE_VERSION || !Array.isArray(p.items)) {
      return { v: STORAGE_VERSION, updatedAt: new Date().toISOString(), items: [] }
    }
    const items: ProjectEnvVarEntry[] = p.items
      .map((row) => {
        if (!row || typeof row !== 'object') return null
        const id = typeof (row as ProjectEnvVarEntry).id === 'string' ? (row as ProjectEnvVarEntry).id : ''
        const key = typeof (row as ProjectEnvVarEntry).key === 'string' ? (row as ProjectEnvVarEntry).key : ''
        const value =
          typeof (row as ProjectEnvVarEntry).value === 'string' ? (row as ProjectEnvVarEntry).value : ''
        if (!id) return null
        return { id, key, value }
      })
      .filter(Boolean) as ProjectEnvVarEntry[]
    return {
      v: STORAGE_VERSION,
      updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : new Date().toISOString(),
      items,
    }
  } catch {
    return { v: STORAGE_VERSION, updatedAt: new Date().toISOString(), items: [] }
  }
}

export function saveProjectEnvVars(projectId: string, payload: PersistedProjectEnvVars): void {
  try {
    localStorage.setItem(projectEnvVarsStorageKey(projectId), JSON.stringify(payload))
    window.dispatchEvent(new CustomEvent('flow-project-env-vars-changed', { detail: { projectId } }))
  } catch (err) {
    console.warn('[projeto] Não foi possível salvar variáveis de ambiente:', err)
  }
}

export function removeProjectEnvVars(projectId: string): void {
  try {
    localStorage.removeItem(projectEnvVarsStorageKey(projectId))
  } catch {
    /* ignore */
  }
}

/** Último valor vence se houver chaves duplicadas (normalizado em maiúsculas). */
export function envVarsToRecord(items: ProjectEnvVarEntry[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const it of items) {
    const k = it.key.trim().toUpperCase()
    if (!k) continue
    out[k] = it.value
  }
  return out
}

/** Payload pronto para um futuro `POST /projects/:id/env` ou provisionamento. */
export function envVarsForBackendSync(projectId: string, items: ProjectEnvVarEntry[]) {
  return {
    projectId,
    updatedAt: new Date().toISOString(),
    variables: envVarsToRecord(items),
  }
}
