import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const ProfileRoot = styled.div`
  width: 100%;
`

export const ProfileHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const Avatar = styled.div`
  flex-shrink: 0;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  background: ${({ theme }) => theme.primary};
`

export const HeaderText = styled.div`
  flex: 1;
  min-width: 0;
`

export const ProfileTitle = styled.h1`
  margin: 0 0 0.35rem;
  font-size: 1.45rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const ProfileMeta = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.45;
`

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`

export const EditLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1rem;
  border-radius: 0.55rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background: ${({ theme }) => theme.primary};
  transition: filter 0.15s ease;

  &:hover {
    filter: brightness(1.06);
    color: #fff;
  }
`

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 22rem);
  gap: 1.5rem;
  align-items: start;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const ChartCard = styled.div`
  padding: 1.2rem 1.35rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const ChartTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const ChartBox = styled.div`
  height: 220px;
  width: 100%;
`

export const ChartHint = styled.p`
  margin: 0.65rem 0 0;
  font-size: 0.78rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.textMuted};
`

export const SideStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
`

export const ProjectListCard = styled.div`
  padding: 1.1rem 1.2rem;
  border-radius: 0.9rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const ProjectListTitle = styled.h3`
  margin: 0 0 0.65rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const ProjectLink = styled(Link)`
  display: block;
  padding: 0.45rem 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    text-decoration: underline;
  }
`

export const FuturePanel = styled.div`
  padding: 1.1rem 1.2rem;
  border-radius: 0.9rem;
  border: 1px dashed ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
`

export const FutureTitle = styled.h3`
  margin: 0 0 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
`

export const FutureText = styled.p`
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`
