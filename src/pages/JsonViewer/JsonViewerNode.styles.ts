import styled from 'styled-components'

/** Caixa estilo JSON Crack / modelagem ER: fundo sólido, cantos arredondados, sombra flutuante. */
export const JsonNodeCard = styled.div`
  position: relative;
  min-width: 15rem;
  max-width: 22rem;
  border-radius: 0.625rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  line-height: 1.45;
  overflow: visible;
  box-shadow: ${({ theme }) =>
    theme.mode === 'dark'
      ? `0 0 0 1px rgba(148, 163, 184, 0.1), 0 4px 6px rgba(0, 0, 0, 0.25),
         0 14px 36px rgba(0, 0, 0, 0.45)`
      : `0 1px 2px rgba(15, 23, 42, 0.06), 0 6px 16px rgba(15, 23, 42, 0.08),
         0 14px 32px rgba(15, 23, 42, 0.06)`};
`

/** Faixa superior tipo “título da entidade”. */
export const JsonNodeHeader = styled.div`
  position: relative;
  padding: 0.45rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  font-weight: 700;
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.textMuted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
`

export const JsonNodeBody = styled.div`
  display: flex;
  flex-direction: column;
`

/** Uma linha = um campo (como colunas num diagrama de banco). */
export const JsonTableRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 1.8125rem;
  padding: 0.35rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  box-sizing: border-box;
  gap: 0.45rem;

  &:last-child {
    border-bottom: none;
  }
`

export const PrimitiveRowGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 0.55rem;
  align-items: center;
  width: 100%;
  min-width: 0;
`

export const NestedRowFlex = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  min-width: 0;
  flex: 1;
`

export const JsonKey = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  word-break: break-word;
`

export const JsonValue = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 400;
  font-size: 0.72rem;
  word-break: break-word;
  text-align: right;
`

export const JsonValueCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
  min-width: 0;
`

export const ColorSwatch = styled.span<{ $hex: string }>`
  flex-shrink: 0;
  width: 0.8125rem;
  height: 0.8125rem;
  border-radius: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ $hex }) => $hex};
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
`

export const ToggleNestBtn = styled.button.attrs({ type: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  padding: 0;
  margin: 0;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.25rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.surfaceHover : theme.surface};
  font-size: 0.7rem;
  line-height: 1;
  transition:
    background 0.12s ease,
    color 0.12s ease,
    border-color 0.12s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.primaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const NestedSummary = styled.span`
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.7rem;
  font-weight: 500;
`

export const TruncNote = styled.div`
  width: 100%;
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
  font-style: italic;
`
