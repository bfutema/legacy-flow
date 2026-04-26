import type { Node } from '@xyflow/react'
import { createDemoArchitectureNodes } from '../../components/ProjectArchitectureCanvas/demoInitialArchitecture'
import type { ArchitectureBlockNodeData } from '../../components/ProjectArchitectureCanvas/architectureTypes'
import { loadArchitectureFlow } from '../../persistence/architectureFlowStorage'

export type ArchitectureBlockSummary = {
  nodeId: string
  data: ArchitectureBlockNodeData
}

function nodesForProject(projectId: string): Node[] {
  const saved = loadArchitectureFlow(projectId)
  if (saved?.nodes?.length) return saved.nodes
  return createDemoArchitectureNodes(projectId).nodes
}

export function listArchitectureBlocks(projectId: string): ArchitectureBlockSummary[] {
  return nodesForProject(projectId)
    .filter((n) => n.type === 'architectureBlock')
    .filter((n) => (n.data as ArchitectureBlockNodeData).kind !== 'database')
    .map((n) => ({
      nodeId: n.id,
      data: n.data as ArchitectureBlockNodeData,
    }))
}

export function findArchitectureBlock(
  projectId: string,
  nodeId: string,
): ArchitectureBlockSummary | undefined {
  return listArchitectureBlocks(projectId).find((b) => b.nodeId === nodeId)
}
