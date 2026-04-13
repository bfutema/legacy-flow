import { TimelineShell } from './parts/TimelineShell'
import type { SmartTimelineProps } from './types'

/**
 * Timeline tipo Gantt para alocação usuário × projeto.
 * Implementação visual e interações: evoluir em parts/, hooks/ e tipos em types.ts.
 */
export function SmartTimeline(props: SmartTimelineProps) {
  return <TimelineShell {...props} />
}
