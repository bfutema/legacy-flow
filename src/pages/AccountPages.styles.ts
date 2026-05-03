import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ADMIN_HEADER_BAR_HEIGHT } from '../layouts/adminShellTokens'

export const PageRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100dvh - ${ADMIN_HEADER_BAR_HEIGHT});
  min-height: 0;
  box-sizing: border-box;
  padding: 1rem 1.25rem;
  max-width: 36rem;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const Lead = styled.p`
  margin: 0.35rem 0 1rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const InlineLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
