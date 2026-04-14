import styled from 'styled-components'

export const ScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: auto;
  padding: 1rem clamp(1rem, 3vw, 2rem) 2rem;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
`

export const Forest = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: clamp(2.5rem, 4vw, 4.5rem);
  width: max-content;
  min-width: 100%;
  box-sizing: border-box;
  padding-bottom: 0.5rem;
`

export const TreeRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 0 0 auto;
  width: max-content;
  max-width: 100%;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: max-content;
  max-width: 100%;
  min-width: 0;
`

/** Filhos diretos no mesmo nível: mesma largura base para alinhar o SVG ao centro de cada coluna. */
export const BranchColumn = styled.div`
  flex: 1 1 260px;
  min-width: 248px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`

export const GroupRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
`

export const PersonRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: center;
  gap: 0.85rem;
  width: 100%;
  box-sizing: border-box;
`

export const PersonBranchColumn = styled.div`
  flex: 1 1 140px;
  min-width: 136px;
  max-width: 180px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`

export const ConnectorSlot = styled.div`
  width: 100%;
  align-self: stretch;
  flex-shrink: 0;
  margin: 0.15rem 0 0.35rem;
`

export const GroupCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  min-width: 0;
  padding: 0;
  border-radius: 0.65rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  box-sizing: border-box;
`

export const GroupCardInner = styled.div`
  position: relative;
  padding: 0.85rem 0.95rem 1.85rem;
`

export const CardFooterExpand = styled.div`
  display: flex;
  justify-content: center;
  padding: 0.45rem 0.65rem 0.55rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

export const AccentCorner = styled.span<{ $color: string }>`
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`

export const GroupTitle = styled.h3`
  margin: 0 1.35rem 0.5rem 0;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.text};
`

export const CountLine = styled.p`
  margin: 0 0 0.45rem;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
`

export const MetricsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

export const Metric = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.text};
`

export const MetricLabel = styled.span`
  color: ${({ theme }) => theme.textMuted};
`

export const DeltaBadge = styled.span<{ $positive?: boolean }>`
  padding: 0.12rem 0.4rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  background: ${({ $positive }) =>
    $positive ? 'rgba(34, 197, 94, 0.18)' : 'rgba(248, 113, 113, 0.18)'};
  color: ${({ $positive }) => ($positive ? '#22c55e' : '#f87171')};
`

export const KebabBtn = styled.button`
  position: absolute;
  bottom: 0.5rem;
  right: 0.55rem;
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.text};
  }
`

export const ExpandBtn = styled.button<{ $accent: string }>`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  margin: 0;
  padding: 0;
  border-radius: 999px;
  border: 2px solid ${({ $accent }) => $accent};
  background: ${({ theme }) => theme.surface};
  color: ${({ $accent }) => $accent};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`

export const PersonCard = styled.article`
  width: 100%;
  max-width: 180px;
  min-width: 0;
  padding: 0.65rem 0.7rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.35rem;
`

export const Avatar = styled.div`
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.primaryMuted};
  border: 1px solid ${({ theme }) => theme.border};
`

export const PersonName = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;
`

export const PersonRole = styled.div`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
`

export const PersonMetric = styled.div`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
`

export const EmptyHint = styled.p`
  margin: 0.65rem 0 0;
  padding: 0.5rem 0.65rem;
  font-size: 0.75rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.textMuted};
  text-align: center;
  max-width: 260px;
  border-radius: 0.45rem;
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  box-sizing: border-box;
`
