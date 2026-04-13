import type { KanbanState } from './kanbanTypes'
import { DEFAULT_KANBAN_STATE } from './defaultKanbanState'

const STORAGE_KEY = 'flow-kanban-board-v1'

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function parseState(raw: unknown): KanbanState | null {
  if (!isRecord(raw)) return null
  const columnOrder = raw.columnOrder
  const columns = raw.columns
  const tasks = raw.tasks
  if (!Array.isArray(columnOrder) || !isRecord(columns) || !isRecord(tasks))
    return null
  if (!columnOrder.every((id) => typeof id === 'string')) return null
  return raw as KanbanState
}

export function loadKanbanState(): KanbanState {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (!s) return structuredClone(DEFAULT_KANBAN_STATE)
    const parsed = parseState(JSON.parse(s))
    return parsed ?? structuredClone(DEFAULT_KANBAN_STATE)
  } catch {
    return structuredClone(DEFAULT_KANBAN_STATE)
  }
}

export function saveKanbanState(state: KanbanState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota */
  }
}

export function resetKanbanStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
