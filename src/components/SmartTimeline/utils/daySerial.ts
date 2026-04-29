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
