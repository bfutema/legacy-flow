import { useAbility } from '@casl/react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  HiArrowRightOnRectangle,
  HiCodeBracketSquare,
  HiKey,
  HiUserCircle,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { AbilityContext } from '../contexts/AbilityContext'
import { useAuth } from '../contexts/AuthContext'
import { getUserByEmail } from '../data/directoryUsers'
import {
  displayNameFromEmail,
  initialsFromDisplayName,
} from '../utils/userDisplay'
import {
  AccountMenuDivider,
  AccountMenuLogoutButton,
  AccountPopoverHeader,
  AccountPopoverHeaderEmail,
  AccountPopoverHeaderName,
  AccountPopoverHeaderText,
  AccountPopoverPanel,
  ProfileAvatar,
  ProfileFooterButton,
  ProfileFooterEmail,
  ProfileFooterMeta,
  ProfileFooterName,
  ToolsMenuBackdrop,
  ToolsMenuItemIcon,
  ToolsMenuItemLink,
  ToolsMenuPanelTitle,
} from './Sidebar.styles'

const ACCOUNT_POPOVER_WIDTH = 280
const ACCOUNT_POPOVER_GAP = 10

const icNav = { size: 18 as const, 'aria-hidden': true as const }

type PopoverPos = { top: number; left: number }

type Props = {
  collapsed: boolean
  mobileDrawer?: boolean
  onNavigate?: () => void
}

export function SidebarAccountPopover({ collapsed, mobileDrawer, onNavigate }: Props) {
  const menuId = useId()
  const { userEmail, logout } = useAuth()
  const ability = useAbility(AbilityContext)
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<PopoverPos | null>(null)

  const dirUser = useMemo(
    () => (userEmail ? getUserByEmail(userEmail) : undefined),
    [userEmail],
  )

  const displayName = dirUser?.name ?? displayNameFromEmail(userEmail ?? '')
  const emailLine = userEmail ?? ''
  const initials = initialsFromDisplayName(displayName)

  const profileTo =
    dirUser && ability.can('read', 'User')
      ? `/users/${dirUser.id}`
      : '/account/profile'

  const canJsonViewer = ability.can('read', 'JsonViewer')

  const close = useCallback(() => setOpen(false), [])

  const layoutPopover = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return
    const br = btn.getBoundingClientRect()
    const margin = 10
    const panelH = panelRef.current?.offsetHeight ?? 200

    let left = br.left + br.width / 2 - ACCOUNT_POPOVER_WIDTH / 2
    left = Math.max(
      margin,
      Math.min(left, window.innerWidth - ACCOUNT_POPOVER_WIDTH - margin),
    )

    let top = br.top - panelH - ACCOUNT_POPOVER_GAP
    if (top < margin) {
      top = br.bottom + ACCOUNT_POPOVER_GAP
    }

    setPos({ top, left })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    layoutPopover()
    let raf0 = 0
    let raf1 = 0
    raf0 = requestAnimationFrame(() => {
      layoutPopover()
      raf1 = requestAnimationFrame(layoutPopover)
    })
    const onResize = () => layoutPopover()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      cancelAnimationFrame(raf0)
      cancelAnimationFrame(raf1)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open, layoutPopover])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent | PointerEvent) => {
      const t = e.target as Node
      if (buttonRef.current?.contains(t) || panelRef.current?.contains(t)) return
      close()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open, close])

  const closeIfDrawer = () => {
    if (mobileDrawer) onNavigate?.()
  }

  const handleLogout = () => {
    close()
    logout()
    navigate('/login', { replace: true })
  }

  if (!userEmail) {
    return null
  }

  const portal =
    open &&
    pos &&
    createPortal(
      <>
        <ToolsMenuBackdrop type="button" aria-label="Fechar menu" onClick={close} />
        <AccountPopoverPanel
          ref={panelRef}
          id={menuId}
          role="dialog"
          aria-label="Conta e ferramentas"
          style={{
            top: pos.top,
            left: pos.left,
            width: ACCOUNT_POPOVER_WIDTH,
          }}
        >
          <AccountPopoverHeader>
            <ProfileAvatar $small>{initials}</ProfileAvatar>
            <AccountPopoverHeaderText>
              <AccountPopoverHeaderName>{displayName}</AccountPopoverHeaderName>
              <AccountPopoverHeaderEmail>{emailLine}</AccountPopoverHeaderEmail>
            </AccountPopoverHeaderText>
          </AccountPopoverHeader>
          <ToolsMenuPanelTitle>Conta</ToolsMenuPanelTitle>
          <ToolsMenuItemLink
            to={profileTo}
            onClick={() => {
              close()
              closeIfDrawer()
            }}
          >
            <ToolsMenuItemIcon>
              <HiUserCircle {...icNav} />
            </ToolsMenuItemIcon>
            Meu perfil
          </ToolsMenuItemLink>
          <ToolsMenuItemLink
            to="/account/password"
            onClick={() => {
              close()
              closeIfDrawer()
            }}
          >
            <ToolsMenuItemIcon>
              <HiKey {...icNav} />
            </ToolsMenuItemIcon>
            Alterar senha
          </ToolsMenuItemLink>
          {canJsonViewer ? (
            <>
              <ToolsMenuPanelTitle>Ferramentas globais</ToolsMenuPanelTitle>
              <ToolsMenuItemLink
                to="/tools/json-viewer"
                onClick={() => {
                  close()
                  closeIfDrawer()
                }}
              >
                <ToolsMenuItemIcon>
                  <HiCodeBracketSquare {...icNav} />
                </ToolsMenuItemIcon>
                JSON Viewer
              </ToolsMenuItemLink>
            </>
          ) : null}
          <AccountMenuDivider />
          <AccountMenuLogoutButton onClick={handleLogout}>
            <HiArrowRightOnRectangle {...icNav} aria-hidden />
            Sair
          </AccountMenuLogoutButton>
        </AccountPopoverPanel>
      </>,
      document.body,
    )

  const showLabels = mobileDrawer || !collapsed

  return (
    <>
      <ProfileFooterButton
        ref={buttonRef}
        $collapsed={collapsed}
        $mobileDrawer={mobileDrawer}
        aria-label={
          showLabels
            ? 'Abrir menu da conta'
            : `Conta: ${displayName}, ${emailLine}`
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <ProfileAvatar>{initials}</ProfileAvatar>
        <ProfileFooterMeta $collapsed={collapsed} $mobileDrawer={mobileDrawer}>
          <ProfileFooterName>{displayName}</ProfileFooterName>
          <ProfileFooterEmail>{emailLine}</ProfileFooterEmail>
        </ProfileFooterMeta>
      </ProfileFooterButton>
      {portal}
    </>
  )
}
