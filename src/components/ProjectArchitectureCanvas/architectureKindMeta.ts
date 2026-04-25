import type { ArchitectureBlockKind } from './architectureTypes'

export const ARCHITECTURE_KIND_LABEL: Record<ArchitectureBlockKind, string> = {
  client: 'Cliente',
  service: 'Serviço',
  queue: 'Fila',
  worker: 'Worker',
  database: 'Banco de dados',
  external: 'Externo',
}

/** Cor de destaque do bloco (header / borda). */
export const ARCHITECTURE_KIND_ACCENT: Record<ArchitectureBlockKind, string> = {
  client: '#3b82f6',
  service: '#22c55e',
  queue: '#f43f5e',
  worker: '#ec4899',
  database: '#a855f7',
  external: '#f59e0b',
}

export const ALL_ARCHITECTURE_KINDS: ArchitectureBlockKind[] = [
  'client',
  'service',
  'queue',
  'worker',
  'database',
  'external',
]
