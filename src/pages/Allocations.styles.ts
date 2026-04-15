import styled, { css, keyframes } from 'styled-components'
import { ADMIN_CONTENT_GUTTER_X, ADMIN_MOBILE_MEDIA } from '../layouts/adminShellTokens'

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

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

const chipPop = keyframes`
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const timelineReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const enter = (animation: ReturnType<typeof keyframes>, duration: string, delay: string) => css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    animation: ${animation} ${duration} ${easeOut} ${delay} both;
  }
`

export const AllocationsRoot = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TopStrip = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.25rem;
  padding: 0.85rem ${ADMIN_CONTENT_GUTTER_X};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.bg : theme.surface};
  ${enter(fadeUp, '0.44s', '0s')}

  @media ${ADMIN_MOBILE_MEDIA} {
    padding: 0.65rem ${ADMIN_CONTENT_GUTTER_X};
    gap: 0.55rem 0.75rem;
  }
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 1.12rem;
    line-height: 1.25;
  }
`

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`

export const CollaboratorsToggle = styled.button<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 3px;
    border-radius: 0.25rem;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 0.78rem;
    gap: 0.4rem;
  }
`

export const ToggleTrack = styled.span<{ $on: boolean }>`
  position: relative;
  width: 2.5rem;
  height: 1.35rem;
  border-radius: 999px;
  background: ${({ theme, $on }) =>
    $on ? theme.primary : theme.border};
  transition:
    background 0.22s ${easeOut},
    box-shadow 0.22s ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? 'calc(100% - 17px)' : '3px')};
    width: 1.05rem;
    height: 1.05rem;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.2);
    transition: left 0.22s ${easeOut};
  }
`

export const FiltersStrip = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem ${ADMIN_CONTENT_GUTTER_X} 0.85rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'dark' ? theme.bg : theme.surface};
  ${enter(fadeUp, '0.44s', '0.07s')}

  @media ${ADMIN_MOBILE_MEDIA} {
    flex-direction: column;
    align-items: stretch;
    gap: 0.65rem;
    padding: 0.6rem ${ADMIN_CONTENT_GUTTER_X} 0.65rem;
  }
`

export const FiltersLeft = styled.div`
  flex: 1;
  min-width: min(100%, 18rem);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`

export const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  max-width: 28rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryMuted};
  }

  svg {
    flex-shrink: 0;
    width: 1.1rem;
    height: 1.1rem;
    color: ${({ theme }) => theme.textMuted};
    transition: color 0.2s ease;
  }

  &:focus-within svg {
    color: ${({ theme }) => theme.primary};
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    max-width: none;
    width: 100%;
  }
`

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }
`

export const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`

export const Chip = styled.button<{ $delayIndex?: number }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.45rem 0.2rem 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.35rem;
  background: ${({ theme }) => theme.surface};
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ${easeOut};

  @media (prefers-reduced-motion: no-preference) {
    animation: ${chipPop} 0.4s ${easeOut} both;
    animation-delay: ${({ $delayIndex = 0 }) => 0.14 + $delayIndex * 0.055}s;
  }

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const ChipRemove = styled.span`
  font-size: 0.85rem;
  line-height: 1;
  color: ${({ theme }) => theme.textMuted};
  transition: color 0.15s ease;
`

export const FiltersRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;

  @media ${ADMIN_MOBILE_MEDIA} {
    width: 100%;
    justify-content: space-between;
    gap: 0.45rem;
  }
`

export const ScaleGroup = styled.div`
  display: inline-flex;
  padding: 0.15rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};

  @media ${ADMIN_MOBILE_MEDIA} {
    flex: 1;
    min-width: 0;
    justify-content: center;
  }
`

export const ScaleBtn = styled.button<{ $active: boolean }>`
  padding: 0.35rem 0.65rem;
  border: none;
  border-radius: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.textMuted)};
  background: ${({ theme, $active }) =>
    $active ? theme.primary : 'transparent'};
  transition:
    background 0.2s ${easeOut},
    color 0.2s ${easeOut},
    transform 0.18s ${easeOut};

  &:hover {
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.text)};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const DateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.18s ${easeOut};

  svg {
    width: 1rem;
    height: 1rem;
    color: ${({ theme }) => theme.textMuted};
    transition: color 0.2s ease;
  }

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};

    svg {
      color: ${({ theme }) => theme.text};
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    flex-shrink: 0;
    padding: 0.38rem 0.5rem;
    font-size: 0.72rem;
    gap: 0.35rem;
  }
`

export const TimelineFill = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;

  @media ${ADMIN_MOBILE_MEDIA} {
    min-height: clamp(200px, calc(100dvh - 12rem), 70dvh);
  }

  & > * {
    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      animation: ${timelineReveal} 0.52s ${easeOut} 0.13s both;
    }
  }
`
