import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../../layouts/adminShellTokens'

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const PageRoot = styled.div<{ $theater?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;

  ${({ $theater }) =>
    $theater
      ? css`
          flex: 1;
          gap: 0;
          height: 100%;
        `
      : ''}
`

export const Shell = styled.div<{ $theater?: boolean }>`
  display: grid;
  grid-template-columns: minmax(200px, 15rem) minmax(0, 1fr);
  gap: 0;
  width: 100%;
  min-height: clamp(420px, calc(100dvh - 13rem), 880px);
  border-radius: 0.55rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => (theme.mode === 'dark' ? '#111827' : theme.surface)};
  box-shadow: ${({ theme }) => theme.shadow};

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
    min-height: clamp(360px, calc(100dvh - 12rem), 900px);
  }

  ${({ $theater }) =>
    $theater
      ? css`
          flex: 1;
          min-height: 0;
          height: 100%;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-bottom: none;
          box-shadow: none;
        `
      : ''}
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding: 0.55rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const TreeHeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
`

export const TreeHeaderIconBtn = styled.button`
  width: 1.65rem;
  height: 1.65rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.34rem;
  border: 1px solid transparent;
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.surface};
  }
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

export const BreadcrumbSpacer = styled.span`
  flex: 1;
`

export const EditorThemeSelect = styled.select`
  font: inherit;
  font-size: 0.72rem;
  padding: 0.18rem 0.35rem;
  border-radius: 0.28rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  min-width: 8.25rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
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

export const ToolbarBtn = styled.button<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  border: 1px solid
    ${({ $danger, theme }) => ($danger ? 'rgba(239, 68, 68, 0.45)' : theme.border)};
  background: ${({ $danger, theme }) =>
    $danger
      ? theme.mode === 'dark'
        ? 'rgba(127, 29, 29, 0.4)'
        : 'rgba(254, 226, 226, 0.9)'
      : theme.mode === 'dark'
        ? 'rgba(30, 41, 59, 0.78)'
        : theme.surface};
  color: ${({ $danger, theme }) => ($danger ? '#ef4444' : theme.text)};
  font-size: 0.73rem;
  font-weight: 600;
  line-height: 1;
  border-radius: 0.42rem;
  padding: 0.36rem 0.5rem;
  cursor: pointer;

  &:hover {
    border-color: ${({ $danger, theme }) => ($danger ? '#ef4444' : theme.primary)};
  }
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
  overflow: hidden;
  min-height: 0;
`

export const EditorHost = styled.div`
  width: 100%;
  height: 100%;
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

export const TreeFoldBtn = styled.button`
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
`

export const TreeFoldSpacer = styled.span`
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  display: inline-block;
`

export const TreeInlineInput = styled.input`
  width: 100%;
  min-width: 0;
  font: inherit;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 0.3rem;
  padding: 0.14rem 0.3rem;
  outline: none;
`

export const TreeRowWrap = styled.div`
  position: relative;

  &:hover > [data-tree-actions='true'] {
    opacity: 1;
    pointer-events: auto;
  }
`

export const TreeRowActions = styled.div`
  position: absolute;
  right: 0.28rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  gap: 0.18rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.16s ease;
  padding-left: 0.3rem;
  background: linear-gradient(90deg, transparent, ${({ theme }) => theme.surface} 40%);
`

export const TreeActionBtn = styled.button<{ $danger?: boolean }>`
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 0.3rem;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => (theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.92)' : theme.surface)};
  color: ${({ $danger, theme }) => ($danger ? '#ef4444' : theme.textMuted)};
  cursor: pointer;

  &:hover {
    border-color: ${({ $danger, theme }) => ($danger ? '#ef4444' : theme.primary)};
    color: ${({ $danger, theme }) => ($danger ? '#ef4444' : theme.text)};
  }
`

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.58);
  display: grid;
  place-items: center;
  z-index: 1400;
`

export const ConfirmModal = styled.div`
  width: min(28rem, calc(100vw - 2rem));
  border-radius: 0.62rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 24px 50px rgba(2, 6, 23, 0.35);
  padding: 0.9rem 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`

export const ConfirmTitle = styled.h3`
  margin: 0;
  font-size: 0.92rem;
`

export const ConfirmText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`

export const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
`

export const HubGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr));
  gap: 0.95rem;
  width: 100%;
  margin-top: 0.35rem;
`

export const HubCard = styled(Link)<{ $accent: string }>`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  position: relative;
  overflow: hidden;
  min-height: 6.1rem;
  padding: 1.15rem 1.1rem 1.05rem;
  border-radius: 0.72rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $accent }) =>
    theme.mode === 'dark'
      ? `linear-gradient(135deg, color-mix(in srgb, ${$accent} 16%, ${theme.surface}) 0%, ${theme.surface} 62%)`
      : `linear-gradient(135deg, color-mix(in srgb, ${$accent} 12%, ${theme.surface}) 0%, ${theme.surface} 62%)`};
  text-decoration: none;
  color: inherit;
  box-shadow: ${({ theme }) => theme.shadow};
  transition:
    border-color 0.18s ease,
    transform 0.24s ${easeOut},
    box-shadow 0.24s ${easeOut};

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ $accent }) => $accent},
      color-mix(in srgb, ${({ $accent }) => $accent} 65%, white)
    );
    opacity: 0.9;
  }

  &:hover {
    border-color: ${({ $accent }) => $accent};
    transform: translateY(-3px);
    box-shadow:
      0 14px 30px color-mix(in srgb, ${({ $accent }) => $accent} 24%, transparent),
      0 4px 12px rgba(15, 23, 42, 0.16);
  }

  &:focus-visible {
    outline: 2px solid ${({ $accent }) => $accent};
    outline-offset: 2px;
  }
`

export const HubCardTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.42rem;
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.3;

  svg {
    flex-shrink: 0;
    opacity: 0.92;
  }
`

export const HubCardMeta = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  align-items: center;
  font-size: 0.74rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
  margin-top: auto;
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
  margin: 0.35rem 0 0;
  max-width: 64rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.45;
`
