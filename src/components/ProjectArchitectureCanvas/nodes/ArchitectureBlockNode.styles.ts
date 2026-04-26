import styled from 'styled-components'
import type { ArchitectureBlockKind } from '../architectureTypes'
import { ARCHITECTURE_KIND_ACCENT } from '../architectureKindMeta'

const NODE_RADIUS = '0.65rem'

export const Root = styled.div<{ $accent: string; $selected?: boolean }>`
  position: relative;
  cursor: grab;
  min-width: 11.5rem;
  max-width: 14rem;
  border-radius: ${NODE_RADIUS};
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  /* Handles do React Flow ficam fora do retângulo — não usar overflow:hidden aqui */
  overflow: visible;
  font-family: ui-sans-serif, system-ui, sans-serif;
  box-shadow: ${({ theme, $selected, $accent }) =>
    [
      theme.shadow,
      `0 0 0 1px color-mix(in srgb, ${$accent} 22%, transparent)`,
      $selected ? `0 0 0 2px ${$accent}` : null,
    ]
      .filter(Boolean)
      .join(', ')};

  &:active {
    cursor: grabbing;
  }
`

/** Recorte nos cantos superiores: faixa + conteúdo formam um só bloco visual. */
export const CardInner = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border-radius: inherit;
`

export const DragStrip = styled.div<{ $accent: string }>`
  flex-shrink: 0;
  width: 100%;
  height: 4px;
  margin: 0;
  padding: 0;
  border: none;
  background: linear-gradient(
    90deg,
    ${({ $accent }) => $accent},
    color-mix(in srgb, ${({ $accent }) => $accent} 55%, white)
  );
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

export const Body = styled.div`
  padding: 0.65rem 0.75rem 0.7rem;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.35rem;
`

export const Title = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;
  word-break: break-word;
`

export const KindBadge = styled.span<{ $kind: ArchitectureBlockKind }>`
  flex-shrink: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.15rem 0.35rem;
  border-radius: 0.25rem;
  color: #fff;
  background: ${({ $kind }) => ARCHITECTURE_KIND_ACCENT[$kind]};
`

export const TechHint = styled.div`
  margin-top: 0.35rem;
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.textMuted};

  svg {
    flex-shrink: 0;
  }
`

export const SlugRow = styled.div`
  margin-top: 0.45rem;
  font-size: 0.625rem;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: ${({ theme }) => theme.primary};
  opacity: 0.9;
  word-break: break-all;
`

export const MonorepoBadge = styled.div`
  margin-top: 0.35rem;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`
