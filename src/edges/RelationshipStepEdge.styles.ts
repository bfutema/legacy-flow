import styled from 'styled-components'

export const CardinalityBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  padding: 0.15rem 0.35rem;
  font-size: 0.65rem;
  font-weight: 600;
  font-family: ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, monospace;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.3rem;
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: pointer;
  user-select: none;
`
