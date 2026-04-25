import styled from 'styled-components'

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const HelpTooltipBubble = styled.span`
  position: absolute;
  right: 0;
  top: calc(100% + 0.35rem);
  /* Acima de camadas internas do React Flow (ex.: connection line z-index 1001) */
  z-index: 1200;
  width: max-content;
  max-width: min(15.5rem, calc(100vw - 2rem));
  padding: 0.55rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 400;
  line-height: 1.45;
  color: ${({ theme }) => theme.text};
  text-align: left;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.16s ease,
    visibility 0.16s ease,
    transform 0.16s ${easeOut};
  transform: translateY(-2px);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`

export const HelpWrap = styled.span`
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  margin-top: 0.05rem;

  &:hover ${HelpTooltipBubble},
  &:focus-within ${HelpTooltipBubble} {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }
`

export const HelpTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textMuted};
  cursor: help;
  line-height: 1;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`
