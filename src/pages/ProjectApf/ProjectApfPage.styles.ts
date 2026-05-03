import styled from 'styled-components'

/** Ocupa a faixa útil do `ContentInner` (padding já aplicado pelo shell admin). */
export const PageRoot = styled.div`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0;
  padding-bottom: 0.25rem;
`

export const SimpleHeader = styled.div`
  margin-bottom: 1.35rem;
`

export const SimpleTitle = styled.h1`
  margin: 0 0 0.45rem;
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
`

export const SimpleActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.45rem;
`

export const Lead = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
`

export const HeaderLead = styled(Lead)`
  margin: 0;
`

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.65rem;
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 1.2rem 1.35rem;
`

/** Cartão da grade de contagem — margem inferior separada do bloco GSC/preço. */
export const CountCard = styled(Card)`
  margin-bottom: 1.25rem;
`

export const CardTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const HintBox = styled.div`
  font-size: 0.76rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
  padding: 0.75rem 0.9rem;
  border-radius: 0.45rem;
  background: ${({ theme }) => theme.surfaceHover};
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 0.95rem;
`

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.75rem;
`

export const Stat = styled.div`
  padding: 0.65rem 0.75rem;
  border-radius: 0.4rem;
  background: ${({ theme }) => theme.surfaceHover};
  border: 1px solid ${({ theme }) => theme.border};
`

export const StatLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.2rem;
`

export const StatValue = styled.div`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  font-variant-numeric: tabular-nums;
`

export const StatValueCurrency = styled(StatValue)`
  font-size: 0.95rem;
`

export const CountTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;

  th,
  td {
    border: 1px solid ${({ theme }) => theme.border};
    padding: 0.45rem 0.6rem;
    text-align: center;
  }

  th:first-child,
  td:first-child {
    text-align: left;
    min-width: 12rem;
  }
`

export const ThMuted = styled.th`
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surfaceHover};
`

export const NumInput = styled.input`
  width: 100%;
  max-width: 5rem;
  margin: 0 auto;
  display: block;
  box-sizing: border-box;
  padding: 0.35rem 0.42rem;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  text-align: center;
  font-size: 0.78rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 0;
  }
`

export const GscGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem 0.85rem;
  align-items: center;
  font-size: 0.78rem;
`

export const GscLabel = styled.label`
  color: ${({ theme }) => theme.text};
`

export const GscInput = styled.input`
  width: 3.25rem;
  padding: 0.35rem 0.42rem;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  text-align: center;
`

export const PriceRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  align-items: flex-end;
  margin-top: 0.85rem;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

export const FieldLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textMuted};
`

export const FieldInput = styled.input`
  padding: 0.42rem 0.6rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  min-width: 7rem;
`

export const BtnSecondary = styled.button.attrs({ type: 'button' })`
  padding: 0.45rem 0.85rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const Details = styled.details`
  margin-top: 0.95rem;
  font-size: 0.76rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;

  summary {
    cursor: pointer;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }
`

export const DetailsBody = styled.p`
  margin: 0.55rem 0 0;
`
