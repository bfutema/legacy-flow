import styled from 'styled-components'

export const PagesList = styled.ul`
  margin: 0;
  padding: 0.35rem 0;
  list-style: none;
`

export const PageRow = styled.li<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.6rem;
  margin: 0 0.35rem 0.2rem;
  border-radius: 0.35rem;
  cursor: pointer;
  font-size: 0.8rem;
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.text)};
  background: ${({ theme, $active }) =>
    $active ? theme.primaryMuted : 'transparent'};
  border: 1px solid transparent;

  &:hover {
    background: ${({ theme, $active }) =>
      $active ? theme.primaryMuted : theme.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 0;
  }
`

export const PageNameInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.78rem;
`

export const PageActions = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
`

export const IconGhostBtn = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  padding: 0;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textMuted};
  background: transparent;

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const PagesFooter = styled.div`
  flex-shrink: 0;
  padding: 0.5rem 0.65rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

export const PrimaryToolbarBtn = styled.button.attrs({ type: 'button' })`
  width: 100%;
  padding: 0.45rem 0.55rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.primaryMuted};
  color: ${({ theme }) => theme.primary};
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    filter: brightness(1.05);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`
