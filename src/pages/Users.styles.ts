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

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

const motionEnter = (duration = '0.5s') => css`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeUp} ${duration} ${easeOut} both;
  }
`

export const UsersTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.35rem;
  width: 100%;
  ${motionEnter()}
  animation-delay: 0s;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const UsersActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`

export const NewUserCta = styled(Link)`
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
  max-width: 44rem;
  line-height: 1.5;
  ${motionEnter()}
  animation-delay: 0.06s;
`
