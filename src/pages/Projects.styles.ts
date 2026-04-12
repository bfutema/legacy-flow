import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'

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

const cardEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
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

const accentPop = keyframes`
  from {
    opacity: 0;
    transform: scaleY(0.35);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
`

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

const motionEnter = (animation: ReturnType<typeof keyframes>, duration = '0.55s') => css`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${animation} ${duration} ${easeOut} both;
  }
`

export const ProjectsTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.35rem;
  width: 100%;
  ${motionEnter(fadeUp, '0.5s')}
  animation-delay: 0s;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const ProjectsActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`

export const NewProjectCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 0.55rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background: ${({ theme }) => theme.primary};
  box-shadow:
    0 1px 2px ${({ theme }) => (theme.mode === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(15, 23, 42, 0.08)')},
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transition:
    filter 0.15s ease,
    transform 0.12s ease;

  &:hover {
    filter: brightness(1.06);
    color: #fff;
  }

  &:active {
    transform: translateY(1px);
  }
`

export const Lead = styled.p`
  margin: 0 0 1.75rem;
  color: ${({ theme }) => theme.textMuted};
  max-width: 40rem;
  line-height: 1.5;
  ${motionEnter(fadeUp, '0.5s')}
  animation-delay: 0.07s;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
  width: 100%;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

export const ProjectCard = styled(Link)<{ $accent: string; $delayIndex: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 9.5rem;
  padding: 1.25rem 1.35rem;
  border-radius: 0.9rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  --card-delay: ${({ $delayIndex }) => $delayIndex * 0.055}s;
  transition:
    transform 0.28s ${easeOut},
    box-shadow 0.28s ${easeOut},
    border-color 0.22s ease,
    background 0.22s ease;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${cardEnter} 0.58s ${easeOut} both;
    animation-delay: calc(0.12s + var(--card-delay));
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    transform-origin: left center;
    background: linear-gradient(
      90deg,
      ${({ $accent }) => $accent},
      color-mix(in srgb, ${({ $accent }) => $accent} 72%, white)
    );

    @media (prefers-reduced-motion: no-preference) {
      animation: ${stripeGrow} 0.65s ${easeOut} both;
      animation-delay: calc(0.22s + var(--card-delay));
    }
  }

  &:hover {
    transform: translateY(-6px);
    border-color: color-mix(in srgb, ${({ $accent }) => $accent} 55%, transparent);
    box-shadow:
      0 16px 36px color-mix(in srgb, ${({ $accent }) => $accent} 20%, transparent),
      0 6px 14px rgba(15, 23, 42, 0.08);
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ $accent }) => $accent};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover {
      transform: none;
    }
  }
`

export const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.5rem;
`

export const TitleAccent = styled.span<{ $accent: string; $delayIndex: number }>`
  flex-shrink: 0;
  width: 0.35rem;
  height: 1.35rem;
  border-radius: 999px;
  background: ${({ $accent }) => $accent};
  box-shadow: 0 0 0 1px color-mix(in srgb, ${({ $accent }) => $accent} 35%, transparent);
  transform-origin: center top;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${accentPop} 0.45s ${easeOut} both;
    animation-delay: calc(0.35s + ${({ $delayIndex }) => $delayIndex * 0.055}s);
  }
`

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  min-width: 0;
`

export const CardDesc = styled.p`
  margin: 0 0 1rem;
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const CardMeta = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`
