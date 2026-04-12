import styled from 'styled-components'

export const Root = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  pointer-events: auto;
`

export const Backdrop = styled.button`
  position: absolute;
  inset: 0;
  border: none;
  padding: 0;
  margin: 0;
  cursor: default;
  background: ${({ theme }) => theme.overlay};
`

export const Panel = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, 26rem);
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow}, 0 12px 40px rgba(0, 0, 0, 0.18);
  padding: 1.1rem 1.15rem 1rem;
`

export const Title = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  line-height: 1.3;
`

export const Message = styled.p`
  margin: 0 0 1.1rem;
  font-size: 0.875rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 0.45rem 0.85rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }
`

export const CancelButton = styled(ActionButton)`
  background: transparent;
  border-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const ConfirmButton = styled(ActionButton)`
  background: ${({ theme }) => theme.primary};
  color: #fff;

  &:hover {
    filter: brightness(1.06);
  }
`
