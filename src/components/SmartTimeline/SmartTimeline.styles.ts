import styled, { css } from 'styled-components'
import type { DefaultTheme } from 'styled-components'
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
  width: ${TIMELINE_UI.laneWidth}px;
  flex-shrink: 0;
  position: sticky;
  left: 0;
  z-index: 2;
  background: ${({ theme }) => theme.surface};
  border-right: 1px solid ${({ theme }) => theme.border};
  box-sizing: border-box;
  box-shadow: 6px 0 20px rgba(15, 23, 42, 0.07);

  ${({ theme }) =>
    theme.mode === 'dark'
      ? css`
          box-shadow: 6px 0 24px rgba(0, 0, 0, 0.35);
        `
      : undefined}
`

export const Root = styled.section`
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

/** Conteúdo rolável da timeline: ancora uma única linha de “hoje” em relação a todas as linhas. */
export const GanttScrollInner = styled.div<{ $minTrackWidth: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: max(
    100%,
    ${({ $minTrackWidth }) => TIMELINE_UI.laneWidth + $minTrackWidth}px
  );
`

export const GanttDataRow = styled.div<{
  $minTrackWidth: number
  $stickyTop?: boolean
}>`
  display: flex;
  align-items: stretch;
  min-width: max(
    100%,
    ${({ $minTrackWidth }) => TIMELINE_UI.laneWidth + $minTrackWidth}px
  );
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};

  ${({ $stickyTop }) =>
    $stickyTop
      ? css`
          position: sticky;
          top: 0;
          z-index: 4;
        `
      : undefined}
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

/** Coluna esquerda da régua: acima das faixas de dados ao rolar na vertical. */
export const GanttHeaderStickyLane = styled(GanttStickyLane)`
  z-index: 5;
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
  padding: 0.45rem 0.75rem;
  min-height: ${TIMELINE_UI.projectRowHeight}px;
`

export const GanttLaneProjectTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const GanttProjectLaneStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
`

export const GanttLaneRange = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.textMuted};
  margin-top: 0.15rem;
`

export const GanttLaneUserRow = styled.div`
  ${laneSticky};
  display: flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  min-height: ${TIMELINE_UI.userRowHeight}px;

  & > * {
    flex: 1;
    min-width: 0;
  }
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`

export const GanttLaneUserTextRow = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
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

/** Mesma altura/largura e raio das barras Gantt. */
export const GanttLaneUserColorSwatch = styled.span<{ $color: string }>`
  display: block;
  flex-shrink: 0;
  width: ${TIMELINE_UI.ganttBarThickness}px;
  height: ${TIMELINE_UI.ganttBarThickness}px;
  border-radius: 6px;
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
  width: ${TIMELINE_UI.ganttBarThickness}px;
  height: ${TIMELINE_UI.ganttBarThickness}px;
  cursor: pointer;
  border-radius: 6px;

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
    border-radius: 6px;
  }

  input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type='color']::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
`

/** Régua de datas virtualizada (largura = total de colunas × dayWidth). */
export const GanttVirtualTimeTrack = styled.div<{ $width: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  min-height: 3.35rem;
  background: ${({ theme }) => theme.surface};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

/**
 * Linha vertical do dia atual — um único elemento no `GanttScrollInner` (contínua na vertical).
 * `left` = borda esquerda da área de trilhas + centro da coluna do dia (px).
 */
export const GanttTodayIndicatorLine = styled.div<{ $left: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $left }) => $left}px;
  width: 2px;
  transform: translateX(-50%);
  pointer-events: none;
  border-radius: 1px;
  z-index: 50;
  background: ${({ theme }) => theme.primary};
  opacity: 0.92;
  box-shadow:
    0 0 0 1px ${({ theme }) => theme.surface},
    0 0 10px ${({ theme }) => theme.primaryMuted};
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

export const GanttTrackArea = styled.div<{ $minWidth: number }>`
  flex: 1 1 auto;
  min-width: ${({ $minWidth }) => $minWidth}px;
  background: ${({ theme }) => theme.surface};
  position: relative;
`

/** Faixa de fundo da linha (projeto ou usuário) com largura total virtualizada. */
export const GanttVirtualRowTrack = styled.div<{ $width: number; $height: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  flex-shrink: 0;
  overflow: hidden;
`

export const GanttDayBgCell = styled.div<{ $weekend: boolean }>`
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme, $weekend }) => ganttWeekendSurface(theme, $weekend)};
  box-sizing: border-box;
  ${dayCellHoverOverlay}
`
