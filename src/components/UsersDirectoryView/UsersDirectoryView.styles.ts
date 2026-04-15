import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { ADMIN_MOBILE_MEDIA } from '../../layouts/adminShellTokens'

const easeOut = 'cubic-bezier(0.22, 1, 0.36, 1)'

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const cardLift = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const listRowIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const enterMotion = (animation: ReturnType<typeof keyframes>, duration = '0.48s') => css`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${animation} ${duration} ${easeOut} both;
  }
`

export const Root = styled.div`
  width: 100%;
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  width: 100%;
  ${enterMotion(fadeUp, '0.44s')}
  animation-delay: 0.04s;
`

/** Ao trocar tabela/cards/lista, o bloco entra de novo. */
export const ViewContainer = styled.div`
  width: 100%;
  ${enterMotion(fadeUp, '0.46s')}
`

export const ToggleGroup = styled.div`
  display: inline-flex;
  align-items: stretch;
  padding: 0.2rem;
  border-radius: 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const ToggleBtn = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.65rem;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.textMuted)};
  background: ${({ theme, $active }) =>
    $active ? theme.primary : 'transparent'};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.text)};
    background: ${({ theme, $active }) =>
      $active ? theme.primary : theme.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  svg {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }
`

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`

export const HeadRow = styled.tr`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeUp} 0.4s ${easeOut} both;
  }
`

export const TableRow = styled.tr<{ $delayIndex: number }>`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeUp} 0.42s ${easeOut} both;
    animation-delay: ${({ $delayIndex }) => 0.06 + $delayIndex * 0.04}s;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`

export const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  white-space: nowrap;
`

export const ThActions = styled(Th)`
  text-align: right;
  width: 1%;
  white-space: nowrap;
`

export const Td = styled.td`
  padding: 0.7rem 1rem;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  vertical-align: middle;

  tr:last-child & {
    border-bottom: none;
  }
`

export const TdActions = styled(Td)`
  text-align: right;
  white-space: nowrap;
`

export const TableActionGroup = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.15rem;
  vertical-align: middle;
`

export const TableIconActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 0.45rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
    flex-shrink: 0;
  }
`

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 1.1rem;
  width: 100%;
`

export const UserCardLink = styled(Link)<{ $delayIndex: number }>`
  display: block;
  padding: 1.1rem 1.2rem;
  border-radius: 0.85rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${cardLift} 0.52s ${easeOut} both;
    animation-delay: ${({ $delayIndex }) => 0.08 + $delayIndex * 0.055}s;
  }

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    box-shadow:
      0 8px 24px ${({ theme }) => theme.primaryMuted},
      ${({ theme }) => theme.shadow};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`

export const CardName = styled.h3`
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const CardEmail = styled.p`
  margin: 0 0 0.65rem;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.textMuted};
  word-break: break-word;
`

export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
`

export const CardDate = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
`

export const ListRoot = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
`

export const ListRow = styled.li`
  margin: 0;
  padding: 0;
  list-style: none;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }
`

export const ListRowLink = styled(Link)<{ $delayIndex: number }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem 1.25rem;
  padding: 0.85rem 1.1rem;
  text-decoration: none;
  color: inherit;
  box-sizing: border-box;
  width: 100%;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${listRowIn} 0.45s ${easeOut} both;
    animation-delay: ${({ $delayIndex }) => 0.05 + $delayIndex * 0.035}s;
  }

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: -2px;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    column-gap: 0.65rem;
    row-gap: 0.35rem;
    align-items: center;
    padding: 0.65rem 0.7rem;
    flex-wrap: unset;
  }
`

export const ListChevron = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-left: auto;
  color: ${({ theme }) => theme.textMuted};

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media ${ADMIN_MOBILE_MEDIA} {
    grid-column: 3;
    grid-row: 1 / span 2;
    margin-left: 0;
    align-self: center;

    svg {
      width: 1.1rem;
      height: 1.1rem;
    }
  }
`

export const ListAvatar = styled.span`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: #fff;
  background: ${({ theme }) => theme.primary};

  @media ${ADMIN_MOBILE_MEDIA} {
    grid-column: 1;
    grid-row: 1 / span 2;
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.88rem;
    border-radius: 0.5rem;
    align-self: center;
  }
`

export const ListMain = styled.div`
  flex: 1;
  min-width: 0;

  @media ${ADMIN_MOBILE_MEDIA} {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
  }
`

export const ListName = styled.span`
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 0.86rem;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const ListEmail = styled.span`
  display: block;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  word-break: break-all;

  @media ${ADMIN_MOBILE_MEDIA} {
    font-size: 0.74rem;
    word-break: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const ListAside = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};

  @media ${ADMIN_MOBILE_MEDIA} {
    grid-column: 2;
    grid-row: 2;
    flex-wrap: nowrap;
    gap: 0.35rem 0.5rem;
    font-size: 0.72rem;
    min-width: 0;
    overflow: hidden;

    & > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
  }
`

const statusPill = css<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  ${({ $active }) =>
    $active
      ? css`
          background: rgba(21, 128, 61, 0.2);
          color: #15803d;
        `
      : css`
          background: rgba(113, 113, 122, 0.25);
          color: #71717a;
        `}
`

export const StatusPill = styled.span<{ $active: boolean }>`
  ${statusPill}

  @media ${ADMIN_MOBILE_MEDIA} {
    flex-shrink: 0;
    overflow: visible;
    text-overflow: clip;
    white-space: nowrap;
  }
`

export const StatusPillTable = styled.span<{ $active: boolean }>`
  ${statusPill}
`
