/**
 * Tipos da timeline de alocações (projetos vêm de `getAllProjects`; colaboradores de `getDirectoryUsers`).
 */
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
