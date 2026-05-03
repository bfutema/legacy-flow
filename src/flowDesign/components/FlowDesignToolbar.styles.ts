import styled from 'styled-components'

export const ToolbarRoot = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
`

export const ToolBtn = styled.button.attrs({ type: 'button' })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.35rem 0.55rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.primaryMuted};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const ToolbarSep = styled.span`
  width: 1px;
  height: 1.25rem;
  background: ${({ theme }) => theme.border};
  margin: 0 0.15rem;
`
