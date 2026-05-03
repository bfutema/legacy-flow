import styled from 'styled-components'

export const CanvasViewport = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  cursor: grab;
  touch-action: none;

  &[data-panning='true'] {
    cursor: grabbing;
  }
`

export const CanvasWorld = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
  will-change: transform;
`

export const CanvasGrid = styled.div`
  position: absolute;
  inset: -200%;
  pointer-events: none;
  opacity: 0.35;
  background-image:
    linear-gradient(${({ theme }) => theme.chartGrid} 1px, transparent 1px),
    linear-gradient(90deg, ${({ theme }) => theme.chartGrid} 1px, transparent 1px);
  background-size: 18px 18px;
`

export const NodeWrap = styled.div<{
  $selected?: boolean
  $locked?: boolean
}>`
  position: absolute;
  box-sizing: border-box;
  cursor: ${({ $locked }) => ($locked ? 'not-allowed' : 'default')};
  outline: ${({ theme, $selected }) =>
    $selected ? `2px solid ${theme.primary}` : 'none'};
  outline-offset: 1px;

  &:hover {
    ${({ theme, $selected, $locked }) =>
      !$selected && !$locked ? `outline: 1px dashed ${theme.textMuted};` : ''}
  }
`

export const NodeFrame = styled.div<{
  $fill: string
  $stroke: string
  $strokeWidth: number
  $radius: number
}>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: ${({ $fill }) => $fill};
  border: ${({ $strokeWidth, $stroke }) => `${$strokeWidth}px solid ${$stroke}`};
  border-radius: ${({ $radius }) => `${$radius}px`};
`

export const NodeRect = styled.div<{
  $fill: string
  $stroke: string
  $strokeWidth: number
  $radius: number
}>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: ${({ $fill }) => $fill};
  border: ${({ $strokeWidth, $stroke }) => `${$strokeWidth}px solid ${$stroke}`};
  border-radius: ${({ $radius }) => `${$radius}px`};
`

export const NodeText = styled.div<{
  $fill: string
  $fontSize: number
  $fontWeight: number
  $align: string
}>`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 4px 6px;
  overflow: hidden;
  color: ${({ $fill }) => $fill};
  font-size: ${({ $fontSize }) => `${$fontSize}px`};
  font-weight: ${({ $fontWeight }) => $fontWeight};
  text-align: ${({ $align }) => $align};
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.25;
`

export const CanvasHint = styled.div`
  position: absolute;
  bottom: 0.65rem;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  font-size: 0.68rem;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surface};
  padding: 0.25rem 0.55rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  opacity: 0.92;
  max-width: calc(100% - 2rem);
  text-align: center;
`
