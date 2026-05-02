import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import {
  ADMIN_CONTENT_GUTTER_X,
  ADMIN_HEADER_BAR_HEIGHT,
  ADMIN_MOBILE_MEDIA,
} from '../layouts/adminShellTokens'

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const canvasReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const panelFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const panelFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Cabeçalho + canvas: filhos diretos na ordem de DatabaseModeling.tsx */
export const ModelingPageRoot = styled.div<{ $theater?: boolean }>`
  ${({ $theater }) =>
    $theater
      ? css`
          margin: -1.5rem calc(-1 * ${ADMIN_CONTENT_GUTTER_X}) -2.5rem;
          height: calc(100dvh - ${ADMIN_HEADER_BAR_HEIGHT});
          display: flex;
          flex-direction: column;
          overflow: hidden;

          @media ${ADMIN_MOBILE_MEDIA} {
            margin: -1.5rem calc(-1 * ${ADMIN_CONTENT_GUTTER_X}) -2.5rem;
            height: calc(100dvh - ${ADMIN_HEADER_BAR_HEIGHT});
          }
        `
      : ''}

  @media ${ADMIN_MOBILE_MEDIA} {
    ${({ $theater }) =>
      $theater
        ? ''
        : css`
            padding: 0 clamp(0.5rem, 2.5vw, 0.85rem);
            box-sizing: border-box;
          `}
  }

  & > * {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${fadeUp} 0.5s ${easeOut} both;
    }
  }

  ${({ $theater }) =>
    $theater
      ? css`
          & > * {
            animation: none !important;
          }
        `
      : ''}

  & > *:nth-child(1) {
    animation-delay: 0.02s;
  }
  & > *:nth-child(2) {
    animation-delay: 0.065s;
  }
  & > *:nth-child(3) {
    animation-delay: 0.11s;
  }
  & > *:nth-child(4) {
    animation-delay: 0.14s;
  }

  & > *:last-child {
    @media (prefers-reduced-motion: no-preference) {
      animation-name: ${canvasReveal};
      animation-duration: 0.62s;
    }
  }
`

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    text-decoration: underline;
  }
`

export const PageTitle = styled.h1`
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 1.15rem;
    line-height: 1.25;
  }
`

export const FlowPersistHint = styled.p`
  margin: 0 0 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.4;

  @media ${ADMIN_MOBILE_MEDIA} {
    margin-bottom: 0.65rem;
    font-size: 0.75rem;
  }
`

export const FlowSqlScriptsLink = styled(Link)`
  display: inline-block;
  margin: -0.5rem 0 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    margin-bottom: 0.65rem;
    font-size: 0.75rem;
  }
`

export const FlowHost = styled.div<{ $theater?: boolean }>`
  width: 100%;
  height: clamp(420px, calc(100vh - 14rem), 820px);
  height: clamp(420px, calc(100dvh - 14rem), 820px);
  min-height: 380px;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  transform-origin: center top;
  transition:
    border-color 0.2s ease,
    box-shadow 0.25s ${easeOut};

  &:focus-within {
    border-color: color-mix(in srgb, ${({ theme }) => theme.primary} 35%, transparent);
    box-shadow:
      0 0 0 1px color-mix(in srgb, ${({ theme }) => theme.primary} 12%, transparent),
      ${({ theme }) => theme.shadow};
  }

  .react-flow__panel.top.left {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${panelFromLeft} 0.48s ${easeOut} 0.12s both;
    }
  }

  .react-flow__panel.top.right {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${panelFromRight} 0.48s ${easeOut} 0.22s both;
    }
  }

  .react-flow__panel.modeling-controls-panel {
    left: 0.5rem;
    right: 0.5rem;
    top: 0.5rem;
    width: auto;
    max-width: none;
    margin: 0;
    pointer-events: none;

    & > * {
      pointer-events: auto;
    }
  }

  .react-flow__panel.modeling-history-panel {
    top: 11.2rem;
    right: 0.5rem;
    max-width: none;
    margin: 0;
  }

  .react-flow__controls {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${fadeUp} 0.45s ${easeOut} 0.32s both;
    }
  }

  .react-flow {
    --xy-background-color: transparent;
    width: 100%;
    height: 100%;
  }

  /*
   * O wrapper .react-flow__node costuma ficar mais largo que o card: a área “vazia”
   * à direita/esquerda ainda tem pointer-events e rouba clique de arestas e labels.
   * Encolher ao conteúdo (como o Root interno) alinha hitbox ao visual.
   */
  .react-flow__node.react-flow__node-table {
    border-radius: 0.75rem;
    width: fit-content;
    height: fit-content;
    min-width: 0;
    max-width: min(21rem, 100%);
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    height: clamp(240px, calc(100dvh - 9.5rem), 820px);
    min-height: 220px;
    border-radius: 0.5rem;

    .react-flow__node.react-flow__node-table {
      max-width: min(19rem, calc(100vw - 1.25rem));
    }

    .react-flow__controls {
      transform: scale(0.92);
      transform-origin: bottom left;
    }

    .react-flow__panel.modeling-history-panel {
      top: 8.8rem;
      right: 0.45rem;
    }
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
        `
      : ''}

  /* Reforço no dark: ícones e fundo dos botões (colorMode dark já aplica a classe .dark) */
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

  &:fullscreen,
  &:-webkit-full-screen {
    height: 100vh;
    height: 100dvh;
    width: 100vw;
    max-height: none;
    border-radius: 0;
    min-height: 100%;
  }

  &:fullscreen .react-flow,
  &:-webkit-full-screen .react-flow {
    height: 100%;
    min-height: 100%;
  }
`

export const PanelActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
`

export const FsButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.surface};
  padding: 0.4rem;
  min-width: 2.25rem;
  min-height: 2.25rem;
  box-sizing: border-box;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    gap 0.2s ease,
    padding 0.2s ease,
    min-width 0.2s ease;

  & > svg {
    flex-shrink: 0;
  }

  .fs-btn-label {
    display: block;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
    transition:
      max-width 0.22s ease,
      opacity 0.18s ease;
  }

  &:hover,
  &:focus-visible {
    justify-content: flex-start;
    gap: 0.4rem;
    padding: 0.4rem 0.65rem;
    min-width: auto;
    background: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.primary};

    .fs-btn-label {
      max-width: 14rem;
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    .fs-btn-label {
      transition: none;
    }
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    min-width: 1.85rem;
    min-height: 1.85rem;
    padding: 0.26rem;
    border-radius: 0.35rem;

    & > svg {
      width: 14px;
      height: 14px;
    }

    .fs-btn-label {
      display: none;
    }

    &:hover,
    &:focus-visible {
      justify-content: center;
      gap: 0;
      padding: 0.26rem;
      min-width: 1.85rem;
    }
  }
`

/** Igual ao `FsButton`, mas com destaque na cor do projeto quando há revisão pendente. */
export const RevisionSaveButton = styled(FsButton)<{
  $pending: boolean
  $projectPrimary: string
}>`
  ${({ $pending, $projectPrimary, theme }) =>
    $pending
      ? css`
          background: ${$projectPrimary};
          color: #fff;
          border-color: color-mix(in srgb, ${$projectPrimary} 70%, ${theme.border});

          & > svg {
            color: #fff;
          }

          .fs-btn-label {
            color: #fff;
          }

          &:hover,
          &:focus-visible {
            background: color-mix(in srgb, ${$projectPrimary} 85%, #fff);
            border-color: ${$projectPrimary};
            color: #fff;

            & > svg {
              color: #fff;
            }

            .fs-btn-label {
              color: #fff;
            }
          }

          @media ${ADMIN_MOBILE_MEDIA} {
            &:hover,
            &:focus-visible {
              background: color-mix(in srgb, ${$projectPrimary} 85%, #fff);
            }
          }
        `
      : undefined}
`

export const SchemaFilterWrap = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  padding: 0.45rem 0.55rem;
  min-width: 11.5rem;
  border-radius: 0.4rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  box-sizing: border-box;

  @media ${ADMIN_MOBILE_MEDIA} {
    width: 100%;
    min-width: 0;
  }
`

export const SchemaFilterLabel = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const SchemaFilterSelect = styled.select`
  font: inherit;
  font-size: 0.74rem;
  padding: 0.25rem 0.35rem;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`

export const ModelingControlsStrip = styled.div<{ $mobile: boolean }>`
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  gap: 0.45rem;
  width: 100%;
  max-width: 100%;

  ${({ $mobile }) =>
    $mobile
      ? css`
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;

          ${SchemaFilterWrap} {
            flex: 0 1 auto;
            width: auto;
            min-width: 0;
            max-width: min(11rem, 46vw);
            padding: 0.38rem 0.45rem;
          }

          ${SchemaFilterSelect} {
            font-size: 0.7rem;
            padding: 0.2rem 0.28rem;
          }

          ${PanelActions} {
            flex: 1 1 auto;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-end;
            align-items: center;
            gap: 0.28rem;
            min-width: 0;
          }
        `
      : css`
          flex-direction: column;
          align-items: flex-end;
          margin-left: auto;
          width: fit-content;
          max-width: 100%;

          ${PanelActions} {
            align-items: flex-end;
          }
        `}
`

export const HistoryPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: min(22rem, calc(100vw - 1rem));
  max-width: min(24rem, calc(100vw - 1rem));
  padding: 0.45rem 0.5rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  align-items: stretch;

  @media ${ADMIN_MOBILE_MEDIA} {
    min-width: min(18rem, calc(100vw - 1rem));
    max-width: min(20rem, calc(100vw - 1rem));
    padding: 0.4rem 0.45rem;
  }
`

export const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`

export const HistoryPanelToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  border-radius: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.48rem;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`

export const HistoryFilterSelect = styled.select`
  margin-left: auto;
  font: inherit;
  font-size: 0.7rem;
  padding: 0.2rem 0.28rem;
  border-radius: 0.32rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
`

export const HistoryHint = styled.p`
  margin: 0;
  font-size: 0.66rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.35;
`

export const RevisionFeedback = styled.div`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.primary};
  line-height: 1.35;
`

export const HistoryList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: min(18rem, calc(100dvh - 14rem));
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

export const HistoryItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.58)' : theme.surfaceHover};
`

export const HistoryEntryTitle = styled.strong`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  line-height: 1.35;
`

export const HistoryEntryDetail = styled.span`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.35;
`

export const HistoryEntryTime = styled.time`
  font-size: 0.66rem;
  color: ${({ theme }) => theme.textMuted};
`

export const RevisionChanges = styled.ul`
  margin: 0.2rem 0 0;
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
`

export const RevisionChangeItem = styled.li`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.35;
`

export const HistoryEmpty = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.textMuted};
  padding: 0.35rem 0.4rem 0.2rem;
`

export const CardinalityPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 12rem;
  max-width: 16rem;
  padding: 0.45rem 0.55rem;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.4rem;
  box-shadow: ${({ theme }) => theme.shadow};
`

export const CardinalityPanelTitle = styled.div`
  font-weight: 600;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.1rem;
`

export const CardinalityField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const CardinalityFieldLabel = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.textMuted};
`

export const CardinalitySelect = styled.select`
  font: inherit;
  font-size: 0.72rem;
  padding: 0.25rem 0.35rem;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`

