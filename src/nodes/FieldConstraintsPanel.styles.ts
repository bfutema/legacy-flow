import styled from 'styled-components'

export const ConstraintsWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
`

export const ConstraintsButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  border: none;
  border-radius: 0.3rem;
  background: ${({ $active, theme }) =>
    $active ? theme.primaryMuted : 'transparent'};
  color: ${({ $active, theme }) => ($active ? theme.primary : theme.textMuted)};
  cursor: pointer;
  transition:
    color 0.12s ease,
    background 0.12s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.surfaceHover};
  }

  svg {
    width: 13px;
    height: 13px;
  }
`

export const ConstraintsPanel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 45;
  min-width: 13.5rem;
  max-width: min(17rem, 85vw);
  padding: 0.45rem 0.5rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  text-align: left;
`

export const ConstraintsTitle = styled.div`
  font-size: 0.65rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const ConstraintsRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  margin-bottom: 0.35rem;
  user-select: none;

  input[type='checkbox'] {
    accent-color: ${({ theme }) => theme.primary};
    width: 0.85rem;
    height: 0.85rem;
  }

  &:has(input:disabled) {
    opacity: 0.75;
    cursor: not-allowed;
  }
`

export const ConstraintsHint = styled.div`
  font-size: 0.6rem;
  color: ${({ theme }) => theme.textMuted};
  margin: -0.15rem 0 0.35rem 1.25rem;
  line-height: 1.25;
`

export const DefaultBlock = styled.div`
  margin-top: 0.35rem;
  padding-top: 0.35rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

export const DefaultInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  margin-top: 0.25rem;
  font: inherit;
  font-size: 0.68rem;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.surfaceHover};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.3rem;
  padding: 0.25rem 0.35rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const SuggestionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.3rem;
`

export const SuggestionChip = styled.button`
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  font-size: 0.62rem;
  font-family: inherit;
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryMuted};
  }
`
