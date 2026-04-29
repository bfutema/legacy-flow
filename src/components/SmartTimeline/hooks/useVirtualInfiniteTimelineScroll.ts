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
  dateToSerial,
  formatMonthYearPt,
  serialToLocalDate,
  startOfIsoWeekSerial,
} from '../utils/daySerial'

type ScrollMetrics = { left: number; vw: number }

const { virtualBufferCols: BUFFER, extendThresholdPx: THRESH } = TIMELINE_UI

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

type WindowState = { startSerial: number; columnCount: number }

export type VirtualTimelineOptions = {
  /** Largura em px de cada coluna (um dia ou uma semana inteira). */
  columnWidth: number
  /** Dias cobertos por coluna: 1 (dia/mês) ou 7 (semana). */
  columnUnitDays: number
  /** Ao mudar (ex.: escala), reinicia janela e scroll horizontal. */
  viewResetKey: string
  initialStartSerial?: number
  initialColumnCount?: number
}

function getInitialMonthStartSerial(): number {
  const now = new Date()
  return dateToSerial(new Date(now.getFullYear(), now.getMonth(), 1))
}

function defaultInitialStartSerial(columnUnitDays: number): number {
  const monthStart = getInitialMonthStartSerial()
  return columnUnitDays === 7 ? startOfIsoWeekSerial(monthStart) : monthStart
}

function defaultInitialColumnCount(columnUnitDays: number): number {
  if (columnUnitDays === 7) return 28
  return 100
}

function extendChunkColumns(columnUnitDays: number): number {
  return columnUnitDays === 7
    ? TIMELINE_UI.extendChunkWeeks
    : TIMELINE_UI.extendChunkDays
}

function maxTimelineColumns(columnUnitDays: number): number {
  return columnUnitDays === 7
    ? TIMELINE_UI.maxBufferWeeks
    : TIMELINE_UI.maxBufferCols
}

export function useVirtualInfiniteTimelineScroll({
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
      initialStartSerialProp ?? defaultInitialStartSerial(columnUnitDays)
    const startSerial0 =
      columnUnitDays === 7 ? startOfIsoWeekSerial(base) : base
    const columnCount0 =
      initialColumnCountProp ?? defaultInitialColumnCount(columnUnitDays)
    return { startSerial: startSerial0, columnCount: columnCount0 }
  })

  const [tick, setTick] = useState(0)

  const { startSerial, columnCount } = win
  const totalWidth = columnCount * columnWidth
  const pixelsPerDay = columnWidth / columnUnitDays

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

  const CHUNK = extendChunkColumns(columnUnitDays)
  const MAX_COLS = maxTimelineColumns(columnUnitDays)

  const prependChunk = useCallback(() => {
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
  }, [CHUNK, MAX_COLS, columnUnitDays, columnWidth])

  const appendChunk = useCallback(() => {
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
  }, [CHUNK, MAX_COLS, columnUnitDays, columnWidth])

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
      initialStartSerialProp ?? defaultInitialStartSerial(columnUnitDays)
    const startSerial0 =
      columnUnitDays === 7 ? startOfIsoWeekSerial(base) : base
    const columnCount0 =
      initialColumnCountProp ?? defaultInitialColumnCount(columnUnitDays)
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
    const serial = startSerial + col * columnUnitDays
    return formatMonthYearPt(serialToLocalDate(serial))
  }, [tick, startSerial, columnCount, columnWidth, columnUnitDays])

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

  return {
    scrollRef,
    onScroll,
    startSerial,
    columnCount,
    totalWidth,
    columnWidth,
    columnUnitDays,
    pixelsPerDay,
    firstCol,
    lastCol,
    visibleColIndices,
    visibleStartSerial:
      lastCol >= firstCol ? startSerial + firstCol * columnUnitDays : startSerial,
    visibleEndSerial:
      lastCol >= firstCol
        ? startSerial + lastCol * columnUnitDays + (columnUnitDays - 1)
        : startSerial,
    monthNavLabel,
    shiftViewportByDays,
    getSerialForColumn: (col: number) => startSerial + col * columnUnitDays,
    getDateForColumn: (col: number) =>
      serialToLocalDate(startSerial + col * columnUnitDays),
  }
}
