import styled from 'styled-components'

export const MarkWrap = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
`

export const BrandLabel = styled.span`
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.sidebarText};
  white-space: nowrap;
`
