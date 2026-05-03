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

/** Indicadores e alocações à esquerda; áreas de trabalho à direita. */
export const DetailMain = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 22rem);
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
  min-width: 0;
  min-height: 0;
  gap: 1rem;
  align-self: stretch;
`

export const DetailSideColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  align-self: stretch;
`

/** Painel único à direita: configuração + atalhos (evita vários cartões empilhados). */
export const SideOverviewPanel = styled.div`
  flex: 1;
  min-height: 0;
  padding: 1.2rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
`

export const HeroStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;
  margin-bottom: 1rem;

  @media (max-width: 1050px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`

export const HeroStatCard = styled.div`
  padding: 0.95rem 1rem;
  border-radius: 0.8rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'linear-gradient(140deg, rgba(15,23,42,0.68), rgba(15,23,42,0.38))'
      : 'linear-gradient(140deg, #ffffff, #f8fafc)'};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const HeroStatLabel = styled.span`
  display: block;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.3rem;
`

export const HeroStatValue = styled.strong`
  display: block;
  font-size: 1.45rem;
  line-height: 1;
  color: ${({ theme }) => theme.text};
`

/** Painel único à esquerda: preenche a altura da linha do grid (alinhado à coluna direita). */
export const ProjectOverviewShell = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem 1.15rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const ProjectOverviewTitle = styled.h3`
  margin: 0 0 0.85rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

/** Três visualizações em faixa — evita grade 2×2 de caixas iguais. */
export const ProjectChartsStrip = styled.div`
  display: flex;
  gap: 0;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  overflow: hidden;
  min-height: 260px;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(2, 6, 23, 0.35)' : theme.surfaceHover};

  @media (max-width: 1050px) {
    min-height: 0;
    flex-direction: column;
  }
`

export const ProjectChartSlot = styled.button<{ $active: boolean }>`
  appearance: none;
  border: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  background: transparent;
  text-align: left;
  cursor: pointer;
  padding: ${({ $active }) => ($active ? '0.75rem 0.85rem' : '0.6rem 0.35rem')};
  min-width: ${({ $active }) => ($active ? '0' : '2.8rem')};
  flex: ${({ $active }) => ($active ? '1 1 0' : '0 0 2.8rem')};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  justify-content: ${({ $active }) => ($active ? 'flex-start' : 'center')};
  align-items: ${({ $active }) => ($active ? 'stretch' : 'center')};
  border-right: 1px solid ${({ theme }) => theme.border};
  transition:
    flex-basis 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.24s ease;

  ${({ $active, theme }) =>
    !$active
      ? `background: ${
          theme.mode === 'dark'
            ? 'rgba(2, 6, 23, 0.22)'
            : 'color-mix(in srgb, white 45%, #e2e8f0)'
        };`
      : ''}

  &:hover {
    background: ${({ theme, $active }) =>
      $active
        ? theme.mode === 'dark'
          ? 'rgba(15, 23, 42, 0.25)'
          : 'rgba(148, 163, 184, 0.12)'
        : theme.mode === 'dark'
          ? 'rgba(51, 65, 85, 0.35)'
          : 'rgba(148, 163, 184, 0.2)'};
  }

  &:last-child {
    border-right: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: -2px;
  }

  @media (max-width: 1050px) {
    flex: 0 0 auto;
    min-width: 0;
    padding: 0.65rem 0.8rem;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    align-items: stretch;
    justify-content: flex-start;

    &:last-child {
      border-bottom: none;
    }
  }
`

export const ProjectChartSlotTitle = styled.h4<{ $active: boolean }>`
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
  writing-mode: ${({ $active }) => ($active ? 'horizontal-tb' : 'vertical-rl')};
  transform: ${({ $active }) => ($active ? 'none' : 'rotate(180deg)')};
  margin-bottom: ${({ $active }) => ($active ? '0.5rem' : '0')};
  white-space: nowrap;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;
  opacity: ${({ $active }) => ($active ? 1 : 0.92)};

  @media (max-width: 1050px) {
    writing-mode: horizontal-tb;
    transform: none;
    margin-bottom: ${({ $active }) => ($active ? '0.5rem' : '0')};
  }
`

/** Altura fixa no estado aberto para manter boa leitura dos gráficos. */
export const ProjectChartSlotBox = styled.div<{
  $active: boolean
  $position: 'left' | 'right' | 'center'
}>`
  width: 100%;
  height: ${({ $active }) => ($active ? '230px' : '0')};
  min-height: ${({ $active }) => ($active ? '230px' : '0')};
  overflow: hidden;
  opacity: 1;
  visibility: ${({ $active }) => ($active ? 'visible' : 'hidden')};
  pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};
  transform: ${({ $active, $position }) => {
    if ($active) return 'translateX(0) scale(1)'
    if ($position === 'left') return 'translateX(-18px) scale(0.985)'
    if ($position === 'right') return 'translateX(18px) scale(0.985)'
    return 'translateX(0) scale(0.985)'
  }};
  transform-origin: center center;
  will-change: transform;
  /* Sem atraso em visibility: antes o gráfico ficava visível enquanto a coluna encolhia. */
  transition: ${({ $active }) =>
    $active ? 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'};
`

export const ProjectAllocationsSection = styled.div`
  flex: 1;
  min-height: 0;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
`

export const ProjectAllocationsTitle = styled.h4`
  margin: 0 0 0.65rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const ProjectAllocationsScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 0.15rem;
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

export const WorkspaceNavLinkSqlScripts = styled(Link)`
  ${workspacePremiumShell}
  animation-delay: 0.11s;

  &:focus-visible {
    outline: 2px solid #0ea5e9;
    outline-offset: 3px;
  }

  &::before {
    background: linear-gradient(90deg, #0ea5e9, #38bdf8);
    animation-delay: 0.78s;
  }

  background: linear-gradient(
    135deg,
    color-mix(in srgb, #0ea5e9 22%, ${({ theme }) => theme.surface}) 0%,
    ${({ theme }) => theme.surface} 58%
  );

  &:hover {
    transform: translateY(-5px);
    border-color: #0ea5e9;
    box-shadow:
      0 14px 32px color-mix(in srgb, #0ea5e9 18%, transparent),
      0 4px 12px rgba(15, 23, 42, 0.08);

    ${WorkspaceNavChevron} {
      transform: translateX(4px);
      color: #0ea5e9;
    }

    ${WorkspaceNavIconWrap} {
      color: #0ea5e9;

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

export const WorkspaceNavLinkApf = styled(Link)`
  ${workspacePremiumShell}
  animation-delay: 0.17s;

  &:focus-visible {
    outline: 2px solid #ca8a04;
    outline-offset: 3px;
  }

  &::before {
    background: linear-gradient(90deg, #ca8a04, #fbbf24);
    animation-delay: 0.82s;
  }

  background: linear-gradient(
    135deg,
    color-mix(in srgb, #ca8a04 22%, ${({ theme }) => theme.surface}) 0%,
    ${({ theme }) => theme.surface} 58%
  );

  &:hover {
    transform: translateY(-5px);
    border-color: #ca8a04;
    box-shadow:
      0 14px 32px color-mix(in srgb, #ca8a04 18%, transparent),
      0 4px 12px rgba(15, 23, 42, 0.08);

    ${WorkspaceNavChevron} {
      transform: translateX(4px);
      color: #ca8a04;
    }

    ${WorkspaceNavIconWrap} {
      color: #ca8a04;

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

export type WorkspaceNavLockedVariant = 'modeling' | 'architecture' | 'sqlScripts'

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
        : $variant === 'sqlScripts'
          ? 'linear-gradient(90deg, #0ea5e9, #38bdf8)'
          : 'linear-gradient(90deg, #14b8a6, #5eead4)'};
  }

  background: ${({ $variant, theme }) =>
    $variant === 'modeling'
      ? `linear-gradient(
          135deg,
          ${theme.primaryMuted} 0%,
          ${theme.surface} 55%
        )`
      : $variant === 'sqlScripts'
        ? `linear-gradient(
            135deg,
            color-mix(in srgb, #0ea5e9 18%, ${theme.surface}) 0%,
            ${theme.surface} 58%
          )`
        : `linear-gradient(
            135deg,
            color-mix(in srgb, #14b8a6 18%, ${theme.surface}) 0%,
            ${theme.surface} 58%
          )`};
`

export const AllocationRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`

export const AllocationRow = styled.div`
  display: grid;
  grid-template-columns: minmax(80px, 140px) minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.55rem;
`

export const AllocationName = styled.span`
  font-size: 0.74rem;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const AllocationBarTrack = styled.div`
  height: 0.45rem;
  border-radius: 999px;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(148, 163, 184, 0.2)' : theme.surfaceHover};
  overflow: hidden;
`

export const AllocationBarFill = styled.span<{ $pct: number }>`
  display: block;
  height: 100%;
  width: ${({ $pct }) => `${$pct}%`};
  border-radius: inherit;
  background: ${({ theme }) => theme.primary};
`

export const AllocationValue = styled.span`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
  min-width: 3.5rem;
  text-align: right;
`

export const SecondaryChartsGrid = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
  }
`

export const InsightsGrid = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
  }
`

export const InsightCard = styled.div`
  padding: 0.95rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(2, 6, 23, 0.45)' : theme.surfaceHover};
`

export const InsightTitle = styled.h4`
  margin: 0 0 0.6rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const TeamStack = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
`

export const TeamAvatar = styled.span`
  width: 1.95rem;
  height: 1.95rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.primaryMuted};
  border: 1px solid ${({ theme }) => theme.border};
`

export const TeamName = styled.span`
  font-size: 0.78rem;
  color: ${({ theme }) => theme.text};
  margin-right: 0.55rem;
`

export const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`

export const TagChip = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.26rem 0.58rem;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.primaryMuted};
  border: 1px solid ${({ theme }) => theme.border};
`

export const ActivityList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const ActivityItem = styled.li`
  font-size: 0.76rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;

  small {
    color: ${({ theme }) => theme.textMuted};
    font-size: 0.68rem;
    white-space: nowrap;
  }
`

export const MiniChartCard = styled.div`
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(2, 6, 23, 0.45)' : theme.surfaceHover};
`

export const MiniChartTitle = styled.h4`
  margin: 0 0 0.55rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const MiniChartWrap = styled.div`
  width: 100%;
  height: 170px;
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
  margin: 0.2rem 0 0;
  font-size: 0.74rem;
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

export const HeaderPageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`

const SETTINGS_LINK_PAD_Y = '0.55rem'
const SETTINGS_LINK_PAD_X = '1rem'
const SETTINGS_LINK_ICON = 18

/** Mesma escala do Excluir; em repouso só o ícone, texto abre no hover/focus. */
export const PageSettingsLink = styled(Link)`
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.4rem;
  width: auto;
  max-width: 100%;
  padding: ${SETTINGS_LINK_PAD_Y} ${SETTINGS_LINK_PAD_X};
  min-height: calc(${SETTINGS_LINK_PAD_Y} * 2 + ${SETTINGS_LINK_ICON}px);
  border-radius: 0.55rem;
  box-sizing: border-box;
  font-family: inherit;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'rgba(148, 163, 184, 0.12)'
      : 'rgba(71, 85, 105, 0.1)'};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
  transition:
    transform 0.2s ease,
    width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    gap 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.2s ease,
    color 0.25s ease;

  &:not(:hover):not(:focus-visible) {
    justify-content: center;
    gap: 0;
    padding: ${SETTINGS_LINK_PAD_Y} 0.55rem;
    width: calc(${SETTINGS_LINK_PAD_Y} * 2 + ${SETTINGS_LINK_ICON}px);
    min-width: calc(${SETTINGS_LINK_PAD_Y} * 2 + ${SETTINGS_LINK_ICON}px);
    max-width: calc(${SETTINGS_LINK_PAD_Y} * 2 + ${SETTINGS_LINK_ICON}px);
  }

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.text};
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) =>
      theme.mode === 'dark'
        ? 'rgba(148, 163, 184, 0.18)'
        : 'rgba(71, 85, 105, 0.14)'};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (prefers-reduced-motion: reduce) {
    transition:
      background 0.2s ease,
      border-color 0.2s ease;

    &:active {
      transform: none;
    }

    &:not(:hover):not(:focus-visible) {
      padding: ${SETTINGS_LINK_PAD_Y} ${SETTINGS_LINK_PAD_X};
      gap: 0.4rem;
      justify-content: flex-start;
      width: auto;
      min-width: 0;
      max-width: 100%;
    }
  }
`

export const PageSettingsLinkIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${SETTINGS_LINK_ICON}px;
  height: ${SETTINGS_LINK_ICON}px;
  color: inherit;

  svg {
    display: block;
    shape-rendering: geometricPrecision;
  }
`

export const PageSettingsLinkLabel = styled.span`
  display: block;
  flex: 0 1 auto;
  min-width: 0;
  line-height: 1;
  font-size: 0.9rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  max-width: 11rem;
  opacity: 1;
  transition:
    max-width 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease,
    flex-basis 0.28s cubic-bezier(0.22, 1, 0.36, 1);

  ${PageSettingsLink}:not(:hover):not(:focus-visible) & {
    flex: 0 0 0;
    max-width: 0;
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.15s ease;

    ${PageSettingsLink}:not(:hover):not(:focus-visible) & {
      flex: 0 1 auto;
      max-width: 11rem;
      opacity: 1;
    }
  }
`

export const SettingsHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`

export const SettingsTitleBlock = styled.div`
  min-width: 0;
`

export const SettingsPageTitle = styled.h1`
  margin: 0 0 0.35rem;
  font-size: 1.45rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const SettingsPageLead = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.45;
`

export const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  width: 100%;
`

export const SettingsFieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

export const SettingsLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
`

export const SettingsTextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  font-family: inherit;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`

export const SettingsTextArea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  line-height: 1.45;
  resize: vertical;
  font-family: inherit;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`

export const SettingsDateRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
`

export const SettingsDateField = styled.div`
  flex: 1;
  min-width: 11rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`

export const SettingsDateInput = styled(SettingsTextInput).attrs({ type: 'date' })`
  min-height: 2.65rem;
  color-scheme: inherit;
`

export const SettingsFieldHint = styled.p`
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.textMuted};
`

export const SettingsFieldError = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #dc2626;
`

export const SettingsColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`

export const SettingsColorBoxLabel = styled.label`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.85rem;
  height: 2.85rem;
  padding: 0.28rem;
  box-sizing: border-box;
  border-radius: 0.6rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.textMuted};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }
`

export const SettingsColorInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border-radius: 0.4rem;
    border: none;
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: 0.4rem;
  }
`

export const SettingsColorHint = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
`

export const SettingsReadOnlyId = styled(SettingsTextInput)`
  opacity: 0.88;
  font-family: ui-monospace, monospace;
  font-size: 0.85rem;
`

export const SettingsSubmitRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.35rem;
`

export const SettingsSubmitButton = styled.button`
  padding: 0.72rem 1.2rem;
  border-radius: 0.55rem;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    filter 0.15s ease,
    transform 0.12s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const SettingsSavedFlash = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
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
