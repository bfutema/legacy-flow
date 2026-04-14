import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10001;
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
  width: min(100%, 40rem);
  max-height: min(90vh, 720px);
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow}, 0 12px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
`

export const PanelHeader = styled.div`
  flex-shrink: 0;
  padding: 1rem 1.15rem 0.65rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

export const Title = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const Subtitle = styled.p`
  margin: 0.35rem 0 0;
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ theme }) => theme.textMuted};
`

export const InlineHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`

export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.85rem 1.15rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`

export const SectionLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const EngineTabs = styled.div`
  display: inline-flex;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  margin-bottom: 0.35rem;
`

export const EngineTab = styled.button<{ $active?: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border: none;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active ? theme.primaryMuted : 'transparent'};
  color: ${({ $active, theme }) => ($active ? theme.primary : theme.textMuted)};

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const SqlTextarea = styled.textarea`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.68rem;
  line-height: 1.4;
  width: 100%;
  min-height: 7rem;
  max-height: 12rem;
  padding: 0.5rem 0.55rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`

export const JsonTextarea = styled.textarea`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.72rem;
  line-height: 1.4;
  width: 100%;
  min-height: 8rem;
  max-height: 16rem;
  padding: 0.5rem 0.55rem;
  border-radius: 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`

const Btn = styled.button`
  font-size: 0.78rem;
  font-weight: 500;
  padding: 0.4rem 0.75rem;
  border-radius: 0.45rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const SecondaryBtn = styled(Btn)`
  background: transparent;
  border-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const PrimaryBtn = styled(Btn)`
  background: ${({ theme }) => theme.primary};
  border-color: ${({ theme }) => theme.primary};
  color: #fff;

  &:hover:not(:disabled) {
    filter: brightness(1.06);
  }
`

export const GhostBtn = styled(Btn)`
  background: transparent;
  border-color: transparent;
  color: ${({ theme }) => theme.primary};
  text-decoration: underline;
  padding-left: 0.25rem;
  padding-right: 0.25rem;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.surfaceHover};
  }
`

export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #dc2626;
  line-height: 1.4;
`

export const FileInput = styled.input`
  display: none;
`

export const PanelFooter = styled.div`
  flex-shrink: 0;
  padding: 0.75rem 1.15rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.5rem;
`
