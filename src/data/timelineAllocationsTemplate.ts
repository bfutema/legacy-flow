/**
 * Template da timeline de alocações: mesmos projetos que `getAllProjects()`.
 */
import type { MockGanttBar, MockGanttProject, MockGanttUser } from '../components/SmartTimeline/mockData'
import { dateToSerial, serialToLocalDate } from '../components/SmartTimeline/utils/daySerial'
import { collaboratorColorForUserId } from './collaboratorColors'
import { getUserById } from './directoryUsers'
import { getAllProjects, resolveProjectById, type Project } from './projects'

function sd(year: number, monthIndex: number, day: number): number {
  return dateToSerial(new Date(year, monthIndex, day))
}

function formatRangeLabel(start: Date, end: Date): string {
  const fmt = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${fmt.format(start)} – ${fmt.format(end)}`
}

/** Texto na faixa do projeto na timeline quando não há intervalo para exibir. */
export const TIMELINE_RANGE_NOT_SET = 'Projeto sem prazo definido'

function parseYmdLocal(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim())
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2]) - 1
  const d = Number(m[3])
  const dt = new Date(y, mo, d)
  return Number.isNaN(dt.getTime()) ? null : dt
}

/** Rótulo do período na lane quando não há barras Gantt: datas do projeto ou "Não definido". */
export function projectTimelineRangeLabel(
  project: Pick<Project, 'timelineStartDate' | 'timelineEndDate'>,
): string {
  const s = project.timelineStartDate?.trim()
  const e = project.timelineEndDate?.trim()
  if (!s || !e) return TIMELINE_RANGE_NOT_SET
  const d0 = parseYmdLocal(s)
  const d1 = parseYmdLocal(e)
  if (!d0 || !d1) return TIMELINE_RANGE_NOT_SET
  if (d0.getTime() > d1.getTime()) return TIMELINE_RANGE_NOT_SET
  return formatRangeLabel(d0, d1)
}

/** Barras demo por projeto e membro (equivalente ao antigo Polishop/Devstream, espalhado nos seeds). */
function demoBarsFor(
  projectId: string,
  memberId: string,
  year: number,
  month: number,
): MockGanttBar[] {
  const p = DEMO_BARS[projectId]?.[memberId]
  if (p) {
    return p.map((b) => ({
      startSerial: sd(year, month, b.d0),
      endSerial: sd(year, month, b.d1),
    }))
  }
  const t = sd(year, month, Math.min(15, new Date(year, month + 1, 0).getDate()))
  return [{ startSerial: t - 3, endSerial: t + 5 }]
}

/** Dias do mês (1-based) — ids = usuários demo (`demoUsers` / diretório). */
const DEMO_BARS: Record<string, Record<string, { d0: number; d1: number }[]>> = {
  ecommerce: {
    u2: [{ d0: 3, d1: 19 }],
    u3: [
      { d0: 1, d1: 7 },
      { d0: 11, d1: 15 },
      { d0: 21, d1: 26 },
    ],
  },
  crm: {
    u5: [{ d0: 5, d1: 23 }],
    u1: [
      { d0: 2, d1: 6 },
      { d0: 13, d1: 20 },
    ],
  },
  faturamento: {
    u2: [{ d0: 4, d1: 18 }],
  },
  rh: {
    u6: [{ d0: 6, d1: 22 }],
  },
  logistica: {
    u3: [
      { d0: 3, d1: 10 },
      { d0: 14, d1: 24 },
    ],
  },
  bi: {
    u5: [{ d0: 1, d1: 12 }],
  },
}

/** Colaboradores iniciais por projeto seed (ids de `DEMO_USERS` / cadastro). */
const SEED_USER_IDS_BY_PROJECT: Record<string, string[]> = {
  ecommerce: ['u2', 'u3'],
  crm: ['u5', 'u1'],
  faturamento: ['u2'],
  rh: ['u6'],
  logistica: ['u3'],
  bi: ['u5'],
}

export function computeGanttRangeLabel(users: MockGanttUser[], fallback: string): string {
  if (users.length === 0) return fallback
  let minS = Infinity
  let maxS = -Infinity
  for (const u of users) {
    for (const b of u.bars) {
      minS = Math.min(minS, b.startSerial)
      maxS = Math.max(maxS, b.endSerial)
    }
  }
  if (!Number.isFinite(minS) || !Number.isFinite(maxS)) return fallback
  return formatRangeLabel(serialToLocalDate(minS), serialToLocalDate(maxS))
}

function seedUsersForProject(
  projectId: string,
  year: number,
  month: number,
): MockGanttUser[] {
  const ids = SEED_USER_IDS_BY_PROJECT[projectId]
  if (!ids) return []
  const out: MockGanttUser[] = []
  for (const uid of ids) {
    const u = getUserById(uid)
    if (!u || u.status !== 'active') continue
    out.push({
      id: u.id,
      name: u.name,
      color: collaboratorColorForUserId(u.id),
      bars: demoBarsFor(projectId, uid, year, month),
    })
  }
  return out
}

/**
 * Estado inicial da timeline: um bloco por projeto visível no app,
 * com título/descrição vindos de `resolveProjectById`.
 */
export function buildAllocationsGanttTemplate(
  baseDate = new Date(),
): MockGanttProject[] {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const apps = getAllProjects()

  return apps.map((p) => {
    const view = resolveProjectById(p.id) ?? p
    const users = seedUsersForProject(p.id, year, month)
    const rangeFallback = projectTimelineRangeLabel(view)
    return {
      id: p.id,
      title: view.name,
      rangeLabel: computeGanttRangeLabel(users, rangeFallback),
      users,
    }
  })
}
