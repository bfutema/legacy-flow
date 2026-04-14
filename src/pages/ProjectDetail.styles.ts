import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

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

const cardLift = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const stripeGrow = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Contêiner: anima filhos diretos em cascata (ordem fixa em ProjectDetail.tsx). */
export const ProjectDetailRoot = styled.div`
  width: 100%;

  & > * {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${fadeUp} 0.52s ${easeOut} both;
    }
  }

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
    animation-delay: 0.155s;
  }
`

/** Gráfico à esquerda, configurações e modelagem à direita. */
export const DetailMain = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 22rem);
  gap: 1.75rem;
  align-items: start;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const DetailMainColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const DetailSideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
`

export const DiagramCard = styled.div`
  padding: 1.25rem 1.35rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const DiagramCardTitle = styled.h3`
  margin: 0 0 0.85rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const DiagramChartBox = styled.div`
  height: 220px;
  width: 100%;
`

export const StatRowMini = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1rem;
`

export const StatPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ theme }) => theme.primaryMuted};
  color: ${({ theme }) => theme.text};
`

export const DiagramHint = styled.p`
  margin: 0.75rem 0 0;
  font-size: 0.78rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.textMuted};
`

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    text-decoration: underline;
  }
`

export const SectionTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const Body = styled.p`
  margin: 0 0 1.75rem;
  max-width: 48rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.text};
`

export const DbSettingRow = styled.div`
  margin: 0 0 1.5rem;
  width: 100%;
  max-width: 100%;
`

export const DbLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.2rem;
`

export const DbHint = styled.p`
  margin: 0.4rem 0 0;
  font-size: 0.8rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.textMuted};
`

export const DbSelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }
`

export const ModelagemCard = styled(Link)`
  display: block;
  position: relative;
  overflow: hidden;
  padding: 1.5rem 1.75rem;
  border-radius: 0.9rem;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primaryMuted} 0%,
    ${({ theme }) => theme.surface} 55%
  );
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  transition:
    transform 0.28s ${easeOut},
    box-shadow 0.28s ${easeOut},
    border-color 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    transform: scaleX(0);
    transform-origin: left center;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.primary},
      color-mix(in srgb, ${({ theme }) => theme.primary} 70%, white)
    );

    @media (prefers-reduced-motion: no-preference) {
      animation: ${stripeGrow} 0.6s ${easeOut} 0.88s both;
    }

    @media (prefers-reduced-motion: reduce) {
      transform: scaleX(1);
    }
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow:
      0 14px 32px ${({ theme }) => theme.primaryMuted},
      0 4px 12px rgba(15, 23, 42, 0.08);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: ${cardLift} 0.6s ${easeOut} 0.18s both;
  }
`

/** Versão somente leitura quando não há permissão de atualizar o projeto. */
export const ModelagemCardLocked = styled.div`
  display: block;
  position: relative;
  overflow: hidden;
  padding: 1.5rem 1.75rem;
  border-radius: 0.9rem;
  color: inherit;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primaryMuted} 0%,
    ${({ theme }) => theme.surface} 55%
  );
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: not-allowed;
  opacity: 0.92;
`

export const ModelagemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};

  svg {
    flex-shrink: 0;
    transition: transform 0.25s ${easeOut};
  }

  ${ModelagemCard}:hover & svg {
    transform: scale(1.06);

    @media (prefers-reduced-motion: reduce) {
      transform: none;
    }
  }
`

export const ModelagemDesc = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textMuted};
`

export const ModelagemHint = styled.span`
  display: inline-block;
  margin-top: 0.85rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  transition: transform 0.2s ${easeOut};

  ${ModelagemCard}:hover & {
    transform: translateX(4px);

    @media (prefers-reduced-motion: reduce) {
      transform: none;
    }
  }
`
