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
  padding: 0.75rem 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`

export const FooterText = styled.div<{ $collapsed: boolean; $mobileDrawer?: boolean }>`
  display: ${({ $collapsed, $mobileDrawer }) =>
    $mobileDrawer || !$collapsed ? 'block' : 'none'};
`
