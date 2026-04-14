import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const ReportsRoot = styled.div`
  width: 100%;
  max-width: 100%;
`

export const PageTitle = styled.h1`
  margin: 0 0 0.4rem;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

export const Lead = styled.p`
  margin: 0 0 1.25rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
  max-width: 46rem;
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  padding: 0.65rem 0.85rem;
  border-radius: 0.65rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`

export const ToolbarLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`

export const ToolbarLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
`

export const PeriodSelect = styled.select`
  padding: 0.4rem 2rem 0.4rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  font-size: 0.85rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryMuted};
  }
`

export const ExportGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`

export const ExportBtn = styled.button`
  padding: 0.4rem 0.75rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: not-allowed;
  opacity: 0.72;
`

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.85rem;
  margin-bottom: 1.35rem;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

export const KpiCard = styled.div`
  padding: 1rem 1.05rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const KpiLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.35rem;
`

export const KpiValue = styled.div`
  font-size: 1.65rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.text};
  line-height: 1.15;
`

export const KpiHint = styled.div`
  margin-top: 0.35rem;
  font-size: 0.72rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.textMuted};
`

export const SectionTitle = styled.h2`
  margin: 0 0 0.65rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const ChartCard = styled.div`
  padding: 1rem 1.05rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const ChartCardTitle = styled.h3`
  margin: 0 0 0.15rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const ChartCaption = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.textMuted};
`

export const ChartBox = styled.div`
  height: 240px;
  width: 100%;
`

export const TableSection = styled.section`
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`

export const TableHead = styled.div`
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const TableTitle = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
`

export const Th = styled.th`
  text-align: left;
  padding: 0.65rem 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surfaceHover};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: nowrap;
`

export const Td = styled.td`
  padding: 0.65rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  vertical-align: middle;
`

export const Tr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }

  &:hover td {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const ProjectLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const MutedCell = styled.span`
  color: ${({ theme }) => theme.textMuted};
`

export const EmptyTable = styled.div`
  padding: 1.5rem 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
`
