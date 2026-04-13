/**
 * Dados ilustrativos alinhados ao mês atual para a timeline abrir em um contexto real.
 */
import { dateToSerial } from './utils/daySerial'

export type MockGanttBar = { startSerial: number; endSerial: number }

export type MockGanttUser = {
  id: string
  name: string
  color: string
  bars: MockGanttBar[]
}

export type MockGanttProject = {
  id: string
  title: string
  rangeLabel: string
  users: MockGanttUser[]
}

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

function buildMockTimelineProjects(baseDate = new Date()): MockGanttProject[] {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()

  const polishopStart = new Date(year, month, 2)
  const polishopEnd = new Date(year, month, 28)
  const devstreamStart = new Date(year, month, 5)
  const devstreamEnd = new Date(year, month + 1, 12)

  return [
    {
      id: 'polishop',
      title: 'Polishop',
      rangeLabel: formatRangeLabel(polishopStart, polishopEnd),
      users: [
        {
          id: 'u1',
          name: 'Geovani A.',
          color: '#2dd4bf',
          bars: [{ startSerial: sd(year, month, 3), endSerial: sd(year, month, 19) }],
        },
        {
          id: 'u2',
          name: 'Guilherme F.',
          color: '#60a5fa',
          bars: [
            { startSerial: sd(year, month, 1), endSerial: sd(year, month, 7) },
            { startSerial: sd(year, month, 11), endSerial: sd(year, month, 15) },
            { startSerial: sd(year, month, 21), endSerial: sd(year, month, 26) },
          ],
        },
      ],
    },
    {
      id: 'devstream',
      title: 'Devstream',
      rangeLabel: formatRangeLabel(devstreamStart, devstreamEnd),
      users: [
        {
          id: 'u3',
          name: 'Mikael R.',
          color: '#fb923c',
          bars: [{ startSerial: sd(year, month, 5), endSerial: sd(year, month, 23) }],
        },
        {
          id: 'u4',
          name: 'Ana L.',
          color: '#c084fc',
          bars: [
            { startSerial: sd(year, month, 2), endSerial: sd(year, month, 6) },
            { startSerial: sd(year, month, 13), endSerial: sd(year, month, 20) },
          ],
        },
      ],
    },
  ]
}

/** Cópia editável do mock (ex.: arrastar barras). */
export function cloneMockProjects(): MockGanttProject[] {
  return structuredClone(MOCK_TIMELINE_PROJECTS)
}

export const MOCK_TIMELINE_PROJECTS: MockGanttProject[] = buildMockTimelineProjects()
