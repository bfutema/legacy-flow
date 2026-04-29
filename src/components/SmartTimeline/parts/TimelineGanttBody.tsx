import { useAbility } from '@casl/react'
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { HiChevronLeft, HiChevronRight, HiUserPlus, HiXMark } from 'react-icons/hi2'
import { AbilityContext } from '../../../contexts/AbilityContext'
import {
  GanttAllocEmpty,
  GanttAllocList,
  GanttAllocPopover,
  GanttAllocPopoverHeader,
  GanttAllocSearch,
  GanttAllocUserBtn,
  GanttAllocUserEmail,
  GanttAllocUserName,
  GanttAllocateTriggerBtn,
  GanttDayBgCell,
  GanttLaneHeader,
  GanttLaneHeaderRow,
  GanttLaneMonthNav,
  GanttLaneProjectTitle,
  GanttLaneRange,
  GanttLaneToggleBtn,
  GanttLaneUserAvatar,
  GanttLaneUserCell,
  GanttLaneUserColorPickerWrap,
  GanttLaneUserColorSwatch,
  GanttLaneUserName,
  GanttLaneUserRow,
  GanttLaneUserTextRow,
  GanttMonthBtn,
  GanttMonthLabel,
  GanttProjectLaneCollapsed,
  GanttProjectLaneRow,
  GanttProjectLaneStack,
  GanttProjectTitleRow,
  GanttRemoveCollaboratorBtn,
  GanttStickyHeaderSection,
  GanttHeaderStickyLane,
  GanttGridRowPair,
  GanttScrollArea,
  GanttScrollInner,
  GanttTimeDayCell,
  GanttTimeDowCell,
  GanttTimeWeekCell,
  GanttTodayIndicatorLine,
  GanttTodayIndicatorTrack,
  GanttTrackArea,
  GanttVirtualRowTrack,
  GanttVirtualTimeTrackSticky,
} from '../SmartTimeline.styles'
import { TIMELINE_UI } from '../constants'
import { useVirtualInfiniteTimelineScroll } from '../hooks/useVirtualInfiniteTimelineScroll'
import { collaboratorColorForUserId } from '../../../data/collaboratorColors'
import { computeGanttRangeLabel } from '../../../data/timelineAllocationsTemplate'
import { getDirectoryUsers, getUserById } from '../../../data/directoryUsers'
import type { MockGanttBar, MockGanttProject, MockGanttUser } from '../mockData'
import {
  ALLOCATIONS_GANTT_STORAGE_KEY,
  loadAllocationsGanttProjects,
  saveAllocationsGanttProjects,
} from '../../../persistence/allocationsGanttStorage'
import { GanttBarSegment } from './GanttBarSegment'
import type { TimelineScale } from '../types'
import {
  dateToSerial,
  daysInMonthStartingAt,
  formatMonthColumnLabel,
  formatWeekRangeColumnLabel,
  monthScaleBarPixelRect,
  monthScalePixelOffset,
} from '../utils/daySerial'

const WEEKDAY_PT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const

type Props = {
  scale: TimelineScale
  /** Sobrescreve a largura da coluna da régua (px), ex. testes. */
  dayWidth?: number
  laneOpen: boolean
  onToggleLane: () => void
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

function defaultBarsForNewAllocation(): MockGanttBar[] {
  const t = dateToSerial(new Date())
  return [{ startSerial: t, endSerial: t + 5 }]
}

function popoverCoords(anchor: DOMRect) {
  const m = 8
  const w = Math.min(288, window.innerWidth - 2 * m)
  let left = anchor.left
  left = Math.max(m, Math.min(left, window.innerWidth - w - m))
  const est = 260
  let top = anchor.bottom + m
  if (top + est > window.innerHeight - m) {
    top = Math.max(m, anchor.top - est - m)
  }
  return { top, left, width: w }
}

function CollaboratorAllocPopover({
  anchor,
  excludedIds,
  onPick,
  onClose,
}: {
  anchor: DOMRect
  excludedIds: string[]
  onPick: (userId: string) => void
  onClose: () => void
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [q, setQ] = useState('')
  const [pos, setPos] = useState(() => popoverCoords(anchor))

  const excludedKey = excludedIds.join(',')

  useLayoutEffect(() => {
    setPos(popoverCoords(anchor))
 }, [anchor])

  useEffect(() => {
    const onResize = () => setPos(popoverCoords(anchor))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [anchor])

  useEffect(() => {
    const onScroll = () => onClose()
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    let removeDoc: (() => void) | undefined
    const t = window.setTimeout(() => {
      const onDoc = (ev: MouseEvent) => {
        if (!rootRef.current || rootRef.current.contains(ev.target as Node))
          return
        onClose()
      }
      document.addEventListener('mousedown', onDoc)
      removeDoc = () => document.removeEventListener('mousedown', onDoc)
    }, 0)
    return () => {
      window.clearTimeout(t)
      removeDoc?.()
    }
  }, [onClose])

  const users = useMemo(() => {
    const excluded = new Set(excludedIds)
    const list = getDirectoryUsers().filter((u) => u.status === 'active')
    const qt = q.trim().toLowerCase()
    const filtered = !qt
      ? list
      : list.filter(
          (u) =>
            u.name.toLowerCase().includes(qt) ||
            u.email.toLowerCase().includes(qt),
        )
    return filtered.filter((u) => !excluded.has(u.id))
  }, [q, excludedKey])

  return createPortal(
    <GanttAllocPopover
      ref={rootRef}
      style={{ top: pos.top, left: pos.left, width: pos.width }}
      role="dialog"
      aria-modal="true"
      aria-label="Alocar colaborador ao projeto"
    >
      <GanttAllocPopoverHeader>Alocar colaborador</GanttAllocPopoverHeader>
      <GanttAllocSearch
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar por nome ou e-mail"
        autoFocus aria-label="Buscar usuário da plataforma"
      />
      <GanttAllocList>
        {users.length === 0 ? (
          <GanttAllocEmpty>
            Nenhum usuário ativo disponível ou já alocado neste projeto.
          </GanttAllocEmpty>
        ) : (
          users.map((u) => (
            <GanttAllocUserBtn
              key={u.id}
              type="button"
              onClick={() => onPick(u.id)}
            >
              <GanttAllocUserName>{u.name}</GanttAllocUserName>
              <GanttAllocUserEmail>{u.email}</GanttAllocUserEmail>
            </GanttAllocUserBtn>
          ))
        )}
      </GanttAllocList>
    </GanttAllocPopover>,
    document.body,
  )
}

export function TimelineGanttBody({
  scale,
  dayWidth: dayWidthProp,
  laneOpen,
  onToggleLane,
}: Props) {
  const ability = useAbility(AbilityContext)
  const canAllocate = ability.can('create', 'Timeline')
  const canDeallocate = ability.can('delete', 'Timeline')
  const canUpdateTimeline = ability.can('update', 'Timeline')

  const timelineScrollLayout = useMemo(() => {
    if (scale === 'week') {
      return {
        timelineMode: 'week' as const,
        columnWidth: TIMELINE_UI.weekColumnWidth,
        columnUnitDays: 7,
        initialColumnCount: 28,
      }
    }
    if (scale === 'month') {
      return {
        timelineMode: 'month' as const,
        columnWidth: TIMELINE_UI.monthColumnWidth,
        columnUnitDays: 1,
        initialColumnCount: 18,
      }
    }
    return {
      timelineMode: 'day' as const,
      columnWidth: TIMELINE_UI.dayColumnWidth,
      columnUnitDays: 1,
      initialColumnCount: 100,
    }
  }, [scale])

  const scrollColumnWidth = dayWidthProp ?? timelineScrollLayout.columnWidth

  const [projects, setProjects] = useState<MockGanttProject[]>(
    loadAllocationsGanttProjects,
  )

  const [allocPicker, setAllocPicker] = useState<{
    projectId: string
    anchor: DOMRect
  } | null>(null)

  useEffect(() => {
    if (!canAllocate) setAllocPicker(null)
  }, [canAllocate])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== ALLOCATIONS_GANTT_STORAGE_KEY) return
      setProjects(loadAllocationsGanttProjects())
    }
    const refresh = () => setProjects(loadAllocationsGanttProjects())
    window.addEventListener('storage', onStorage)
    window.addEventListener('flow-user-projects-changed', refresh)
    window.addEventListener('flow-project-meta-changed', refresh)
    window.addEventListener('flow-app-users-changed', refresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('flow-user-projects-changed', refresh)
      window.removeEventListener('flow-project-meta-changed', refresh)
      window.removeEventListener('flow-app-users-changed', refresh)
    }
  }, [])

  const onBarChange = useCallback(
    (
      projectId: string,
      userId: string,
      barIndex: number,
      next: MockGanttBar,
    ) => {
      if (!canUpdateTimeline) return
      setProjects((ps) => {
        const nextProjects = ps.map((p) => {
          if (p.id !== projectId) return p
          const users = p.users.map((u) => {
            if (u.id !== userId) return u
            const bars = u.bars.slice()
            bars[barIndex] = next
            return { ...u, bars }
          })
          return {
            ...p,
            users,
            rangeLabel: computeGanttRangeLabel(users, p.rangeLabel),
          }
        })
        saveAllocationsGanttProjects(nextProjects)
        return nextProjects
      })
    },
    [canUpdateTimeline],
  )

  const onAddBarRange = useCallback(
    (projectId: string, userId: string, startSerial: number, endSerial: number) => {
      if (!canUpdateTimeline) return
      setProjects((ps) => {
        const nextProjects = ps.map((p) => {
          if (p.id !== projectId) return p
          const users = p.users.map((u) => {
            if (u.id !== userId) return u
            const newBar: MockGanttBar = {
              startSerial,
              endSerial,
            }
            return { ...u, bars: [...u.bars, newBar] }
          })
          return {
            ...p,
            users,
            rangeLabel: computeGanttRangeLabel(users, p.rangeLabel),
          }
        })
        saveAllocationsGanttProjects(nextProjects)
        return nextProjects
      })
    },
    [canUpdateTimeline],
  )

  const onUserColorChange = useCallback(
    (projectId: string, userId: string, color: string) => {
      if (!canUpdateTimeline) return
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
    [canUpdateTimeline],
  )

  const onAllocateUser = useCallback((projectId: string, platformUserId: string) => {
    if (!canAllocate) return
    const u = getUserById(platformUserId)
    if (!u || u.status !== 'active') return
    const newUser: MockGanttUser = {
      id: u.id,
      name: u.name,
      color: collaboratorColorForUserId(u.id),
      bars: defaultBarsForNewAllocation(),
    }
    setProjects((ps) => {
      const next = ps.map((p) => {
        if (p.id !== projectId) return p
        if (p.users.some((x) => x.id === platformUserId)) return p
        const users = [...p.users, newUser]
        return {
          ...p,
          users,
          rangeLabel: computeGanttRangeLabel(users, p.rangeLabel),
        }
      })
      saveAllocationsGanttProjects(next)
      return next
    })
  }, [canAllocate])

  const onRemoveCollaborator = useCallback(
    (projectId: string, userId: string) => {
      if (!canDeallocate) return
      setProjects((ps) => {
        const next = ps.map((p) => {
          if (p.id !== projectId) return p
          const users = p.users.filter((u) => u.id !== userId)
          return {
            ...p,
            users,
            rangeLabel: computeGanttRangeLabel(users, p.rangeLabel),
          }
        })
        saveAllocationsGanttProjects(next)
        return next
      })
    },
    [canDeallocate],
  )

  const {
    scrollRef,
    onScroll,
    startSerial,
    columnCount,
    totalWidth,
    columnWidth,
    columnUnitDays,
    pixelsPerDay,
    visibleColIndices,
    visibleStartSerial,
    visibleEndSerial,
    monthNavLabel,
    shiftViewportByDays,
    getDateForColumn,
    getSerialForColumn,
  } = useVirtualInfiniteTimelineScroll({
    timelineMode: timelineScrollLayout.timelineMode,
    columnWidth: scrollColumnWidth,
    columnUnitDays: timelineScrollLayout.columnUnitDays,
    viewResetKey: scale,
    initialColumnCount: timelineScrollLayout.initialColumnCount,
  })

  const isWeekScale = scale === 'week'
  const isMonthScale = scale === 'month'

  /** Metade da lane do header para alinhar com a coluna “Projetos” (só visão dia). */
  const headerHalfH = TIMELINE_UI.headerLaneMinHeight / 2
  const dayRowH = `${headerHalfH}px`
  const dowRowH = `${headerHalfH}px`

  const todaySerial = dateToSerial(new Date())
  const lastSerial =
    isMonthScale && columnCount > 0
      ? getSerialForColumn(columnCount - 1) +
        daysInMonthStartingAt(getSerialForColumn(columnCount - 1)) -
        1
      : startSerial + columnCount * columnUnitDays - 1
  const todayInWindow =
    todaySerial >= startSerial && todaySerial <= lastSerial
  const todayIndicatorCenterX = todayInWindow
    ? Math.round(
        isMonthScale
          ? (monthScalePixelOffset(startSerial, columnWidth, todaySerial) +
              monthScalePixelOffset(
                startSerial,
                columnWidth,
                todaySerial + 1,
              )) /
              2
          : (todaySerial - startSerial) * pixelsPerDay + pixelsPerDay / 2,
      )
    : 0

  const allocExcluded =
    allocPicker &&
    projects.find((p) => p.id === allocPicker.projectId)?.users.map((u) => u.id)

  return (
    <GanttScrollArea
      id="timeline-gantt-scroll"
      ref={scrollRef}
      onScroll={onScroll}
    >
      {allocPicker && allocExcluded ? (
        <CollaboratorAllocPopover
          anchor={allocPicker.anchor}
          excludedIds={allocExcluded}
          onPick={(userId) => {
            onAllocateUser(allocPicker.projectId, userId)
            setAllocPicker(null)
          }}
          onClose={() => setAllocPicker(null)}
        />
      ) : null}
      <GanttScrollInner $minTrackWidth={totalWidth}>
        <GanttStickyHeaderSection>
          <GanttGridRowPair $minTrackWidth={totalWidth}>
            <GanttHeaderStickyLane>
              <GanttLaneHeaderRow $collapsed={!laneOpen}>
                <GanttLaneToggleBtn
                  type="button"
                  onClick={onToggleLane}
                  aria-expanded={laneOpen}
                  aria-controls="timeline-gantt-scroll"
                  aria-label={
                    laneOpen
                      ? 'Recolher painel lateral de projetos e colaboradores'
                      : 'Expandir painel lateral de projetos e colaboradores'
                  }
                  title={laneOpen ? 'Recolher painel' : 'Expandir painel'}
                >
                  {laneOpen ? (
                    <HiChevronLeft strokeWidth={2} aria-hidden />
                  ) : (
                    <HiChevronRight strokeWidth={2} aria-hidden />
                  )}
                </GanttLaneToggleBtn>
                {laneOpen ? <GanttLaneHeader>Projetos</GanttLaneHeader> : null}
              </GanttLaneHeaderRow>
              {laneOpen ? (
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
              ) : null}
            </GanttHeaderStickyLane>
          <GanttVirtualTimeTrackSticky $width={totalWidth}>
            {isWeekScale
              ? visibleColIndices.map((col) => {
                  const weekStart = getSerialForColumn(col)
                  const weekHasToday =
                    todaySerial >= weekStart && todaySerial <= weekStart + 6
                  return (
                    <GanttTimeWeekCell
                      key={`wk-${weekStart}`}
                      $isToday={weekHasToday}
                      style={{
                        position: 'absolute',
                        left: col * columnWidth,
                        top: 0,
                        width: columnWidth,
                        height: TIMELINE_UI.headerLaneMinHeight,
                      }}
                    >
                      {formatWeekRangeColumnLabel(weekStart)}
                    </GanttTimeWeekCell>
                  )
                })
              : isMonthScale
                ? visibleColIndices.map((col) => {
                    const monthStart = getSerialForColumn(col)
                    const dim = daysInMonthStartingAt(monthStart)
                    const monthHasToday =
                      todaySerial >= monthStart &&
                      todaySerial <= monthStart + dim - 1
                    return (
                      <GanttTimeWeekCell
                        key={`mo-${monthStart}`}
                        $isToday={monthHasToday}
                        style={{
                          position: 'absolute',
                          left: col * columnWidth,
                          top: 0,
                          width: columnWidth,
                          height: TIMELINE_UI.headerLaneMinHeight,
                        }}
                      >
                        {formatMonthColumnLabel(monthStart)}
                      </GanttTimeWeekCell>
                    )
                  })
                : visibleColIndices.map((col) => {
                  const d = getDateForColumn(col)
                  const wk = d.getDay() === 0 || d.getDay() === 6
                  const isToday = dateToSerial(d) === todaySerial
                  return (
                    <GanttTimeDayCell
                      key={`n-${startSerial + col * columnUnitDays}`}
                      $weekend={wk}
                      $isToday={isToday}
                      style={{
                        position: 'absolute',
                        left: col * columnWidth,
                        top: 0,
                        width: columnWidth,
                        height: dayRowH,
                      }}
                    >
                      {d.getDate()}
                    </GanttTimeDayCell>
                  )
                })}
            {!isWeekScale && !isMonthScale
              ? visibleColIndices.map((col) => {
                  const d = getDateForColumn(col)
                  const wk = d.getDay() === 0 || d.getDay() === 6
                  const isToday = dateToSerial(d) === todaySerial
                  return (
                    <GanttTimeDowCell
                      key={`w-${startSerial + col * columnUnitDays}`}
                      $weekend={wk}
                      $isToday={isToday}
                      style={{
                        position: 'absolute',
                        left: col * columnWidth,
                        top: dayRowH,
                        width: columnWidth,
                        height: dowRowH,
                      }}
                    >
                      {WEEKDAY_PT[d.getDay()]}
                    </GanttTimeDowCell>
                  )
                })
              : null}
            </GanttVirtualTimeTrackSticky>
          </GanttGridRowPair>
        </GanttStickyHeaderSection>

        {projects.map((project) => (
          <Fragment key={project.id}>
            <GanttGridRowPair $minTrackWidth={totalWidth}>
              <GanttProjectLaneRow>
                {laneOpen ? (
                  <GanttProjectLaneStack>
                    <GanttProjectTitleRow>
                      <GanttLaneProjectTitle>{project.title}</GanttLaneProjectTitle>
                      <GanttAllocateTriggerBtn
                        type="button"
                        disabled={!canAllocate}
                        $open={allocPicker?.projectId === project.id}
                        title={
                          canAllocate
                            ? 'Alocar colaborador'
                            : 'Sem permissão para alocar colaboradores'
                        }
                        aria-label={
                          canAllocate
                            ? `Alocar colaborador em ${project.title}`
                            : `Alocar colaborador em ${project.title} (sem permissão)`
                        }
                        aria-expanded={allocPicker?.projectId === project.id}
                        onClick={(e) => {
                          if (!canAllocate) return
                          const rect = (
                            e.currentTarget as HTMLButtonElement
                          ).getBoundingClientRect()
                          setAllocPicker((prev) =>
                            prev?.projectId === project.id
                              ? null
                              : { projectId: project.id, anchor: rect },
                          )
                        }}
                      >
                        <HiUserPlus size={15} strokeWidth={2} aria-hidden />
                      </GanttAllocateTriggerBtn>
                    </GanttProjectTitleRow>
                    <GanttLaneRange>{project.rangeLabel}</GanttLaneRange>
                  </GanttProjectLaneStack>
                ) : (
                  <GanttProjectLaneCollapsed>
                    <GanttAllocateTriggerBtn
                      type="button"
                      disabled={!canAllocate}
                      $open={allocPicker?.projectId === project.id}
                      title={
                        canAllocate
                          ? `Alocar colaborador em ${project.title}`
                          : 'Sem permissão para alocar colaboradores'
                      }
                      aria-label={
                        canAllocate
                          ? `Alocar colaborador em ${project.title}`
                          : `Alocar colaborador em ${project.title} (sem permissão)`
                      }
                      aria-expanded={allocPicker?.projectId === project.id}
                      onClick={(e) => {
                        if (!canAllocate) return
                        const rect = (
                          e.currentTarget as HTMLButtonElement
                        ).getBoundingClientRect()
                        setAllocPicker((prev) =>
                          prev?.projectId === project.id
                            ? null
                            : { projectId: project.id, anchor: rect },
                        )
                      }}
                    >
                      <HiUserPlus size={15} strokeWidth={2} aria-hidden />
                    </GanttAllocateTriggerBtn>
                  </GanttProjectLaneCollapsed>
                )}
              </GanttProjectLaneRow>
              <GanttTrackArea $minWidth={totalWidth}>
                <GanttVirtualRowTrack
                  $width={totalWidth}
                  $height={TIMELINE_UI.projectRowHeight}
                >
                  {visibleColIndices.map((col) => {
                    const d = getDateForColumn(col)
                    const wk =
                      scale === 'day' && (d.getDay() === 0 || d.getDay() === 6)
                    return (
                      <GanttDayBgCell
                        key={`pg-${project.id}-${getSerialForColumn(col)}`}
                        $weekend={wk}
                        $interactive={false}
                        style={{
                          position: 'absolute',
                          left: col * columnWidth,
                          top: 0,
                          width: columnWidth,
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
                <GanttLaneUserRow $laneCollapsed={!laneOpen}>
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
                        {canUpdateTimeline ? (
                          <input
                            type="color"
                            value={toInputColorValue(user.color)}
                            onChange={(e) =>
                              onUserColorChange(project.id, user.id, e.target.value)
                            }
                            aria-label="Escolher cor da alocação"
                            title="Cor da alocação na timeline"
                          />
                        ) : null}
                      </GanttLaneUserColorPickerWrap>
                    </GanttLaneUserTextRow>
                  </GanttLaneUserCell>
                  {canDeallocate ? (
                    <GanttRemoveCollaboratorBtn
                      type="button"
                      title="Remover colaborador deste projeto"
                      aria-label={`Remover ${user.name} deste projeto`}
                      onClick={() => onRemoveCollaborator(project.id, user.id)}
                    >
                      <HiXMark size={14} strokeWidth={2} aria-hidden />
                    </GanttRemoveCollaboratorBtn>
                  ) : null}
                </GanttLaneUserRow>
                <GanttTrackArea $minWidth={totalWidth}>
                  <GanttVirtualRowTrack
                    $width={totalWidth}
                    $height={TIMELINE_UI.userRowHeight}
                  >
                    {visibleColIndices.map((col) => {
                      const d = getDateForColumn(col)
                      const wk =
                        scale === 'day' && (d.getDay() === 0 || d.getDay() === 6)
                      const s0 = getSerialForColumn(col)
                      const dim = isMonthScale ? daysInMonthStartingAt(s0) : 0
                      return (
                        <GanttDayBgCell
                          key={`ug-${user.id}-${s0}`}
                          $weekend={wk}
                          $interactive={canUpdateTimeline}
                          style={{
                            position: 'absolute',
                            left: col * columnWidth,
                            top: 0,
                            width: columnWidth,
                            height: '100%',
                          }}
                          title={
                            canUpdateTimeline
                              ? isWeekScale
                                ? 'Adicionar alocação nesta semana (clique)'
                                : isMonthScale
                                  ? 'Adicionar alocação neste mês (clique)'
                                  : 'Adicionar alocação neste dia (clique)'
                              : undefined
                          }
                          onClick={
                            canUpdateTimeline
                              ? () =>
                                  onAddBarRange(
                                    project.id,
                                    user.id,
                                    s0,
                                    isWeekScale
                                      ? s0 + 6
                                      : isMonthScale
                                        ? s0 + dim - 1
                                        : s0,
                                  )
                              : undefined
                          }
                        />
                      )
                    })}
                    {user.bars.map((b, i) =>
                      barIntersectsWindow(b, visibleStartSerial, visibleEndSerial) ? (
                        <GanttBarSegment
                          key={`${user.id}-bar-${i}`}
                          bar={b}
                          timelineStartSerial={startSerial}
                          dayWidth={pixelsPerDay}
                          barLayoutPx={
                            isMonthScale
                              ? monthScaleBarPixelRect(
                                  startSerial,
                                  columnWidth,
                                  b,
                                )
                              : undefined
                          }
                          dragPixelsPerDay={
                            isMonthScale ? pixelsPerDay : undefined
                          }
                          color={user.color}
                          projectId={project.id}
                          userId={user.id}
                          barIndex={i}
                          canEdit={canUpdateTimeline}
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
