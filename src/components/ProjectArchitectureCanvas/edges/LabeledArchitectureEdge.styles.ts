import styled from 'styled-components'

export const EdgeLabel = styled.div<{ $dashed?: boolean }>`
  position: absolute;
  padding: 0.2rem 0.45rem;
  border-radius: 0.35rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  pointer-events: all;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  max-width: 8rem;
  text-align: center;
  line-height: 1.2;
  ${({ $dashed }) =>
    $dashed
      ? `
    border-style: dashed;
    opacity: 0.95;
  `
      : ''}
`
