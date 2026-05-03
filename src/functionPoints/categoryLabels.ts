import type { FpCategory } from './types'

/** Rótulos para a grade de contagem (IFPUG + nome usual no Brasil). */
export const FP_CATEGORY_LABELS: Record<FpCategory, string> = {
  ILF: 'ALI — Arquivo Lógico Interno (ILF)',
  EIF: 'AIE — Arquivo de Interface Externa (EIF)',
  EI: 'EE — Entrada Externa (EI)',
  EO: 'SE — Saída Externa (EO)',
  EQ: 'CE — Consulta Externa (EQ)',
}

export const FP_COMPLEXITY_LABELS: Record<'low' | 'avg' | 'high', string> = {
  low: 'Baixa',
  avg: 'Média',
  high: 'Alta',
}
