import { useCallback, useMemo, useState } from 'react'
import type { PrimaryDatabaseType } from '../data/databaseEngines'
import { isPrimaryDatabaseType } from '../data/databaseEngines'
import { getProjectById } from '../data/projects'

const STORAGE_KEY = (projectId: string) => `flow-primary-db:${projectId}`

function readStoredDb(projectId: string): PrimaryDatabaseType | null {
  const raw = localStorage.getItem(STORAGE_KEY(projectId))
  if (raw && isPrimaryDatabaseType(raw)) return raw
  return null
}

export function useProjectPrimaryDatabase(projectId: string | undefined) {
  const [tick, setTick] = useState(0)

  const projectDefault = useMemo((): PrimaryDatabaseType => {
    if (!projectId) return 'mysql'
    return getProjectById(projectId)?.primaryDatabase ?? 'mysql'
  }, [projectId])

  const primaryDatabase = useMemo((): PrimaryDatabaseType => {
    void tick
    if (!projectId) return projectDefault
    const fromStorage = readStoredDb(projectId)
    return fromStorage ?? projectDefault
  }, [projectId, projectDefault, tick])

  const setPrimaryDatabase = useCallback(
    (next: PrimaryDatabaseType) => {
      if (!projectId) return
      localStorage.setItem(STORAGE_KEY(projectId), next)
      setTick((t) => t + 1)
    },
    [projectId],
  )

  return { primaryDatabase, setPrimaryDatabase, projectDefault }
}
