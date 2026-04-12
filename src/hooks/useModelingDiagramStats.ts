import { useCallback, useEffect, useState } from 'react'
import { initialDbEdges, initialDbNodes } from '../nodes/initialFlow'
import {
  loadModelingFlow,
  modelingFlowStorageKey,
} from '../persistence/modelingFlowStorage'

function computeStats(projectId: string) {
  const saved = loadModelingFlow(projectId)
  const nodes = saved?.nodes ?? initialDbNodes
  const edges = saved?.edges ?? initialDbEdges
  const tableCount = nodes.filter((n) => n.type === 'table').length
  const relationCount = edges.length
  return { tableCount, relationCount }
}

export function useModelingDiagramStats(projectId: string | undefined) {
  const [stats, setStats] = useState({ tableCount: 0, relationCount: 0 })

  const refresh = useCallback(() => {
    if (!projectId) return
    setStats(computeStats(projectId))
  }, [projectId])

  useEffect(() => {
    if (!projectId) return
    refresh()
    const key = modelingFlowStorageKey(projectId)
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) refresh()
    }
    const onFocus = () => refresh()
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
    }
  }, [projectId, refresh])

  return { ...stats, refresh }
}
