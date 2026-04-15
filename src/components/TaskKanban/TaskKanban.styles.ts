import styled, { css, keyframes } from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../../layouts/adminShellTokens'

/** Sem translate/scale nos ancestrais do drag — o @dnd-kit mede rects com correção de transform. */
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const reduceMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
    transition: none !important;
  }
`

export const Root = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
`

export const Toolbar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  animation: ${fadeIn} 0.48s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
  ${reduceMotion}

  @media ${ADMIN_MOBILE_MEDIA} {
    padding: 0.55rem 0.65rem;
    gap: 0.55rem;
  }
`

export const ToolbarLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
`

export const ToolbarHint = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.4;

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 0.78rem;
    line-height: 1.38;
  }
`

export const ToolbarActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  @media ${ADMIN_MOBILE_MEDIA} {
    width: 100%;
    justify-content: flex-start;
    gap: 0.4rem;
  }
`

export const ToolButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.18s ease,
    box-shadow 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:active {
    transform: scale(0.97);
  }

  ${reduceMotion}

  @media ${ADMIN_MOBILE_MEDIA} {
    padding: 0.4rem 0.65rem;
    font-size: 0.8rem;
    border-radius: 7px;
  }
`

export const ManagePanel = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  transform-origin: top center;
  animation: ${fadeIn} 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
  ${reduceMotion}
`

export const ManageTitle = styled.h3`
  margin: 0 0 0.65rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.textMuted};
`

export const ManageRow = styled.div<{ $index?: number }>`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
  animation: ${fadeIn} 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $index = 0 }) => `${$index * 0.04}`}s;

  @media ${ADMIN_MOBILE_MEDIA} {
    grid-template-columns: 1fr;
  }

  ${reduceMotion}
`

export const ManageInput = styled.input`
  padding: 0.4rem 0.55rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.85rem;
  min-width: 0;
`

export const ColorInput = styled.input`
  width: 2.25rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
`

export const DangerButton = styled.button`
  padding: 0.35rem 0.55rem;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.75rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #ef4444;
    color: #ef4444;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

/** Área rolável horizontal: colunas com altura 100% (estilo Monday). */
export const BoardScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  animation: ${fadeIn} 0.45s ease 0.18s both;
  ${reduceMotion}
`

export const BoardColumns = styled.div`
  display: flex;
  align-items: stretch;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
  width: max-content;

  @media ${ADMIN_MOBILE_MEDIA} {
    gap: 0.65rem;
    padding: 0.65rem 0.65rem 0.75rem;
  }
`

/** Envolve cada coluna para entrada escalonada + ref do sortable. */
export const KanbanColumnWrapper = styled.div<{ $index: number; $dropHighlight?: boolean }>`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 280px;
  height: 100%;
  min-height: 0;
  animation: ${fadeIn} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $index }) => `${0.14 + $index * 0.055}`}s;
  ${reduceMotion}

  ${({ $dropHighlight, theme }) =>
    $dropHighlight
      ? css`
          outline: 2px dashed ${theme.primary};
          outline-offset: 3px;
          border-radius: 12px;
          transition: outline-color 0.15s ease;
        `
      : undefined}

  @media ${ADMIN_MOBILE_MEDIA} {
    width: min(300px, calc(100vw - 2.5rem));
    min-width: 240px;
  }
`

/** Fantasma do drag (overlay): leve rotação estilo Monday. */
export const DragOverlayTilt = styled.div<{ $kind?: 'task' | 'column' }>`
  transform: rotate(${({ $kind }) => ($kind === 'column' ? '-1.25deg' : '-2.75deg')});
  filter: drop-shadow(0 12px 28px rgba(15, 23, 42, 0.2));

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    filter: drop-shadow(0 4px 14px rgba(15, 23, 42, 0.12));
  }
`

type ColumnProps = { $isDragging?: boolean }

export const ColumnShell = styled.div<ColumnProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  flex: 1;
  min-height: 0;
  border-radius: 10px;
  overflow: hidden;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.45 : 1)};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? `color-mix(in srgb, ${theme.surface} 88%, black)`
      : '#f1f5f9'};
  box-shadow: ${({ theme }) =>
    theme.mode === 'dark'
      ? '0 1px 3px rgba(0,0,0,0.35)'
      : '0 1px 2px rgba(15, 23, 42, 0.06)'};
`

export const ColumnHeader = styled.header<{ $headerColor: string }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  background: ${({ $headerColor }) => $headerColor};
  color: #fff;
  cursor: grab;
  user-select: none;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`

export const ColumnTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
`

export const ColumnTitle = styled.h2`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ColumnCount = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  opacity: 0.92;
`

export const ColumnBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0.65rem;
  gap: 0.5rem;
`

export const TaskList = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
`

export const DropTail = styled.div`
  flex-shrink: 0;
  min-height: 28px;
  border-radius: 8px;
  border: 1px dashed transparent;
  transition: border-color 0.15s ease, background 0.15s ease;
`

export const AddTaskBtn = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  padding: 0.45rem;
  margin-top: 0.15rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.18s ease;

  &:hover {
    background: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'};
    color: ${({ theme }) => theme.text};
  }

  &:active {
    transform: scale(0.99);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

type CardProps = { $accent: string; $isDragging?: boolean }

export const TaskCard = styled.article<CardProps>`
  position: relative;
  padding: 0.65rem 0.75rem 0.65rem 0.85rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  cursor: grab;
  touch-action: none;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.35 : 1)};
  /* Sem transform no hover: o @dnd-kit usa rect “agnóstico” ao transform do cartão e o overlay desalinhava. */
  transition:
    opacity 0.2s ease,
    box-shadow 0.22s ease,
    border-color 0.2s ease;

  &:hover {
    box-shadow:
      0 6px 18px rgba(15, 23, 42, 0.1),
      0 1px 2px rgba(15, 23, 42, 0.06);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.2s ease;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 4px;
    border-radius: 2px;
    background: ${({ $accent }) => $accent};
  }

  &:active {
    cursor: grabbing;
  }
`

export const TaskTitle = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  line-height: 1.35;
  padding-left: 0.15rem;
`

export const TaskSubtitle = styled.div`
  margin-top: 0.35rem;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.35;
  padding-left: 0.15rem;
`

export const EmptyColumn = styled.div`
  flex: 1;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.82rem;
  text-align: center;
  animation: ${fadeIn} 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`
