import styled from 'styled-components'
import { ADMIN_HEADER_BAR_HEIGHT } from '../../layouts/adminShellTokens'

export const StudioRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100dvh - ${ADMIN_HEADER_BAR_HEIGHT});
  min-height: 0;
  box-sizing: border-box;
  background: ${({ theme }) => theme.bg};
`

export const StudioTopBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.55rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`

export const DocTitleInput = styled.input`
  flex: 1;
  min-width: 12rem;
  max-width: 24rem;
  padding: 0.35rem 0.55rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  font-size: 0.88rem;
  font-weight: 600;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 0;
    border-color: transparent;
  }
`

export const StudioHint = styled.span`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.textMuted};
`

export const StudioBody = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: grid;
  grid-template-columns: 13.5rem 1fr 15rem;
  grid-template-rows: 1fr;

  @media (max-width: 1100px) {
    grid-template-columns: 11rem 1fr 13rem;
  }

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
`

export const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};

  &:last-child {
    border-right: none;
    border-left: 1px solid ${({ theme }) => theme.border};
  }

  @media (max-width: 820px) {
    border-right: none;
    border-left: none;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    max-height: 40vh;

    &:last-child {
      border-bottom: none;
      border-top: 1px solid ${({ theme }) => theme.border};
      max-height: 36vh;
    }
  }
`

export const PanelTitle = styled.h2`
  margin: 0;
  padding: 0.55rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  flex-shrink: 0;
`

export const PanelScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
`

export const CanvasRegion = styled.div`
  position: relative;
  min-height: 0;
  min-width: 0;
  background: ${({ theme }) => theme.bg};
  display: flex;
  flex-direction: column;
`

/** Área flexível sob a toolbar; o canvas usa posição absoluta em 100% deste bloco. */
export const CanvasFill = styled.div`
  flex: 1;
  min-height: 0;
  min-width: 0;
  position: relative;
`
