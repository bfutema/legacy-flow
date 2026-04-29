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
import { AbilityContext } from '../contexts/AbilityContext'
import { createDemoArchitectureNodes } from '../components/ProjectArchitectureCanvas/demoInitialArchitecture'
import { deleteProject, resolveProjectById } from '../data/projects'
import { useModelingDiagramStats } from '../hooks/useModelingDiagramStats'
import { useProjectMonorepo } from '../hooks/useProjectMonorepo'
import { loadAllocationsGanttProjects } from '../persistence/allocationsGanttStorage'
import { loadArchitectureFlow } from '../persistence/architectureFlowStorage'
import { FiSettings } from 'react-icons/fi'
import { TrashDeleteButton } from '../components/TrashDeleteButton/TrashDeleteButton'
import { PageHeader } from '../layouts/PageHeader'
import { listArchitectureBlocks } from './subprojectFiles/architectureBlocksLoader'
import { ProjectWorkspaceNav } from './ProjectWorkspaceNav'
import {
  AllocationBarFill,
  AllocationBarTrack,
  AllocationName,
  AllocationRow,
  AllocationRows,
  AllocationValue,
  BackLink,
  DetailMain,
  DetailMainColumn,
  DetailSideColumn,
  DiagramHint,
  HeaderPageActions,
  HeroStatCard,
  HeroStatLabel,
  HeroStatsGrid,
  HeroStatValue,
  PageSettingsLink,
  PageSettingsLinkIcon,
  PageSettingsLinkLabel,
  ProjectAllocationsScroll,
  ProjectAllocationsSection,
  ProjectAllocationsTitle,
  ProjectChartSlot,
  ProjectChartSlotBox,
  ProjectChartsStrip,
  ProjectChartSlotTitle,
  ProjectDetailRoot,
  ProjectOverviewShell,
  ProjectOverviewTitle,
  PanelSectionLabel,
  SideOverviewPanel,
} from './ProjectDetail.styles'

type ProjectChartTab = 'modeling' | 'architecture' | 'coverage'
const CHART_TAB_ORDER: ProjectChartTab[] = ['modeling', 'architecture', 'coverage']

export function ProjectDetail() {
  const theme = useTheme()
  const ability = useAbility(AbilityContext)
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const [infoTick, setInfoTick] = useState(0)
  const [activeChart, setActiveChart] = useState<ProjectChartTab>('modeling')
  const getChartPosition = (tab: ProjectChartTab): 'left' | 'right' | 'center' => {
    const activeIdx = CHART_TAB_ORDER.indexOf(activeChart)
    const tabIdx = CHART_TAB_ORDER.indexOf(tab)
    if (tabIdx < activeIdx) return 'left'
    if (tabIdx > activeIdx) return 'right'
    return 'center'
  }

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

  const { isMonorepo } = useProjectMonorepo(projectId)
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
  const withRuntimeCount = useMemo(
    () => architectureBlocks.filter((b) => Boolean(b.data.runtime)).length,
    [architectureBlocks],
  )
  const projectAllocations = useMemo(() => {
    if (!projectId) return []
    const target = loadAllocationsGanttProjects().find((p) => p.id === projectId)
    if (!target) return []
    const rows = target.users.map((u) => {
      const totalDays = u.bars.reduce(
        (acc, b) => acc + (b.endSerial - b.startSerial + 1),
        0,
      )
      return { id: u.id, name: u.name, totalDays }
    })
    const max = rows.reduce((m, r) => (r.totalDays > m ? r.totalDays : m), 0)
    return rows
      .sort((a, b) => b.totalDays - a.totalDays)
      .slice(0, 7)
      .map((r) => ({
        ...r,
        pct: max > 0 ? Math.max(6, Math.round((r.totalDays / max) * 100)) : 0,
      }))
  }, [projectId])

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
          <HeaderPageActions>
            <PageSettingsLink
              to={`/projects/${project.id}/settings`}
              title="Configurações"
            >
              <PageSettingsLinkIcon aria-hidden>
                <FiSettings size={15} strokeWidth={2} />
              </PageSettingsLinkIcon>
              <PageSettingsLinkLabel>Configurações</PageSettingsLinkLabel>
            </PageSettingsLink>
            {canDeleteProject ? (
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
            ) : null}
          </HeaderPageActions>
        }
      />
      <HeroStatsGrid>
        <HeroStatCard>
          <HeroStatLabel>Subprojetos</HeroStatLabel>
          <HeroStatValue>{architectureBlocks.length}</HeroStatValue>
        </HeroStatCard>
        <HeroStatCard>
          <HeroStatLabel>Ligações no mapa</HeroStatLabel>
          <HeroStatValue>{architectureEdgeCount}</HeroStatValue>
        </HeroStatCard>
        <HeroStatCard>
          <HeroStatLabel>Tabelas modeladas</HeroStatLabel>
          <HeroStatValue>{tableCount}</HeroStatValue>
        </HeroStatCard>
        <HeroStatCard>
          <HeroStatLabel>Blocos com runtime</HeroStatLabel>
          <HeroStatValue>{withRuntimeCount}</HeroStatValue>
        </HeroStatCard>
      </HeroStatsGrid>
      <DetailMain>
        <DetailMainColumn>
          <ProjectOverviewShell>
            <ProjectOverviewTitle>Indicadores e alocações</ProjectOverviewTitle>
            <ProjectChartsStrip>
              <ProjectChartSlot
                type="button"
                $active={activeChart === 'modeling'}
                onClick={() => setActiveChart('modeling')}
                aria-expanded={activeChart === 'modeling'}
                aria-label="Expandir gráfico de modelagem"
              >
                <ProjectChartSlotTitle $active={activeChart === 'modeling'}>
                  Modelagem
                </ProjectChartSlotTitle>
                <ProjectChartSlotBox
                  $active={activeChart === 'modeling'}
                  $position={getChartPosition('modeling')}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 4, right: 8, left: 4, bottom: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fill: theme.chartAxis, fontSize: 10 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={68}
                        tick={{ fill: theme.chartAxis, fontSize: 10 }}
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
                </ProjectChartSlotBox>
              </ProjectChartSlot>
              <ProjectChartSlot
                type="button"
                $active={activeChart === 'architecture'}
                onClick={() => setActiveChart('architecture')}
                aria-expanded={activeChart === 'architecture'}
                aria-label="Expandir gráfico de arquitetura"
              >
                <ProjectChartSlotTitle $active={activeChart === 'architecture'}>
                  Arquitetura
                </ProjectChartSlotTitle>
                <ProjectChartSlotBox
                  $active={activeChart === 'architecture'}
                  $position={getChartPosition('architecture')}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={kindChartData}
                        dataKey="q"
                        nameKey="label"
                        innerRadius={50}
                        outerRadius={86}
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
                </ProjectChartSlotBox>
              </ProjectChartSlot>
              <ProjectChartSlot
                type="button"
                $active={activeChart === 'coverage'}
                onClick={() => setActiveChart('coverage')}
                aria-expanded={activeChart === 'coverage'}
                aria-label="Expandir gráfico de cobertura"
              >
                <ProjectChartSlotTitle $active={activeChart === 'coverage'}>
                  Cobertura
                </ProjectChartSlotTitle>
                <ProjectChartSlotBox
                  $active={activeChart === 'coverage'}
                  $position={getChartPosition('coverage')}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={coverageData}
                      margin={{ top: 4, right: 6, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: theme.chartAxis, fontSize: 11 }}
                        interval={0}
                        angle={-10}
                        textAnchor="end"
                        height={44}
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
                </ProjectChartSlotBox>
              </ProjectChartSlot>
            </ProjectChartsStrip>
            <DiagramHint style={{ marginTop: '0.65rem' }}>
              Tabelas e relações da modelagem, tipos de bloco no mapa e métricas de preenchimento
              (slug, runtime).
            </DiagramHint>
            <ProjectAllocationsSection>
              <ProjectAllocationsTitle>Alocações na timeline</ProjectAllocationsTitle>
              <ProjectAllocationsScroll>
                {projectAllocations.length > 0 ? (
                  <AllocationRows>
                    {projectAllocations.map((row) => (
                      <AllocationRow key={row.id}>
                        <AllocationName title={row.name}>{row.name}</AllocationName>
                        <AllocationBarTrack aria-hidden>
                          <AllocationBarFill $pct={row.pct} />
                        </AllocationBarTrack>
                        <AllocationValue>{row.totalDays} dias</AllocationValue>
                      </AllocationRow>
                    ))}
                  </AllocationRows>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.78rem', color: theme.textMuted }}>
                    Sem alocações registradas para este projeto na timeline.
                  </p>
                )}
              </ProjectAllocationsScroll>
              <DiagramHint style={{ marginTop: '0.65rem', marginBottom: 0 }}>
                Soma dos dias alocados por pessoa, a partir dos dados salvos em Timeline.
              </DiagramHint>
            </ProjectAllocationsSection>
          </ProjectOverviewShell>
        </DetailMainColumn>
        <DetailSideColumn>
          <SideOverviewPanel>
            <div>
              <PanelSectionLabel>Áreas de trabalho</PanelSectionLabel>
              <ProjectWorkspaceNav
                projectId={project.id}
                isMonorepo={isMonorepo}
                canUpdateProject={canUpdateProject}
              />
            </div>
          </SideOverviewPanel>
        </DetailSideColumn>
      </DetailMain>
    </ProjectDetailRoot>
  )
}
