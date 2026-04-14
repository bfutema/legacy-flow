import { useCallback, useState } from 'react'
import type { MockGanttBar } from '../mockData'
import { GanttBarFill, GanttBarHandle, GanttBarRoot } from './GanttBarSegment.styles'

type Props = {
  bar: MockGanttBar
  timelineStartSerial: number
  dayWidth: number
  color: string
  projectId: string
  userId: string
  barIndex: number
  /** Quando false, a barra é só leitura (sem arrastar extremidades). */
  canEdit?: boolean
  onBarChange: (
    projectId: string,
    userId: string,
    barIndex: number,
    next: MockGanttBar,
  ) => void
}

export function GanttBarSegment({
  bar,
  timelineStartSerial,
  dayWidth,
  color,
  projectId,
  userId,
  barIndex,
  canEdit = true,
  onBarChange,
}: Props) {
  const [dragging, setDragging] = useState(false)

  const left = (bar.startSerial - timelineStartSerial) * dayWidth + 3
  const width = (bar.endSerial - bar.startSerial + 1) * dayWidth - 6

  const onHandlePointerDown = useCallback(
    (edge: 'start' | 'end') => (e: React.PointerEvent) => {
      if (!canEdit) return
      e.preventDefault()
      e.stopPropagation()
      const el = e.currentTarget
      el.setPointerCapture(e.pointerId)
      const pid = e.pointerId
      const originX = e.clientX
      const initStart = bar.startSerial
      const initEnd = bar.endSerial
      setDragging(true)

      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return
        const dDays = Math.round((ev.clientX - originX) / dayWidth)
        if (edge === 'start') {
          let ns = initStart + dDays
          if (ns > initEnd) ns = initEnd
          onBarChange(projectId, userId, barIndex, {
            startSerial: ns,
            endSerial: initEnd,
          })
        } else {
          let ne = initEnd + dDays
          if (ne < initStart) ne = initStart
          onBarChange(projectId, userId, barIndex, {
            startSerial: initStart,
            endSerial: ne,
          })
        }
      }

      const up = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return
        setDragging(false)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', up)
        try {
          el.releasePointerCapture(pid)
        } catch {
          /* ignore */
        }
      }

      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
    },
    [
      bar.startSerial,
      bar.endSerial,
      dayWidth,
      onBarChange,
      projectId,
      userId,
      barIndex,
      canEdit,
    ],
  )

  return (
    <GanttBarRoot $left={left} $width={width} $dragging={dragging}>
      <GanttBarFill $color={color} $dragging={dragging} />
      {canEdit ? (
        <>
          <GanttBarHandle
            data-edge="start"
            aria-label="Ajustar data de início"
            onPointerDown={onHandlePointerDown('start')}
          />
          <GanttBarHandle
            data-edge="end"
            aria-label="Ajustar data de fim"
            onPointerDown={onHandlePointerDown('end')}
          />
        </>
      ) : null}
    </GanttBarRoot>
  )
}
