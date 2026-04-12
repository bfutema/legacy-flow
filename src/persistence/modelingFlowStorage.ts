import type { Edge, Node } from '@xyflow/react'

export const modelingFlowStorageKey = (projectId: string) =>
  `flow-modeling-graph:${projectId}`

const VERSION = 1

export type PersistedModelingFlow = {
  v: number
  nodes: Node[]
  edges: Edge[]
}

function omitSelected<T extends { selected?: boolean }>(item: T): T {
  const { selected: _s, ...rest } = item
  return rest as T
}

/** Remove estado efêmero antes de serializar (seleção, animação da aresta). */
export function sanitizeFlowForStorage(nodes: Node[], edges: Edge[]) {
  const nodesOut = nodes.map((n) => omitSelected(n as Node & { selected?: boolean }))
  const edgesOut = edges.map((e) =>
    omitSelected({
      ...(e as Edge),
      animated: false,
    } as Edge & { selected?: boolean }),
  )
  return { nodes: nodesOut, edges: edgesOut }
}

export function loadModelingFlow(
  projectId: string,
): PersistedModelingFlow | null {
  try {
    const raw = localStorage.getItem(modelingFlowStorageKey(projectId))
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<PersistedModelingFlow>
    if (
      !data ||
      data.v !== VERSION ||
      !Array.isArray(data.nodes) ||
      !Array.isArray(data.edges)
    ) {
      return null
    }
    return data as PersistedModelingFlow
  } catch {
    return null
  }
}

export function saveModelingFlow(
  projectId: string,
  nodes: Node[],
  edges: Edge[],
): void {
  try {
    const { nodes: n, edges: e } = sanitizeFlowForStorage(nodes, edges)
    const payload: PersistedModelingFlow = { v: VERSION, nodes: n, edges: e }
    localStorage.setItem(
      modelingFlowStorageKey(projectId),
      JSON.stringify(payload),
    )
  } catch (err) {
    console.warn('[modelagem] Não foi possível salvar o diagrama:', err)
  }
}

export function removeModelingFlow(projectId: string): void {
  try {
    localStorage.removeItem(modelingFlowStorageKey(projectId))
  } catch (err) {
    console.warn('[modelagem] Não foi possível remover o diagrama:', err)
  }
}
