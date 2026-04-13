import { useSmartTimelineScale } from '../hooks/useSmartTimelineScale'
import { Root } from '../SmartTimeline.styles'
import type { SmartTimelineProps } from '../types'
import { TimelineGanttBody } from './TimelineGanttBody'

type Props = SmartTimelineProps

/**
 * Shell da timeline: apenas o corpo Gantt (cabeçalho da página e filtros ficam na rota).
 */
export function TimelineShell({
  className,
  'aria-label': ariaLabel,
  scale: scaleProp,
  onScaleChange,
}: Props) {
  const { scale } = useSmartTimelineScale(scaleProp, onScaleChange)

  return (
    <Root
      className={className}
      role="region"
      aria-label={ariaLabel ?? 'Timeline Gantt de alocações'}
    >
      <TimelineGanttBody scale={scale} />
    </Root>
  )
}
