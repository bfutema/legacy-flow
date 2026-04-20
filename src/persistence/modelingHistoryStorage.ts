export type ModelingHistoryAction =
  | 'table_created'
  | 'table_deleted'
  | 'table_renamed'
  | 'field_created'
  | 'field_deleted'
  | 'field_renamed'
  | 'field_type_changed'

export type ModelingHistoryEntry = {
  id: string
  atIso: string
  action: ModelingHistoryAction
  entityKey: string
  label: string
  details?: string
}

type PersistedModelingHistory = {
  v: number
  entries: ModelingHistoryEntry[]
}

const VERSION = 1
const MAX_ENTRIES = 500

export const modelingHistoryStorageKey = (projectId: string) =>
  `flow-modeling-history:${projectId}`

const MODELING_HISTORY_EVENT = 'flow-modeling-history-changed'

export function emitModelingHistoryChanged(projectId: string): void {
  window.dispatchEvent(
    new CustomEvent(MODELING_HISTORY_EVENT, { detail: { projectId } }),
  )
}

export function getModelingHistoryChangedEventName(): string {
  return MODELING_HISTORY_EVENT
}

export function loadModelingHistory(projectId: string): ModelingHistoryEntry[] {
  try {
    const raw = localStorage.getItem(modelingHistoryStorageKey(projectId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<PersistedModelingHistory>
    if (!parsed || parsed.v !== VERSION || !Array.isArray(parsed.entries)) {
      return []
    }
    return parsed.entries.filter(
      (e) =>
        typeof e?.id === 'string' &&
        typeof e?.atIso === 'string' &&
        typeof e?.action === 'string' &&
        typeof e?.entityKey === 'string' &&
        typeof e?.label === 'string',
    ) as ModelingHistoryEntry[]
  } catch {
    return []
  }
}

export function clearModelingHistory(projectId: string): void {
  try {
    localStorage.removeItem(modelingHistoryStorageKey(projectId))
    emitModelingHistoryChanged(projectId)
  } catch (err) {
    console.warn('[modelagem] Não foi possível limpar o histórico:', err)
  }
}

export function appendModelingHistory(
  projectId: string,
  entry: Omit<ModelingHistoryEntry, 'id' | 'atIso'>,
): void {
  try {
    const prev = loadModelingHistory(projectId)
    const nextEntry: ModelingHistoryEntry = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      atIso: new Date().toISOString(),
      ...entry,
    }
    const next = [nextEntry, ...prev].slice(0, MAX_ENTRIES)
    const payload: PersistedModelingHistory = { v: VERSION, entries: next }
    localStorage.setItem(modelingHistoryStorageKey(projectId), JSON.stringify(payload))
    emitModelingHistoryChanged(projectId)
  } catch (err) {
    console.warn('[modelagem] Não foi possível registrar histórico:', err)
  }
}
