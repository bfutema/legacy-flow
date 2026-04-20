import styled from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../layouts/adminShellTokens'

/** Fallback legado (referência) */
export const HEADER_BG = '#3b82f6'

/** Alturas fixas para alinhar handles com o centro de cada linha */
export const HEADER_HEIGHT_PX = 36
export const ROW_HEIGHT_PX = 32

export const NODE_RADIUS = '0.75rem'

export const Root = styled.div<{ $selected?: boolean; $accent: string }>`
  position: relative;
  width: fit-content;
  max-width: min(21rem, 100%);
  min-width: 12.5rem;
  box-sizing: border-box;
  border-radius: ${NODE_RADIUS};
  overflow: visible;
  font-size: 0.8125rem;
  line-height: 1.2;
  font-family: ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, monospace;
  background: ${({ theme }) => theme.surface};
  box-shadow:
    ${({ theme }) => theme.shadow},
    0 0 0 1px
      ${({ $selected, $accent, theme }) =>
        $selected ? $accent : theme.border};

  .table-db-handle {
    width: 10px !important;
    height: 10px !important;
    border-radius: 50%;
    border: 2px solid
      ${({ theme }) => (theme.mode === 'light' ? '#475569' : '#fff')} !important;
    background: ${({ theme }) => theme.textMuted} !important;
    z-index: 2;
  }
`

export const Header = styled.div<{ $accent: string }>`
  height: ${HEADER_HEIGHT_PX}px;
  min-height: ${HEADER_HEIGHT_PX}px;
  max-height: ${HEADER_HEIGHT_PX}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background: ${({ $accent }) => $accent};
  color: #fff;
  text-align: center;
  padding: 0 0.4rem 0 0.5rem;
  font-weight: 600;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  border-radius: ${NODE_RADIUS} ${NODE_RADIUS} 0 0;
  cursor: grab;
  width: 100%;

  &:active {
    cursor: grabbing;
  }
`

export const HeaderTitleWrap = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const HeaderTitleText = styled.span`
  cursor: text;
  user-select: none;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const HeaderActions = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
  min-width: 1.5rem;
`

export const DeleteTableButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.45rem;
  height: 1.45rem;
  padding: 0;
  border: none;
  border-radius: 0.28rem;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.14s ease,
    background 0.14s ease,
    color 0.14s ease;

  ${Root}:hover &,
  ${Root}:focus-within & {
    opacity: 0.95;
    pointer-events: auto;
  }

  &:hover {
    background: rgba(248, 113, 113, 0.25);
    color: #fff;
  }

  &:focus-visible {
    opacity: 1;
    pointer-events: auto;
    outline: 2px solid rgba(255, 255, 255, 0.9);
    outline-offset: 1px;
  }

  svg {
    width: 12px;
    height: 12px;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    opacity: 0.88;
    pointer-events: auto;
    width: 1.35rem;
    height: 1.35rem;
    background: rgba(255, 255, 255, 0.18);
  }
`

export const TitleInput = styled.input`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  text-align: center;
  font: inherit;
  font-weight: 600;
  letter-spacing: inherit;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.35rem;
  padding: 0.2rem 0.4rem;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryMuted};
  }
`

export const FieldNameInput = styled.input`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  font: inherit;
  font-size: inherit;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(255, 255, 255, 0.92)' : 'rgba(15, 23, 42, 0.85)'};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.3rem;
  padding: 0.1rem 0.25rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primaryMuted};
  }
`

export const Body = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.surface};
`

export const Row = styled.div<{
  $stripe: 'even' | 'odd'
  $typeEditing?: boolean
  $constraintsOpen?: boolean
}>`
  display: grid;
  grid-template-columns:
    1.75rem minmax(0, 13rem) minmax(4.5rem, 8rem) 1.35rem minmax(0, max-content);
  align-items: center;
  gap: 0.22rem;
  height: ${ROW_HEIGHT_PX}px;
  min-height: ${ROW_HEIGHT_PX}px;
  max-height: ${ROW_HEIGHT_PX}px;
  box-sizing: border-box;
  padding: 0 0.45rem 0 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $stripe }) =>
    theme.mode === 'light'
      ? $stripe === 'even'
        ? theme.surfaceHover
        : theme.surface
      : $stripe === 'even'
        ? 'rgba(148, 163, 184, 0.07)'
        : 'rgba(15, 23, 42, 0.45)'};
  position: relative;
  z-index: ${({ $typeEditing, $constraintsOpen }) =>
    $typeEditing || $constraintsOpen ? 30 : 'auto'};

  &:first-of-type {
    border-top: none;
  }
`

export const Icons = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.12rem;
  width: 100%;
  max-width: 2.1rem;
  flex-shrink: 0;
`

export const FieldName = styled.span`
  color: ${({ theme }) => theme.text};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  user-select: none;
`

export const FieldTypeColumn = styled.div`
  min-width: 0;
  max-width: 100%;
  padding-left: 0.18rem;
  box-sizing: border-box;
`

export const FieldType = styled.span`
  display: block;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.75rem;
  text-align: right;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  padding: 0.2rem 0.3rem;
  margin: -0.2rem -0.3rem;
  border-radius: 0.35rem;
  transition: background 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryMuted};
  }
`

export const TypeEditCell = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
`

export const TypeSuggestionPanel = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  left: auto;
  min-width: 11rem;
  max-width: min(18rem, 70vw);
  max-height: 11rem;
  overflow-y: auto;
  padding: 0.4rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 40;
`

export const TypeSuggestionHint = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.textMuted};
  padding: 0 0.15rem 0.35rem;
  line-height: 1.3;
`

export const TypeChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`

export const TypeChip = styled.button`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 0.2rem 0.45rem;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  font-size: 0.68rem;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.12s ease,
    border-color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryMuted};
    border-color: ${({ theme }) => theme.primary};
  }
`

export const RowActions = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.15rem;
  flex-shrink: 0;
  min-width: 0;
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition:
    max-width 0.18s ease,
    opacity 0.14s ease;

  ${Row}:hover &,
  ${Row}:focus-within & {
    max-width: 5.75rem;
    opacity: 1;
    pointer-events: auto;
    overflow: visible;
  }
`

export const ReorderGroup = styled.span`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  line-height: 0;
  flex-shrink: 0;
`

export const ReorderFieldButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.15rem;
  height: 0.7rem;
  padding: 0;
  border: none;
  border-radius: 0.2rem;
  background: transparent;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition:
    color 0.12s ease,
    background 0.12s ease;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryMuted};
  }

  &:disabled {
    opacity: 0.42;
    cursor: not-allowed;
  }

  svg {
    width: 10px;
    height: 10px;
  }
`

export const DeleteFieldButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  border-radius: 0.3rem;
  background: transparent;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover:not(:disabled) {
    color: #f87171;
    background: rgba(248, 113, 113, 0.12);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

export const FieldTypeInput = styled.input`
  width: 100%;
  max-width: none;
  min-width: 0;
  box-sizing: border-box;
  font: inherit;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) =>
    theme.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.95)'};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 0.35rem;
  padding: 0.3rem 0.4rem;
  outline: none;
  text-align: right;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryMuted};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }
`

export const HashPrefix = styled.span`
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.7rem;
  flex-shrink: 0;
`

export const FooterBar = styled.div`
  display: flex;
  align-items: stretch;
  border-top: 1px solid ${({ theme }) => theme.border};
  border-radius: 0 0 ${NODE_RADIUS} ${NODE_RADIUS};
  overflow: hidden;
`

export const FooterAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  flex: 1;
  min-width: 0;
  min-height: 2rem;
  padding: 0.4rem 0.35rem;
  margin: 0;
  border: none;
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.6875rem;
  font-family: inherit;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:last-child {
    border-right: none;
  }

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.surfaceHover};
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 0.625rem;
    padding: 0.4rem 0.25rem;
  }
`

/** Rodapé com uma única ação (legado / uso isolado). */
export const Footer = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  min-height: 2rem;
  padding: 0.4rem 0.5rem;
  margin: 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.75rem;
  font-family: inherit;
  cursor: pointer;
  border-radius: 0 0 ${NODE_RADIUS} ${NODE_RADIUS};
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.surfaceHover};
  }
`
