import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../../layouts/adminShellTokens'

export const PageRoot = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
`

export const Shell = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 15rem) minmax(0, 1fr) minmax(0, 13rem);
  gap: 0;
  width: 100%;
  min-height: clamp(420px, calc(100dvh - 13rem), 880px);
  border-radius: 0.65rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
    min-height: clamp(360px, calc(100dvh - 12rem), 900px);
  }
`

export const TreeColumn = styled.aside`
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(2, 6, 23, 0.55)' : theme.surfaceHover};

  @media (max-width: 960px) {
    max-height: 220px;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`

export const TreeHeader = styled.div`
  padding: 0.55rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const TreeSearch = styled.input`
  margin: 0.45rem 0.55rem 0.35rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.75rem;
  width: calc(100% - 1.1rem);
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`

export const TreeScroll = styled.div`
  flex: 1;
  overflow: auto;
  padding: 0.25rem 0 0.5rem;
  font-size: 0.8rem;
`

export const MainColumn = styled.main`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: ${({ theme }) => theme.surface};
`

export const BreadcrumbBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.2rem 0.35rem;
  padding: 0.5rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.78rem;
  font-family: ui-monospace, 'Cascadia Code', monospace;
`

export const CrumbSep = styled.span`
  color: ${({ theme }) => theme.textMuted};
  user-select: none;
`

export const CrumbPart = styled.span<{ $active?: boolean }>`
  color: ${({ $active, theme }) => ($active ? theme.text : theme.primary)};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: ${({ $active }) => ($active ? 'default' : 'pointer')};

  &:hover {
    text-decoration: ${({ $active }) => ($active ? 'none' : 'underline')};
  }
`

export const CrumbLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  font-weight: 400;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const MetaBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.85rem;
  padding: 0.45rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
`

export const TabRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const Tab = styled.span<{ $active?: boolean }>`
  padding: 0.45rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? theme.text : theme.textMuted)};
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  margin-bottom: -1px;
`

export const CodeScroll = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;
`

export const CodeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 0.72rem;
  line-height: 1.45;
`

export const LineNo = styled.td`
  width: 2.75rem;
  padding: 0 0.5rem 0 0.65rem;
  text-align: right;
  vertical-align: top;
  color: ${({ theme }) => theme.textMuted};
  user-select: none;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.65)' : theme.surfaceHover};
  border-right: 1px solid ${({ theme }) => theme.border};
`

export const LineCode = styled.td`
  padding: 0 0.65rem;
  white-space: pre;
  color: ${({ theme }) => theme.text};
`

export const SymbolsColumn = styled.aside`
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-left: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(2, 6, 23, 0.45)' : theme.surfaceHover};

  @media (max-width: 960px) {
    display: none;
  }
`

export const SymbolsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.55rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const SymbolsSearch = styled(TreeSearch)`
  margin: 0.45rem 0.55rem;
  width: calc(100% - 1.1rem);
`

export const SymbolsScroll = styled(TreeScroll)`
  padding-top: 0.15rem;
`

export const SymbolRow = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.3rem 0.55rem;
  border: none;
  background: transparent;
  font-size: 0.72rem;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: ${({ theme }) => theme.primary};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.primaryMuted};
  }
`

export const TreeRowBtn = styled.button<{ $depth: number; $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  width: 100%;
  text-align: left;
  padding: 0.22rem 0.45rem 0.22rem calc(0.45rem + ${({ $depth }) => $depth * 0.65}rem);
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.primaryMuted : 'transparent'};
  font-size: 0.78rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const HubGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.85rem;
  width: 100%;
`

export const HubCard = styled(Link)`
  display: block;
  padding: 1rem 1.1rem;
  border-radius: 0.65rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  text-decoration: none;
  color: inherit;
  box-shadow: ${({ theme }) => theme.shadow};
  transition:
    border-color 0.15s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
`

export const HubCardTitle = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
  color: ${({ theme }) => theme.text};
`

export const HubCardMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`

export const HubEmpty = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
`

export const BackLinkStyled = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 1.1rem;
  }
`

export const PageDesc = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.45;
`
