import type { Node } from '@xyflow/react'
import type { ProjectCloudProvider } from '../../data/cloudProviders'
import type { PrimaryDatabaseType } from '../../data/databaseEngines'
import type {
  ArchitectureClientSurface,
  ArchitectureRuntimeTech,
} from './architectureTechMeta'

/** Tipos de bloco na vista inicial; novos tipos (cloud etc.) entram aqui depois. */
export type ArchitectureBlockKind =
  | 'client'
  | 'service'
  | 'queue'
  | 'worker'
  | 'database'
  | 'external'

/** No monorepo: pasta sob apps/ ou packages/. */
export type ArchitectureMonorepoRole = 'app' | 'package'

export type ArchitectureBlockNodeData = {
  /** Presente após sync com projeto no canvas */
  projectId?: string
  label: string
  kind: ArchitectureBlockKind
  /** Texto curto sob o título (ex.: React, Fastify) */
  techHint?: string
  /** Runtime/framework principal do bloco (cliente/serviço). */
  runtime?: ArchitectureRuntimeTech
  /** Perfil do cliente (web/mobile/desktop/cli). */
  clientSurface?: ArchitectureClientSurface
  /** Cloud atribuída ao bloco (usada em defaults de infraestrutura). */
  projectCloud?: ProjectCloudProvider
  /** Banco principal do projeto para defaults de bloco de banco de dados. */
  projectPrimaryDatabase?: PrimaryDatabaseType
  /** Identificador estável para codegen / monorepo no futuro */
  slug?: string
  /** Em layout monorepo: este bloco vive em apps/ ou packages/. */
  monorepoRole?: ArchitectureMonorepoRole
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
