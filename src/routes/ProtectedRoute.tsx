import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute() {
  const { userEmail } = useAuth()
  const location = useLocation()

  if (!userEmail) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
