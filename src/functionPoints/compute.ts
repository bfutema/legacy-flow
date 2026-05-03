import type { ApfGscVector, FpCountMatrix } from './types'
import { FP_CATEGORIES, FP_COMPLEXITIES } from './types'
import { IFPUG_WEIGHTS } from './weights'

/** Pontos de Função Não Ajustados (UFP). */
export function computeUfp(counts: FpCountMatrix): number {
  let ufp = 0
  for (const cat of FP_CATEGORIES) {
    for (const cx of FP_COMPLEXITIES) {
      const n = Math.max(0, Math.floor(counts[cat][cx]))
      ufp += n * IFPUG_WEIGHTS[cat][cx]
    }
  }
  return ufp
}

function clampGsc(v: number): number {
  if (!Number.isFinite(v)) return 0
  return Math.min(5, Math.max(0, Math.round(v)))
}

/** Soma dos graus de influência (TDI), máximo 70. */
export function computeTdi(gsc: ApfGscVector): number {
  return gsc.reduce((s, v) => s + clampGsc(v), 0)
}

/**
 * Fator de Ajuste de Valor (VAF) = 0,65 + 0,01 × TDI.
 * AFP (PF ajustados) = UFP × VAF.
 */
export function computeVaf(tdi: number): number {
  return 0.65 + 0.01 * tdi
}

export function computeAdjustedFp(ufp: number, vaf: number): number {
  return ufp * vaf
}

export type ApfSummary = {
  ufp: number
  tdi: number
  vaf: number
  afp: number
  horasEstimadas: number
  custoEstimado: number
}

export function summarizeApf(
  counts: FpCountMatrix,
  gsc: ApfGscVector,
  valorHora: number,
  horasPorPf: number,
): ApfSummary {
  const ufp = computeUfp(counts)
  const tdi = computeTdi(gsc)
  const vaf = computeVaf(tdi)
  const afp = computeAdjustedFp(ufp, vaf)
  const hPor = Math.max(0, horasPorPf)
  const vh = Math.max(0, valorHora)
  const horasEstimadas = afp * hPor
  const custoEstimado = horasEstimadas * vh
  return { ufp, tdi, vaf, afp, horasEstimadas, custoEstimado }
}
