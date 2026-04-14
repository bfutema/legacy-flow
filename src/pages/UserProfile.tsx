import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
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
  PRIMARY_DATABASE_LABELS,
  type PrimaryDatabaseType,
} from '../data/databaseEngines'
import { Can } from '../contexts/AbilityContext'
import { getUserById } from '../data/directoryUsers'
import { resolveProjectById } from '../data/projects'
import { getProjectIdsForUser } from '../data/userProjectAssociations'
import { formatDisplayDate } from '../utils/formatDisplayDate'
import { BackLink } from './ProjectDetail.styles'
import {
  Avatar,
  ChartBox,
  ChartCard,
  ChartHint,
  ChartTitle,
  EditLink,
  FuturePanel,
  FutureText,
  FutureTitle,
  HeaderActions,
  HeaderText,
  MainGrid,
  ProfileHeader,
  ProfileMeta,
  ProfileRoot,
  ProfileTitle,
  ProjectLink,
  ProjectListCard,
  ProjectListTitle,
  SideStack,
} from './UserProfile.styles'

function initialLetter(name: string): string {
  const t = name.trim()
  return t ? t[0]!.toUpperCase() : '?'
}

export function UserProfile() {
  const theme = useTheme()
  const { userId } = useParams<{ userId: string }>()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const bump = () => setTick((n) => n + 1)
    window.addEventListener('flow-app-users-changed', bump)
    window.addEventListener('flow-project-meta-changed', bump)
    return () => {
      window.removeEventListener('flow-app-users-changed', bump)
      window.removeEventListener('flow-project-meta-changed', bump)
    }
  }, [])

  const user = useMemo(
    () => (userId ? getUserById(userId) : undefined),
    [userId, tick],
  )

  const resolvedProjects = useMemo(() => {
    if (!userId) return []
    return getProjectIdsForUser(userId)
      .map((id) => resolveProjectById(id))
      .filter(Boolean) as NonNullable<ReturnType<typeof resolveProjectById>>[]
  }, [userId, tick])

  const engineChartData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of resolvedProjects) {
      const k = p.primaryDatabase
      counts[k] = (counts[k] ?? 0) + 1
    }
    return Object.entries(counts).map(([key, q]) => ({
      label:
        PRIMARY_DATABASE_LABELS[key as PrimaryDatabaseType] ?? key,
      q,
    }))
  }, [resolvedProjects])

  if (!userId) {
    return <Navigate to="/users" replace />
  }

  if (!user) {
    return <Navigate to="/users" replace />
  }

  return (
    <ProfileRoot>
      <BackLink to="/users">← Voltar aos usuários</BackLink>
      <ProfileHeader>
        <Avatar aria-hidden>{initialLetter(user.name)}</Avatar>
        <HeaderText>
          <ProfileTitle>{user.name}</ProfileTitle>
          <ProfileMeta>
            {user.email}
            <br />
            {user.role} · {user.status === 'active' ? 'Ativo' : 'Inativo'}
            <br />
            Membro desde {formatDisplayDate(user.createdAt)}
          </ProfileMeta>
        </HeaderText>
        <HeaderActions>
          <Can I="update" a="User">
            <EditLink to={`/users/${user.id}/edit`}>Editar dados</EditLink>
          </Can>
        </HeaderActions>
      </ProfileHeader>

      <MainGrid>
        <ChartCard>
          <ChartTitle>Projetos associados por motor SQL</ChartTitle>
          {engineChartData.length > 0 ? (
            <>
              <ChartBox>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={engineChartData}
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
                      width={100}
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
                      name="Projetos"
                      fill={theme.primary}
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>
              <ChartHint>
                Distribuição ilustrativa dos projetos em que este usuário participa.
                Em produção, os vínculos viriam da API.
              </ChartHint>
            </>
          ) : (
            <ChartHint>Nenhum projeto associado neste exemplo.</ChartHint>
          )}
        </ChartCard>

        <SideStack>
          <ProjectListCard>
            <ProjectListTitle>
              Projetos ({resolvedProjects.length})
            </ProjectListTitle>
            {resolvedProjects.map((p) => (
              <ProjectLink key={p.id} to={`/projects/${p.id}`}>
                {p.name}
              </ProjectLink>
            ))}
          </ProjectListCard>
          <FuturePanel>
            <FutureTitle>Espaço para evoluir</FutureTitle>
            <FutureText>
              Esta área pode receber auditoria, permissões granulares, histórico de
              acesso, notificações ou integrações — a estrutura da página já separa
              visão geral (gráficos) e painéis laterais.
            </FutureText>
          </FuturePanel>
        </SideStack>
      </MainGrid>
    </ProfileRoot>
  )
}
