import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppThemeProvider } from './contexts/ThemeContext'
import { AdminLayout } from './layouts/AdminLayout'
import { AuthLayout } from './layouts/AuthLayout'
import { Dashboard } from './pages/Dashboard'
import { DatabaseModeling } from './pages/DatabaseModeling'
import { ForgotPassword } from './pages/ForgotPassword'
import { Login } from './pages/Login'
import { NewProject } from './pages/NewProject'
import { ProjectDetail } from './pages/ProjectDetail'
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
import { ProtectedRoute } from './routes/ProtectedRoute'

function RedirectLegacyProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>()
  return <Navigate to={`/projects/${projectId}`} replace />
}

function RedirectLegacyProjectModeling() {
  const { projectId } = useParams<{ projectId: string }>()
  return <Navigate to={`/projects/${projectId}/modeling`} replace />
}

export default function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/new" element={<NewProject />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route
                path="/projects/:projectId/modeling"
                element={<DatabaseModeling />}
              />
              <Route path="/reports" element={<Reports />} />
              <Route path="/organogram" element={<OrganogramPage />} />
              <Route path="/allocations" element={<Allocations />} />
              <Route path="/tasks" element={<TaskBoard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/new" element={<NewUser />} />
              <Route path="/users/:userId/edit" element={<EditUser />} />
              <Route path="/users/:userId" element={<UserProfile />} />
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
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </AppThemeProvider>
  )
}
