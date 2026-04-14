import styled from 'styled-components'
import { ADMIN_CONTENT_GUTTER_X } from '../layouts/adminShellTokens'

export const PageRoot = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TopBar = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.75rem ${ADMIN_CONTENT_GUTTER_X} 1rem;
`

export const TitleBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 1rem;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

export const MonthNav = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const MonthBtn = styled.button`
  display: grid;
  place-items: center;
  width: 1.65rem;
  height: 1.65rem;
  padding: 0;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.text};
  }
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`

export const GhostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.95rem;
  border-radius: 0.45rem;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow};

  &:hover {
    filter: brightness(1.06);
  }
`

export const Lead = styled.p`
  margin: 0;
  padding: 0 ${ADMIN_CONTENT_GUTTER_X} 0.85rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
  max-width: 52rem;
`

export const ChartShell = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 0 ${ADMIN_CONTENT_GUTTER_X};
`
