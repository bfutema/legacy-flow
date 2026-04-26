import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textMuted};
  min-width: 0;
`

export const CrumbLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`

export const Sep = styled.span`
  user-select: none;
  opacity: 0.6;
`

export const Current = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const CurrentMenuWrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`

export const CurrentMenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font: inherit;
  font-weight: 500;
  padding: 0.05rem 0.18rem;
  border-radius: 0.35rem;
  cursor: pointer;
  min-width: 0;

  &:hover {
    border-color: ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.surface};
  }
`

export const CurrentMenuPopup = styled.div`
  position: absolute;
  top: calc(100% + 0.35rem);
  right: 0;
  min-width: 13rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 0.28rem;
  z-index: 1200;
`

export const CurrentMenuItem = styled(Link)<{ $active?: boolean }>`
  display: block;
  padding: 0.35rem 0.5rem;
  border-radius: 0.3rem;
  text-decoration: none;
  color: ${({ $active, theme }) => ($active ? theme.text : theme.textMuted)};
  background: ${({ $active, theme }) => ($active ? theme.primaryMuted : 'transparent')};
  font-size: 0.82rem;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.text};
  }
`
