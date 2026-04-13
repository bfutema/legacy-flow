import { useCallback, useState } from 'react'
import type { TimelineScale } from '../types'

export function useSmartTimelineScale(
  scaleProp?: TimelineScale,
  onScaleChange?: (s: TimelineScale) => void,
): { scale: TimelineScale; setScale: (s: TimelineScale) => void } {
  const [internal, setInternal] = useState<TimelineScale>('week')
  const controlled = scaleProp !== undefined
  const scale = controlled ? scaleProp! : internal

  const setScale = useCallback(
    (s: TimelineScale) => {
      if (controlled) onScaleChange?.(s)
      else setInternal(s)
    },
    [controlled, onScaleChange],
  )

  return { scale, setScale }
}
