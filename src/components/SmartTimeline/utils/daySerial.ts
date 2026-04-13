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
