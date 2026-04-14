import styled from 'styled-components'

export const HelpAnchor = styled.div`
  position: absolute;
  top: 1.05rem;
  right: 1.05rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const HelpButton = styled.button`
  display: grid;
  place-items: center;
  width: 1.65rem;
  height: 1.65rem;
  padding: 0;
  margin: 0;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.88rem;
  font-weight: 700;
  font-family: inherit;
  line-height: 1;
  cursor: help;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;

   &:hover {
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primaryMuted};
    background: ${({ theme }) => theme.primaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`

export const HelpPopover = styled.div`
  position: absolute;
  top: calc(100% + 0.4rem);
  right: 0;
  width: min(19.5rem, calc(100vw - 2.5rem));
  padding: 0.75rem 0.9rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow:
    ${({ theme }) => theme.shadow},
    0 12px 28px rgba(0, 0, 0, 0.18);
  font-size: 0.78rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
  text-align: left;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition:
    opacity 0.18s ease,
    visibility 0.18s ease,
    transform 0.18s ease;

  strong {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
  }

  ${HelpAnchor}:hover &,
  ${HelpAnchor}:focus-within & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.12s ease, visibility 0.12s ease;
    transform: none;
  }
`
