import styled from 'styled-components'

export const Root = styled.div`
  width: 100%;
  max-width: 100%;
`

export const PageTitle = styled.h1`
  margin: 0 0 0.35rem;
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
  max-width: 48rem;
`

export const AdminNote = styled.div`
  margin-bottom: 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.primaryMuted};
  font-size: 0.88rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.text};
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

export const GhostBtn = styled.button`
  padding: 0.45rem 0.85rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const PrimaryBtn = styled.button`
  padding: 0.45rem 0.95rem;
  border-radius: 0.45rem;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    filter: brightness(1.06);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const TableScroll = styled.div`
  overflow-x: auto;
  border-radius: 0.65rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`

export const Table = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-size: 0.86rem;
`

export const Th = styled.th`
  text-align: left;
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textMuted};
  font-weight: 600;
  background: ${({ theme }) => theme.surfaceHover};
`

export const ThCenter = styled(Th)`
  text-align: center;
  width: 6.5rem;
`

export const Td = styled.td`
  padding: 0.55rem 0.85rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  vertical-align: middle;
`

export const TdCenter = styled(Td)`
  text-align: center;
`

export const GroupRow = styled.tr`
  background: ${({ theme }) => theme.bg};
`

export const GroupCell = styled.td`
  padding: 0.45rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const Muted = styled.span`
  display: block;
  font-size: 0.76rem;
  font-weight: 400;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 0.15rem;
`

export const Check = styled.input`
  width: 1.05rem;
  height: 1.05rem;
  cursor: pointer;
`

export const SavedFlash = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.textMuted};
`
