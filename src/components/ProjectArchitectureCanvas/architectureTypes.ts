import type { Node } from '@xyflow/react'
import type { ArchitectureRuntimeTech } from './architectureTechMeta'

/** Tipos de bloco na vista inicial; novos tipos (cloud etc.) entram aqui depois. */
export type ArchitectureBlockKind =
  | 'client'
  | 'service'
  | 'queue'
  | 'worker'
  | 'database'
  | 'external'

export type ArchitectureBlockNodeData = {
  /** Presente após sync com projeto no canvas */
  projectId?: string
  label: string
  kind: ArchitectureBlockKind
  /** Texto curto sob o título (ex.: React, Fastify) */
  techHint?: string
  /** Runtime/framework principal do bloco (cliente/serviço). */
  runtime?: ArchitectureRuntimeTech
  /** Identificador estável para codegen / monorepo no futuro */
  slug?: string
  /**
   * Placeholder de árvore de arquivos gerados (front/back).
   * Quando existir backend, substituir por dados reais.
   */
  generatedPaths?: string[]
}

export type ArchitectureEdgeData = {
  label?: string
}

export type ArchitectureRfNode = Node<
  ArchitectureBlockNodeData,
  'architectureBlock'
>
