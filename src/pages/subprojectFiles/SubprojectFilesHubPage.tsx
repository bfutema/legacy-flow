import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ARCHITECTURE_KIND_LABEL } from '../../components/ProjectArchitectureCanvas/architectureKindMeta'
import {
  normalizeTechForNode,
  renderTechIcon,
  techLabel,
} from '../../components/ProjectArchitectureCanvas/architectureTechMeta'
import { resolveProjectById } from '../../data/projects'
import { isProjectMonorepo } from '../../hooks/useProjectMonorepo'
import { useProjectPrimaryDatabase } from '../../hooks/useProjectPrimaryDatabase'
import { getEffectiveProjectPrimaryColor } from '../../hooks/useProjectPrimaryColor'
import { useProjectCloud } from '../../hooks/useProjectCloud'
import { listArchitectureBlocks } from './architectureBlocksLoader'
import {
  BackLinkStyled,
  HubCard,
  HubCardMeta,
  HubCardTitle,
  HubEmpty,
  HubGrid,
  PageDesc,
  PageTitle,
} from './SubprojectFilesLayout.styles'
import { ModelingPageRoot } from '../DatabaseModeling.styles'

export function SubprojectFilesHubPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const [refreshTick, setRefreshTick] = useState(0)
  const { projectCloud } = useProjectCloud(projectId)
  const { primaryDatabase } = useProjectPrimaryDatabase(projectId)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshTick invalida ao mudar diagrama
    [projectId, refreshTick],
  )

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  if (isProjectMonorepo(projectId)) {
    return <Navigate to={`/projects/${projectId}/workspace-files`} replace />
  }

  const projectAccent = getEffectiveProjectPrimaryColor(project)

  return (
    <ModelingPageRoot>
      <BackLinkStyled to={`/projects/${project.id}`}>← Voltar ao projeto</BackLinkStyled>
      <PageTitle>Arquivos dos subprojetos</PageTitle>
      <PageDesc>
        Escolha um bloco do mapa de arquitetura. A visualização segue o padrão de um repositório
        (árvore, caminho e painel de símbolos); o conteúdo é preview local até integrar o gerador.
      </PageDesc>
      {blocks.length === 0 ? (
        <HubEmpty>
          Nenhum bloco no diagrama de arquitetura.{' '}
          <Link to={`/projects/${project.id}/architecture`}>Abrir o mapa</Link> para criar blocos.
        </HubEmpty>
      ) : (
        <HubGrid>
          {blocks.map((b) => {
            const tech = normalizeTechForNode(
              b.data.kind,
              b.data.runtime,
              b.data.techHint,
              b.data.projectCloud ?? projectCloud,
              b.data.projectPrimaryDatabase ?? primaryDatabase,
              b.data.clientSurface,
            )
            const label = techLabel(tech)
            return (
              <HubCard
                key={b.nodeId}
                $accent={projectAccent}
                to={`/projects/${project.id}/subproject-files/${b.nodeId}`}
              >
                <HubCardTitle>
                  {renderTechIcon(tech, 14)}
                  {b.data.label}
                </HubCardTitle>
                <HubCardMeta>
                  {ARCHITECTURE_KIND_LABEL[b.data.kind]}
                  {label ? ` · ${label}` : ''}
                  {b.data.slug ? ` · ${b.data.slug}` : ''}
                </HubCardMeta>
              </HubCard>
            )
          })}
        </HubGrid>
      )}
    </ModelingPageRoot>
  )
}
