import styled from 'styled-components'

export const AllocationsRoot = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const TopStrip = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.25rem;
  padding: 0.85rem clamp(1rem, 2.5vw, 1.5rem);
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

export const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`

export const CollaboratorsToggle = styled.button<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 3px;
    border-radius: 0.25rem;
  }
`

export const ToggleTrack = styled.span<{ $on: boolean }>`
  position: relative;
  width: 2.5rem;
  height: 1.35rem;
  border-radius: 999px;
  background: ${({ theme, $on }) =>
    $on ? theme.primary : theme.border};
  transition: background 0.15s ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? 'calc(100% - 17px)' : '3px')};
    width: 1.05rem;
    height: 1.05rem;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.2);
    transition: left 0.15s ease;
  }
`

export const FiltersStrip = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem clamp(1rem, 2.5vw, 1.5rem) 0.85rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
`

export const FiltersLeft = styled.div`
  flex: 1;
  min-width: min(100%, 18rem);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
`

export const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  max-width: 28rem;

  svg {
    flex-shrink: 0;
    width: 1.1rem;
    height: 1.1rem;
    color: ${({ theme }) => theme.textMuted};
  }
`

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.text};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }
`

export const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`

export const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.45rem 0.2rem 0.55rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.35rem;
  background: ${({ theme }) => theme.surface};
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-family: inherit;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const ChipRemove = styled.span`
  font-size: 0.85rem;
  line-height: 1;
  color: ${({ theme }) => theme.textMuted};
`

export const FiltersRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`

export const ScaleGroup = styled.div`
  display: inline-flex;
  padding: 0.15rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
`

export const ScaleBtn = styled.button<{ $active: boolean }>`
  padding: 0.35rem 0.65rem;
  border: none;
  border-radius: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? '#fff' : theme.textMuted)};
  background: ${({ theme, $active }) =>
    $active ? theme.primary : 'transparent'};
  transition:
    background 0.12s ease,
    color 0.12s ease;

  &:hover {
    color: ${({ theme, $active }) => ($active ? '#fff' : theme.text)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const DateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-family: inherit;

  svg {
    width: 1rem;
    height: 1rem;
    color: ${({ theme }) => theme.textMuted};
  }

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 1px;
  }
`

export const TimelineFill = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
`
