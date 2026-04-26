import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { resolveProjectById } from '../../data/projects'
import { isProjectMonorepo } from '../../hooks/useProjectMonorepo'
import {
  buildWorkspaceSeedPaths,
  workspaceFolderPrefixForNode,
} from './workspaceSeedPaths'
import {
  findArchitectureBlock,
  listArchitectureBlocks,
} from './architectureBlocksLoader'
import { SubprojectFilesExplorer } from './SubprojectFilesExplorer'
import {
  BackLinkStyled,
  PageDesc,
  PageTitle,
} from './SubprojectFilesLayout.styles'
import { ModelingPageRoot } from '../DatabaseModeling.styles'

const THEATER_STORAGE_KEY = 'flow-theater-mode:workspace-files'

export function WorkspaceFilesPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [searchParams] = useSearchParams()
  const focusId = searchParams.get('focus') ?? undefined
  const [refreshTick, setRefreshTick] = useState(0)
  const [theaterMode, setTheaterMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(THEATER_STORAGE_KEY) === '1'
  })

  useEffect(() => {
    window.localStorage.setItem(THEATER_STORAGE_KEY, theaterMode ? '1' : '0')
  }, [theaterMode])

  useEffect(() => {
    const bump = () => setRefreshTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', bump)
    window.addEventListener('flow-architecture-changed', bump)
    return () => {
      window.removeEventListener('flow-project-meta-changed', bump)
      window.removeEventListener('flow-architecture-changed', bump)
    }
  }, [])

  const project = useMemo(
    () => (projectId ? resolveProjectById(projectId) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshTick intencional
    [projectId, refreshTick],
  )

  const blocks = useMemo(
    () => (projectId ? listArchitectureBlocks(projectId) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectId, refreshTick],
  )

  const seedPaths = useMemo(() => buildWorkspaceSeedPaths(blocks), [blocks])

  const focusBlock = useMemo(
    () =>
      projectId && focusId ? findArchitectureBlock(projectId, focusId) : undefined,
    [projectId, focusId, refreshTick],
  )

  const focusPrefix = useMemo(
    () => workspaceFolderPrefixForNode(focusBlock) || undefined,
    [focusBlock],
  )

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  if (!isProjectMonorepo(projectId)) {
    return <Navigate to={`/projects/${projectId}/subproject-files`} replace />
  }

  return (
    <ModelingPageRoot $theater={theaterMode}>
      {!theaterMode ? (
        <>
          <BackLinkStyled to={`/projects/${project.id}`}>← Voltar ao projeto</BackLinkStyled>
          <PageTitle>Explorador de arquivos</PageTitle>
          <PageDesc>
            Visão única do monorepo (pastas apps/ e packages/), alinhada aos blocos do mapa de
            arquitetura. Preview local até integrar o gerador.
          </PageDesc>
        </>
      ) : null}
      <SubprojectFilesExplorer
        variant="workspace"
        projectId={project.id}
        projectName={project.name}
        seedPaths={seedPaths}
        focusPrefix={focusPrefix}
        theaterMode={theaterMode}
        onToggleTheater={() => setTheaterMode((v) => !v)}
      />
    </ModelingPageRoot>
  )
}
