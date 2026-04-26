import { useCallback, useMemo, useState } from 'react'

const STORAGE_KEY = (projectId: string) => `flow-project-monorepo:${projectId}`

/** Persistido apenas quando o usuário escolhe repositórios separados (opt-out do monorepo). */
export const PROJECT_LAYOUT_MULTI_REPO = 'multi-repo'

export function readProjectLayoutMultiRepo(projectId: string): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY(projectId)) === PROJECT_LAYOUT_MULTI_REPO
  } catch {
    return false
  }
}

/** `true` = monorepo (padrão). `false` = hub multi-repo. */
export function isProjectMonorepo(projectId: string | undefined): boolean {
  if (!projectId) return true
  return !readProjectLayoutMultiRepo(projectId)
}

export function useProjectMonorepo(projectId: string | undefined) {
  const [tick, setTick] = useState(0)

  const isMonorepo = useMemo(() => {
    void tick
    return isProjectMonorepo(projectId)
  }, [projectId, tick])

  const setMultiRepoLayout = useCallback(
    (multiRepo: boolean) => {
      if (!projectId) return
      try {
        if (multiRepo) {
          localStorage.setItem(STORAGE_KEY(projectId), PROJECT_LAYOUT_MULTI_REPO)
        } else {
          localStorage.removeItem(STORAGE_KEY(projectId))
        }
      } catch {
        /* ignore */
      }
      setTick((t) => t + 1)
      window.dispatchEvent(new Event('flow-project-meta-changed'))
    },
    [projectId],
  )

  return { isMonorepo, setMultiRepoLayout }
}
