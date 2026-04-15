import styled, { css, keyframes } from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../layouts/adminShellTokens'

/** Só opacity — evita `transform` no ancestral do Kanban (quebra o DragOverlay do @dnd-kit). */
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const reduceMotion = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
`

export const TopStrip = styled.div`
  flex-shrink: 0;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};

  @media ${ADMIN_MOBILE_MEDIA} {
    padding: 0.65rem 0.85rem 0.55rem;
  }
`

export const PageTitle = styled.h1`
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  animation: ${fadeIn} 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  ${reduceMotion}

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 1.12rem;
    margin-bottom: 0.25rem;
  }
`

export const Lead = styled.p`
  margin: 0;
  max-width: 40rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.5;
  animation: ${fadeIn} 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.06s both;
  ${reduceMotion}

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 0.8rem;
    line-height: 1.45;
    max-width: none;
  }
`

export const BoardFill = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
  ${reduceMotion}

  @media ${ADMIN_MOBILE_MEDIA} {
    min-height: clamp(220px, calc(100dvh - 10.5rem), 75dvh);
  }
`
