import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../../layouts/adminShellTokens'

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const canvasReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.995);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const PageShell = styled.div<{ $theater?: boolean }>`
  width: 100%;
  ${({ $theater }) =>
    $theater
      ? css`
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        `
      : ''}

  & > * {
    @media (prefers-reduced-motion: no-preference) {
      animation: ${fadeUp} 0.48s ${easeOut} both;
    }
  }

  ${({ $theater }) =>
    $theater
      ? css`
          & > * {
            animation: none !important;
          }
        `
      : ''}

  & > *:nth-child(1) {
    animation-delay: 0.02s;
  }
  & > *:nth-child(2) {
    animation-delay: 0.06s;
  }
  & > *:nth-child(3) {
    animation-delay: 0.1s;
  }

  & > *:last-child {
    @media (prefers-reduced-motion: no-preference) {
      animation-name: ${canvasReveal};
      animation-duration: 0.55s;
    }
  }
`

export const FlowHost = styled.div<{ $theater?: boolean }>`
  position: relative;
  z-index: 1;
  width: 100%;
  height: clamp(440px, calc(100dvh - 11.5rem), 900px);
  min-height: 400px;
  border-radius: 0.85rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  transform-origin: center top;

  &:focus-within {
    border-color: color-mix(in srgb, ${({ theme }) => theme.primary} 38%, transparent);
  }

  .react-flow {
    --xy-background-color: transparent;
    width: 100%;
    height: 100%;
  }

  /* Dark: contraste forte (ícones não “somem” no branco) */
  .react-flow.dark .react-flow__controls {
    --xy-controls-button-background-color: #1e293b;
    --xy-controls-button-background-color-hover: #334155;
    --xy-controls-button-color: #e2e8f0;
    --xy-controls-button-color-hover: #f8fafc;
    --xy-controls-button-border-color: #475569;
    --xy-controls-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  }

  .react-flow.dark .react-flow__controls-button svg {
    fill: currentColor;
    stroke: currentColor;
    opacity: 1;
  }

  /* Light: garantir ícone escuro sobre fundo claro */
  .react-flow.light .react-flow__controls {
    --xy-controls-button-background-color: ${({ theme }) => theme.surface};
    --xy-controls-button-background-color-hover: ${({ theme }) => theme.surfaceHover};
    --xy-controls-button-color: ${({ theme }) => theme.text};
    --xy-controls-button-color-hover: ${({ theme }) => theme.text};
    --xy-controls-button-border-color: ${({ theme }) => theme.border};
    --xy-controls-box-shadow: ${({ theme }) => theme.shadow};
  }

  .react-flow.light .react-flow__controls-button svg {
    fill: currentColor;
    stroke: currentColor;
    opacity: 1;
  }

  &:fullscreen,
  &:-webkit-full-screen {
    height: 100vh;
    height: 100dvh;
    width: 100vw;
    max-height: none;
    border-radius: 0;
    min-height: 100%;
  }

  &:fullscreen .react-flow,
  &:-webkit-full-screen .react-flow {
    height: 100%;
    min-height: 100%;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    height: clamp(260px, calc(100dvh - 10rem), 900px);
    min-height: 220px;

    .react-flow__controls {
      transform: scale(0.92);
      transform-origin: bottom left;
    }
  }

  ${({ $theater }) =>
    $theater
      ? css`
          flex: 1;
          min-height: 0;
          height: 100%;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-bottom: none;
        `
      : ''}
`

export const StatusStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 1rem;
  margin-bottom: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.55rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
`

export const StatusStrong = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const StatusDot = styled.span`
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  margin-right: 0.35rem;
  vertical-align: middle;
`

export const SideRail = styled.aside`
  width: min(17.5rem, calc(100vw - 2rem));
  max-height: min(560px, calc(100dvh - 10rem));
  overflow: auto;
  padding: 0.65rem 0.7rem;
  border-radius: 0.55rem;
  background: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.94)'};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  backdrop-filter: blur(8px);
  font-size: 0.78rem;

  @media ${ADMIN_MOBILE_MEDIA} {
    width: min(100%, 15rem);
    max-height: min(420px, 42vh);
    font-size: 0.72rem;
  }
`

export const RailTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`

export const RailTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
`

export const RailTitleWithHelp = styled(RailTitle)`
  margin-bottom: 0;
  flex: 1;
  min-width: 0;
`

export const RailSection = styled.div`
  margin-bottom: 0.85rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const FilterRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.35rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  user-select: none;

  &:last-child {
    margin-bottom: 0;
  }

  input {
    accent-color: ${({ theme }) => theme.primary};
  }
`

export const InlineLabel = styled.label`
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
`

export const SmallSelect = styled.select`
  width: 100%;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.72rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryMuted};
  }
`

export const SmallInput = styled.input`
  width: 100%;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.72rem;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryMuted};
  }
`

export const DetailCard = styled.div`
  padding: 0.55rem 0.55rem 0.6rem;
  border-radius: 0.45rem;
  background: ${({ theme }) => theme.surfaceHover};
  border: 1px solid ${({ theme }) => theme.border};
`

export const DetailTitle = styled.div`
  font-weight: 600;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.25rem;
`

export const FileList = styled.ul`
  margin: 0.45rem 0 0;
  padding: 0 0 0 1rem;
  font-size: 0.68rem;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  color: ${({ theme }) => theme.text};
  line-height: 1.45;
`

export const TopLeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-width: min(16rem, 46vw);
`

export const TopToolbarRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
`

/** Cabeçalho clicável para recolher/expandir blocos do painel (ex.: filtros). */
export const FoldSectionHead = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0 0 0.4rem;
  padding: 0.35rem 0.2rem;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.surfaceHover};
  }

  svg {
    flex-shrink: 0;
    width: 0.85rem;
    height: 0.85rem;
    color: ${({ theme }) => theme.textMuted};
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
    transition: transform 0.2s ${easeOut};
  }
`

export const RailHintLink = styled(Link)`
  display: inline-block;
  margin-top: 0.45rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const RailHintButton = styled.button`
  display: block;
  width: 100%;
  margin-top: 0.45rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.primaryMuted};
  color: ${({ theme }) => theme.primary};
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const AddBlockWrap = styled.div`
  position: relative;
`

export const AddBlockPopover = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 12;
  width: min(17rem, 56vw);
  max-height: min(330px, 48vh);
  padding: 0.55rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transform: translateY(${({ $open }) => ($open ? '0.22rem' : '-0.12rem')});
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    visibility 0.15s ease;
`

export const AddBlockSearch = styled.input`
  width: 100%;
  margin: 0 0 0.45rem;
  padding: 0.38rem 0.46rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.7rem;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryMuted};
  }
`

export const AddBlockList = styled.div`
  display: grid;
  gap: 0.3rem;
  max-height: calc(min(330px, 48vh) - 3.25rem);
  overflow: auto;
  padding-right: 0.1rem;
`

export const AddBlockOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.34rem 0.44rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryMuted};
  }
`

export const PersistHintBar = styled.div`
  position: relative;
  /* Acima do canvas (irmão seguinte no DOM), para o tooltip não ficar sob o React Flow */
  z-index: 20;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
`

export const PersistHintText = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.45;
`
