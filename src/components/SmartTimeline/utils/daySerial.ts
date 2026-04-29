/**
 * Serial de dia no fuso local: dias desde 1970-01-01 (meia-noite local).
 */
const MS_PER_DAY = 86_400_000

const LOCAL_EPOCH = new Date(1970, 0, 1).getTime()

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function dateToSerial(d: Date): number {
  const z = startOfLocalDay(d)
  return Math.round((z.getTime() - LOCAL_EPOCH) / MS_PER_DAY)
}

export function serialToLocalDate(serial: number): Date {
  return new Date(LOCAL_EPOCH + serial * MS_PER_DAY)
}

export function formatMonthYearPt(d: Date): string {
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

/** Segunda-feira local da semana que contém o dia `serial`. */
export function startOfIsoWeekSerial(serial: number): number {
  const d = serialToLocalDate(serial)
  const day = d.getDay()
  const daysFromMonday = day === 0 ? 6 : day - 1
  return serial - daysFromMonday
}

/** Rótulo de coluna semanal estilo "1–7 fev 2021" (pt-BR). */
export function formatWeekRangeColumnLabel(weekStartSerial: number): string {
  const start = serialToLocalDate(weekStartSerial)
  const end = serialToLocalDate(weekStartSerial + 6)
  const shortMonth = (d: Date) =>
    d
      .toLocaleDateString('pt-BR', { month: 'short' })
      .replace(/\./g, '')
      .trim()
  const d1 = start.getDate()
  const d2 = end.getDate()
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${d1}–${d2} ${shortMonth(start)} ${start.getFullYear()}`
  }
  return `${d1} ${shortMonth(start)} – ${d2} ${shortMonth(end)} ${end.getFullYear()}`
}

/** Primeiro dia do mês local que contém `serial`. */
export function startOfMonthSerial(serial: number): number {
  const d = serialToLocalDate(serial)
  return dateToSerial(new Date(d.getFullYear(), d.getMonth(), 1))
}

/** Primeiro dia do mês `deltaMonths` após `monthStartSerial` (que deve ser dia 1). */
export function addCalendarMonthsSerial(
  monthStartSerial: number,
  deltaMonths: number,
): number {
  const d = serialToLocalDate(startOfMonthSerial(monthStartSerial))
  return dateToSerial(new Date(d.getFullYear(), d.getMonth() + deltaMonths, 1))
}

/** Quantidade de dias do mês cujo primeiro dia é `monthStartSerial`. */
export function daysInMonthStartingAt(monthStartSerial: number): number {
  const d = serialToLocalDate(startOfMonthSerial(monthStartSerial))
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

/** Cabeçalho de coluna mensal estilo "fev 2021". */
export function formatMonthColumnLabel(monthStartSerial: number): string {
  const d = serialToLocalDate(startOfMonthSerial(monthStartSerial))
  const mon = d
    .toLocaleDateString('pt-BR', { month: 'short' })
    .replace(/\./g, '')
    .trim()
  return `${mon} ${d.getFullYear()}`
}

/** Média de dias por mês (ajuste fino de scroll). */
export const AVG_DAYS_PER_MONTH = 30.436875

/**
 * Posição em px da borda esquerda do dia `daySerial` na régua mensal:
 * cada mês ocupa `monthColumnWidth` px; densidade = dias do mês.
 */
export function monthScalePixelOffset(
  timelineStartSerial: number,
  monthColumnWidth: number,
  daySerial: number,
): number {
  const anchor = startOfMonthSerial(timelineStartSerial)
  if (daySerial < anchor) {
    const dim = daysInMonthStartingAt(anchor)
    return ((daySerial - anchor) * monthColumnWidth) / dim
  }
  let px = 0
  let monthStart = anchor
  for (let i = 0; i < 2400; i++) {
    const dim = daysInMonthStartingAt(monthStart)
    const monthEnd = monthStart + dim - 1
    if (daySerial <= monthEnd) {
      return px + ((daySerial - monthStart) * monthColumnWidth) / dim
    }
    px += monthColumnWidth
    monthStart = addCalendarMonthsSerial(monthStart, 1)
  }
  const dim = daysInMonthStartingAt(monthStart)
  return px + ((daySerial - monthStart) * monthColumnWidth) / dim
}

export function monthScaleBarPixelRect(
  timelineStartSerial: number,
  monthColumnWidth: number,
  bar: { startSerial: number; endSerial: number },
): { left: number; width: number } {
  const rawLeft = monthScalePixelOffset(
    timelineStartSerial,
    monthColumnWidth,
    bar.startSerial,
  )
  const rawRight = monthScalePixelOffset(
    timelineStartSerial,
    monthColumnWidth,
    bar.endSerial + 1,
  )
  return {
    left: rawLeft + 3,
    width: Math.max(rawRight - rawLeft - 6, 8),
  }
}
