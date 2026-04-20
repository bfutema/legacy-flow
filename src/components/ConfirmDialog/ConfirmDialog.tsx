import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ConfirmOptions } from './confirmDialogTypes'
import {
  Actions,
  Backdrop,
  CancelButton,
  ConfirmButton,
  Message,
  Panel,
  Root,
  Title,
} from './ConfirmDialog.styles'

type Props = ConfirmOptions & {
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return createPortal(
    <Root role="presentation">
      <Backdrop type="button" aria-label="Fechar" onClick={onCancel} />
      <Panel
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={title ? 'confirm-dialog-title' : undefined}
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? <Title id="confirm-dialog-title">{title}</Title> : null}
        <Message id="confirm-dialog-desc">{message}</Message>
        <Actions>
          <CancelButton type="button" onClick={onCancel}>
            {cancelLabel}
          </CancelButton>
          <ConfirmButton type="button" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </ConfirmButton>
        </Actions>
      </Panel>
    </Root>,
    document.body,
  )
}
