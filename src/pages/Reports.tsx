import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { PRIMARY_DATABASE_LABELS, PRIMARY_DATABASES } from '../data/databaseEngines'
import { getDirectoryUsers } from '../data/directoryUsers'
import { getAllProjects, resolveProjectById } from '../data/projects'
import { initialDbEdges, initialDbNodes } from '../nodes/initialFlow'
import {
  ChartBox,
  ChartCaption,
  ChartCard,
  ChartCardTitle,
  ChartsGrid,
  EmptyTable,
  ExportBtn,
  ExportGroup,
  KpiCard,
  KpiGrid,
  KpiHint,
  KpiLabel,
  KpiValue,
  Lead,
  MutedCell,
  PageTitle,
  PeriodSelect,
  ProjectLink,
  ReportsRoot,
  SectionTitle,
  Table,
  TableHead,
  TableScroll,
  TableSection,
  TableTitle,
  Td,
  Th,
  Toolbar,
  ToolbarLabel,
  ToolbarLeft,
  Tr,
} from './Reports.styles'

const PIE_COLORS = ['#6366f1', '#14b8a6', '#f97316']

const PERIOD_OPTIONS = [
  { value: '30d', label: 'Últimos 30 dias' },
  { value: 'quarter', label: 'Trimestre atual' },
  { value: 'year', label: 'Ano corrente' },
] as const

type PeriodKey = (typeof PERIOD_OPTIONS)[number]['value']

/** Curva ilustrativa de “movimento” na timeline — não há API ainda. */
const TIMELINE_ACTIVITY_MOCK = [
  { p: 'S1', v: 3 },
  { p: 'S2', v: 5 },
  { p: 'S3', v: 4 },
  { p: 'S4', v: 7 },
  { p: 'S5', v: 6 },
  { p: 'S6', v: 8 },
]

function formatTableDate(iso: string): string {
  const d = parseISO(iso)
  return isValid(d) ? format(d, 'dd/MM/yyyy', { locale: ptBR }) : '—'
}

export function Reports() {
  const theme = useTheme()
  const [period, setPeriod] = useState<PeriodKey>('30d')
  const [listTick, setListTick] = useState(0)

  useEffect(() => {
    const bump = () => setListTick((n) => n + 1)
    window.addEventListener('flow-user-projects-changed', bump)
    return () => window.removeEventListener('flow-user-projects-changed', bump)
  }, [])

  const projects = useMemo(() => getAllProjects(), [listTick])
  const activeUsers = useMemo(
    () => getDirectoryUsers().filter((u) => u.status === 'active').length,
    [listTick],
  )
  const userCreatedCount = useMemo(
    () => projects.filter((p) => p.id.startsWith('proj_')).length,
    [projects],
  )

  const engineChartData = useMemo(() => {
    const counts = { mysql: 0, postgresql: 0, mssql: 0 } as Record<
      (typeof PRIMARY_DATABASES)[number],
      number
    >
    for (const p of projects) {
      counts[p.primaryDatabase]++
    }
    return PRIMARY_DATABASES.map((key) => ({
      name: PRIMARY_DATABASE_LABELS[key],
      value: counts[key],
    })).filter((d) => d.value > 0)
  }, [projects])

  const engineBarData = useMemo(
    () =>
      PRIMARY_DATABASES.map((key) => ({
        name: PRIMARY_DATABASE_LABELS[key],
        projetos: projects.filter((p) => p.primaryDatabase === key).length,
      })),
    [projects],
  )

  const tableRows = useMemo(() => {
    return [...projects]
      .map((p) => {
        const v = resolveProjectById(p.id) ?? p
        return {
          id: p.id,
          name: v.name,
          engine: PRIMARY_DATABASE_LABELS[v.primaryDatabase],
          updatedAt: v.updatedAt,
        }
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [projects])

  const periodHint =
    period === '30d'
      ? 'Últimos 30 dias'
      : period === 'quarter'
        ? 'Trimestre atual'
        : 'Ano corrente'

  return (
    <ReportsRoot>
      <PageTitle>Relatórios</PageTitle>
      <Lead>
        Resumo operacional do Flow: quantidade de projetos e usuários, distribuição dos
        motores SQL na modelagem e tabela para auditoria rápida. Os gráficos de tendência
        usam dados ilustrativos até existir integração com analytics.
      </Lead>

      <Toolbar>
        <ToolbarLeft>
          <ToolbarLabel htmlFor="reports-period">Período</ToolbarLabel>
          <PeriodSelect
            id="reports-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodKey)}
            aria-label="Período do relatório"
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </PeriodSelect>
        </ToolbarLeft>
        <ExportGroup>
          <ExportBtn
            type="button"
            disabled
            title="Exportação em uma versão futura do produto"
          >
            Exportar CSV
          </ExportBtn>
          <ExportBtn
            type="button"
            disabled
            title="Exportação em uma versão futura do produto"
          >
            Exportar PDF
          </ExportBtn>
        </ExportGroup>
      </Toolbar>

      <SectionTitle>Indicadores</SectionTitle>
      <KpiGrid>
        <KpiCard>
          <KpiLabel>Projetos</KpiLabel>
          <KpiValue>{projects.length}</KpiValue>
          <KpiHint>Total incluindo demos e projetos criados por você.</KpiHint>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Usuários ativos</KpiLabel>
          <KpiValue>{activeUsers}</KpiValue>
          <KpiHint>Cadastro local e contas demo com status ativo.</KpiHint>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Seus projetos</KpiLabel>
          <KpiValue>{userCreatedCount}</KpiValue>
          <KpiHint>Projetos criados neste navegador a partir de &quot;Novo projeto&quot;.</KpiHint>
        </KpiCard>
        <KpiCard>
          <KpiLabel>Diagrama de referência</KpiLabel>
          <KpiValue>
            {initialDbNodes.length} / {initialDbEdges.length}
          </KpiValue>
          <KpiHint>Tabelas e relações do modelo seed usado na modelagem.</KpiHint>
        </KpiCard>
      </KpiGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartCardTitle>Projetos por motor SQL</ChartCardTitle>
          <ChartCaption>
            Distribuição do campo &quot;Motor SQL&quot; em todos os projetos visíveis.
          </ChartCaption>
          <ChartBox>
            {engineChartData.length === 0 ? (
              <EmptyTable style={{ padding: '2rem 1rem', border: 'none', background: 'transparent' }}>
                Nenhum projeto para exibir.
              </EmptyTable>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engineChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {engineChartData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: theme.surface,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartBox>
        </ChartCard>

        <ChartCard>
          <ChartCardTitle>Atividade na timeline (ilustrativo)</ChartCardTitle>
          <ChartCaption>
            Série de exemplo para {periodHint} — substitua por métricas reais quando a API
            estiver disponível.
          </ChartCaption>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIMELINE_ACTIVITY_MOCK} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportsArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.primary} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="p" tick={{ fill: theme.chartAxis, fontSize: 11 }} />
                <YAxis tick={{ fill: theme.chartAxis, fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  name="Eventos (demo)"
                  stroke={theme.primary}
                  fill="url(#reportsArea)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartBox>
        </ChartCard>
      </ChartsGrid>

      <ChartCard style={{ marginBottom: '1.35rem' }}>
        <ChartCardTitle>Volume por motor (barras)</ChartCardTitle>
        <ChartCaption>Mesma base do gráfico de pizza, em formato comparativo.</ChartCaption>
        <ChartBox style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engineBarData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: theme.chartAxis, fontSize: 11 }} />
              <YAxis tick={{ fill: theme.chartAxis, fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="projetos" fill={theme.primary} radius={[6, 6, 0, 0]} name="Projetos" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartCard>

      <TableSection>
        <TableHead>
          <TableTitle>Projetos (ordenado por última atualização)</TableTitle>
        </TableHead>
        {tableRows.length === 0 ? (
          <EmptyTable>Nenhum projeto listado.</EmptyTable>
        ) : (
          <TableScroll>
            <Table>
              <thead>
                <tr>
                  <Th>Projeto</Th>
                  <Th>Motor SQL</Th>
                  <Th>Atualizado</Th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <Tr key={row.id}>
                    <Td>
                      <ProjectLink to={`/projects/${row.id}`}>{row.name}</ProjectLink>
                    </Td>
                    <Td>
                      <MutedCell>{row.engine}</MutedCell>
                    </Td>
                    <Td>
                      <MutedCell>{formatTableDate(row.updatedAt)}</MutedCell>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </TableSection>
    </ReportsRoot>
  )
}
