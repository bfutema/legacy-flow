import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BrandLink, BrandMark, Card, Wrapper } from './AuthLayout.styles'

export function AuthLayout() {
  const { userEmail } = useAuth()

  if (userEmail) {
    return <Navigate to="/" replace />
  }

  return (
    <Wrapper>
      <Card>
        <BrandLink to="/login" title="Ir para o login">
          <BrandMark aria-hidden>F</BrandMark>
          Flow Admin
        </BrandLink>
        <Outlet />
      </Card>
    </Wrapper>
  )
}
