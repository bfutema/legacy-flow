import type { ApfGscVector, FpCountMatrix, ProjectApfDocument } from '../functionPoints/types'
import { DEFAULT_GSC, emptyFpMatrix } from '../functionPoints/types'

const STORAGE_PREFIX = 'flow-project-apf:v1:'

export function projectApfStorageKey(projectId: string): string {
  return `${STORAGE_PREFIX}${projectId}`
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object'
}

function coerceMatrix(raw: unknown): FpCountMatrix | null {
  if (!isRecord(raw)) return null
  const out = emptyFpMatrix()
  for (const k of ['ILF', 'EIF', 'EI', 'EO', 'EQ'] as const) {
    const row = raw[k]
    if (!isRecord(row)) return null
    for (const c of ['low', 'avg', 'high'] as const) {
      const n = row[c]
      if (typeof n !== 'number' || !Number.isFinite(n)) return null
      out[k][c] = Math.max(0, Math.floor(n))
    }
  }
  return out
}

function coerceGsc(raw: unknown): ApfGscVector | null {
  if (!Array.isArray(raw) || raw.length !== 14) return null
  const nums = raw.map((v) => {
    const n = typeof v === 'number' ? v : Number(v)
    if (!Number.isFinite(n)) return 0
    return Math.min(5, Math.max(0, Math.round(n)))
  })
  return nums as unknown as ApfGscVector
}

export function defaultProjectApfDocument(): ProjectApfDocument {
  return {
    schemaVersion: 1,
    counts: emptyFpMatrix(),
    gsc: DEFAULT_GSC,
    valorHora: 150,
    horasPorPf: 8,
  }
}

export function loadProjectApfDocument(projectId: string): ProjectApfDocument {
  try {
    const raw = localStorage.getItem(projectApfStorageKey(projectId))
    if (!raw?.trim()) return defaultProjectApfDocument()
    const p = JSON.parse(raw) as unknown
    if (!isRecord(p) || p.schemaVersion !== 1) return defaultProjectApfDocument()
    const counts = coerceMatrix(p.counts)
    const gsc = coerceGsc(p.gsc)
    if (!counts || !gsc) return defaultProjectApfDocument()
    const valorHora =
      typeof p.valorHora === 'number' && Number.isFinite(p.valorHora) ? Math.max(0, p.valorHora) : 150
    const horasPorPf =
      typeof p.horasPorPf === 'number' && Number.isFinite(p.horasPorPf)
        ? Math.max(0, p.horasPorPf)
        : 8
    return { schemaVersion: 1, counts, gsc, valorHora, horasPorPf }
  } catch {
    return defaultProjectApfDocument()
  }
}

export function saveProjectApfDocument(projectId: string, doc: ProjectApfDocument): void {
  try {
    localStorage.setItem(projectApfStorageKey(projectId), JSON.stringify(doc))
  } catch {
    /* ignore */
  }
}
