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
import { dateToSerial, formatMonthYearPt, serialToLocalDate } from '../utils/daySerial'

type ScrollMetrics = { left: number; vw: number }

const {
  virtualBufferCols: BUFFER,
  extendChunkDays: CHUNK,
  extendThresholdPx: THRESH,
  maxBufferCols: MAX_COLS,
} = TIMELINE_UI

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

type WindowState = { startSerial: number; columnCount: number }

type Options = {
  dayWidth: number
  initialStartSerial?: number
  initialColumnCount?: number
}

function getInitialTimelineStartSerial(): number {
  const now = new Date()
  return dateToSerial(new Date(now.getFullYear(), now.getMonth(), 1))
}

export function useVirtualInfiniteTimelineScroll({
  dayWidth,
  initialStartSerial = getInitialTimelineStartSerial(),
  initialColumnCount = 100,
}: Options) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<ScrollMetrics>({ left: 0, vw: 0 })
  const rafRef = useRef<number | null>(null)
  const pendingScrollDeltaRef = useRef(0)
  const prevDayWidthRef = useRef(dayWidth)
  const extendCooldownRef = useRef(0)
  /** Evita prepend/append ao rolar só na vertical (scrollLeft não muda). */
  const prevScrollLeftRef = useRef(0)

  const [win, setWin] = useState<WindowState>(() => ({
    startSerial: initialStartSerial,
    columnCount: initialColumnCount,
  }))

  const [tick, setTick] = useState(0)

  const { startSerial, columnCount } = win
  const totalWidth = columnCount * dayWidth

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

  const prependChunk = useCallback(() => {
    setWin((w) => {
      if (w.columnCount >= MAX_COLS) {
        pendingScrollDeltaRef.current += CHUNK * dayWidth
        return { startSerial: w.startSerial - CHUNK, columnCount: MAX_COLS }
      }
      pendingScrollDeltaRef.current += CHUNK * dayWidth
      return {
        startSerial: w.startSerial - CHUNK,
        columnCount: w.columnCount + CHUNK,
      }
    })
  }, [dayWidth])

  const appendChunk = useCallback(() => {
    setWin((w) => {
      if (w.columnCount >= MAX_COLS) {
        pendingScrollDeltaRef.current -= CHUNK * dayWidth
        return { startSerial: w.startSerial + CHUNK, columnCount: MAX_COLS }
      }
      return {
        startSerial: w.startSerial,
        columnCount: w.columnCount + CHUNK,
      }
    })
  }, [dayWidth])

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

      // Só estende o lado para onde o usuário está rolando. Do contrário, com
      // scrollLeft inicial 0 (< THRESH), qualquer rolagem para a direita disparava
      // prepend e a timeline “pulava” vários dias.
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
    const el = scrollRef.current
    if (!el) return
    const prev = prevDayWidthRef.current
    if (prev !== dayWidth && prev > 0) {
      el.scrollLeft = (el.scrollLeft * dayWidth) / prev
      prevScrollLeftRef.current = el.scrollLeft
      readMetrics(el)
      bump()
    }
    prevDayWidthRef.current = dayWidth
  }, [dayWidth, readMetrics, bump])

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
    if (columnCount <= 0 || dayWidth <= 0) {
      return { firstCol: 0, lastCol: -1 }
    }
    const first = clamp(
      Math.floor(left / dayWidth) - BUFFER,
      0,
      columnCount - 1,
    )
    const last = clamp(
      Math.ceil((left + vw) / dayWidth) + BUFFER,
      0,
      columnCount - 1,
    )
    return { firstCol: first, lastCol: last }
  }, [tick, columnCount, dayWidth])

  const visibleColIndices = useMemo(() => {
    if (lastCol < firstCol) return []
    const out: number[] = []
    for (let i = firstCol; i <= lastCol; i++) out.push(i)
    return out
  }, [firstCol, lastCol])

  const monthNavLabel = useMemo(() => {
    const { left, vw } = metricsRef.current
    const mid = left + vw / 2
    const col = clamp(Math.floor(mid / dayWidth), 0, Math.max(0, columnCount - 1))
    const serial = startSerial + col
    return formatMonthYearPt(serialToLocalDate(serial))
  }, [tick, startSerial, columnCount, dayWidth])

  const shiftViewportByDays = useCallback(
    (deltaDays: number) => {
      const el = scrollRef.current
      if (!el) return
      el.scrollLeft += deltaDays * dayWidth
      prevScrollLeftRef.current = el.scrollLeft
      readMetrics(el)
      bump()
    },
    [bump, dayWidth, readMetrics],
  )

  return {
    scrollRef,
    onScroll,
    startSerial,
    columnCount,
    totalWidth,
    dayWidth,
    firstCol,
    lastCol,
    visibleColIndices,
    /** Serial inclusivo da primeira coluna virtualizada (buffer). */
    visibleStartSerial:
      lastCol >= firstCol ? startSerial + firstCol : startSerial,
    /** Serial inclusivo da última coluna virtualizada (buffer). */
    visibleEndSerial:
      lastCol >= firstCol ? startSerial + lastCol : startSerial,
    monthNavLabel,
    shiftViewportByDays,
    getSerialForColumn: (col: number) => startSerial + col,
    getDateForColumn: (col: number) => serialToLocalDate(startSerial + col),
  }
}
