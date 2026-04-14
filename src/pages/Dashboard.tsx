import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Can } from '../contexts/AbilityContext'
import { PRIMARY_DATABASE_LABELS, PRIMARY_DATABASES } from '../data/databaseEngines'
import { getAllProjects } from '../data/projects'
import { initialDbEdges, initialDbNodes } from '../nodes/initialFlow'
import {
  Card,
  CardTitle,
  ChartBox,
  DashboardRoot,
  Grid,
  Lead,
  PageTitle,
  QuickLinks,
  QuickLinksButton,
  QuickLinksText,
  Stat,
  StatLabel,
  StatRow,
  StatValue,
} from './Dashboard.styles'

/** Série ilustrativa — em produção viria de API/analytics */
const modelingActivity = [
  { m: 'Jan', v: 12 },
  { m: 'Fev', v: 19 },
  { m: 'Mar', v: 16 },
  { m: 'Abr', v: 24 },
  { m: 'Mai', v: 28 },
  { m: 'Jun', v: 32 },
]

export function Dashboard() {
  const theme = useTheme()
  const [listTick, setListTick] = useState(0)
  useEffect(() => {
    const onList = () => setListTick((n) => n + 1)
    window.addEventListener('flow-user-projects-changed', onList)
    return () => window.removeEventListener('flow-user-projects-changed', onList)
  }, [])

  const allProjects = useMemo(() => getAllProjects(), [listTick])

  const projectsByEngine = useMemo(() => {
    const counts = { mysql: 0, postgresql: 0, mssql: 0 } as Record<
      (typeof PRIMARY_DATABASES)[number],
      number
    >
    for (const p of allProjects) {
      counts[p.primaryDatabase]++
    }
    return PRIMARY_DATABASES.map((key) => ({
      name: PRIMARY_DATABASE_LABELS[key],
      value: counts[key],
    }))
  }, [allProjects])

  const projectCount = allProjects.length
  const seedTables = initialDbNodes.length
  const seedRelations = initialDbEdges.length

  return (
    <DashboardRoot>
      <PageTitle>Dashboard</PageTitle>
      <Lead>
        Visão geral da operação de <strong>modelagem de dados</strong>: projetos, diagrama
        de referência e distribuição dos motores SQL usados nas sugestões de tipo no
        editor visual.
      </Lead>
      <StatRow>
        <Stat>
          <StatLabel>Projetos</StatLabel>
          <StatValue>{projectCount}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>Tabelas (diagrama demo)</StatLabel>
          <StatValue>{seedTables}</StatValue>
        </Stat>
        <Stat>
          <StatLabel>Relações (diagrama demo)</StatLabel>
          <StatValue>{seedRelations}</StatValue>
        </Stat>
      </StatRow>
      <Grid>
        <Card>
          <CardTitle>Atividade de modelagem (ilustrativo)</CardTitle>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={modelingActivity}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="dashAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.primary} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={theme.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="m" tick={{ fill: theme.chartAxis, fontSize: 12 }} />
                <YAxis tick={{ fill: theme.chartAxis, fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8,
                  }}
                  labelFormatter={(label) => `${label} · ilustrativo`}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  name="Sessões (ilustrativo)"
                  stroke={theme.primary}
                  fill="url(#dashAreaFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartBox>
        </Card>
        <Card>
          <CardTitle>Projetos por motor SQL</CardTitle>
          <ChartBox>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectsByEngine}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                <XAxis dataKey="name" tick={{ fill: theme.chartAxis, fontSize: 11 }} />
                <YAxis tick={{ fill: theme.chartAxis, fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 8,
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Projetos"
                  fill={theme.primary}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </Card>
      </Grid>
      <QuickLinks>
        <QuickLinksText>
          <strong>Abrir projetos e modelagem</strong>
          <span>
            Cada projeto tem cor primária, motor SQL e diagrama salvo no navegador. Acesse
            a lista para editar ou entrar direto na modelagem ER.
          </span>
        </QuickLinksText>
        <Can I="read" a="Project">
          <QuickLinksButton to="/projects">
            Ver todos os projetos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </QuickLinksButton>
        </Can>
      </QuickLinks>
    </DashboardRoot>
  )
}
