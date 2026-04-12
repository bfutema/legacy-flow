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
