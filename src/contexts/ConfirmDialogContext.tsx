import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog/ConfirmDialog'
import type { ConfirmOptions } from '../components/ConfirmDialog/confirmDialogTypes'

export type { ConfirmOptions }

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<ConfirmOptions | null>(null)
  const resolveRef = useRef<((value: boolean) => void) | null>(null)

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setOpen(options)
    })
  }, [])

  const finish = useCallback((result: boolean) => {
    setOpen(null)
    const r = resolveRef.current
    resolveRef.current = null
    r?.(result)
  }, [])

  useEffect(() => {
    return () => {
      const r = resolveRef.current
      resolveRef.current = null
      r?.(false)
    }
  }, [])

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open ? (
        <ConfirmDialog
          {...open}
          onConfirm={() => finish(true)}
          onCancel={() => finish(false)}
        />
      ) : null}
    </ConfirmContext.Provider>
  )
}

export function useConfirmDialog() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirmDialog must be used within ConfirmDialogProvider')
  }
  return ctx
}
