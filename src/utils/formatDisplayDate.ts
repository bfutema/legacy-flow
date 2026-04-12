import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

const DISPLAY = "P 'às' HH:mm:ss"

/**
 * Data/hora para exibição (pt-BR), sempre com instante completo — ex.: 08/04/2026 às 14:32:05.
 * Valores só com calendário (`YYYY-MM-DD`) são interpretados em meia-noite local.
 */
export function formatDisplayDate(value: string | Date | null | undefined): string {
  if (value === null || value === undefined) return '—'

  if (value instanceof Date) {
    return isValid(value) ? format(value, DISPLAY, { locale: ptBR }) : '—'
  }

  const raw = String(value).trim()
  if (!raw) return '—'

  const parsed = parseISO(raw)
  if (!isValid(parsed)) return raw

  return format(parsed, DISPLAY, { locale: ptBR })
}
