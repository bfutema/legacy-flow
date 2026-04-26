import styled, { css } from 'styled-components'

const labelBox = css`
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
`

export const EdgeLabel = styled.button<{ $dashed?: boolean }>`
  position: absolute;
  ${labelBox}
  cursor: text;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  ${({ $dashed }) =>
    $dashed
      ? `
    border-style: dashed;
    opacity: 0.95;
  `
      : ''}
`

export const EdgeLabelInput = styled.input<{ $dashed?: boolean }>`
  position: absolute;
  ${labelBox}
  min-width: 7.5rem;
  padding: 0.22rem 0.45rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow:
      0 0 0 2px ${({ theme }) => theme.primaryMuted},
      ${({ theme }) => theme.shadow};
  }

  ${({ $dashed }) =>
    $dashed
      ? `
    border-style: dashed;
    opacity: 0.95;
  `
      : ''}
`
