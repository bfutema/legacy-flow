import styled, { css } from 'styled-components'
import type { DefaultTheme } from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../../layouts/adminShellTokens'
import { TIMELINE_UI } from './constants'

/** Fim de semana: mistura com `border` — no dark, evita `surfaceHover` igual à borda (some o traço sáb/dom). */
function ganttWeekendSurface(theme: DefaultTheme, weekend: boolean) {
  if (!weekend) return theme.surface
  const surfacePct = theme.mode === 'dark' ? 76 : 84
  return `color-mix(in srgb, ${theme.surface} ${surfacePct}%, ${theme.border} ${
    100 - surfacePct
  }%)`
}

const laneSticky = css`
  width: var(--gantt-lane-width, ${TIMELINE_UI.laneWidth}px);
  flex-shrink: 0;
  position: sticky;
  left: 0;
  z-index: 12;
  background: ${({ theme }) => theme.surface};
  border-right: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  box-sizing: border-box;
  box-shadow: 6px 0 20px rgba(15, 23, 42, 0.07);

  ${({ theme }) =>
    theme.mode === 'dark'
      ? css`
          box-shadow: 6px 0 24px rgba(0, 0, 0, 0.35);
        `
      : undefined}
`

export const Root = styled.section<{ $laneWidth: number }>`
  --gantt-lane-width: ${({ $laneWidth }) => `${$laneWidth}px`};
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.surface};
  border-top: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`

export const GanttScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`

/**
 * Coluna de linhas: cada linha é um grid próprio (lane | track).
 * Evita `display: contents`, que em WebKit/Chromium quebra `position: sticky` na coluna fixa.
 */
export const GanttScrollInner = styled.div<{ $minTrackWidth: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: max(
    100%,
    ${({ $minTrackWidth }) =>
      `calc(var(--gantt-lane-width, ${TIMELINE_UI.laneWidth}px) + ${$minTrackWidth}px)`}
  );
`

const ganttRowGrid = ($minTrackWidth: number) => css`
  display: grid;
  grid-template-columns:
    var(--gantt-lane-width, ${TIMELINE_UI.laneWidth}px)
    minmax(${$minTrackWidth}px, 1fr);
  align-items: stretch;
  min-width: max(
    100%,
    calc(var(--gantt-lane-width, ${TIMELINE_UI.laneWidth}px) + ${$minTrackWidth}px)
  );
`

/** Uma linha lógica: coluna fixa + faixa da timeline (mesmas colunas em todas as linhas). */
export const GanttGridRowPair = styled.div<{ $minTrackWidth: number }>`
  ${({ $minTrackWidth }) => ganttRowGrid($minTrackWidth)}
`

/**
 * Envolve só a régua (Projetos + datas): sticky vertical no scroll da timeline.
 * Sticky nos filhos do grid por linha costuma falhar; o bloco inteiro gruda no topo.
 */
export const GanttStickyHeaderSection = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  align-self: stretch;
  background: ${({ theme }) => theme.surface};
`

export const GanttStickyLane = styled.div`
  ${laneSticky};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  min-height: ${TIMELINE_UI.headerLaneMinHeight}px;
`

export const GanttLaneHeaderRow = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  width: 100%;

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      justify-content: center;
    `}
`

export const GanttLaneToggleBtn = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: none;
  border-radius: 0.4rem;
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.border};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`

/** Coluna esquerda da régua: sticky horizontal (`left`); vertical vem de GanttStickyHeaderSection. */
export const GanttHeaderStickyLane = styled(GanttStickyLane)`
  z-index: 18;
  border-bottom: 2px solid ${({ theme }) => theme.chartGrid};
`

export const GanttLaneHeader = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const GanttLaneMonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`

export const GanttMonthBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  padding: 0;
  border: none;
  border-radius: 0.35rem;
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.border};
  }
`

export const GanttMonthLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  flex: 1;
  text-align: center;
`

export const GanttLaneCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`

export const GanttProjectLaneRow = styled.div`
  ${laneSticky};
  display: flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  min-height: ${TIMELINE_UI.projectRowHeight}px;
  max-height: ${TIMELINE_UI.projectRowHeight}px;
  box-sizing: border-box;
`

export const GanttProjectLaneCollapsed = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  min-height: ${TIMELINE_UI.projectRowHeight}px;
  max-height: ${TIMELINE_UI.projectRowHeight}px;
  box-sizing: border-box;
`

export const GanttLaneProjectTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

/** Título do projeto + ação discreta (alocar colaborador). */
export const GanttProjectTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  width: 100%;
`

/** Projeto: nome na primeira linha, período abaixo. */
export const GanttProjectLaneStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.1rem;
  min-width: 0;
  flex: 1;
`

export const GanttLaneRange = styled.div`
  font-size: 0.7rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
`

export const GanttAllocateTriggerBtn = styled.button<{ $open?: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  border-radius: 0.35rem;
  background: ${({ theme, $open }) =>
    $open ? theme.primaryMuted : 'transparent'};
  color: ${({ theme, $open }) => ($open ? theme.primary : theme.textMuted)};
  cursor: pointer;
  opacity: ${({ $open }) => ($open ? 1 : 0.65)};

  &:hover:not(:disabled) {
    opacity: 1;
    background: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
    pointer-events: none;
  }
`

export const GanttAllocPopover = styled.div`
  position: fixed;
  z-index: 400;
  width: min(18rem, calc(100vw - 1.5rem));
  max-height: min(22rem, calc(100vh - 6rem));
  max-height: min(22rem, calc(100dvh - 6rem));
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;

  @media ${ADMIN_MOBILE_MEDIA} {
    width: min(18rem, calc(100vw - 1rem));
    max-height: min(20rem, calc(100dvh - 5rem));
  }
`

export const GanttAllocPopoverHeader = styled.div`
  padding: 0.55rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const GanttAllocSearch = styled.input`
  margin: 0.45rem 0.65rem 0.35rem;
  font-size: 0.75rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }
`

export const GanttAllocList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.15rem 0.35rem 0.45rem;
`

export const GanttAllocUserBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  width: 100%;
  text-align: left;
  padding: 0.4rem 0.45rem;
  margin: 0.1rem 0;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font: inherit;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const GanttAllocUserName = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
`

export const GanttAllocUserEmail = styled.span`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
`

export const GanttAllocEmpty = styled.div`
  padding: 0.75rem 0.65rem;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  text-align: center;
`

export const GanttLaneUserAvatar = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  background: ${({ $color }) => $color};
`

/** Linha do colaborador: ocupa a largura da coluna fixa; nome e swatch nos extremos. */
export const GanttLaneUserCell = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`

/** Remove alocação: sem largura no layout até hover/foco — evita “vão” invisível. */
export const GanttRemoveCollaboratorBtn = styled.button`
  flex-shrink: 0;
  flex-grow: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 0;
  min-width: 0;
  height: 1.45rem;
  margin-left: 0;
  padding: 0;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transition:
    width 0.14s ease,
    min-width 0.14s ease,
    margin-left 0.14s ease,
    opacity 0.12s ease,
    background 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.text};
  }

  &:focus-visible {
    width: 1.45rem;
    min-width: 1.45rem;
    margin-left: 0.2rem;
    opacity: 1;
    overflow: visible;
    pointer-events: auto;
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const GanttLaneUserTextRow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
`

export const GanttLaneUserRow = styled.div<{ $laneCollapsed?: boolean }>`
  ${laneSticky};
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0.35rem 0.45rem 0.35rem
    calc(0.75rem + ${TIMELINE_UI.laneUserExtraIndentPx}px);
  min-height: ${TIMELINE_UI.userRowHeight}px;
  max-height: ${TIMELINE_UI.userRowHeight}px;
  box-sizing: border-box;

  ${({ $laneCollapsed }) =>
    $laneCollapsed &&
    css`
      padding-left: 0.35rem;
      padding-right: 0.35rem;
      justify-content: center;
    `}

  @media (hover: hover) and (pointer: fine) {
    &:hover ${GanttRemoveCollaboratorBtn} {
      width: 1.45rem;
      min-width: 1.45rem;
      margin-left: 0.2rem;
      opacity: 0.55;
      overflow: visible;
      pointer-events: auto;
    }
  }

  @media (hover: none) {
    ${GanttRemoveCollaboratorBtn} {
      width: 1.45rem;
      min-width: 1.45rem;
      margin-left: 0.2rem;
      opacity: 0.45;
      overflow: visible;
      pointer-events: auto;
    }
  }

  & ${GanttRemoveCollaboratorBtn}:is(:hover, :focus-visible) {
    opacity: 1;
  }

  ${({ $laneCollapsed }) =>
    $laneCollapsed &&
    css`
      ${GanttLaneUserCell} {
        justify-content: center;
      }

      ${GanttLaneUserTextRow} {
        display: none;
      }

      ${GanttRemoveCollaboratorBtn} {
        display: none;
      }
    `}
`

export const GanttLaneUserName = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`

/** Quadrado de cor na lane (espessura da barra na grade em `ganttBarThickness`). */
export const GanttLaneUserColorSwatch = styled.span<{ $color: string }>`
  display: block;
  flex-shrink: 0;
  width: ${TIMELINE_UI.laneColorSwatchSize}px;
  height: ${TIMELINE_UI.laneColorSwatchSize}px;
  border-radius: 5px;
  background: ${({ $color }) => $color};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
  pointer-events: none;

  ${({ theme }) =>
    theme.mode === 'dark'
      ? css`
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
        `
      : undefined}
`

/** Área clicável com input type="color" invisível sobre o swatch. */
export const GanttLaneUserColorPickerWrap = styled.span`
  position: relative;
  flex-shrink: 0;
  width: ${TIMELINE_UI.laneColorSwatchSize}px;
  height: ${TIMELINE_UI.laneColorSwatchSize}px;
  cursor: pointer;
  border-radius: 5px;

  input[type='color'] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: none;
    opacity: 0;
    cursor: pointer;
    border-radius: 5px;
  }

  input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type='color']::-webkit-color-swatch {
    border: none;
    border-radius: 5px;
  }
`

/** Régua de datas virtualizada (largura = total de colunas × dayWidth). */
export const GanttVirtualTimeTrack = styled.div<{ $width: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  /* Igual à altura mínima da lane “Projetos” na mesma linha — evita faixa vazia sob qui/sex/sáb. */
  min-height: ${TIMELINE_UI.headerLaneMinHeight}px;
  background: ${({ theme }) => theme.surface};
  /* Células absolute cobrem o fundo; border no pai some. Faixa com z-index separa header do grid. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: ${({ theme }) => theme.chartGrid};
    z-index: 4;
    pointer-events: none;
  }
`

/** Régua de datas da primeira linha (sticky vertical no wrapper GanttStickyHeaderSection). */
export const GanttVirtualTimeTrackSticky = styled(GanttVirtualTimeTrack)`
  z-index: 16;
`

/**
 * Faixa só sobre a timeline (à direita da coluna fixa), abaixo do header — não compete com o menu.
 */
export const GanttTodayIndicatorTrack = styled.div<{ $trackWidth: number }>`
  position: absolute;
  left: var(--gantt-lane-width, ${TIMELINE_UI.laneWidth}px);
  top: ${TIMELINE_UI.headerLaneMinHeight}px;
  width: ${({ $trackWidth }) => $trackWidth}px;
  bottom: 0;
  z-index: 10;
  pointer-events: none;
  margin: 0;
  min-height: 0;
  overflow: hidden;
  overflow: clip;
`

/**
 * Linha do dia atual — `centerX` em px dentro do track; largura 2px sem transform
 * (evita subpixel) e sem box-shadow (não é recortável de forma confiável).
 */
export const GanttTodayIndicatorLine = styled.div<{ $centerX: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $centerX }) => $centerX - 1}px;
  width: 2px;
  pointer-events: none;
  background: ${({ theme }) => theme.primary};
  opacity: 0.95;
`

const dayCellHoverOverlay = css`
  cursor: pointer;
  transition:
    box-shadow 0.18s ease,
    color 0.18s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: inset 0 0 0 9999px ${({ theme }) => theme.primaryMuted};
    }
  }
`

export const GanttTimeDayCell = styled.div<{ $weekend: boolean; $isToday?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme, $isToday }) => ($isToday ? theme.primary : theme.text)};
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $weekend }) => ganttWeekendSurface(theme, $weekend)};
  box-sizing: border-box;
  ${dayCellHoverOverlay}

  ${({ $isToday, theme }) =>
    $isToday &&
    css`
      font-weight: 800;
      text-decoration: underline;
      text-underline-offset: 2px;
      text-decoration-color: ${theme.primary};
      text-decoration-thickness: 2px;
    `}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`

export const GanttTimeDowCell = styled.div<{ $weekend: boolean; $isToday?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: lowercase;
  color: ${({ theme, $isToday }) =>
    $isToday ? theme.primary : theme.textMuted};
  border-right: 1px solid ${({ theme }) => theme.border};
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $weekend }) => ganttWeekendSurface(theme, $weekend)};
  box-sizing: border-box;
  ${dayCellHoverOverlay}

  ${({ $isToday }) =>
    $isToday &&
    css`
      font-weight: 700;
    `}

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      color: ${({ theme, $isToday }) =>
        $isToday ? theme.primary : theme.text};
    }
  }
`

/** Uma coluna = uma semana (intervalo no cabeçalho). */
export const GanttTimeWeekCell = styled.div<{ $isToday?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1.25;
  padding: 2px 4px;
  color: ${({ theme, $isToday }) => ($isToday ? theme.primary : theme.text)};
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => ganttWeekendSurface(theme, false)};
  box-sizing: border-box;
  hyphens: auto;
  overflow: hidden;

  ${({ $isToday, theme }) =>
    $isToday &&
    css`
      box-shadow: inset 0 -2px 0 ${theme.primary};
    `}
`

export const GanttTrackArea = styled.div<{ $minWidth: number }>`
  min-width: ${({ $minWidth }) => $minWidth}px;
  width: 100%;
  box-sizing: border-box;
  background: ${({ theme }) => theme.surface};
  position: relative;
  z-index: 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

/** Faixa de fundo da linha (projeto ou usuário) com largura total virtualizada. */
export const GanttVirtualRowTrack = styled.div<{ $width: number; $height: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  flex-shrink: 0;
  overflow: hidden;
`

export const GanttDayBgCell = styled.div<{ $weekend: boolean; $interactive?: boolean }>`
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $weekend }) => ganttWeekendSurface(theme, $weekend)};
  box-sizing: border-box;
  ${({ $interactive }) => ($interactive !== false ? dayCellHoverOverlay : undefined)}
`
