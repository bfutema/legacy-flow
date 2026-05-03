import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ADMIN_HEADER_BAR_HEIGHT, ADMIN_MOBILE_MEDIA } from './adminShellTokens'

export const Aside = styled.aside<{
  $collapsed: boolean
  $mobileDrawer?: boolean
  $mobileOpen?: boolean
}>`
  flex-shrink: 0;
  height: 100vh;
  height: 100dvh;
  background: ${({ theme }) => theme.sidebarBg};
  color: ${({ theme }) => theme.sidebarText};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.border};
  z-index: 2;
  transition:
    width 0.2s ease,
    transform 0.26s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.26s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  ${({ $mobileDrawer, $mobileOpen, $collapsed, theme }) =>
    $mobileDrawer
      ? css`
          position: fixed;
          top: 0;
          left: 0;
          width: min(18.5rem, 90vw);
          max-width: 100%;
          z-index: 55;
          transform: translateX(${ $mobileOpen ? '0' : '-100%' });
          box-shadow: ${$mobileOpen
            ? theme.mode === 'dark'
              ? '8px 0 32px rgba(0,0,0,0.45)'
              : '8px 0 28px rgba(15, 23, 42, 0.18)'
            : 'none'};
        `
      : css`
          width: ${$collapsed ? '4.25rem' : '15.5rem'};
        `}

  @media (prefers-reduced-motion: reduce) {
    transition:
      width 0.2s ease,
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    height: 100dvh;
  }
`

export const Brand = styled.div<{ $collapsed: boolean; $mobileDrawer?: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? '0.5rem' : 0};
  justify-content: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? 'flex-start' : 'center'};
  height: ${ADMIN_HEADER_BAR_HEIGHT};
  min-height: ${ADMIN_HEADER_BAR_HEIGHT};
  max-height: ${ADMIN_HEADER_BAR_HEIGHT};
  flex-shrink: 0;
  padding: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? '0.75rem 0.875rem' : '0.75rem 0'};
  font-weight: 600;
  font-size: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? '1rem' : '0.7rem'};
  letter-spacing: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? '0' : '0.02em'};
  line-height: 1.2;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? 'nowrap' : 'normal'};
  overflow: hidden;
`

export const NavScroll = styled.nav<{ $collapsed: boolean; $mobileDrawer?: boolean }>`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? '0.75rem 0.5rem' : '0.75rem 0.35rem'};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const SidebarLink = styled(NavLink)<{
  $collapsed: boolean
  $mobileDrawer?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? 'flex-start' : 'center'};
  gap: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? '0.65rem' : 0};
  padding: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? '0.6rem 0.65rem' : '0.6rem 0'};
  border-radius: 0.5rem;
  color: inherit;
  text-decoration: none;
  font-size: 0.9rem;
  transition:
    background 0.15s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.sidebarActive};
  }

  &.active {
    background: ${({ theme }) => theme.sidebarActive};
  }
`

export const NavIcon = styled.span`
  display: inline-flex;
  width: 1.35rem;
  height: 1.35rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`

export const NavLabel = styled.span<{ $collapsed: boolean; $mobileDrawer?: boolean }>`
  ${({ $collapsed, $mobileDrawer }) =>
    !$mobileDrawer && $collapsed ? 'display: none;' : ''}
  overflow: hidden;
  white-space: nowrap;
`

export const Footer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0.55rem 0.5rem 0.65rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

export const FooterAccountRow = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: stretch;
`

export const ProfileFooterButton = styled.button.attrs({ type: 'button' })<{
  $collapsed: boolean
  $mobileDrawer?: boolean
}>`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.45rem 0.5rem;
  border: none;
  border-radius: 0.55rem;
  cursor: pointer;
  color: inherit;
  text-align: left;
  font: inherit;
  background: ${({ theme }) => theme.surfaceHover};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.border};
  transition:
    background 0.18s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: ${({ theme }) => theme.sidebarActive};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.primaryMuted};
  }

  &[aria-expanded='true'] {
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.primaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  ${({ $collapsed, $mobileDrawer }) =>
    !$mobileDrawer && $collapsed
      ? css`
          justify-content: center;
          padding-left: 0.35rem;
          padding-right: 0.35rem;
        `
      : undefined}
`

export const ProfileAvatar = styled.span<{ $small?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-weight: 700;
  letter-spacing: 0.02em;
  background: ${({ theme }) => theme.primaryMuted};
  color: ${({ theme }) => theme.primary};

  ${({ $small }) =>
    $small
      ? css`
          width: 2rem;
          height: 2rem;
          font-size: 0.62rem;
        `
      : css`
          width: 2.35rem;
          height: 2.35rem;
          font-size: 0.78rem;
        `}
`

export const ProfileFooterMeta = styled.div<{ $collapsed: boolean; $mobileDrawer?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.06rem;
  min-width: 0;
  flex: 1;

  ${({ $collapsed, $mobileDrawer }) =>
    !$mobileDrawer && $collapsed ? 'display: none;' : ''}
`

export const ProfileFooterName = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ProfileFooterEmail = styled.span`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const AccountPopoverHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem 0.55rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
`

export const AccountPopoverHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-width: 0;
`

export const AccountPopoverHeaderName = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const AccountPopoverHeaderEmail = styled.span`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const AccountMenuDivider = styled.div`
  height: 1px;
  margin: 0.25rem 0;
  background: ${({ theme }) => theme.border};
`

export const AccountMenuLogoutButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.55rem 0.85rem;
  margin-top: 0.15rem;
  border: none;
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  text-align: left;
  color: ${({ theme }) => theme.textMuted};
  background: transparent;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.text};
  }

  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.primaryMuted};
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
    flex-shrink: 0;
  }
`

export const ToolsMenuBackdrop = styled.button.attrs({ type: 'button' })`
  position: fixed;
  inset: 0;
  z-index: 70;
  border: none;
  padding: 0;
  margin: 0;
  cursor: default;
  background: transparent;
`

export const ToolsMenuPanel = styled.div`
  position: fixed;
  z-index: 71;
  min-width: 13.5rem;
  max-width: min(17rem, calc(100vw - 1.25rem));
  padding: 0.45rem 0;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  box-shadow:
    ${({ theme }) => theme.shadow},
    0 12px 40px rgba(15, 23, 42, 0.12);

  ${({ theme }) =>
    theme.mode === 'dark'
      ? css`
          box-shadow:
            ${theme.shadow},
            0 12px 40px rgba(0, 0, 0, 0.45);
        `
      : undefined}
`

export const ToolsMenuPanelTitle = styled.div`
  padding: 0.35rem 0.85rem 0.45rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const ToolsMenuItemIcon = styled.span`
  display: inline-flex;
  width: 1.35rem;
  height: 1.35rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textMuted};

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
`

export const ToolsMenuItemLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.85rem;
  font-size: 0.875rem;
  color: inherit;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.primaryMuted};
  }

  &.active {
    background: ${({ theme }) => theme.primaryMuted};
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
  }

  &.active ${ToolsMenuItemIcon} {
    color: ${({ theme }) => theme.primary};
  }
`

export const AccountPopoverPanel = styled(ToolsMenuPanel)`
  padding: 0;
  min-width: 17rem;
  overflow: hidden;
`
