/**
 * Contratos da SmartTimeline (Gantt). Evoluir junto com o Figma e a API de alocações.
 */

/** Granularidade da régua de tempo (futuro: zoom / snap). */
export type TimelineScale = 'day' | 'week' | 'month'

export type SmartTimelineProps = {
  className?: string
  /** Rótulo acessível da região principal da timeline. */
  'aria-label'?: string
  /** Visão controlada (Dia / Semana / Mês). */
  scale?: TimelineScale
  onScaleChange?: (scale: TimelineScale) => void
}

/** Identificador de faixa horizontal (ex.: usuário, projeto ou grupo). */
export type TimelineLaneId = string

/** Barra Gantt: intervalo sobre uma faixa (futuro: drag, dependências, cor por projeto). */
export type TimelineBar = {
  id: string
  laneId: TimelineLaneId
  /** ISO8601 (data). */
  start: string
  end: string
  label: string
}

/** Modelo de dados da timeline (placeholder até ligar a persistência). */
export type SmartTimelineModel = {
  lanes: Array<{ id: TimelineLaneId; title: string }>
  bars: TimelineBar[]
}
