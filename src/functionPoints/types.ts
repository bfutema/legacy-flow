/**
 * Contagens para APF / IFPUG (Análise de Pontos de Função).
 * Complexidade já classificada (baixa / média / alta) — equivalente a somar funções elementares já contadas.
 */

export type FpComplexity = 'low' | 'avg' | 'high'

/** Tipos de função IFPUG (nomenclatura brasileira comum entre parênteses). */
export type FpCategory = 'ILF' | 'EIF' | 'EI' | 'EO' | 'EQ'

export type FpCountMatrix = Record<FpCategory, Record<FpComplexity, number>>

export const FP_CATEGORIES: FpCategory[] = ['ILF', 'EIF', 'EI', 'EO', 'EQ']

export const FP_COMPLEXITIES: FpComplexity[] = ['low', 'avg', 'high']

/** Graus de influência (0–5) das 14 Características Gerais do Sistema (IFPUG). */
export type ApfGscVector = readonly [number, number, number, number, number, number, number, number, number, number, number, number, number, number]

export type ProjectApfDocument = {
  schemaVersion: 1
  /** Contagem por tipo e complexidade (quantidade de funções nessa faixa). */
  counts: FpCountMatrix
  /** 14 valores 0–5 para o Fator de Ajuste de Valor (VAF). */
  gsc: ApfGscVector
  /** Parâmetros comerciais / esforço (opcionais). */
  valorHora: number
  /** Horas estimadas por PF ajustado (AFP). */
  horasPorPf: number
}

export const DEFAULT_GSC: ApfGscVector = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]

export function emptyFpMatrix(): FpCountMatrix {
  const z = (): Record<FpComplexity, number> => ({ low: 0, avg: 0, high: 0 })
  return {
    ILF: z(),
    EIF: z(),
    EI: z(),
    EO: z(),
    EQ: z(),
  }
}
