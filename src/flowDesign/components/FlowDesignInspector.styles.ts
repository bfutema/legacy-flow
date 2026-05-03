import styled from 'styled-components'

export const InspectorRoot = styled.div`
  padding: 0.65rem 0.75rem;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.text};
`

export const InspectorEmpty = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.textMuted};
  line-height: 1.45;
`

export const FieldGroup = styled.div`
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.25rem;
`

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
`

export const FieldInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.32rem 0.45rem;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  font-size: 0.78rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 0;
    border-color: transparent;
  }
`

export const FieldTextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 4rem;
  padding: 0.35rem 0.45rem;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  font-size: 0.78rem;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 0;
    border-color: transparent;
  }
`

export const FieldSelect = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 0.32rem 0.45rem;
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.text};
  font-size: 0.78rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 0;
    border-color: transparent;
  }
`

export const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  font-size: 0.78rem;
  margin-top: 0.35rem;
`
