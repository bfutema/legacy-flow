import { useAbility } from '@casl/react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ALL_ARCHITECTURE_KINDS,
  ARCHITECTURE_KIND_ACCENT,
  ARCHITECTURE_KIND_LABEL,
} from '../components/ProjectArchitectureCanvas/architectureKindMeta'
import {
  isProjectCloudProvider,
  PROJECT_CLOUD_LABELS,
  PROJECT_CLOUDS,
} from '../data/cloudProviders'
import {
  isPrimaryDatabaseType,
  PRIMARY_DATABASE_LABELS,
  PRIMARY_DATABASES,
} from '../data/databaseEngines'
import { AbilityContext } from '../contexts/AbilityContext'
import { createDemoArchitectureNodes } from '../components/ProjectArchitectureCanvas/demoInitialArchitecture'
import { deleteProject, resolveProjectById } from '../data/projects'
import { useModelingDiagramStats } from '../hooks/useModelingDiagramStats'
import { useProjectCloud } from '../hooks/useProjectCloud'
import { useProjectMonorepo } from '../hooks/useProjectMonorepo'
import { useProjectPrimaryDatabase } from '../hooks/useProjectPrimaryDatabase'
import { loadArchitectureFlow } from '../persistence/architectureFlowStorage'
import { HelpInfoTooltip } from '../components/HelpInfoTooltip/HelpInfoTooltip'
import { TrashDeleteButton } from '../components/TrashDeleteButton/TrashDeleteButton'
import { PageHeader } from '../layouts/PageHeader'
import { listArchitectureBlocks } from './subprojectFiles/architectureBlocksLoader'
import {
  BackLink,
  DbLabelInRow,
  DbLabelRow,
  DbSelect,
  DetailMain,
  DetailMainColumn,
  DetailSideColumn,
  DiagramCard,
  DiagramCardTitle,
  DiagramChartBox,
  DiagramHint,
  MiniChartCard,
  MiniChartTitle,
  MiniChartWrap,
  PanelDbSettingRow,
  PanelDivider,
  PanelSectionLabel,
  ProjectDetailRoot,
  SecondaryChartsGrid,
  SideOverviewPanel,
  StatPill,
  StatRowMini,
  WorkspaceNavChevron,
  WorkspaceNavIconWrap,
  WorkspaceNavLinkArchitecture,
  WorkspaceNavLinkFiles,
  WorkspaceNavLinkModeling,
  WorkspaceNavList,
  WorkspaceNavRowBody,
  WorkspaceNavRowDesc,
  WorkspaceNavRowLocked,
  WorkspaceNavRowTitle,
} from './ProjectDetail.styles'

const iconDb = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
)

const iconArch = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
  </svg>
)

const iconFiles = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
)

export function ProjectDetail() {
  const theme = useTheme()
  const ability = useAbility(AbilityContext)
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const [infoTick, setInfoTick] = useState(0)
  const canUpdateProject = ability.can('update', 'Project')
  const canDeleteProject = ability.can('delete', 'Project')

  useEffect(() => {
    const bump = () => setInfoTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', bump)
    window.addEventListener('flow-architecture-changed', bump)
    return () => {
      window.removeEventListener('flow-project-meta-changed', bump)
      window.removeEventListener('flow-architecture-changed', bump)
    }
  }, [])

  const project = useMemo(
    () => (projectId ? resolveProjectById(projectId) : undefined),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- infoTick invalida ao mudar meta do projeto
    [projectId, infoTick],
  )

  const { primaryDatabase, setPrimaryDatabase } =
    useProjectPrimaryDatabase(projectId)
  const { projectCloud, setProjectCloud } = useProjectCloud(projectId)
  const { isMonorepo, setMultiRepoLayout } = useProjectMonorepo(projectId)
  const { tableCount, relationCount } = useModelingDiagramStats(projectId)

  const chartData = useMemo(
    () => [
      { label: 'Tabelas', q: tableCount },
      { label: 'Relações', q: relationCount },
    ],
    [tableCount, relationCount],
  )
  const architectureBlocks = useMemo(
    () => (projectId ? listArchitectureBlocks(projectId) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- infoTick invalida ao mudar arquitetura
    [projectId, infoTick],
  )
  const architectureEdgeCount = useMemo(() => {
    if (!projectId) return 0
    const saved = loadArchitectureFlow(projectId)
    if (saved?.edges) return saved.edges.length
    return createDemoArchitectureNodes(projectId).edges.length
    // eslint-disable-next-line react-hooks/exhaustive-deps -- infoTick invalida ao mudar arquitetura
  }, [projectId, infoTick])
  const kindChartData = useMemo(() => {
    const counts = ALL_ARCHITECTURE_KINDS.reduce(
      (acc, kind) => {
        acc[kind] = 0
        return acc
      },
      {} as Record<(typeof ALL_ARCHITECTURE_KINDS)[number], number>,
    )
    for (const b of architectureBlocks) {
      counts[b.data.kind] += 1
    }
    return ALL_ARCHITECTURE_KINDS.map((kind) => ({
      kind,
      label: ARCHITECTURE_KIND_LABEL[kind],
      q: counts[kind],
      color: ARCHITECTURE_KIND_ACCENT[kind],
    })).filter((x) => x.q > 0)
  }, [architectureBlocks])
  const coverageData = useMemo(() => {
    const withRuntime = architectureBlocks.filter((b) => Boolean(b.data.runtime)).length
    const withSlug = architectureBlocks.filter((b) => Boolean(b.data.slug)).length
    return [
      { label: 'Blocos', q: architectureBlocks.length },
      { label: 'Ligações', q: architectureEdgeCount },
      { label: 'Com runtime', q: withRuntime },
      { label: 'Com slug', q: withSlug },
    ]
  }, [architectureBlocks, architectureEdgeCount])

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <ProjectDetailRoot>
      <BackLink to="/projects">← Voltar aos projetos</BackLink>
      <PageHeader
        projectId={project.id}
        title={project.name}
        description={project.description}
        updatedAt={project.updatedAt}
        titleTrailing={
          canDeleteProject ? (
            <TrashDeleteButton
              aria-label="Excluir projeto"
              confirm={{
                title: 'Excluir projeto',
                message: `Tem certeza que deseja excluir “${project.name}”? O diagrama e as alterações salvas neste aparelho serão apagados.`,
                confirmLabel: 'Excluir',
                cancelLabel: 'Cancelar',
              }}
              onSuccess={() => {
                deleteProject(project.id)
                navigate('/projects', { replace: true })
              }}
            />
          ) : null
        }
      />
      <DetailMain>
        <DetailMainColumn>
          <DiagramCard>
            <DiagramCardTitle>Diagrama neste projeto</DiagramCardTitle>
            <StatRowMini>
              <StatPill>{tableCount} tabelas</StatPill>
              <StatPill>{relationCount} relações</StatPill>
            </StatRowMini>
            <DiagramChartBox>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: theme.chartAxis, fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={72}
                    tick={{ fill: theme.chartAxis, fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                    }}
                  />
                  <Bar
                    dataKey="q"
                    name="Quantidade"
                    fill={theme.primary}
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </DiagramChartBox>
            <DiagramHint>
              Dados do diagrama salvo no navegador; se você ainda não editou a
              modelagem, aparece o modelo inicial de referência.
            </DiagramHint>
            <SecondaryChartsGrid>
              <MiniChartCard>
                <MiniChartTitle>Arquitetura por tipo</MiniChartTitle>
                <MiniChartWrap>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={kindChartData}
                        dataKey="q"
                        nameKey="label"
                        innerRadius={36}
                        outerRadius={62}
                        paddingAngle={2}
                      >
                        {kindChartData.map((entry) => (
                          <Cell key={entry.kind} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: theme.surface,
                          border: `1px solid ${theme.border}`,
                          borderRadius: 8,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </MiniChartWrap>
              </MiniChartCard>
              <MiniChartCard>
                <MiniChartTitle>Cobertura de arquitetura</MiniChartTitle>
                <MiniChartWrap>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coverageData} margin={{ top: 4, right: 10, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: theme.chartAxis, fontSize: 10 }}
                        interval={0}
                        angle={-12}
                        textAnchor="end"
                        height={42}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fill: theme.chartAxis, fontSize: 11 }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: theme.surface,
                          border: `1px solid ${theme.border}`,
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="q" fill={theme.primary} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </MiniChartWrap>
              </MiniChartCard>
            </SecondaryChartsGrid>
          </DiagramCard>
        </DetailMainColumn>
        <DetailSideColumn>
          <SideOverviewPanel>
            <div>
              <PanelSectionLabel>Motor SQL principal</PanelSectionLabel>
              <PanelDbSettingRow>
                <DbLabelRow>
                  <DbLabelInRow htmlFor="project-primary-db">
                    Sugestões de tipo na modelagem
                  </DbLabelInRow>
                  <HelpInfoTooltip
                    ariaLabel="Ajuda: motor SQL e sugestões de tipo"
                    tooltipId="project-primary-db-tip"
                  >
                    Tipos sugeridos ao editar colunas seguem o motor escolhido (MySQL,
                    PostgreSQL ou SQL Server).
                  </HelpInfoTooltip>
                </DbLabelRow>
                <DbSelect
                  id="project-primary-db"
                  value={primaryDatabase}
                  disabled={!canUpdateProject}
                  onChange={(e) => {
                    const v = e.target.value
                    if (isPrimaryDatabaseType(v)) setPrimaryDatabase(v)
                  }}
                >
                  {PRIMARY_DATABASES.map((key) => (
                    <option key={key} value={key}>
                      {PRIMARY_DATABASE_LABELS[key]}
                    </option>
                  ))}
                </DbSelect>
              </PanelDbSettingRow>
            </div>
            <div>
              <PanelSectionLabel>Cloud principal</PanelSectionLabel>
              <PanelDbSettingRow>
                <DbLabelRow>
                  <DbLabelInRow htmlFor="project-primary-cloud">
                    Padrão para filas e serviços de infraestrutura
                  </DbLabelInRow>
                  <HelpInfoTooltip
                    ariaLabel="Ajuda: cloud padrão do projeto"
                    tooltipId="project-primary-cloud-tip"
                  >
                    Novas filas no mapa de arquitetura usam por padrão o serviço da cloud
                    escolhida (AWS SQS, GCP Pub/Sub ou Azure Service Bus). Você ainda pode
                    trocar por bloco depois.
                  </HelpInfoTooltip>
                </DbLabelRow>
                <DbSelect
                  id="project-primary-cloud"
                  value={projectCloud}
                  disabled={!canUpdateProject}
                  onChange={(e) => {
                    const v = e.target.value
                    if (isProjectCloudProvider(v)) setProjectCloud(v)
                  }}
                >
                  {PROJECT_CLOUDS.map((key) => (
                    <option key={key} value={key}>
                      {PROJECT_CLOUD_LABELS[key]}
                    </option>
                  ))}
                </DbSelect>
              </PanelDbSettingRow>
            </div>
            <div>
              <PanelSectionLabel>Estrutura do código</PanelSectionLabel>
              <PanelDbSettingRow>
                <DbLabelRow>
                  <DbLabelInRow htmlFor="project-repo-layout">
                    Monorepo ou repositórios separados
                  </DbLabelInRow>
                  <HelpInfoTooltip
                    ariaLabel="Ajuda: layout do repositório"
                    tooltipId="project-repo-layout-tip"
                  >
                    Monorepo (padrão): um explorador com pastas apps/ e packages/. Repositórios
                    separados: um cartão por bloco, como projetos distintos.
                  </HelpInfoTooltip>
                </DbLabelRow>
                <DbSelect
                  id="project-repo-layout"
                  value={isMonorepo ? 'monorepo' : 'multi'}
                  disabled={!canUpdateProject}
                  onChange={(e) => setMultiRepoLayout(e.target.value === 'multi')}
                >
                  <option value="monorepo">Monorepo (padrão)</option>
                  <option value="multi">Repositórios separados</option>
                </DbSelect>
              </PanelDbSettingRow>
            </div>
            <PanelDivider />
            <div>
              <PanelSectionLabel>Áreas de trabalho</PanelSectionLabel>
              <WorkspaceNavList>
                {canUpdateProject ? (
                  <WorkspaceNavLinkModeling to={`/projects/${project.id}/modeling`}>
                    <WorkspaceNavIconWrap>{iconDb}</WorkspaceNavIconWrap>
                    <WorkspaceNavRowBody>
                      <WorkspaceNavRowTitle>
                        Modelagem do banco de dados
                      </WorkspaceNavRowTitle>
                      <WorkspaceNavRowDesc>
                        Editor visual com grade, zoom e minimapa.
                      </WorkspaceNavRowDesc>
                    </WorkspaceNavRowBody>
                    <WorkspaceNavChevron aria-hidden>→</WorkspaceNavChevron>
                  </WorkspaceNavLinkModeling>
                ) : (
                  <WorkspaceNavRowLocked $variant="modeling">
                    <WorkspaceNavIconWrap>{iconDb}</WorkspaceNavIconWrap>
                    <WorkspaceNavRowBody>
                      <WorkspaceNavRowTitle>
                        Modelagem do banco de dados
                      </WorkspaceNavRowTitle>
                      <WorkspaceNavRowDesc>
                        Peça permissão para editar projeto e modelagem.
                      </WorkspaceNavRowDesc>
                    </WorkspaceNavRowBody>
                  </WorkspaceNavRowLocked>
                )}
                {canUpdateProject ? (
                  <WorkspaceNavLinkArchitecture
                    to={`/projects/${project.id}/architecture`}
                  >
                    <WorkspaceNavIconWrap>{iconArch}</WorkspaceNavIconWrap>
                    <WorkspaceNavRowBody>
                      <WorkspaceNavRowTitle>Mapa de arquitetura</WorkspaceNavRowTitle>
                      <WorkspaceNavRowDesc>
                        Serviços, filas e clientes em canvas dedicado.
                      </WorkspaceNavRowDesc>
                    </WorkspaceNavRowBody>
                    <WorkspaceNavChevron aria-hidden>→</WorkspaceNavChevron>
                  </WorkspaceNavLinkArchitecture>
                ) : (
                  <WorkspaceNavRowLocked $variant="architecture">
                    <WorkspaceNavIconWrap>{iconArch}</WorkspaceNavIconWrap>
                    <WorkspaceNavRowBody>
                      <WorkspaceNavRowTitle>Mapa de arquitetura</WorkspaceNavRowTitle>
                      <WorkspaceNavRowDesc>
                        Disponível com permissão de edição do projeto.
                      </WorkspaceNavRowDesc>
                    </WorkspaceNavRowBody>
                  </WorkspaceNavRowLocked>
                )}
                <WorkspaceNavLinkFiles
                  to={
                    isMonorepo
                      ? `/projects/${project.id}/workspace-files`
                      : `/projects/${project.id}/subproject-files`
                  }
                >
                  <WorkspaceNavIconWrap>{iconFiles}</WorkspaceNavIconWrap>
                  <WorkspaceNavRowBody>
                    <WorkspaceNavRowTitle>
                      {isMonorepo ? 'Explorador de arquivos' : 'Arquivos dos subprojetos'}
                    </WorkspaceNavRowTitle>
                    <WorkspaceNavRowDesc>
                      {isMonorepo
                        ? 'Árvore única do monorepo (apps/ e packages/); duplo-clique em um bloco no mapa.'
                        : 'Um repositório por bloco; duplo-clique no mapa abre o subprojeto.'}
                    </WorkspaceNavRowDesc>
                  </WorkspaceNavRowBody>
                  <WorkspaceNavChevron aria-hidden>→</WorkspaceNavChevron>
                </WorkspaceNavLinkFiles>
              </WorkspaceNavList>
            </div>
          </SideOverviewPanel>
        </DetailSideColumn>
      </DetailMain>
    </ProjectDetailRoot>
  )
}
