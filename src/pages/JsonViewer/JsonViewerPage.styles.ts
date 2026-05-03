import styled from 'styled-components'
import { ADMIN_HEADER_BAR_HEIGHT, ADMIN_MOBILE_MEDIA } from '../../layouts/adminShellTokens'

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100dvh - ${ADMIN_HEADER_BAR_HEIGHT});
  min-height: 0;
  box-sizing: border-box;
`

export const TopStrip = styled.div`
  flex-shrink: 0;
  padding: 0.65rem 1rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const PageLead = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
`

export const Split = styled.div<{ $stacked: boolean }>`
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  flex-direction: ${({ $stacked }) => ($stacked ? 'column' : 'row')};
  align-items: stretch;
`

export const EditorPane = styled.div<{ $stacked: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  box-sizing: border-box;
  border-right: ${({ theme, $stacked }) =>
    $stacked ? 'none' : `1px solid ${theme.border}`};
  border-bottom: ${({ theme, $stacked }) =>
    $stacked ? `1px solid ${theme.border}` : 'none'};
  background: ${({ theme }) => theme.surfaceHover};
  flex: ${({ $stacked }) => ($stacked ? '0 1 38vh' : '0 0 auto')};
  max-height: ${({ $stacked }) => ($stacked ? '50vh' : 'none')};
  min-height: ${({ $stacked }) => ($stacked ? '12rem' : '0')};
`

/** Divisor entre editor e grafo (arrastar horizontalmente). */
export const SplitResizeHandle = styled.button.attrs({ type: 'button' })`
  flex-shrink: 0;
  width: 6px;
  margin: 0;
  padding: 0;
  border: none;
  cursor: col-resize;
  touch-action: none;
  background: ${({ theme }) => theme.border};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: -1px;
  }
`

export const EditorToolbar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.65rem;
  font-size: 0.72rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textMuted};
`

export const StatusBadge = styled.span<{ $ok: boolean }>`
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 0.35rem;
  font-size: 0.68rem;
  color: ${({ theme, $ok }) => ($ok ? theme.primary : '#dc2626')};
  background: ${({ theme, $ok }) =>
    $ok ? theme.primaryMuted : 'color-mix(in srgb, #dc2626 16%, transparent)'};
`

/** Área flexível para o Monaco ocupar 100% da coluna com `automaticLayout`. */
export const JsonMonacoWrap = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`

export const FlowPane = styled.div<{ $stacked: boolean }>`
  position: relative;
  min-height: 0;
  min-width: 0;
  flex: ${({ $stacked }) => ($stacked ? '1 1 auto' : '1 1 0')};
  background: ${({ theme }) => theme.bg};
`

/** Host do React Flow: tema claro/escuro nos controles (igual ProjectArchitecture / modelagem). */
export const JsonFlowHost = styled.div`
  position: absolute;
  inset: 0;
  min-height: 0;
  min-width: 0;

  .react-flow {
    --xy-background-color: transparent;
    width: 100%;
    height: 100%;
  }

  .react-flow.dark .react-flow__controls {
    --xy-controls-button-background-color: #1e293b;
    --xy-controls-button-background-color-hover: #334155;
    --xy-controls-button-color: #e2e8f0;
    --xy-controls-button-color-hover: #f8fafc;
    --xy-controls-button-border-color: #475569;
    --xy-controls-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  }

  .react-flow.dark .react-flow__controls-button svg {
    fill: currentColor;
    stroke: currentColor;
    opacity: 1;
  }

  .react-flow.light .react-flow__controls {
    --xy-controls-button-background-color: ${({ theme }) => theme.surface};
    --xy-controls-button-background-color-hover: ${({ theme }) => theme.surfaceHover};
    --xy-controls-button-color: ${({ theme }) => theme.text};
    --xy-controls-button-color-hover: ${({ theme }) => theme.text};
    --xy-controls-button-border-color: ${({ theme }) => theme.border};
    --xy-controls-box-shadow: ${({ theme }) => theme.shadow};
  }

  .react-flow.light .react-flow__controls-button svg {
    fill: currentColor;
    stroke: currentColor;
    opacity: 1;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    .react-flow__controls {
      transform: scale(0.92);
      transform-origin: bottom left;
    }
  }
`

export const FlowError = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: #dc2626;
  background: ${({ theme }) => theme.surface};
`
