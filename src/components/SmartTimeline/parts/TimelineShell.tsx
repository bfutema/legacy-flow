import { useState } from 'react'
import { ADMIN_MOBILE_MEDIA } from '../../../layouts/adminShellTokens'
import { TIMELINE_UI } from '../constants'
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
  const [laneOpen, setLaneOpen] = useState(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia(ADMIN_MOBILE_MEDIA).matches,
  )
  const laneWidthPx = laneOpen
    ? TIMELINE_UI.laneWidth
    : TIMELINE_UI.laneWidthCollapsed

  return (
    <Root
      $laneWidth={laneWidthPx}
      className={className}
      role="region"
      aria-label={ariaLabel ?? 'Timeline Gantt de alocações'}
    >
      <TimelineGanttBody
        scale={scale}
        laneOpen={laneOpen}
        onToggleLane={() => setLaneOpen((v) => !v)}
      />
    </Root>
  )
}
