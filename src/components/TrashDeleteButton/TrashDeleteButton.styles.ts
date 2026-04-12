import styled, { css } from 'styled-components'

/** Duração do preenchimento 0 → 100% (ms). */
export const TRASH_DELETE_PROCESS_MS = 1500

/** Tempo no estado verde antes de voltar ao inicial (ms). */
export const TRASH_SUCCESS_HOLD_MS = 1600

/** Após “Pronto!”, espera antes de chamar `onSuccess` (tempo para ler o estado). */
export const TRASH_SUCCESS_ON_ACTION_DELAY_MS = 750

const SHELL_PAD_Y = '0.55rem'
const SHELL_PAD_X = '1rem'

const ICON = 18

export const Shell = styled.button<{
  $busy: boolean
  $success: boolean
}>`
  /* Repouso: discreto em cinza; hover e estados ativos usam vermelho/verde. */
  --btn-bg: ${({ theme }) =>
    theme.mode === 'dark'
      ? 'rgba(148, 163, 184, 0.12)'
      : 'rgba(71, 85, 105, 0.1)'};
  --border: ${({ theme }) => theme.border};
  --fg: ${({ theme }) => theme.textMuted};

  --scale: 1;

  ${({ $success }) =>
    $success
      ? css`
          --btn-bg: rgba(21, 128, 61, 0.55);
          --border: #22c55e;
          --fg: #fff;
        `
      : css``}

  position: relative;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: ${({ $busy }) => ($busy ? 'center' : 'flex-start')};
  gap: ${({ $busy }) => ($busy ? '0.35rem' : '0.4rem')};
  max-width: 100%;
  padding: ${SHELL_PAD_Y} ${SHELL_PAD_X};
  border: 1px solid var(--border);
  border-radius: 0.55rem;
  min-height: 0;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  cursor: ${({ $busy }) => ($busy ? 'default' : 'pointer')};
  color: var(--fg);
  background: var(--btn-bg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  transform: scale(var(--scale));
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1;
  isolation: isolate;
  transition:
    transform 0.2s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.2s ease,
    color 0.25s ease;

  &:hover:not(:disabled) {
    ${({ theme, $success, $busy }) =>
      !$success && !$busy
        ? theme.mode === 'dark'
          ? css`
              --btn-bg: rgba(127, 29, 29, 0.58);
              --border: #dc2626;
              --fg: #fff;
            `
          : css`
              --btn-bg: #fee2e2;
              --border: #ef4444;
              --fg: #991b1b;
            `
        : $success
          ? css`
              --btn-bg: rgba(21, 128, 61, 0.65);
              --border: #16a34a;
              --fg: #fff;
            `
          : theme.mode === 'dark'
            ? css`
                --btn-bg: rgba(127, 29, 29, 0.78);
                --border: #b91c1c;
                --fg: #fff;
              `
            : css`
                --btn-bg: #dc2626;
                --border: #991b1b;
                --fg: #fff;
              `}
  }

  &[aria-busy='true'] {
    ${({ theme }) =>
      theme.mode === 'dark'
        ? css`
            --btn-bg: rgba(69, 10, 10, 0.55);
            --border: #991b1b;
            --fg: #fff;
          `
        : css`
            --btn-bg: rgba(254, 226, 226, 0.95);
            --border: #dc2626;
            --fg: #7f1d1d;
          `}
  }

  &:active:not(:disabled) {
    --scale: 0.98;
  }

  &:focus-visible {
    outline: none;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.12),
      0 0 0 2px ${({ theme }) => theme.surface},
      0 0 0 4px
        ${({ theme, $success }) =>
          $success ? 'rgba(34, 197, 94, 0.65)' : theme.primaryMuted};
  }

  &:disabled {
    cursor: default;
    opacity: 0.95;
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    transition:
      background 0.2s ease,
      border-color 0.2s ease;

    &:active:not(:disabled) {
      transform: none;
    }
  }
`

/** Camada do preenchimento (cor da borda), esquerda → direita. */
export const ProcessFillTrack = styled.span`
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  overflow: hidden;
`

export const ProcessFillBar = styled.span<{ $progress: number }>`
  display: block;
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: var(--border);
  border-radius: 0;
  transition: none;

  @media (prefers-reduced-motion: reduce) {
    transition: width 0.12s ease;
  }
`

export const ContentRow = styled.span`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-width: 0;
`

export const IconWrap = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${ICON}px;
  height: ${ICON}px;
  color: var(--fg);

  svg {
    display: block;
    shape-rendering: geometricPrecision;
  }
`

export const LabelText = styled.span`
  display: block;
  line-height: 1;
  font-size: 0.9rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`
