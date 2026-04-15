import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useThemeMode } from '../contexts/ThemeContext'
import { Breadcrumbs } from '../components/Breadcrumbs/Breadcrumbs'
import {
  Bar,
  IconButton,
  Left,
  MenuButton,
  Right,
  UserBadge,
} from './Header.styles'

type Props = {
  onToggleSidebar: () => void
  /** Modo gaveta (mobile): controla rótulos ARIA do botão menu. */
  mobileNav?: boolean
  mobileNavOpen?: boolean
}

const iconMenu = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const iconSun = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const iconMoon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
)

const iconLogout = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)

export function Header({
  onToggleSidebar,
  mobileNav = false,
  mobileNavOpen = false,
}: Props) {
  const { mode, toggleTheme } = useThemeMode()
  const { userEmail, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Bar>
      <Left>
        <MenuButton
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            mobileNav
              ? mobileNavOpen
                ? 'Fechar menu'
                : 'Abrir menu'
              : 'Recolher ou expandir menu lateral'
          }
          aria-expanded={mobileNav ? mobileNavOpen : undefined}
          aria-controls={mobileNav ? 'admin-mobile-nav' : undefined}
        >
          {iconMenu}
        </MenuButton>
        <Breadcrumbs />
      </Left>
      <Right>
        {userEmail ? (
          <UserBadge title={userEmail}>{userEmail}</UserBadge>
        ) : null}
        <IconButton
          type="button"
          onClick={toggleTheme}
          aria-label={mode === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
        >
          {mode === 'light' ? iconMoon : iconSun}
        </IconButton>
        <IconButton
          type="button"
          onClick={handleLogout}
          aria-label="Sair"
          title="Sair"
        >
          {iconLogout}
        </IconButton>
      </Right>
    </Bar>
  )
}
