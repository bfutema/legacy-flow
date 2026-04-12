import { useCallback, useEffect, useRef, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useConfirmDialog } from '../../contexts/ConfirmDialogContext'
import type { ConfirmOptions } from '../ConfirmDialog/confirmDialogTypes'
import {
  ContentRow,
  IconWrap,
  LabelText,
  ProcessFillBar,
  ProcessFillTrack,
  Shell,
  TRASH_DELETE_PROCESS_MS,
  TRASH_SUCCESS_HOLD_MS,
  TRASH_SUCCESS_ON_ACTION_DELAY_MS,
} from './TrashDeleteButton.styles'

type TrashDeleteButtonProps = {
  /** Sobrescreve o rótulo acessível (o texto visível muda com o estado) */
  'aria-label'?: string
  /** Se definido, pergunta confirmação antes do preenchimento (requer ConfirmDialogProvider). */
  confirm?: ConfirmOptions
  /** Chamado após “Pronto!” e uma pausa curta (`TRASH_SUCCESS_ON_ACTION_DELAY_MS`). */
  onSuccess?: () => void
}

type Phase = 'idle' | 'busy' | 'success'

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setReduce(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return reduce
}

/**
 * Exclusão: preenchimento esquerda→direita (cor da borda) com %, depois verde e reset.
 */
export function TrashDeleteButton({
  'aria-label': ariaLabel,
  confirm,
  onSuccess,
}: TrashDeleteButtonProps) {
  const { confirm: openConfirm } = useConfirmDialog()
  const [phase, setPhase] = useState<Phase>('idle')
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess
  const reduceMotion = usePrefersReducedMotion()

  const busy = phase === 'busy'
  const success = phase === 'success'

  useEffect(() => {
    if (phase === 'idle') {
      setProgress(0)
      return
    }

    if (phase !== 'busy') return

    if (reduceMotion) {
      setProgress(100)
      const t = window.setTimeout(() => setPhase('success'), 80)
      return () => window.clearTimeout(t)
    }

    setProgress(0)
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(
        100,
        Math.round((elapsed / TRASH_DELETE_PROCESS_MS) * 100),
      )
      setProgress(p)
      if (elapsed >= TRASH_DELETE_PROCESS_MS) {
        setPhase('success')
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, reduceMotion])

  useEffect(() => {
    if (phase !== 'success') return
    const actionId = window.setTimeout(() => {
      onSuccessRef.current?.()
    }, TRASH_SUCCESS_ON_ACTION_DELAY_MS)
    const resetId = window.setTimeout(() => setPhase('idle'), TRASH_SUCCESS_HOLD_MS)
    return () => {
      window.clearTimeout(actionId)
      window.clearTimeout(resetId)
    }
  }, [phase])

  const run = useCallback(async () => {
    if (phase !== 'idle') return
    if (confirm) {
      const ok = await openConfirm(confirm)
      if (!ok) return
    }
    setPhase('busy')
  }, [phase, confirm, openConfirm])

  const label =
    success ? 'Pronto!' : busy ? `${progress}%` : 'Excluir'

  return (
    <Shell
      type="button"
      $busy={busy}
      $success={success}
      disabled={busy}
      data-success={success || undefined}
      onClick={run}
      aria-busy={busy}
      aria-valuenow={busy ? progress : undefined}
      aria-valuemin={busy ? 0 : undefined}
      aria-valuemax={busy ? 100 : undefined}
      role={busy ? 'progressbar' : undefined}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      title={
        success
          ? 'Exclusão concluída'
          : busy
            ? `${progress}%`
            : 'Iniciar exclusão'
      }
    >
      <ProcessFillTrack aria-hidden>
        <ProcessFillBar $progress={busy ? progress : 0} />
      </ProcessFillTrack>
      <ContentRow>
        <IconWrap aria-hidden>
          <FiTrash2 size={15} strokeWidth={2} />
        </IconWrap>
        <LabelText aria-hidden={ariaLabel ? true : undefined}>{label}</LabelText>
      </ContentRow>
    </Shell>
  )
}
