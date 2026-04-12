import { useCallback, useMemo, useState } from 'react'
import {
  getProjectById,
  normalizeProjectPrimaryColor,
  type Project,
} from '../data/projects'

const STORAGE_KEY = (projectId: string) =>
  `flow-project-primary-color:${projectId}`

function readStored(projectId: string): string | null {
  const raw = localStorage.getItem(STORAGE_KEY(projectId))
  const s = raw?.trim() ?? ''
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s
  return null
}

/** Cor exibida na UI (lista de projetos, etc.): localStorage ou seed. */
export function getEffectiveProjectPrimaryColor(
  project: Pick<Project, 'id' | 'primaryColor'>,
): string {
  const stored = readStored(project.id)
  return normalizeProjectPrimaryColor(stored ?? project.primaryColor)
}

/**
 * Cor primária do projeto (header dos nós na modelagem).
 * Persistida em localStorage por projeto; fallback no seed em `projects.ts`.
 */
export function useProjectPrimaryColor(projectId: string | undefined) {
  const [tick, setTick] = useState(0)

  const fallback = useMemo(
    () =>
      normalizeProjectPrimaryColor(
        projectId ? getProjectById(projectId)?.primaryColor : undefined,
      ),
    [projectId],
  )

  const primaryColor = useMemo(() => {
    void tick
    if (!projectId) return fallback
    return readStored(projectId) ?? fallback
  }, [projectId, fallback, tick])

  const setPrimaryColor = useCallback(
    (hex: string) => {
      if (!projectId) return
      const n = normalizeProjectPrimaryColor(hex)
      localStorage.setItem(STORAGE_KEY(projectId), n)
      setTick((t) => t + 1)
    },
    [projectId],
  )

  return { primaryColor, setPrimaryColor, fallbackPrimaryColor: fallback }
}
