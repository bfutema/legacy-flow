import styled from 'styled-components'
import { ADMIN_CONTENT_GUTTER_X, ADMIN_HEADER_BAR_HEIGHT } from './adminShellTokens'

export const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: nowrap;
  box-sizing: border-box;
  height: ${ADMIN_HEADER_BAR_HEIGHT};
  min-height: ${ADMIN_HEADER_BAR_HEIGHT};
  flex-shrink: 0;
  padding: 0.75rem ${ADMIN_CONTENT_GUTTER_X};
  background: ${({ theme }) => theme.headerBg};
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
`

export const MenuButton = styled.button`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`

export const IconButton = styled.button`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
`

export const UserBadge = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  max-width: 12rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`
