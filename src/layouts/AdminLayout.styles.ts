import styled from 'styled-components'

export const Shell = styled.div`
  display: flex;
  min-height: 100vh;
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
  overflow: hidden;
`

export const Content = styled.main`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
`

export const ContentInner = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 1.5rem clamp(1rem, 3vw, 2rem) 2.5rem;
  box-sizing: border-box;
`
