import { Fragment, useCallback, useEffect, useState } from 'react'
import {
  GanttDayBgCell,
  GanttLaneHeader,
  GanttLaneMonthNav,
  GanttLaneProjectTitle,
  GanttLaneRange,
  GanttLaneUserAvatar,
  GanttLaneUserCell,
  GanttLaneUserColorPickerWrap,
  GanttLaneUserColorSwatch,
  GanttLaneUserName,
  GanttLaneUserRow,
  GanttLaneUserTextRow,
  GanttMonthBtn,
  GanttMonthLabel,
  GanttProjectLaneRow,
  GanttProjectLaneStack,
  GanttHeaderStickyLane,
  GanttGridRowPair,
  GanttScrollArea,
  GanttScrollInner,
  GanttTimeDayCell,
  GanttTimeDowCell,
  GanttTodayIndicatorLine,
  GanttTodayIndicatorTrack,
  GanttTrackArea,
  GanttVirtualRowTrack,
  GanttVirtualTimeTrackSticky,
} from '../SmartTimeline.styles'
import { TIMELINE_UI } from '../constants'
import { useVirtualInfiniteTimelineScroll } from '../hooks/useVirtualInfiniteTimelineScroll'
import type { MockGanttBar, MockGanttProject } from '../mockData'
import {
  ALLOCATIONS_GANTT_STORAGE_KEY,
  loadAllocationsGanttProjects,
  saveAllocationsGanttProjects,
} from '../../../persistence/allocationsGanttStorage'
import { GanttBarSegment } from './GanttBarSegment'
import type { TimelineScale } from '../types'
import { dateToSerial } from '../utils/daySerial'

const WEEKDAY_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const

type Props = {
  scale: TimelineScale
  dayWidth?: number
}

function dayWidthForScale(scale: TimelineScale): number {
  if (scale === 'day') return TIMELINE_UI.dayColumnWidth
  if (scale === 'week') return 20
  return 10
}

function barIntersectsWindow(
  bar: MockGanttBar,
  windowStartSerial: number,
  windowEndSerial: number,
): boolean {
  return bar.endSerial >= windowStartSerial && bar.startSerial <= windowEndSerial
}

/** `<input type="color">` exige `#rrggbb`. */
function toInputColorValue(color: string): string {
  const t = color.trim()
  const m6 = /^#([0-9a-fA-F]{6})$/.exec(t)
  if (m6) return `#${m6[1].toLowerCase()}`
  const m3 = /^#([0-9a-fA-F]{3})$/.exec(t)
  if (m3) {
    const [a, b, c] = m3[1]
    return `#${a}${a}${b}${b}${c}${c}`.toLowerCase()
  }
  return '#808080'
}

export function TimelineGanttBody({ scale, dayWidth: dayWidthProp }: Props) {
  const dayWidth = dayWidthProp ?? dayWidthForScale(scale)
  const [projects, setProjects] = useState<MockGanttProject[]>(
    loadAllocationsGanttProjects,
  )

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== ALLOCATIONS_GANTT_STORAGE_KEY) return
      setProjects(loadAllocationsGanttProjects())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const onBarChange = useCallback(
    (
      projectId: string,
      userId: string,
      barIndex: number,
      next: MockGanttBar,
    ) => {
      setProjects((ps) => {
        const nextProjects = ps.map((p) => {
          if (p.id !== projectId) return p
          return {
            ...p,
            users: p.users.map((u) => {
              if (u.id !== userId) return u
              const bars = u.bars.slice()
              bars[barIndex] = next
              return { ...u, bars }
            }),
          }
        })
        saveAllocationsGanttProjects(nextProjects)
        return nextProjects
      })
    },
    [],
  )

  const onUserColorChange = useCallback(
    (projectId: string, userId: string, color: string) => {
      setProjects((ps) => {
        const nextProjects = ps.map((p) => {
          if (p.id !== projectId) return p
          return {
            ...p,
            users: p.users.map((u) =>
              u.id !== userId ? u : { ...u, color },
            ),
          }
        })
        saveAllocationsGanttProjects(nextProjects)
        return nextProjects
      })
    },
    [],
  )

  const {
    scrollRef,
    onScroll,
    startSerial,
    columnCount,
    totalWidth,
    visibleColIndices,
    visibleStartSerial,
    visibleEndSerial,
    monthNavLabel,
    shiftViewportByDays,
    getDateForColumn,
  } = useVirtualInfiniteTimelineScroll({ dayWidth })

  /** Metade da lane do header para alinhar com a coluna “Projetos” (sem buraco escuro abaixo dos dias da semana). */
  const headerHalfH = TIMELINE_UI.headerLaneMinHeight / 2
  const dayRowH = `${headerHalfH}px`
  const dowRowH = `${headerHalfH}px`

  const todaySerial = dateToSerial(new Date())
  const lastSerial = startSerial + columnCount - 1
  const todayInWindow =
    todaySerial >= startSerial && todaySerial <= lastSerial
  const todayIndicatorCenterX = todayInWindow
    ? Math.round((todaySerial - startSerial) * dayWidth + dayWidth / 2)
    : 0

  return (
    <GanttScrollArea ref={scrollRef} onScroll={onScroll}>
      <GanttScrollInner $minTrackWidth={totalWidth}>
        <GanttGridRowPair $minTrackWidth={totalWidth}>
          <GanttHeaderStickyLane>
            <GanttLaneHeader>Projetos</GanttLaneHeader>
            <GanttLaneMonthNav>
              <GanttMonthBtn
                type="button"
                aria-label="Mês anterior"
                onClick={() => shiftViewportByDays(-30)}
              >
                ‹
              </GanttMonthBtn>
              <GanttMonthLabel>{monthNavLabel}</GanttMonthLabel>
              <GanttMonthBtn
                type="button"
                aria-label="Próximo mês"
                onClick={() => shiftViewportByDays(30)}
              >
                ›
              </GanttMonthBtn>
            </GanttLaneMonthNav>
          </GanttHeaderStickyLane>
          <GanttVirtualTimeTrackSticky $width={totalWidth}>
            {visibleColIndices.map((col) => {
              const d = getDateForColumn(col)
              const wk = d.getDay() === 0 || d.getDay() === 6
              const isToday = dateToSerial(d) === todaySerial
              return (
                <GanttTimeDayCell
                  key={`n-${startSerial + col}`}
                  $weekend={wk}
                  $isToday={isToday}
                  style={{
                    position: 'absolute',
                    left: col * dayWidth,
                    top: 0,
                    width: dayWidth,
                    height: dayRowH,
                  }}
                >
                  {d.getDate()}
                </GanttTimeDayCell>
              )
            })}
            {visibleColIndices.map((col) => {
              const d = getDateForColumn(col)
              const wk = d.getDay() === 0 || d.getDay() === 6
              const isToday = dateToSerial(d) === todaySerial
              return (
                <GanttTimeDowCell
                  key={`w-${startSerial + col}`}
                  $weekend={wk}
                  $isToday={isToday}
                  style={{
                    position: 'absolute',
                    left: col * dayWidth,
                    top: dayRowH,
                    width: dayWidth,
                    height: dowRowH,
                  }}
                >
                  {WEEKDAY_PT[d.getDay()]}
                </GanttTimeDowCell>
              )
            })}
          </GanttVirtualTimeTrackSticky>
        </GanttGridRowPair>

        {projects.map((project) => (
          <Fragment key={project.id}>
            <GanttGridRowPair $minTrackWidth={totalWidth}>
              <GanttProjectLaneRow>
                <GanttProjectLaneStack>
                  <GanttLaneProjectTitle>{project.title}</GanttLaneProjectTitle>
                  <GanttLaneRange>{project.rangeLabel}</GanttLaneRange>
                </GanttProjectLaneStack>
              </GanttProjectLaneRow>
              <GanttTrackArea $minWidth={totalWidth}>
                <GanttVirtualRowTrack
                  $width={totalWidth}
                  $height={TIMELINE_UI.projectRowHeight}
                >
                  {visibleColIndices.map((col) => {
                    const d = getDateForColumn(col)
                    const wk = d.getDay() === 0 || d.getDay() === 6
                    return (
                      <GanttDayBgCell
                        key={`pg-${project.id}-${startSerial + col}`}
                        $weekend={wk}
                        style={{
                          position: 'absolute',
                          left: col * dayWidth,
                          top: 0,
                          width: dayWidth,
                          height: '100%',
                        }}
                      />
                    )
                  })}
                </GanttVirtualRowTrack>
              </GanttTrackArea>
            </GanttGridRowPair>

            {project.users.map((user) => (
              <GanttGridRowPair key={user.id} $minTrackWidth={totalWidth}>
                <GanttLaneUserRow>
                  <GanttLaneUserCell>
                    <GanttLaneUserAvatar $color={user.color} aria-hidden>
                      {user.name
                        .split(/\s+/)
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join('')}
                    </GanttLaneUserAvatar>
                    <GanttLaneUserTextRow>
                      <GanttLaneUserName>{user.name}</GanttLaneUserName>
                      <GanttLaneUserColorPickerWrap>
                        <GanttLaneUserColorSwatch $color={user.color} aria-hidden />
                        <input
                          type="color"
                          value={toInputColorValue(user.color)}
                          onChange={(e) =>
                            onUserColorChange(project.id, user.id, e.target.value)
                          }
                          aria-label="Escolher cor da alocação"
                          title="Cor da alocação na timeline"
                        />
                      </GanttLaneUserColorPickerWrap>
                    </GanttLaneUserTextRow>
                  </GanttLaneUserCell>
                </GanttLaneUserRow>
                <GanttTrackArea $minWidth={totalWidth}>
                  <GanttVirtualRowTrack
                    $width={totalWidth}
                    $height={TIMELINE_UI.userRowHeight}
                  >
                    {visibleColIndices.map((col) => {
                      const d = getDateForColumn(col)
                      const wk = d.getDay() === 0 || d.getDay() === 6
                      return (
                        <GanttDayBgCell
                          key={`ug-${user.id}-${startSerial + col}`}
                          $weekend={wk}
                          style={{
                            position: 'absolute',
                            left: col * dayWidth,
                            top: 0,
                            width: dayWidth,
                            height: '100%',
                          }}
                        />
                      )
                    })}
                    {user.bars.map((b, i) =>
                      barIntersectsWindow(b, visibleStartSerial, visibleEndSerial) ? (
                        <GanttBarSegment
                          key={`${user.id}-bar-${i}`}
                          bar={b}
                          timelineStartSerial={startSerial}
                          dayWidth={dayWidth}
                          color={user.color}
                          projectId={project.id}
                          userId={user.id}
                          barIndex={i}
                          onBarChange={onBarChange}
                        />
                      ) : null,
                    )}
                  </GanttVirtualRowTrack>
                </GanttTrackArea>
              </GanttGridRowPair>
            ))}
        </Fragment>
      ))}
      {todayInWindow ? (
        <GanttTodayIndicatorTrack $trackWidth={totalWidth}>
          <GanttTodayIndicatorLine
            $centerX={todayIndicatorCenterX}
            title="Hoje"
            aria-hidden
          />
        </GanttTodayIndicatorTrack>
      ) : null}
      </GanttScrollInner>
    </GanttScrollArea>
  )
}
