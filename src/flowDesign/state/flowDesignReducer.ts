import {
  FLOW_DESIGN_DEFAULT_VIEWPORT,
  FLOW_DESIGN_ZOOM_MAX,
  FLOW_DESIGN_ZOOM_MIN,
} from '../constants'
import {
  defaultFrameNode,
  defaultRectNode,
  defaultTextNode,
} from '../factory'
import { newFlowDesignId } from '../id'
import type {
  FlowDesignDocument,
  FlowDesignNode,
  FlowDesignSessionUi,
  FlowDesignViewport,
} from '../types'

export type FlowDesignState = {
  doc: FlowDesignDocument
  ui: FlowDesignSessionUi
  /** Seleção não persistida — apenas sessão */
  selection: string[]
}

export type FlowDesignAction =
  | { type: 'HYDRATE'; doc: FlowDesignDocument; ui: FlowDesignSessionUi }
  | { type: 'PATCH_DOC_META'; title?: string }
  | { type: 'SET_ACTIVE_PAGE'; pageId: string }
  | { type: 'ADD_PAGE' }
  | { type: 'RENAME_PAGE'; pageId: string; name: string }
  | { type: 'DELETE_PAGE'; pageId: string }
  | { type: 'SET_VIEWPORT'; pageId: string; viewport: FlowDesignViewport }
  | { type: 'PAN_VIEWPORT'; pageId: string; dx: number; dy: number }
  | {
      type: 'ZOOM_VIEWPORT_AT'
      pageId: string
      screenX: number
      screenY: number
      nextZoom: number
      containerRect: DOMRectReadOnly
    }
  | { type: 'SELECT'; ids: string[]; additive?: boolean }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'ADD_NODE'; node: FlowDesignNode }
  | { type: 'MOVE_NODES'; deltas: Record<string, { dx: number; dy: number }> }
  | { type: 'UPDATE_NODE'; id: string; patch: Partial<FlowDesignNode> }
  | { type: 'DELETE_NODES'; ids: string[] }
  | { type: 'BRING_TO_FRONT'; ids: string[] }

function clampZoom(z: number): number {
  return Math.min(FLOW_DESIGN_ZOOM_MAX, Math.max(FLOW_DESIGN_ZOOM_MIN, z))
}

function touchUpdated(doc: FlowDesignDocument): FlowDesignDocument {
  return {
    ...doc,
    meta: {
      ...doc.meta,
      updatedAt: new Date().toISOString(),
    },
  }
}

function mapPage(
  doc: FlowDesignDocument,
  pageId: string,
  fn: (page: FlowDesignDocument['pages'][0]) => FlowDesignDocument['pages'][0],
): FlowDesignDocument {
  const pages = doc.pages.map((p) => (p.id === pageId ? fn(p) : p))
  return touchUpdated({ ...doc, pages })
}

function ensureViewport(
  ui: FlowDesignSessionUi,
  pageId: string,
): FlowDesignViewport {
  return ui.viewportByPageId[pageId] ?? { ...FLOW_DESIGN_DEFAULT_VIEWPORT }
}

export function flowDesignReducer(
  state: FlowDesignState,
  action: FlowDesignAction,
): FlowDesignState {
  switch (action.type) {
    case 'HYDRATE': {
      const ui = { ...action.ui }
      const page0 = action.doc.pages[0]?.id
      if (page0 && !action.doc.pages.some((p) => p.id === ui.activePageId)) {
        ui.activePageId = page0
      }
      return {
        doc: action.doc,
        ui,
        selection: [],
      }
    }

    case 'PATCH_DOC_META': {
      const title =
        action.title !== undefined ? action.title.trim() || state.doc.meta.title : state.doc.meta.title
      return {
        ...state,
        doc: touchUpdated({
          ...state.doc,
          meta: { ...state.doc.meta, title },
        }),
      }
    }

    case 'SET_ACTIVE_PAGE': {
      if (!state.doc.pages.some((p) => p.id === action.pageId)) return state
      return {
        ...state,
        ui: { ...state.ui, activePageId: action.pageId },
        selection: [],
      }
    }

    case 'ADD_PAGE': {
      const id = newFlowDesignId()
      const n =
        state.doc.pages.reduce((m, p) => {
          const match = /^Página (\d+)$/.exec(p.name)
          if (match) return Math.max(m, Number(match[1]))
          return m
        }, 0) + 1
      const page = { id, name: `Página ${n}`, nodes: [] }
      return {
        ...state,
        doc: touchUpdated({ ...state.doc, pages: [...state.doc.pages, page] }),
        ui: {
          ...state.ui,
          activePageId: id,
          viewportByPageId: {
            ...state.ui.viewportByPageId,
            [id]: { ...FLOW_DESIGN_DEFAULT_VIEWPORT },
          },
        },
        selection: [],
      }
    }

    case 'RENAME_PAGE': {
      const name = action.name.trim()
      if (!name) return state
      return {
        ...state,
        doc: touchUpdated({
          ...state.doc,
          pages: state.doc.pages.map((p) =>
            p.id === action.pageId ? { ...p, name } : p,
          ),
        }),
      }
    }

    case 'DELETE_PAGE': {
      if (state.doc.pages.length <= 1) return state
      const pages = state.doc.pages.filter((p) => p.id !== action.pageId)
      const viewportByPageId = { ...state.ui.viewportByPageId }
      delete viewportByPageId[action.pageId]
      let activePageId = state.ui.activePageId
      if (activePageId === action.pageId) {
        activePageId = pages[0]!.id
      }
      return {
        ...state,
        doc: touchUpdated({ ...state.doc, pages }),
        ui: { ...state.ui, activePageId, viewportByPageId },
        selection: [],
      }
    }

    case 'SET_VIEWPORT': {
      const viewport = {
        x: action.viewport.x,
        y: action.viewport.y,
        zoom: clampZoom(action.viewport.zoom),
      }
      return {
        ...state,
        ui: {
          ...state.ui,
          viewportByPageId: {
            ...state.ui.viewportByPageId,
            [action.pageId]: viewport,
          },
        },
      }
    }

    case 'PAN_VIEWPORT': {
      const prev = ensureViewport(state.ui, action.pageId)
      return {
        ...state,
        ui: {
          ...state.ui,
          viewportByPageId: {
            ...state.ui.viewportByPageId,
            [action.pageId]: {
              ...prev,
              x: prev.x + action.dx,
              y: prev.y + action.dy,
            },
          },
        },
      }
    }

    case 'ZOOM_VIEWPORT_AT': {
      const prev = ensureViewport(state.ui, action.pageId)
      const z = clampZoom(action.nextZoom)
      const { left, top } = action.containerRect
      const mx = action.screenX - left
      const my = action.screenY - top
      const worldX = (mx - prev.x) / prev.zoom
      const worldY = (my - prev.y) / prev.zoom
      const x = mx - worldX * z
      const y = my - worldY * z
      return {
        ...state,
        ui: {
          ...state.ui,
          viewportByPageId: {
            ...state.ui.viewportByPageId,
            [action.pageId]: { x, y, zoom: z },
          },
        },
      }
    }

    case 'SELECT': {
      if (action.additive) {
        const set = new Set(state.selection)
        for (const id of action.ids) set.add(id)
        return { ...state, selection: [...set] }
      }
      return { ...state, selection: [...action.ids] }
    }

    case 'CLEAR_SELECTION':
      return { ...state, selection: [] }

    case 'ADD_NODE': {
      const pid = state.ui.activePageId
      return {
        ...state,
        doc: mapPage(state.doc, pid, (p) => ({
          ...p,
          nodes: [...p.nodes, action.node],
        })),
        selection: [action.node.id],
      }
    }

    case 'MOVE_NODES': {
      const pid = state.ui.activePageId
      return {
        ...state,
        doc: mapPage(state.doc, pid, (p) => ({
          ...p,
          nodes: p.nodes.map((n) => {
            const d = action.deltas[n.id]
            if (!d || n.locked) return n
            return { ...n, x: n.x + d.dx, y: n.y + d.dy }
          }),
        })),
      }
    }

    case 'UPDATE_NODE': {
      const pid = state.ui.activePageId
      return {
        ...state,
        doc: mapPage(state.doc, pid, (p) => ({
          ...p,
          nodes: p.nodes.map((n) => {
            if (n.id !== action.id) return n
            return { ...n, ...action.patch } as FlowDesignNode
          }),
        })),
      }
    }

    case 'DELETE_NODES': {
      const rm = new Set(action.ids)
      const pid = state.ui.activePageId
      return {
        ...state,
        doc: mapPage(state.doc, pid, (p) => ({
          ...p,
          nodes: p.nodes.filter((n) => !rm.has(n.id)),
        })),
        selection: state.selection.filter((id) => !rm.has(id)),
      }
    }

    case 'BRING_TO_FRONT': {
      const pid = state.ui.activePageId
      const bring = new Set(action.ids)
      return {
        ...state,
        doc: mapPage(state.doc, pid, (p) => {
          const rest = p.nodes.filter((n) => !bring.has(n.id))
          const front = p.nodes.filter((n) => bring.has(n.id))
          return { ...p, nodes: [...rest, ...front] }
        }),
      }
    }

    default:
      return state
  }
}

export function createFlowDesignState(
  doc: FlowDesignDocument,
  ui: FlowDesignSessionUi,
): FlowDesignState {
  return {
    doc,
    ui,
    selection: [],
  }
}

/** Posição “centro visível” em coordenadas de mundo (para colar novos nós). */
export function worldCenterForNewNode(
  viewport: FlowDesignViewport,
  containerW: number,
  containerH: number,
  nodeW: number,
  nodeH: number,
): { x: number; y: number } {
  const cx = (containerW / 2 - viewport.x) / viewport.zoom
  const cy = (containerH / 2 - viewport.y) / viewport.zoom
  return {
    x: cx - nodeW / 2,
    y: cy - nodeH / 2,
  }
}

export type QuickAddKind = 'frame' | 'rect' | 'text'

export function nodeForQuickAdd(
  kind: QuickAddKind,
  at: { x: number; y: number },
): FlowDesignNode {
  switch (kind) {
    case 'frame':
      return defaultFrameNode(at)
    case 'rect':
      return defaultRectNode(at)
    case 'text':
      return defaultTextNode(at)
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}
