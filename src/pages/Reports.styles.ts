import styled from 'styled-components'

export const PageTitle = styled.h1`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const Lead = styled.p`
  margin: 0;
  max-width: 42rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.55;
`
