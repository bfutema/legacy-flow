import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

const stripeGrow = keyframes`
  to {
    transform: scaleX(1);
  }
`

export const DashboardRoot = styled.div`
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
    animation-delay: 0.17s;
  }
  & > *:nth-child(5) {
    animation-delay: 0.23s;
  }
`

export const PageTitle = styled.h1`
  margin: 0 0 0.4rem;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
`

export const Lead = styled.p`
  margin: 0 0 1.35rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
  max-width: 42rem;

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.text};
  }
`

export const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

export const Stat = styled.div`
  position: relative;
  padding: 1.05rem 1.2rem;
  border-radius: 0.85rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.22s ${easeOut},
    transform 0.22s ${easeOut};

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.primary},
      color-mix(in srgb, ${({ theme }) => theme.primary} 65%, white)
    );
    transform-origin: left center;
    transform: scaleX(0);

    @media (prefers-reduced-motion: no-preference) {
      animation: ${stripeGrow} 0.55s ${easeOut} 0.35s both;
    }

    @media (prefers-reduced-motion: reduce) {
      transform: scaleX(1);
    }
  }

  &:hover {
    border-color: color-mix(in srgb, ${({ theme }) => theme.primary} 35%, transparent);
    box-shadow:
      0 8px 24px ${({ theme }) => theme.primaryMuted},
      ${({ theme }) => theme.shadow};
    transform: translateY(-2px);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

export const StatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.35rem;
`

export const StatValue = styled.div`
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text};
  font-variant-numeric: tabular-nums;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
  gap: 1.25rem;
  width: 100%;
  margin-bottom: 1.5rem;
`

export const Card = styled.section`
  position: relative;
  padding: 1.25rem 1.35rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.22s ${easeOut};

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.primary},
      color-mix(in srgb, ${({ theme }) => theme.primary} 72%, white)
    );
  }

  &:hover {
    border-color: color-mix(in srgb, ${({ theme }) => theme.primary} 28%, transparent);
    box-shadow:
      0 12px 28px ${({ theme }) => theme.primaryMuted},
      ${({ theme }) => theme.shadow};
  }
`

export const CardTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const ChartBox = styled.div`
  width: 100%;
  height: 260px;
`

export const QuickLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem 1.35rem;
  border-radius: 0.9rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.primaryMuted} 0%,
    ${({ theme }) => theme.surface} 65%
  );
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const QuickLinksText = styled.div`
  flex: 1;
  min-width: 12rem;

  strong {
    display: block;
    font-size: 0.95rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.25rem;
  }

  span {
    font-size: 0.82rem;
    line-height: 1.45;
    color: ${({ theme }) => theme.textMuted};
  }
`

export const QuickLinksButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.65rem 1.2rem;
  border-radius: 0.55rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background: ${({ theme }) => theme.primary};
  box-shadow: 0 2px 8px ${({ theme }) => theme.primaryMuted};
  transition:
    filter 0.15s ease,
    transform 0.18s ${easeOut};

  &:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`
