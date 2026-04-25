import styled from 'styled-components'

export const HeaderRoot = styled.header`
  width: 100%;
  margin: 0 0 1.5rem;
  padding: 0 0 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  box-sizing: border-box;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin: 0 0 0.5rem;
`

/** Cor + nome ocupam o espaço à esquerda; ações ficam em `TitleRowActions`. */
export const TitleRowStart = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`

export const TitleRowActions = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`

/** Título: aparência de heading; foco revela o “input”. */
export const TitleField = styled.input`
  flex: 1;
  min-width: 0;
  display: block;
  margin: 0;
  padding: 0.2rem 0.35rem;
  margin-left: -0.35rem;
  border: 1px solid transparent;
  border-radius: 0.4rem;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: -0.02em;
  line-height: 1.25;
  box-sizing: border-box;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
    opacity: 0.45;
  }

  &:hover:not(:focus) {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.surface};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }

  &[readonly] {
    cursor: default;
    user-select: text;

    &:hover,
    &:focus {
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    }
  }
`

export const DescField = styled.textarea`
  display: block;
  width: 100%;
  max-width: none;
  margin: 0 0 0.35rem;
  padding: 0.3rem 0.4rem;
  min-height: 0;
  border: 1px solid transparent;
  border-radius: 0.45rem;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  font-family: inherit;
  line-height: 1.55;
  resize: none;
  box-sizing: border-box;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
    opacity: 0.45;
  }

  &:hover:not(:focus) {
    background: ${({ theme }) => theme.surfaceHover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.surface};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }

  &[readonly] {
    cursor: default;
    user-select: text;

    &:hover,
    &:focus {
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    }
  }
`

export const HeaderMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textMuted};
`

export const SavedFlash = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`

/** Caixa arredondada com seletor nativo de cor (modelagem). */
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
    transform 0.12s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.textMuted};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primaryMuted};
  }

  &:active {
    transform: scale(0.97);
  }

  &:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.62;
    pointer-events: none;
  }
`

export const ColorBoxInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  background: transparent;

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
