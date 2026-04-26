import type { Edge, Node } from '@xyflow/react'
import { MarkerType } from '@xyflow/react'
import { techLabel } from './architectureTechMeta'
import type { ArchitectureBlockNodeData, ArchitectureEdgeData } from './architectureTypes'

function block(
  id: string,
  position: { x: number; y: number },
  data: ArchitectureBlockNodeData,
): Node {
  return {
    id,
    type: 'architectureBlock',
    position,
    data,
  }
}

/** Diagrama de exemplo alinhado à referência ARK95 (nomes genéricos). */
export function createDemoArchitectureNodes(
  projectId: string,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    block('arch-fe', { x: 40, y: 60 }, {
      projectId,
      label: 'Painel administrativo',
      kind: 'client',
      clientSurface: 'web',
      runtime: 'vite',
      techHint: techLabel('vite'),
      slug: 'web',
      monorepoRole: 'app',
      generatedPaths: [
        'package.json',
        'src/main.tsx',
        'src/app.tsx',
        'vite.config.ts',
      ],
    }),
    block('arch-api', { x: 380, y: 40 }, {
      projectId,
      label: 'API principal',
      kind: 'service',
      runtime: 'fastify',
      techHint: techLabel('fastify'),
      slug: 'api',
      monorepoRole: 'app',
      generatedPaths: ['package.json', 'src/server.ts'],
    }),
    block('arch-queue', { x: 380, y: 220 }, {
      projectId,
      label: 'Fila de e-mails',
      kind: 'queue',
      runtime: 'aws-sqs',
      techHint: techLabel('aws-sqs'),
      slug: 'email-queue',
      monorepoRole: 'package',
      generatedPaths: [],
    }),
    block('arch-worker', { x: 720, y: 220 }, {
      projectId,
      label: 'Worker de envio',
      kind: 'worker',
      techHint: 'Consumidor',
      slug: 'mail-worker',
      monorepoRole: 'app',
      generatedPaths: ['package.json', 'src/index.ts'],
    }),
  ]

  const edgeDefaults = {
    type: 'labeledArchitecture' as const,
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
  }

  const edges: Edge<ArchitectureEdgeData>[] = [
    {
      id: 'e-fe-api',
      source: 'arch-fe',
      target: 'arch-api',
      ...edgeDefaults,
      data: { label: 'HTTPS / JSON' },
    },
    {
      id: 'e-api-queue',
      source: 'arch-api',
      target: 'arch-queue',
      ...edgeDefaults,
      data: { label: 'AMQP' },
    },
    {
      id: 'e-queue-worker',
      source: 'arch-queue',
      target: 'arch-worker',
      ...edgeDefaults,
      data: { label: 'AMQP' },
    },
  ]

  return { nodes, edges }
}
