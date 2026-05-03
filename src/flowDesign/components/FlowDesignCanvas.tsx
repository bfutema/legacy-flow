import { useCallback, useEffect, useRef } from 'react'
import { FLOW_DESIGN_DEFAULT_VIEWPORT } from '../constants'
import type { FlowDesignNode } from '../types'
import { useFlowDesign } from '../state/FlowDesignContext'
import {
  nodeForQuickAdd,
  worldCenterForNewNode,
  type QuickAddKind,
} from '../state/flowDesignReducer'
import {
  CanvasGrid,
  CanvasHint,
  CanvasViewport,
  CanvasWorld,
  NodeFrame,
  NodeRect,
  NodeText,
  NodeWrap,
} from './FlowDesignCanvas.styles'

function renderNodeBody(n: FlowDesignNode) {
  switch (n.type) {
    case 'frame':
      return (
        <NodeFrame
          $fill={n.fill}
          $stroke={n.stroke}
          $strokeWidth={n.strokeWidth}
          $radius={n.radius}
        />
      )
    case 'rect':
      return (
        <NodeRect
          $fill={n.fill}
          $stroke={n.stroke}
          $strokeWidth={n.strokeWidth}
          $radius={n.radius}
        />
      )
    case 'text':
      return (
        <NodeText
          $fill={n.fill}
          $fontSize={n.fontSize}
          $fontWeight={n.fontWeight}
          $align={n.align}
        >
          {n.text}
        </NodeText>
      )
    default: {
      const _e: never = n
      return _e
    }
  }
}

type DragRef =
  | { kind: 'node'; ids: string[]; lastClientX: number; lastClientY: number }
  | { kind: 'pan'; lastClientX: number; lastClientY: number }

export function FlowDesignCanvas() {
  const { state, dispatch } = useFlowDesign()
  const viewportElRef = useRef<HTMLDivElement>(null)
  const spaceDownRef = useRef(false)
  const dragRef = useRef<DragRef | null>(null)

  const pageId = state.ui.activePageId
  const page = state.doc.pages.find((p) => p.id === pageId)
  const nodes = page?.nodes ?? []
  const viewport = state.ui.viewportByPageId[pageId] ?? {
    ...FLOW_DESIGN_DEFAULT_VIEWPORT,
  }
  const selection = state.selection

  const onQuickAdd = useCallback(
    (kind: QuickAddKind) => {
      const el = viewportElRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const at = worldCenterForNewNode(viewport, r.width, r.height, 100, 100)
      const node = nodeForQuickAdd(kind, at)
      dispatch({ type: 'ADD_NODE', node })
    },
    [dispatch, viewport],
  )

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ kind: QuickAddKind }>
      if (ce.detail?.kind) onQuickAdd(ce.detail.kind)
    }
    window.addEventListener('flow-design-quick-add', handler)
    return () => window.removeEventListener('flow-design-quick-add', handler)
  }, [onQuickAdd])

  useEffect(() => {
    const el = viewportElRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const direction = e.deltaY < 0 ? 1 : -1
      const factor = 1 + direction * 0.08
      const nextZoom = viewport.zoom * factor
      dispatch({
        type: 'ZOOM_VIEWPORT_AT',
        pageId,
        screenX: e.clientX,
        screenY: e.clientY,
        nextZoom,
        containerRect: rect,
      })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [dispatch, pageId, viewport.zoom])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && !e.repeat) {
        const t = e.target as HTMLElement
        if (t.closest('[data-flow-design-canvas]')) {
          e.preventDefault()
          spaceDownRef.current = true
        }
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const t = e.target as HTMLElement
        if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
          return
        if (state.selection.length === 0) return
        e.preventDefault()
        dispatch({ type: 'DELETE_NODES', ids: state.selection })
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') spaceDownRef.current = false
    }
    window.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('keyup', onKeyUp, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('keyup', onKeyUp, true)
    }
  }, [dispatch, state.selection])

  useEffect(() => {
    const finish = () => {
      dragRef.current = null
    }
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      const dx = e.clientX - d.lastClientX
      const dy = e.clientY - d.lastClientY
      d.lastClientX = e.clientX
      d.lastClientY = e.clientY
      if (d.kind === 'pan') {
        dispatch({ type: 'PAN_VIEWPORT', pageId, dx, dy })
        return
      }
      const dz = viewport.zoom
      const deltas: Record<string, { dx: number; dy: number }> = {}
      for (const id of d.ids) {
        deltas[id] = { dx: dx / dz, dy: dy / dz }
      }
      dispatch({ type: 'MOVE_NODES', deltas })
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
    }
  }, [dispatch, pageId, viewport.zoom])

  const onViewportPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('[data-flow-node]')) return
    if (e.button === 1 || (e.button === 0 && spaceDownRef.current)) {
      e.preventDefault()
      dragRef.current = {
        kind: 'pan',
        lastClientX: e.clientX,
        lastClientY: e.clientY,
      }
      ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
      return
    }
    if (e.button === 0) {
      dispatch({ type: 'CLEAR_SELECTION' })
      dragRef.current = {
        kind: 'pan',
        lastClientX: e.clientX,
        lastClientY: e.clientY,
      }
      ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    }
  }

  const onNodePointerDown = (e: React.PointerEvent, node: FlowDesignNode) => {
    if (node.locked || e.button !== 0) return
    e.stopPropagation()

    let nextSelection: string[]
    if (e.shiftKey) {
      const set = new Set(selection)
      if (set.has(node.id)) set.delete(node.id)
      else set.add(node.id)
      nextSelection = [...set]
      dispatch({ type: 'SELECT', ids: nextSelection })
    } else if (!selection.includes(node.id)) {
      nextSelection = [node.id]
      dispatch({ type: 'SELECT', ids: nextSelection })
    } else {
      nextSelection = [...selection]
    }

    const dragIds = nextSelection.filter((id) => {
      const n = nodes.find((x) => x.id === id)
      return n && !n.locked
    })

    dragRef.current = {
      kind: 'node',
      ids: dragIds,
      lastClientX: e.clientX,
      lastClientY: e.clientY,
    }
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }

  const tf = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`

  return (
    <CanvasViewport
      ref={viewportElRef}
      data-flow-design-canvas
      onPointerDown={onViewportPointerDown}
    >
      <CanvasWorld style={{ transform: tf }}>
        <CanvasGrid data-canvas-bg aria-hidden />
        {nodes.map((n) => (
          <NodeWrap
            key={n.id}
            data-flow-node
            $selected={selection.includes(n.id)}
            $locked={n.locked}
            style={{
              left: n.x,
              top: n.y,
              width: n.w,
              height: n.h,
              display: n.visible ? 'block' : 'none',
            }}
            onPointerDown={(e) => onNodePointerDown(e, n)}
          >
            {renderNodeBody(n)}
          </NodeWrap>
        ))}
      </CanvasWorld>
      <CanvasHint>
        Rodinha ou ⌃ + scroll: zoom · Arrastar no fundo: mover vista · Espaço + arrastar: mover ·
        Shift + clique: seleção múltipla · Delete: remover
      </CanvasHint>
    </CanvasViewport>
  )
}
