import styled from 'styled-components'

export const EnvToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
`

export const EnvBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.42rem 0.85rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.78rem;
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

export const EnvBtnPrimary = styled(EnvBtn)`
  background: ${({ theme }) => theme.primaryMuted};
  color: ${({ theme }) => theme.primary};
  border-color: transparent;
`

export const EnvError = styled.div`
  padding: 0.55rem 0.75rem;
  border-radius: 0.4rem;
  background: color-mix(in srgb, #dc2626 12%, transparent);
  border: 1px solid color-mix(in srgb, #dc2626 35%, transparent);
  color: #b91c1c;
  font-size: 0.78rem;
  margin-bottom: 0.85rem;
`

export const EnvTableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.55rem;
  background: ${({ theme }) => theme.surface};
`

export const EnvTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
`

export const EnvTh = styled.th`
  text-align: left;
  padding: 0.55rem 0.75rem;
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.textMuted};
  font-weight: 700;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const EnvTd = styled.td`
  padding: 0.45rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  vertical-align: middle;

  tr:last-child & {
    border-bottom: none;
  }
`

export const EnvEmptyTd = styled(EnvTd)`
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.78rem;
`

export const EnvKeyInput = styled.input`
  width: 100%;
  min-width: 10rem;
  max-width: 22rem;
  box-sizing: border-box;
  padding: 0.38rem 0.5rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.78rem;

  &:disabled {
    opacity: 0.65;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 0;
    border-color: transparent;
  }
`

export const EnvValueInput = styled.input`
  width: 100%;
  min-width: 12rem;
  box-sizing: border-box;
  padding: 0.38rem 0.5rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.78rem;

  &:disabled {
    opacity: 0.65;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 0;
    border-color: transparent;
  }
`

export const EnvRemoveBtn = styled.button.attrs({ type: 'button' })`
  padding: 0.32rem 0.55rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.72rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: #b91c1c;
    border-color: color-mix(in srgb, #dc2626 40%, ${({ theme }) => theme.border});
    background: color-mix(in srgb, #dc2626 8%, transparent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const EnvHint = styled.p`
  margin: 0.85rem 0 0;
  font-size: 0.76rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`
