import type { MockGanttProject, MockGanttUser } from '../components/SmartTimeline/mockData'
import { getUserById } from '../data/directoryUsers'
import {
  buildAllocationsGanttTemplate,
  computeGanttRangeLabel,
} from '../data/timelineAllocationsTemplate'

export const ALLOCATIONS_GANTT_STORAGE_KEY = 'flow-allocations-gantt-projects'

const VERSION = 4

type Payload = {
  v: number
  projects: MockGanttProject[]
}

function isBar(x: unknown): x is { startSerial: number; endSerial: number } {
  if (!x || typeof x !== 'object') return false
  const b = x as Record<string, unknown>
  return (
    typeof b.startSerial === 'number' &&
    Number.isFinite(b.startSerial) &&
    typeof b.endSerial === 'number' &&
    Number.isFinite(b.endSerial) &&
    b.startSerial <= b.endSerial
  )
}

function isUser(x: unknown): x is MockGanttUser {
  if (!x || typeof x !== 'object') return false
  const u = x as Record<string, unknown>
  if (typeof u.id !== 'string' || typeof u.name !== 'string') return false
  if (typeof u.color !== 'string') return false
  if (!Array.isArray(u.bars)) return false
  return u.bars.every(isBar)
}

function isProject(x: unknown): x is MockGanttProject {
  if (!x || typeof x !== 'object') return false
  const p = x as Record<string, unknown>
  if (typeof p.id !== 'string' || typeof p.title !== 'string') return false
  if (typeof p.rangeLabel !== 'string') return false
  if (!Array.isArray(p.users)) return false
  return p.users.every(isUser)
}

/**
 * Lista de colaboradores do storage é a fonte da verdade (remoções persistem).
 * Template atualiza título/período base e metadados de seed para ids que ainda existem.
 */
function mergeStoredWithTemplate(
  stored: MockGanttProject[],
  template: MockGanttProject[],
): MockGanttProject[] {
  const storedById = new Map(stored.map((p) => [p.id, p]))

  const withSyncedNames = (users: MockGanttUser[]): MockGanttUser[] =>
    users.map((u) => {
      const d = getUserById(u.id)
      return d ? { ...u, name: d.name } : u
    })

  return template.map((tp) => {
    const sp = storedById.get(tp.id)
    if (!sp) {
      const fresh = structuredClone(tp)
      fresh.users = withSyncedNames(fresh.users)
      return fresh
    }

    const templateById = new Map(tp.users.map((u) => [u.id, u]))

    const mergedUsers = sp.users.map((su) => {
      const tu = templateById.get(su.id)
      if (!tu) {
        return structuredClone(su)
      }
      return {
        ...tu,
        color: su.color,
        bars: su.bars.map((b) => ({
          startSerial: b.startSerial,
          endSerial: b.endSerial,
        })),
      }
    })

    const synced = withSyncedNames(mergedUsers)

    return {
      ...tp,
      users: synced,
      rangeLabel: computeGanttRangeLabel(synced, tp.rangeLabel),
    }
  })
}

function loadPayload(): Payload | null {
  try {
    const raw = localStorage.getItem(ALLOCATIONS_GANTT_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<Payload>
    if (data.v !== VERSION || !Array.isArray(data.projects)) return null
    if (!data.projects.every(isProject)) return null
    return { v: VERSION, projects: data.projects }
  } catch {
    return null
  }
}

export function loadAllocationsGanttProjects(): MockGanttProject[] {
  const template = buildAllocationsGanttTemplate()
  const payload = loadPayload()
  if (!payload) return structuredClone(template)
  return mergeStoredWithTemplate(payload.projects, template)
}

export function saveAllocationsGanttProjects(
  projects: MockGanttProject[],
): void {
  try {
    const payload: Payload = { v: VERSION, projects }
    localStorage.setItem(ALLOCATIONS_GANTT_STORAGE_KEY, JSON.stringify(payload))
  } catch (err) {
    console.warn('[alocações] Não foi possível salvar a timeline:', err)
  }
}
