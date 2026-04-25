import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'

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
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 20rem);
  gap: 1.5rem;
  align-items: stretch;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    align-items: start;
  }
`

export const DetailMainColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 100%;
`

export const DetailSideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;

  @media (min-width: 901px) {
    min-height: 100%;
  }
`

/** Painel único à direita: configuração + atalhos (evita vários cartões empilhados). */
export const SideOverviewPanel = styled.div`
  padding: 1.15rem 1.2rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  min-width: 0;

  @media (min-width: 901px) {
    flex: 1;
  }
`

export const PanelDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border};
  opacity: 0.85;
`

export const PanelSectionLabel = styled.p`
  margin: 0 0 0.45rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const WorkspaceNavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

/** Base dos atalhos: cartão compacto com mesma linguagem visual dos cartões antigos. */
const workspacePremiumShell = css`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1.05rem 1.15rem;
  border-radius: 0.9rem;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
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
    z-index: 1;

    @media (prefers-reduced-motion: no-preference) {
      animation: ${stripeGrow} 0.6s ${easeOut} both;
    }

    @media (prefers-reduced-motion: reduce) {
      transform: scaleX(1);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: ${cardLift} 0.6s ${easeOut} both;
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    animation: none;

    &:hover {
      transform: none;
    }
  }
`

export const WorkspaceNavRowBody = styled.div`
  flex: 1;
  min-width: 0;
`

export const WorkspaceNavRowTitle = styled.span`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  line-height: 1.25;
`

export const WorkspaceNavRowDesc = styled.span`
  display: block;
  margin-top: 0.15rem;
  font-size: 0.78rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.textMuted};
`

export const WorkspaceNavChevron = styled.span`
  flex-shrink: 0;
  margin-top: 0.1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
  transition: transform 0.2s ${easeOut};
`

export const WorkspaceNavIconWrap = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.05rem;
  color: ${({ theme }) => theme.textMuted};
  transition:
    color 0.2s ease,
    transform 0.25s ${easeOut};

  svg {
    display: block;
  }
`

export const WorkspaceNavLinkModeling = styled(Link)`
  ${workspacePremiumShell}
  animation-delay: 0.08s;

  &::before {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.primary},
      color-mix(in srgb, ${({ theme }) => theme.primary} 70%, white)
    );
    animation-delay: 0.75s;
  }

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primaryMuted} 0%,
    ${({ theme }) => theme.surface} 55%
  );

  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.primary};
    box-shadow:
      0 14px 32px ${({ theme }) => theme.primaryMuted},
      0 4px 12px rgba(15, 23, 42, 0.08);

    ${WorkspaceNavChevron} {
      transform: translateX(4px);
      color: ${({ theme }) => theme.primary};
    }

    ${WorkspaceNavIconWrap} {
      color: ${({ theme }) => theme.primary};

      svg {
        transform: scale(1.06);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover ${WorkspaceNavChevron} {
      transform: none;
    }

    &:hover ${WorkspaceNavIconWrap} svg {
      transform: none;
    }
  }
`

export const WorkspaceNavLinkArchitecture = styled(Link)`
  ${workspacePremiumShell}
  animation-delay: 0.14s;

  &:focus-visible {
    outline: 2px solid #14b8a6;
    outline-offset: 3px;
  }

  &::before {
    background: linear-gradient(90deg, #14b8a6, #5eead4);
    animation-delay: 0.8s;
  }

  background: linear-gradient(
    135deg,
    color-mix(in srgb, #14b8a6 22%, ${({ theme }) => theme.surface}) 0%,
    ${({ theme }) => theme.surface} 58%
  );

  &:hover {
    transform: translateY(-5px);
    border-color: #14b8a6;
    box-shadow:
      0 14px 32px color-mix(in srgb, #14b8a6 18%, transparent),
      0 4px 12px rgba(15, 23, 42, 0.08);

    ${WorkspaceNavChevron} {
      transform: translateX(4px);
      color: #14b8a6;
    }

    ${WorkspaceNavIconWrap} {
      color: #14b8a6;

      svg {
        transform: scale(1.06);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover ${WorkspaceNavChevron} {
      transform: none;
    }

    &:hover ${WorkspaceNavIconWrap} svg {
      transform: none;
    }
  }
`

export const WorkspaceNavLinkFiles = styled(Link)`
  ${workspacePremiumShell}
  animation-delay: 0.2s;

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 3px;
  }

  &::before {
    background: linear-gradient(90deg, #6366f1, #a5b4fc);
    animation-delay: 0.85s;
  }

  background: linear-gradient(
    135deg,
    color-mix(in srgb, #6366f1 22%, ${({ theme }) => theme.surface}) 0%,
    ${({ theme }) => theme.surface} 58%
  );

  &:hover {
    transform: translateY(-5px);
    border-color: #6366f1;
    box-shadow:
      0 14px 32px color-mix(in srgb, #6366f1 18%, transparent),
      0 4px 12px rgba(15, 23, 42, 0.08);

    ${WorkspaceNavChevron} {
      transform: translateX(4px);
      color: #6366f1;
    }

    ${WorkspaceNavIconWrap} {
      color: #6366f1;

      svg {
        transform: scale(1.06);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover ${WorkspaceNavChevron} {
      transform: none;
    }

    &:hover ${WorkspaceNavIconWrap} svg {
      transform: none;
    }
  }
`

export type WorkspaceNavLockedVariant = 'modeling' | 'architecture'

export const WorkspaceNavRowLocked = styled.div<{ $variant: WorkspaceNavLockedVariant }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1.05rem 1.15rem;
  border-radius: 0.9rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: not-allowed;
  opacity: 0.92;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    z-index: 1;
    transform: scaleX(1);
    transform-origin: left center;
    background: ${({ $variant, theme }) =>
      $variant === 'modeling'
        ? `linear-gradient(
            90deg,
            ${theme.primary},
            color-mix(in srgb, ${theme.primary} 70%, white)
          )`
        : 'linear-gradient(90deg, #14b8a6, #5eead4)'};
  }

  background: ${({ $variant, theme }) =>
    $variant === 'modeling'
      ? `linear-gradient(
          135deg,
          ${theme.primaryMuted} 0%,
          ${theme.surface} 55%
        )`
      : `linear-gradient(
          135deg,
          color-mix(in srgb, #14b8a6 18%, ${theme.surface}) 0%,
          ${theme.surface} 58%
        )`};
`

export const DiagramCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.35rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  min-height: 0;
`

export const DiagramCardTitle = styled.h3`
  margin: 0 0 0.85rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const DiagramChartBox = styled.div`
  flex: 1;
  min-height: 240px;
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

/** Mesmo bloco de motor SQL, sem margem inferior (uso dentro do painel lateral). */
export const PanelDbSettingRow = styled(DbSettingRow)`
  margin: 0;
`

export const DbLabel = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.2rem;
`

export const DbLabelInRow = styled(DbLabel)`
  margin-bottom: 0;
  flex: 1;
  min-width: 0;
`

export const DbLabelRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.45rem;
  margin-bottom: 0.35rem;
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
