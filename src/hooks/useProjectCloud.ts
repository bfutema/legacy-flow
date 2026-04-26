import { useCallback, useMemo, useState } from 'react'
import {
  isProjectCloudProvider,
  type ProjectCloudProvider,
} from '../data/cloudProviders'
import { getProjectById } from '../data/projects'

const STORAGE_KEY = (projectId: string) => `flow-project-cloud:${projectId}`

function readStoredCloud(projectId: string): ProjectCloudProvider | null {
  const raw = localStorage.getItem(STORAGE_KEY(projectId))
  if (raw && isProjectCloudProvider(raw)) return raw
  return null
}

export function useProjectCloud(projectId: string | undefined) {
  const [tick, setTick] = useState(0)

  const projectDefault = useMemo((): ProjectCloudProvider => {
    if (!projectId) return 'aws'
    return getProjectById(projectId)?.primaryCloud ?? 'aws'
  }, [projectId])

  const projectCloud = useMemo((): ProjectCloudProvider => {
    void tick
    if (!projectId) return projectDefault
    const fromStorage = readStoredCloud(projectId)
    return fromStorage ?? projectDefault
  }, [projectId, projectDefault, tick])

  const setProjectCloud = useCallback(
    (next: ProjectCloudProvider) => {
      if (!projectId) return
      localStorage.setItem(STORAGE_KEY(projectId), next)
      setTick((t) => t + 1)
    },
    [projectId],
  )

  return { projectCloud, setProjectCloud, projectDefault }
}

