import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Root = styled.div`
  width: 100%;
  max-width: 32rem;
`

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    text-decoration: underline;
  }
`

export const PageTitle = styled.h1`
  margin: 0 0 0.35rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`

export const Lead = styled.p`
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.textMuted};
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`

export const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
`

export const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
`

export const TextInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }
`

export const DateRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
`

export const DateField = styled.div`
  flex: 1;
  min-width: 11rem;
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
`

export const DateInput = styled(TextInput).attrs({ type: 'date' })`
  min-height: 2.65rem;
  color-scheme: inherit;
`

export const FieldHint = styled.p`
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.textMuted};
`

export const FieldError = styled.p`
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.4;
  color: #dc2626;
`

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  line-height: 1.45;
  resize: none;
  font-family: inherit;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }
`

export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`

export const ColorBoxLabel = styled.label`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.85rem;
  height: 2.85rem;
  padding: 0.28rem;
  box-sizing: border-box;
  border-radius: 0.6rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.textMuted};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }
`

export const ColorBoxInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border-radius: 0.4rem;
    border: none;
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: 0.4rem;
  }
`

export const ColorHint = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
`

export const SubmitButton = styled.button`
  margin-top: 0.25rem;
  padding: 0.72rem 1.2rem;
  border-radius: 0.55rem;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition:
    filter 0.15s ease,
    transform 0.12s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`
