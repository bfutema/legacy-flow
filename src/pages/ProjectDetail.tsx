import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  isPrimaryDatabaseType,
  PRIMARY_DATABASE_LABELS,
  PRIMARY_DATABASES,
} from '../data/databaseEngines'
import { deleteProject, resolveProjectById } from '../data/projects'
import { useModelingDiagramStats } from '../hooks/useModelingDiagramStats'
import { useProjectPrimaryDatabase } from '../hooks/useProjectPrimaryDatabase'
import { TrashDeleteButton } from '../components/TrashDeleteButton/TrashDeleteButton'
import { PageHeader } from '../layouts/PageHeader'
import {
  BackLink,
  DbHint,
  DbLabel,
  DbSelect,
  DbSettingRow,
  DetailMain,
  DetailMainColumn,
  DetailSideColumn,
  DiagramCard,
  DiagramCardTitle,
  DiagramChartBox,
  DiagramHint,
  ModelagemCard,
  ModelagemDesc,
  ModelagemHint,
  ModelagemTitle,
  ProjectDetailRoot,
  SectionTitle,
  StatPill,
  StatRowMini,
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

export function ProjectDetail() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const [infoTick, setInfoTick] = useState(0)

  useEffect(() => {
    const bump = () => setInfoTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', bump)
    return () => window.removeEventListener('flow-project-meta-changed', bump)
  }, [])

  const project = useMemo(
    () => (projectId ? resolveProjectById(projectId) : undefined),
    [projectId, infoTick],
  )

  const { primaryDatabase, setPrimaryDatabase } =
    useProjectPrimaryDatabase(projectId)
  const { tableCount, relationCount } = useModelingDiagramStats(projectId)

  const chartData = useMemo(
    () => [
      { label: 'Tabelas', q: tableCount },
      { label: 'Relações', q: relationCount },
    ],
    [tableCount, relationCount],
  )

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
          </DiagramCard>
        </DetailMainColumn>
        <DetailSideColumn>
          <SectionTitle>Banco de dados principal</SectionTitle>
          <DbSettingRow>
            <DbLabel htmlFor="project-primary-db">
              Motor SQL usado nas sugestões de tipo na modelagem
            </DbLabel>
            <DbSelect
              id="project-primary-db"
              value={primaryDatabase}
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
            <DbHint>
              Ao editar o tipo de uma coluna no diagrama, o navegador sugere tipos
              típicos deste motor (MySQL, PostgreSQL ou SQL Server).
            </DbHint>
          </DbSettingRow>
          <ModelagemCard to={`/projects/${project.id}/modeling`}>
            <ModelagemTitle>
              {iconDb}
              Modelagem do banco de dados
            </ModelagemTitle>
            <ModelagemDesc>
              Abra o editor visual com grade, controles de zoom e minimapa para
              desenhar tabelas e relacionamentos.
            </ModelagemDesc>
            <ModelagemHint>Clique para abrir →</ModelagemHint>
          </ModelagemCard>
        </DetailSideColumn>
      </DetailMain>
    </ProjectDetailRoot>
  )
}
