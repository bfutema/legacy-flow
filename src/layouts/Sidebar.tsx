import { FlowMark } from '../components/Brand'
import { BrandLabel, MarkWrap } from '../components/Brand/FlowLogo.styles'
import { Can } from '../contexts/AbilityContext'
import {
  Aside,
  Brand,
  Footer,
  FooterText,
  NavIcon,
  NavLabel,
  NavScroll,
  SidebarLink,
} from './Sidebar.styles'

const iconDashboard = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
  </svg>
)

const iconRel = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19V5M9 19V9M14 19v-6M19 19V3" />
  </svg>
)

const iconProjetos = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
)

const iconUsuarios = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)

const iconAlocacoes = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 5h7v5H4zM4 14h11v5H4zM13 5h7v5h-7z" />
  </svg>
)

const iconKanban = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h4v16H4V4zm8 3h4v13h-4V7zm8 5h4v8h-4v-8z" />
  </svg>
)

const iconAccess = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

/* Organograma pausado — descomente o ícone e o <SidebarLink> abaixo para reativar o menu.
const iconOrganogram = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="2.5" />
    <path d="M12 7.5v4M7 11.5h10" />
    <circle cx="7" cy="18" r="2.5" />
    <circle cx="17" cy="18" r="2.5" />
    <path d="M7 14v1.5M17 14v1.5" />
  </svg>
)
*/

type Props = {
  collapsed: boolean
  /** Em telas estreitas: sidebar vira gaveta controlada por `mobileOpen`. */
  mobileDrawer?: boolean
  mobileOpen?: boolean
  onNavigate?: () => void
}

export function Sidebar({
  collapsed,
  mobileDrawer = false,
  mobileOpen = false,
  onNavigate,
}: Props) {
  const showLabels = mobileDrawer || !collapsed
  const closeIfDrawer = () => {
    if (mobileDrawer) onNavigate?.()
  }

  return (
    <Aside
      id={mobileDrawer ? 'admin-mobile-nav' : undefined}
      $collapsed={collapsed}
      $mobileDrawer={mobileDrawer}
      $mobileOpen={mobileOpen}
      aria-label="Menu principal"
      aria-hidden={mobileDrawer && !mobileOpen ? true : undefined}
    >
      <Brand
        $collapsed={collapsed}
        $mobileDrawer={mobileDrawer}
        aria-label={!showLabels ? 'Flow Admin' : undefined}
      >
        <MarkWrap>
          <FlowMark size={showLabels ? 28 : 24} />
        </MarkWrap>
        {showLabels ? <BrandLabel>Flow Admin</BrandLabel> : null}
      </Brand>
      <NavScroll $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
        <Can I="read" a="Dashboard">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/"
            end
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconDashboard}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Dashboard
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="Project">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/projects"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconProjetos}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Projetos
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="User">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/users"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconUsuarios}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Usuários
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="Timeline">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/allocations"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconAlocacoes}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Timeline
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="TaskBoard">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/tasks"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconKanban}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Tarefas
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="read" a="Report">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/reports"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconRel}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Relatórios
            </NavLabel>
          </SidebarLink>
        </Can>
        <Can I="manage" a="Security">
          <SidebarLink
            $collapsed={collapsed}
            $mobileDrawer={mobileDrawer}
            to="/access-control"
            onClick={closeIfDrawer}
          >
            <NavIcon>{iconAccess}</NavIcon>
            <NavLabel $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
              Acesso
            </NavLabel>
          </SidebarLink>
        </Can>
        {/* Organograma: rota /organogram ainda existe; descomente ícone + link no topo do arquivo.
        <SidebarLink $collapsed={collapsed} to="/organogram">
          <NavIcon>{iconOrganogram}</NavIcon>
          <NavLabel $collapsed={collapsed}>Organograma</NavLabel>
        </SidebarLink>
        */}
      </NavScroll>
      <Footer>
        <FooterText $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
          v0.1 · template
        </FooterText>
      </Footer>
    </Aside>
  )
}
