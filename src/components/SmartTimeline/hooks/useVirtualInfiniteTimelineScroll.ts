import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from 'react'
import { TIMELINE_UI } from '../constants'
import {
  AVG_DAYS_PER_MONTH,
  addCalendarMonthsSerial,
  dateToSerial,
  daysInMonthStartingAt,
  formatMonthYearPt,
  serialToLocalDate,
  startOfIsoWeekSerial,
  startOfMonthSerial,
} from '../utils/daySerial'

type ScrollMetrics = { left: number; vw: number }

const { virtualBufferCols: BUFFER, extendThresholdPx: THRESH } = TIMELINE_UI

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

type WindowState = { startSerial: number; columnCount: number }

export type TimelineScrollMode = 'day' | 'week' | 'month'

export type VirtualTimelineOptions = {
  timelineMode: TimelineScrollMode
  columnWidth: number
  /** 1 (dia / mês na grade) ou 7 (semana). */
  columnUnitDays: number
  viewResetKey: string
  initialStartSerial?: number
  initialColumnCount?: number
}

function getInitialMonthStartSerial(): number {
  const now = new Date()
  return dateToSerial(new Date(now.getFullYear(), now.getMonth(), 1))
}

function defaultInitialStartSerial(mode: TimelineScrollMode): number {
  const monthStart = getInitialMonthStartSerial()
  if (mode === 'week') return startOfIsoWeekSerial(monthStart)
  if (mode === 'month') return startOfMonthSerial(monthStart)
  return monthStart
}

function defaultInitialColumnCount(mode: TimelineScrollMode): number {
  if (mode === 'month') return 18
  if (mode === 'week') return 28
  return 100
}

function extendChunk(mode: TimelineScrollMode): number {
  if (mode === 'month') return TIMELINE_UI.extendChunkMonths
  if (mode === 'week') return TIMELINE_UI.extendChunkWeeks
  return TIMELINE_UI.extendChunkDays
}

function maxColumns(mode: TimelineScrollMode): number {
  if (mode === 'month') return TIMELINE_UI.maxBufferMonths
  if (mode === 'week') return TIMELINE_UI.maxBufferWeeks
  return TIMELINE_UI.maxBufferCols
}

export function useVirtualInfiniteTimelineScroll({
  timelineMode,
  columnWidth,
  columnUnitDays,
  viewResetKey,
  initialStartSerial: initialStartSerialProp,
  initialColumnCount: initialColumnCountProp,
}: VirtualTimelineOptions) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<ScrollMetrics>({ left: 0, vw: 0 })
  const rafRef = useRef<number | null>(null)
  const pendingScrollDeltaRef = useRef(0)
  const prevColumnWidthRef = useRef(columnWidth)
  const extendCooldownRef = useRef(0)
  const prevScrollLeftRef = useRef(0)

  const [win, setWin] = useState<WindowState>(() => {
    const base =
      initialStartSerialProp ?? defaultInitialStartSerial(timelineMode)
    let startSerial0 = base
    if (timelineMode === 'week') startSerial0 = startOfIsoWeekSerial(base)
    else if (timelineMode === 'month') startSerial0 = startOfMonthSerial(base)
    const columnCount0 =
      initialColumnCountProp ?? defaultInitialColumnCount(timelineMode)
    return { startSerial: startSerial0, columnCount: columnCount0 }
  })

  const [tick, setTick] = useState(0)

  const { startSerial, columnCount } = win
  const totalWidth = columnCount * columnWidth
  const pixelsPerDay =
    timelineMode === 'month'
      ? columnWidth / AVG_DAYS_PER_MONTH
      : columnWidth / columnUnitDays

  const getSerialForColumn = useCallback(
    (col: number) => {
      if (timelineMode === 'month') {
        return addCalendarMonthsSerial(startSerial, col)
      }
      return startSerial + col * columnUnitDays
    },
    [timelineMode, startSerial, columnUnitDays],
  )

  const readMetrics = useCallback((el: HTMLDivElement) => {
    metricsRef.current = { left: el.scrollLeft, vw: el.clientWidth }
  }, [])

  const bump = useCallback(() => {
    setTick((t) => t + 1)
  }, [])

  const scheduleBump = useCallback(() => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      bump()
    })
  }, [bump])

  const applyPendingScroll = useCallback(() => {
    const el = scrollRef.current
    const d = pendingScrollDeltaRef.current
    if (el && d !== 0) {
      el.scrollLeft += d
      prevScrollLeftRef.current = el.scrollLeft
      pendingScrollDeltaRef.current = 0
      readMetrics(el)
    }
  }, [readMetrics])

  const CHUNK = extendChunk(timelineMode)
  const MAX_COLS = maxColumns(timelineMode)

  const prependChunk = useCallback(() => {
    if (timelineMode === 'month') {
      setWin((w) => {
        if (w.columnCount >= MAX_COLS) {
          pendingScrollDeltaRef.current += CHUNK * columnWidth
          return {
            startSerial: addCalendarMonthsSerial(w.startSerial, -CHUNK),
            columnCount: MAX_COLS,
          }
        }
        pendingScrollDeltaRef.current += CHUNK * columnWidth
        return {
          startSerial: addCalendarMonthsSerial(w.startSerial, -CHUNK),
          columnCount: w.columnCount + CHUNK,
        }
      })
      return
    }

    const step = CHUNK * columnUnitDays
    setWin((w) => {
      if (w.columnCount >= MAX_COLS) {
        pendingScrollDeltaRef.current += CHUNK * columnWidth
        return { startSerial: w.startSerial - step, columnCount: MAX_COLS }
      }
      pendingScrollDeltaRef.current += CHUNK * columnWidth
      return {
        startSerial: w.startSerial - step,
        columnCount: w.columnCount + CHUNK,
      }
    })
  }, [CHUNK, MAX_COLS, columnUnitDays, columnWidth, timelineMode])

  const appendChunk = useCallback(() => {
    if (timelineMode === 'month') {
      setWin((w) => {
        if (w.columnCount >= MAX_COLS) {
          pendingScrollDeltaRef.current -= CHUNK * columnWidth
          return {
            startSerial: addCalendarMonthsSerial(w.startSerial, CHUNK),
            columnCount: MAX_COLS,
          }
        }
        return {
          startSerial: w.startSerial,
          columnCount: w.columnCount + CHUNK,
        }
      })
      return
    }

    const step = CHUNK * columnUnitDays
    setWin((w) => {
      if (w.columnCount >= MAX_COLS) {
        pendingScrollDeltaRef.current -= CHUNK * columnWidth
        return { startSerial: w.startSerial + step, columnCount: MAX_COLS }
      }
      return {
        startSerial: w.startSerial,
        columnCount: w.columnCount + CHUNK,
      }
    })
  }, [CHUNK, MAX_COLS, columnUnitDays, columnWidth, timelineMode])

  const onScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget
      readMetrics(el)
      scheduleBump()

      const { scrollLeft, clientWidth, scrollWidth } = el

      const hasHorizontalOverflow = scrollWidth > clientWidth + 1
      const prevLeft = prevScrollLeftRef.current
      const horizontalMoved = scrollLeft !== prevLeft
      const delta = scrollLeft - prevLeft
      prevScrollLeftRef.current = scrollLeft

      if (!hasHorizontalOverflow || !horizontalMoved) {
        return
      }

      const now =
        typeof performance !== 'undefined' ? performance.now() : Date.now()
      if (now - extendCooldownRef.current < 40) return

      if (scrollLeft < THRESH && delta < 0) {
        extendCooldownRef.current = now
        prependChunk()
      } else if (
        scrollLeft + clientWidth > scrollWidth - THRESH &&
        delta > 0
      ) {
        extendCooldownRef.current = now
        appendChunk()
      }
    },
    [appendChunk, prependChunk, readMetrics, scheduleBump],
  )

  useLayoutEffect(() => {
    applyPendingScroll()
  }, [applyPendingScroll, startSerial, columnCount])

  useEffect(() => {
    const base =
      initialStartSerialProp ?? defaultInitialStartSerial(timelineMode)
    let startSerial0 = base
    if (timelineMode === 'week') startSerial0 = startOfIsoWeekSerial(base)
    else if (timelineMode === 'month') startSerial0 = startOfMonthSerial(base)
    const columnCount0 =
      initialColumnCountProp ?? defaultInitialColumnCount(timelineMode)
    setWin({ startSerial: startSerial0, columnCount: columnCount0 })
    const el = scrollRef.current
    if (el) {
      el.scrollLeft = 0
      prevScrollLeftRef.current = 0
      readMetrics(el)
    }
    bump()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só ao trocar escala (viewResetKey)
  }, [viewResetKey])

  useLayoutEffect(() => {
    const el = scrollRef.current
    const prev = prevColumnWidthRef.current
    if (el && prev !== columnWidth && prev > 0) {
      el.scrollLeft = (el.scrollLeft * columnWidth) / prev
      prevScrollLeftRef.current = el.scrollLeft
      readMetrics(el)
      bump()
    }
    prevColumnWidthRef.current = columnWidth
  }, [columnWidth, readMetrics, bump])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) {
      readMetrics(el)
      prevScrollLeftRef.current = el.scrollLeft
    }
    bump()
  }, [])

  const { firstCol, lastCol } = useMemo(() => {
    const { left, vw } = metricsRef.current
    if (columnCount <= 0 || columnWidth <= 0) {
      return { firstCol: 0, lastCol: -1 }
    }
    const first = clamp(
      Math.floor(left / columnWidth) - BUFFER,
      0,
      columnCount - 1,
    )
    const last = clamp(
      Math.ceil((left + vw) / columnWidth) + BUFFER,
      0,
      columnCount - 1,
    )
    return { firstCol: first, lastCol: last }
  }, [tick, columnCount, columnWidth])

  const visibleColIndices = useMemo(() => {
    if (lastCol < firstCol) return []
    const out: number[] = []
    for (let i = firstCol; i <= lastCol; i++) out.push(i)
    return out
  }, [firstCol, lastCol])

  const monthNavLabel = useMemo(() => {
    const { left, vw } = metricsRef.current
    const mid = left + vw / 2
    const col = clamp(Math.floor(mid / columnWidth), 0, Math.max(0, columnCount - 1))
    const serial = getSerialForColumn(col)
    return formatMonthYearPt(serialToLocalDate(serial))
  }, [tick, startSerial, columnCount, columnWidth, getSerialForColumn])

  const shiftViewportByDays = useCallback(
    (deltaDays: number) => {
      const el = scrollRef.current
      if (!el) return
      el.scrollLeft += deltaDays * pixelsPerDay
      prevScrollLeftRef.current = el.scrollLeft
      readMetrics(el)
      bump()
    },
    [bump, pixelsPerDay, readMetrics],
  )

  const visibleStartSerial =
    lastCol >= firstCol ? getSerialForColumn(firstCol) : startSerial
  const visibleEndSerial =
    lastCol >= firstCol
      ? timelineMode === 'month'
        ? (() => {
            const lastM = getSerialForColumn(lastCol)
            return lastM + daysInMonthStartingAt(lastM) - 1
          })()
        : getSerialForColumn(lastCol) + (columnUnitDays - 1)
      : startSerial

  return {
    scrollRef,
    onScroll,
    startSerial,
    columnCount,
    totalWidth,
    columnWidth,
    timelineMode,
    columnUnitDays,
    pixelsPerDay,
    firstCol,
    lastCol,
    visibleColIndices,
    visibleStartSerial,
    visibleEndSerial,
    monthNavLabel,
    shiftViewportByDays,
    getSerialForColumn,
    getDateForColumn: (col: number) => serialToLocalDate(getSerialForColumn(col)),
  }
}
