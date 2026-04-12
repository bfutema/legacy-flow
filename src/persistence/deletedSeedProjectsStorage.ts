const STORAGE_KEY = 'flow-deleted-seed-project-ids'
const VERSION = 1

type Payload = {
  v: number
  ids: string[]
}

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((i) => typeof i === 'string')
}

export function loadDeletedSeedProjectIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const data = JSON.parse(raw) as Partial<Payload>
    if (data.v !== VERSION || !isStringArray(data.ids)) return new Set()
    return new Set(data.ids)
  } catch {
    return new Set()
  }
}

export function addDeletedSeedProjectId(id: string): void {
  const next = loadDeletedSeedProjectIds()
  next.add(id)
  try {
    const payload: Payload = { v: VERSION, ids: [...next] }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (err) {
    console.warn('[projetos] Não foi possível salvar exclusão de projeto demo:', err)
  }
}
