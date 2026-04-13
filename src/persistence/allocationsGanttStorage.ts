import {
  MOCK_TIMELINE_PROJECTS,
  type MockGanttBar,
  type MockGanttProject,
  type MockGanttUser,
} from '../components/SmartTimeline/mockData'

export const ALLOCATIONS_GANTT_STORAGE_KEY = 'flow-allocations-gantt-projects'

const VERSION = 2

type Payload = {
  v: number
  projects: MockGanttProject[]
}

function isBar(x: unknown): x is MockGanttBar {
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

function sameTopology(
  stored: MockGanttProject[],
  template: MockGanttProject[],
): boolean {
  if (stored.length !== template.length) return false
  for (let i = 0; i < template.length; i++) {
    const a = stored[i]
    const b = template[i]
    if (!a || !b || a.id !== b.id || a.users.length !== b.users.length)
      return false
    for (let j = 0; j < b.users.length; j++) {
      const au = a.users[j]
      const bu = b.users[j]
      if (!au || !bu || au.id !== bu.id || au.bars.length !== bu.bars.length)
        return false
    }
  }
  return true
}

/** Mescla rótulos/cores do mock com intervalos salvos. */
export function mergeGanttProjectsFromStorage(
  stored: MockGanttProject[],
  template: MockGanttProject[],
): MockGanttProject[] {
  if (!sameTopology(stored, template)) {
    return structuredClone(template)
  }
  return template.map((tp, pi) => ({
    ...tp,
    users: tp.users.map((tu, ui) => {
      const su = stored[pi]!.users[ui]!
      return {
        ...tu,
        color: su.color,
        bars: su.bars.map((b) => ({
          startSerial: b.startSerial,
          endSerial: b.endSerial,
        })),
      }
    }),
  }))
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
  const payload = loadPayload()
  if (!payload) return structuredClone(MOCK_TIMELINE_PROJECTS)
  return mergeGanttProjectsFromStorage(
    payload.projects,
    MOCK_TIMELINE_PROJECTS,
  )
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
