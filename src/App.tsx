import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AbilityProvider } from './contexts/AbilityContext'
import { AuthProvider } from './contexts/AuthContext'
import { AppThemeProvider } from './contexts/ThemeContext'
import { AdminLayout } from './layouts/AdminLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { Dashboard } from './pages/Dashboard'
import { DatabaseModeling } from './pages/DatabaseModeling'
import { ForgotPassword } from './pages/ForgotPassword'
import { Login } from './pages/Login'
import { NewProject } from './pages/NewProject'
import { ProjectApfPage } from './pages/ProjectApf/ProjectApfPage'
import { ProjectArchitecture } from './pages/ProjectArchitecture'
import { ProjectDetail } from './pages/ProjectDetail'
import { ProjectEnvVarsPage } from './pages/ProjectEnvVars/ProjectEnvVarsPage'
import { ProjectSettings } from './pages/ProjectSettings'
import { ProjectSqlScripts } from './pages/ProjectSqlScripts'
import { SubprojectFilesHubPage } from './pages/subprojectFiles/SubprojectFilesHubPage'
import { SubprojectFilesViewPage } from './pages/subprojectFiles/SubprojectFilesViewPage'
import { WorkspaceFilesPage } from './pages/subprojectFiles/WorkspaceFilesPage'
import { Projects } from './pages/Projects'
import { Allocations } from './pages/Allocations'
import { OrganogramPage } from './pages/OrganogramPage'
import { Reports } from './pages/Reports'
import { TaskBoard } from './pages/TaskBoard'
import { EditUser } from './pages/EditUser'
import { NewUser } from './pages/NewUser'
import { UserProfile } from './pages/UserProfile'
import { Users } from './pages/Users'
import { ResetPassword } from './pages/ResetPassword'
import { AccessControl } from './pages/AccessControl'
import { AccountPassword } from './pages/AccountPassword'
import { AccountProfile } from './pages/AccountProfile'
import { FlowDesignStudioPage } from './pages/FlowDesignStudioPage'
import { JsonViewerPage } from './pages/JsonViewer/JsonViewerPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RequireAbility } from './routes/RequireAbility'

function RedirectLegacyProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>()
  return <Navigate to={`/projects/${projectId}`} replace />
}

function RedirectLegacyProjectModeling() {
  const { projectId } = useParams<{ projectId: string }>()
  return <Navigate to={`/projects/${projectId}/modeling`} replace />
}

function RedirectLegacyProjectArchitecture() {
  const { projectId } = useParams<{ projectId: string }>()
  return <Navigate to={`/projects/${projectId}/architecture`} replace />
}

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AbilityProvider>
          <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/esqueci-senha"
              element={<Navigate to="/forgot-password" replace />}
            />
            <Route
              path="/redefinir-senha"
              element={<Navigate to="/reset-password" replace />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route
                path="/"
                element={
                  <RequireAbility I="read" a="Dashboard">
                    <Dashboard />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects"
                element={
                  <RequireAbility I="read" a="Project">
                    <Projects />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/new"
                element={
                  <RequireAbility I="create" a="Project">
                    <NewProject />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId"
                element={
                  <RequireAbility I="read" a="Project">
                    <ProjectDetail />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/settings"
                element={
                  <RequireAbility I="read" a="Project">
                    <ProjectSettings />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/environment"
                element={
                  <RequireAbility I="read" a="Project">
                    <ProjectEnvVarsPage />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/modeling"
                element={
                  <RequireAbility I="update" a="Project">
                    <DatabaseModeling />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/sql-scripts"
                element={
                  <RequireAbility I="update" a="Project">
                    <ProjectSqlScripts />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/architecture"
                element={
                  <RequireAbility I="update" a="Project">
                    <ProjectArchitecture />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/apf"
                element={
                  <RequireAbility I="read" a="Project">
                    <ProjectApfPage />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/subproject-files/:nodeId"
                element={
                  <RequireAbility I="read" a="Project">
                    <SubprojectFilesViewPage />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/subproject-files"
                element={
                  <RequireAbility I="read" a="Project">
                    <SubprojectFilesHubPage />
                  </RequireAbility>
                }
              />
              <Route
                path="/projects/:projectId/workspace-files"
                element={
                  <RequireAbility I="read" a="Project">
                    <WorkspaceFilesPage />
                  </RequireAbility>
                }
              />
              <Route
                path="/reports"
                element={
                  <RequireAbility I="read" a="Report">
                    <Reports />
                  </RequireAbility>
                }
              />
              <Route
                path="/organogram"
                element={
                  <RequireAbility I="read" a="Organogram">
                    <OrganogramPage />
                  </RequireAbility>
                }
              />
              <Route
                path="/allocations"
                element={
                  <RequireAbility I="read" a="Timeline">
                    <Allocations />
                  </RequireAbility>
                }
              />
              <Route
                path="/tasks"
                element={
                  <RequireAbility I="read" a="TaskBoard">
                    <TaskBoard />
                  </RequireAbility>
                }
              />
              <Route path="/account/profile" element={<AccountProfile />} />
              <Route path="/account/password" element={<AccountPassword />} />
              <Route
                path="/tools/json-viewer"
                element={
                  <RequireAbility I="read" a="JsonViewer">
                    <JsonViewerPage />
                  </RequireAbility>
                }
              />
              <Route
                path="/tools/flow-design"
                element={
                  <RequireAbility I="read" a="FlowDesign">
                    <FlowDesignStudioPage />
                  </RequireAbility>
                }
              />
              <Route
                path="/users"
                element={
                  <RequireAbility I="read" a="User">
                    <Users />
                  </RequireAbility>
                }
              />
              <Route
                path="/users/new"
                element={
                  <RequireAbility I="create" a="User">
                    <NewUser />
                  </RequireAbility>
                }
              />
              <Route
                path="/users/:userId/edit"
                element={
                  <RequireAbility I="update" a="User">
                    <EditUser />
                  </RequireAbility>
                }
              />
              <Route
                path="/users/:userId"
                element={
                  <RequireAbility I="read" a="User">
                    <UserProfile />
                  </RequireAbility>
                }
              />
              <Route
                path="/access-control"
                element={
                  <RequireAbility I="manage" a="Security">
                    <AccessControl />
                  </RequireAbility>
                }
              />
              <Route
                path="/projetos"
                element={<Navigate to="/projects" replace />}
              />
              <Route
                path="/projetos/novo"
                element={<Navigate to="/projects/new" replace />}
              />
              <Route
                path="/projetos/:projectId"
                element={<RedirectLegacyProjectDetail />}
              />
              <Route
                path="/projetos/:projectId/modelagem"
                element={<RedirectLegacyProjectModeling />}
              />
              <Route
                path="/projetos/:projectId/arquitetura"
                element={<RedirectLegacyProjectArchitecture />}
              />
              <Route
                path="/relatorios"
                element={<Navigate to="/reports" replace />}
              />
              <Route
                path="/alocacoes"
                element={<Navigate to="/allocations" replace />}
              />
              <Route
                path="/tarefas"
                element={<Navigate to="/tasks" replace />}
              />
              <Route
                path="/organograma"
                element={<Navigate to="/organogram" replace />}
              />
              <Route
                path="/controle-acesso"
                element={<Navigate to="/access-control" replace />}
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AbilityProvider>
      </AuthProvider>
    </AppThemeProvider>
  )
}
