import styled, { css } from 'styled-components'
import { TIMELINE_UI } from '../constants'

export const GanttBarRoot = styled.div<{
  $left: number
  $width: number
  $dragging: boolean
}>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => Math.max($width, 8)}px;
  height: ${TIMELINE_UI.ganttBarThickness}px;
  z-index: ${({ $dragging }) => ($dragging ? 4 : 1)};
  pointer-events: auto;
  user-select: ${({ $dragging }) => ($dragging ? 'none' : 'auto')};

  &:hover {
    z-index: 3;
  }
`

export const GanttBarFill = styled.div<{ $color: string; $dragging: boolean }>`
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid ${({ $color }) => $color};
  /* Mesma lógica do botão Excluir: borda na cor “cheia”, preenchimento mais escuro na mesma tonalidade. */
  background: ${({ $color }) =>
    `color-mix(in srgb, ${$color} 70%, black)`};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
  transition: ${({ $dragging }) =>
    $dragging ? 'none' : 'filter 0.2s ease, box-shadow 0.2s ease'};
  cursor: pointer;

  ${({ theme }) =>
    theme.mode === 'dark'
      ? css`
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
        `
      : undefined}

  ${GanttBarRoot}:hover & {
    @media (hover: hover) and (pointer: fine) {
      ${({ $dragging, theme }) =>
        !$dragging &&
        css`
          filter: brightness(1.1) saturate(1.06);
          box-shadow:
            0 4px 12px
              ${theme.mode === 'dark'
                ? 'rgba(0, 0, 0, 0.45)'
                : 'rgba(15, 23, 42, 0.18)'},
            0 0 0 1px
              ${theme.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(255, 255, 255, 0.22)'}
              inset;
        `}
    }
  }
`

export const GanttBarHandle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 12px;
  z-index: 2;
  cursor: ew-resize;
  touch-action: none;

  &[data-edge='start'] {
    left: 0;
    border-radius: 6px 0 0 6px;
  }

  &[data-edge='end'] {
    right: 0;
    border-radius: 0 6px 6px 0;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: rgba(255, 255, 255, 0.22);
    }
  }

  ${({ theme }) =>
    theme.mode === 'dark'
      ? css`
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              background: rgba(0, 0, 0, 0.28);
            }
          }
        `
      : undefined}
`
