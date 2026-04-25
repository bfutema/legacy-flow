import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { resolveProjectById } from '../../data/projects'
import { findArchitectureBlock } from './architectureBlocksLoader'
import { SubprojectFilesExplorer } from './SubprojectFilesExplorer'
import {
  BackLinkStyled,
  PageDesc,
  PageTitle,
} from './SubprojectFilesLayout.styles'
import { ModelingPageRoot } from '../DatabaseModeling.styles'

export function SubprojectFilesViewPage() {
  const { projectId, nodeId } = useParams<{ projectId: string; nodeId: string }>()
  const [refreshTick, setRefreshTick] = useState(0)

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

  const block = useMemo(
    () =>
      projectId && nodeId ? findArchitectureBlock(projectId, nodeId) : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshTick invalida ao mudar diagrama
    [projectId, nodeId, refreshTick],
  )

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  if (!nodeId || !block) {
    return <Navigate to={`/projects/${projectId}/subproject-files`} replace />
  }

  return (
    <ModelingPageRoot>
      <BackLinkStyled to={`/projects/${project.id}/subproject-files`}>
        ← Todos os subprojetos
      </BackLinkStyled>
      <PageTitle>{block.data.label}</PageTitle>
      <PageDesc>
        {block.data.slug ? `Slug: ${block.data.slug} · ` : null}
        Visualização estilo repositório (preview). Duplo-clique em um bloco no diagrama de
        arquitetura também abre esta tela.
      </PageDesc>
      <SubprojectFilesExplorer
        projectId={project.id}
        projectName={project.name}
        block={block}
      />
    </ModelingPageRoot>
  )
}
