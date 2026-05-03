import type { FpCategory, FpComplexity } from './types'

/**
 * Pesos IFPUG (CPM) por tipo e complexidade.
 * @see IFPUG — Function Point Counting Practices Manual
 */
export const IFPUG_WEIGHTS: Record<FpCategory, Record<FpComplexity, number>> = {
  ILF: { low: 7, avg: 10, high: 15 },
  EIF: { low: 5, avg: 7, high: 10 },
  EI: { low: 3, avg: 4, high: 6 },
  EO: { low: 4, avg: 5, high: 7 },
  EQ: { low: 3, avg: 4, high: 6 },
}
