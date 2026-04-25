import type { Edge, Node } from '@xyflow/react'

export const architectureFlowStorageKey = (projectId: string) =>
  `flow-architecture-graph:${projectId}`

const VERSION = 1

export type PersistedArchitectureFlow = {
  v: number
  nodes: Node[]
  edges: Edge[]
}

export function sanitizeArchitectureFlowForStorage(
  nodes: Node[],
  edges: Edge[],
) {
  const nodesOut = nodes.map((n) => {
    const copy = { ...n } as Node & { selected?: boolean; hidden?: boolean }
    delete copy.selected
    delete copy.hidden
    return copy as Node
  })
  const edgesOut = edges.map((e) => {
    const copy = { ...e } as Edge & { selected?: boolean; hidden?: boolean }
    delete copy.selected
    delete copy.hidden
    return { ...copy, animated: false } as Edge
  })
  return { nodes: nodesOut, edges: edgesOut }
}

export function loadArchitectureFlow(
  projectId: string,
): PersistedArchitectureFlow | null {
  try {
    const raw = localStorage.getItem(architectureFlowStorageKey(projectId))
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<PersistedArchitectureFlow>
    if (
      !data ||
      data.v !== VERSION ||
      !Array.isArray(data.nodes) ||
      !Array.isArray(data.edges)
    ) {
      return null
    }
    return data as PersistedArchitectureFlow
  } catch {
    return null
  }
}

export function saveArchitectureFlow(
  projectId: string,
  nodes: Node[],
  edges: Edge[],
): void {
  try {
    const { nodes: n, edges: e } = sanitizeArchitectureFlowForStorage(
      nodes,
      edges,
    )
    const payload: PersistedArchitectureFlow = { v: VERSION, nodes: n, edges: e }
    localStorage.setItem(
      architectureFlowStorageKey(projectId),
      JSON.stringify(payload),
    )
    window.dispatchEvent(
      new CustomEvent('flow-architecture-changed', { detail: { projectId } }),
    )
  } catch (err) {
    console.warn('[arquitetura] Não foi possível salvar o diagrama:', err)
  }
}

export function removeArchitectureFlow(projectId: string): void {
  try {
    localStorage.removeItem(architectureFlowStorageKey(projectId))
  } catch (err) {
    console.warn('[arquitetura] Não foi possível remover o diagrama:', err)
  }
}
