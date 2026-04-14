import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BrandLink, BrandMark, Card, Wrapper } from './AuthLayout.styles'
import { LoginDemoHelp } from './LoginDemoHelp'

export function AuthLayout() {
  const { userEmail } = useAuth()
  const { pathname } = useLocation()
  const showLoginHelp = pathname === '/login'

  if (userEmail) {
    return <Navigate to="/" replace />
  }

  return (
    <Wrapper>
      <Card>
        {showLoginHelp ? <LoginDemoHelp /> : null}
        <BrandLink to="/login" title="Ir para o login">
          <BrandMark aria-hidden>F</BrandMark>
          Flow Admin
        </BrandLink>
        <Outlet />
      </Card>
    </Wrapper>
  )
}
