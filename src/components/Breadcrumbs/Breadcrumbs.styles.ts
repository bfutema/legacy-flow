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
