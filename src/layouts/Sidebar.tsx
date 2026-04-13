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

type Props = {
  collapsed: boolean
}

export function Sidebar({ collapsed }: Props) {
  return (
    <Aside $collapsed={collapsed} aria-label="Menu principal">
      <Brand $collapsed={collapsed}>
        {collapsed ? 'F' : 'Flow Admin'}
      </Brand>
      <NavScroll $collapsed={collapsed}>
        <SidebarLink $collapsed={collapsed} to="/" end>
          <NavIcon>{iconDashboard}</NavIcon>
          <NavLabel $collapsed={collapsed}>Dashboard</NavLabel>
        </SidebarLink>
        <SidebarLink $collapsed={collapsed} to="/projects">
          <NavIcon>{iconProjetos}</NavIcon>
          <NavLabel $collapsed={collapsed}>Projetos</NavLabel>
        </SidebarLink>
        <SidebarLink $collapsed={collapsed} to="/users">
          <NavIcon>{iconUsuarios}</NavIcon>
          <NavLabel $collapsed={collapsed}>Usuários</NavLabel>
        </SidebarLink>
        <SidebarLink $collapsed={collapsed} to="/allocations">
          <NavIcon>{iconAlocacoes}</NavIcon>
          <NavLabel $collapsed={collapsed}>Timeline</NavLabel>
        </SidebarLink>
        <SidebarLink $collapsed={collapsed} to="/tasks">
          <NavIcon>{iconKanban}</NavIcon>
          <NavLabel $collapsed={collapsed}>Tarefas</NavLabel>
        </SidebarLink>
        <SidebarLink $collapsed={collapsed} to="/reports">
          <NavIcon>{iconRel}</NavIcon>
          <NavLabel $collapsed={collapsed}>Relatórios</NavLabel>
        </SidebarLink>
      </NavScroll>
      <Footer>
        <FooterText $collapsed={collapsed}>v0.1 · template</FooterText>
      </Footer>
    </Aside>
  )
}
