import styled, { css } from 'styled-components'
import { ADMIN_CONTENT_GUTTER_X } from './adminShellTokens'

export const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  max-width: 100%;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`

export const Main = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
`

export const MobileNavBackdrop = styled.button.attrs({ type: 'button' })`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: block;
  border: none;
  margin: 0;
  padding: 0;
  appearance: none;
  background: rgba(15, 23, 42, 0.42);
  cursor: pointer;
  animation: flowBackdropIn 0.2s ease both;

  @keyframes flowBackdropIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Content = styled.main`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const ContentInner = styled.div<{ $flush?: boolean }>`
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
  ${({ $flush }) =>
    $flush
      ? css`
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        `
      : css`
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1.5rem ${ADMIN_CONTENT_GUTTER_X} 2.5rem;
        `}
`
