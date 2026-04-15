import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
  background: ${({ theme }) => theme.bg};

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 80% 55% at 50% -25%,
        ${({ theme }) => theme.primaryMuted},
        transparent 55%
      ),
      radial-gradient(
        ellipse 60% 40% at 100% 100%,
        ${({ theme }) => theme.primaryMuted},
        transparent 50%
      ),
      radial-gradient(
        ellipse 50% 35% at 0% 100%,
        ${({ theme }) => theme.primaryMuted},
        transparent 45%
      );
    opacity: ${({ theme }) => (theme.mode === 'dark' ? 0.85 : 1)};
  }
`

const reducedMotion = '@media (prefers-reduced-motion: reduce)'

export const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 26rem;
  padding: 2.25rem 2rem 2rem;
  border-radius: 1.125rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow:
    ${({ theme }) => theme.shadow},
    0 22px 48px -18px ${({ theme }) => (theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.55)' : 'rgba(15, 23, 42, 0.12)')};
  z-index: 1;
  overflow: hidden;
  animation: authCardEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;

  @keyframes authCardEnter {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  ${reducedMotion} {
    animation: none;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.primary},
      color-mix(in srgb, ${({ theme }) => theme.primary} 65%, white)
    );
  }
`

export const BrandLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.75rem;
  text-decoration: none;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.15s ease;
  animation: authBrandEnter 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.06s both;

  @keyframes authBrandEnter {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  ${reducedMotion} {
    animation: none;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`

export const BrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.45rem;
  background: ${({ theme }) => theme.primaryMuted};
  color: ${({ theme }) => theme.primary};
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`

export const AuthPageStack = styled.div`
  display: flex;
  flex-direction: column;
  animation: authStackEnter 0.46s cubic-bezier(0.22, 1, 0.36, 1) both;

  @keyframes authStackEnter {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  ${reducedMotion} {
    animation: none;
  }
`

export const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
`

export const Subtitle = styled.p`
  margin: 0 0 1.65rem;
  font-size: 0.925rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
  max-width: 32ch;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`

export const Input = styled.input`
  padding: 0.72rem 0.85rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) =>
    theme.mode === 'light' ? theme.surfaceHover : theme.bg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
    opacity: 0.75;
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
    background: ${({ theme }) => theme.surface};
  }
`

export const Button = styled.button`
  margin-top: 0.25rem;
  padding: 0.78rem 1.15rem;
  border-radius: 0.55rem;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow:
    0 1px 2px ${({ theme }) => (theme.mode === 'dark' ? 'rgba(0,0,0,0.35)' : 'rgba(15, 23, 42, 0.08)')},
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transition:
    filter 0.15s ease,
    transform 0.12s ease,
    box-shadow 0.15s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.05);
    box-shadow:
      0 4px 14px ${({ theme }) => theme.primaryMuted},
      inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: none;
    box-shadow: none;
  }
`

export const TextLink = styled.a`
  color: ${({ theme }) => theme.primary};
  font-size: 0.875rem;
  text-decoration: none;
  text-align: center;

  &:hover {
    text-decoration: underline;
  }
`

export const RouterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  color: ${({ theme }) => theme.primary};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.35rem 0.15rem;
  border-radius: 0.35rem;
  transition:
    background 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryMuted};
    text-decoration: none;
  }
`

export const RowLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin-top: 1.35rem;
  padding-top: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`

export const SuccessPanel = styled.div`
  margin: 0 0 1.25rem;
  padding: 1rem 1.1rem;
  border-radius: 0.65rem;
  background: ${({ theme }) => theme.primaryMuted};
  border: 1px solid color-mix(in srgb, ${({ theme }) => theme.primary} 28%, transparent);
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  line-height: 1.5;
`

export const FieldError = styled.p`
  margin: -0.35rem 0 0;
  font-size: 0.8rem;
  color: #f87171;
`
