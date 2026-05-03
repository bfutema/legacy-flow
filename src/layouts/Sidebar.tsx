import {
  HiCalendarDays,
  HiChartBar,
  HiFolder,
  HiShieldCheck,
  HiSquares2X2,
  HiUsers,
  HiViewColumns,
} from 'react-icons/hi2'
import { FlowMark } from '../components/Brand'
import { BrandLabel, MarkWrap } from '../components/Brand/FlowLogo.styles'
import { Can } from '../contexts/AbilityContext'
import {
  Aside,
  Brand,
  Footer,
  FooterAccountRow,
  NavIcon,
  NavLabel,
  NavScroll,
  SidebarLink,
} from './Sidebar.styles'
import { SidebarAccountPopover } from './SidebarAccountPopover'

const navIc = { size: 18 as const, 'aria-hidden': true as const }

const iconDashboard = <HiSquares2X2 {...navIc} />
const iconRel = <HiChartBar {...navIc} />
const iconProjetos = <HiFolder {...navIc} />
const iconUsuarios = <HiUsers {...navIc} />
const iconAlocacoes = <HiCalendarDays {...navIc} />
const iconKanban = <HiViewColumns {...navIc} />
const iconAccess = <HiShieldCheck {...navIc} />
/* Organograma pausado — descomente HiShare em react-icons/hi2 e o <SidebarLink> abaixo.
const iconOrganogram = <HiShare {...navIc} />
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
        <FooterAccountRow>
          <SidebarAccountPopover
            collapsed={collapsed}
            mobileDrawer={mobileDrawer}
            onNavigate={onNavigate}
          />
        </FooterAccountRow>
      </Footer>
    </Aside>
  )
}
