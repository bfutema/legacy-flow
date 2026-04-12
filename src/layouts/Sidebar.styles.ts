import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { ADMIN_HEADER_BAR_HEIGHT } from './adminShellTokens'

export const Aside = styled.aside<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? '4.25rem' : '15.5rem')};
  flex-shrink: 0;
  height: 100vh;
  background: ${({ theme }) => theme.sidebarBg};
  color: ${({ theme }) => theme.sidebarText};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.border};
  transition:
    width 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
  z-index: 2;
`

export const Brand = styled.div<{ $collapsed: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  height: ${ADMIN_HEADER_BAR_HEIGHT};
  min-height: ${ADMIN_HEADER_BAR_HEIGHT};
  max-height: ${ADMIN_HEADER_BAR_HEIGHT};
  flex-shrink: 0;
  padding: ${({ $collapsed }) =>
    $collapsed ? '0.75rem 0' : '0.75rem 0.875rem'};
  font-weight: 600;
  font-size: ${({ $collapsed }) => ($collapsed ? '0.7rem' : '1rem')};
  letter-spacing: ${({ $collapsed }) => ($collapsed ? '0.02em' : '0')};
  line-height: 1.2;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: ${({ $collapsed }) => ($collapsed ? 'normal' : 'nowrap')};
  overflow: hidden;
`

export const NavScroll = styled.nav<{ $collapsed: boolean }>`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ $collapsed }) =>
    $collapsed ? '0.75rem 0.35rem' : '0.75rem 0.5rem'};
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const SidebarLink = styled(NavLink)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: ${({ $collapsed }) => ($collapsed ? 0 : '0.65rem')};
  padding: ${({ $collapsed }) =>
    $collapsed ? '0.6rem 0' : '0.6rem 0.65rem'};
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

export const NavLabel = styled.span<{ $collapsed: boolean }>`
  ${({ $collapsed }) => ($collapsed ? 'display: none;' : '')}
  overflow: hidden;
  white-space: nowrap;
`

export const Footer = styled.div`
  padding: 0.75rem 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`

export const FooterText = styled.div<{ $collapsed: boolean }>`
  display: ${({ $collapsed }) => ($collapsed ? 'none' : 'block')};
`
