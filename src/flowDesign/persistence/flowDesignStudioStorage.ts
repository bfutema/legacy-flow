import {
  FLOW_DESIGN_SCHEMA_VERSION,
  type FlowDesignDocument,
  type FlowDesignPersistedV1,
  type FlowDesignSessionUi,
} from '../types'
import { FLOW_DESIGN_STORAGE_KEY } from '../constants'
import { createEmptyFlowDesignDocument } from '../factory'

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object'
}

function coerceDoc(raw: unknown): FlowDesignDocument | null {
  if (!isRecord(raw)) return null
  if (raw.schemaVersion !== FLOW_DESIGN_SCHEMA_VERSION) return null
  if (!Array.isArray(raw.pages)) return null
  const meta = raw.meta
  if (!isRecord(meta)) return null
  if (typeof meta.title !== 'string' || typeof meta.updatedAt !== 'string') return null

  const pages = raw.pages
    .map((p) => {
      if (!isRecord(p)) return null
      if (typeof p.id !== 'string' || typeof p.name !== 'string') return null
      if (!Array.isArray(p.nodes)) return null
      return {
        id: p.id,
        name: p.name,
        nodes: p.nodes.filter(Boolean) as FlowDesignDocument['pages'][0]['nodes'],
      }
    })
    .filter(Boolean) as FlowDesignDocument['pages']

  if (pages.length === 0) return null

  return {
    schemaVersion: FLOW_DESIGN_SCHEMA_VERSION,
    meta: { title: meta.title, updatedAt: meta.updatedAt },
    pages,
  }
}

function coerceUi(raw: unknown, fallbackPageId: string): FlowDesignSessionUi {
  if (!isRecord(raw)) {
    return { activePageId: fallbackPageId, viewportByPageId: {} }
  }
  const activePageId =
    typeof raw.activePageId === 'string' ? raw.activePageId : fallbackPageId
  const vp = raw.viewportByPageId
  const viewportByPageId: Record<string, { x: number; y: number; zoom: number }> = {}
  if (isRecord(vp)) {
    for (const [k, val] of Object.entries(vp)) {
      if (!isRecord(val)) continue
      const x = typeof val.x === 'number' ? val.x : 0
      const y = typeof val.y === 'number' ? val.y : 0
      const zoom = typeof val.zoom === 'number' ? val.zoom : 1
      viewportByPageId[k] = { x, y, zoom }
    }
  }
  return { activePageId, viewportByPageId }
}

export type LoadedFlowDesignPersisted = {
  doc: FlowDesignDocument
  ui: FlowDesignSessionUi
}

export function loadFlowDesignPersisted(): LoadedFlowDesignPersisted | null {
  try {
    const raw = localStorage.getItem(FLOW_DESIGN_STORAGE_KEY)
    if (raw == null || raw.trim() === '') return null
    const parsed = JSON.parse(raw) as unknown
    if (!isRecord(parsed)) return null

    if (parsed.v === 1 && isRecord(parsed.doc)) {
      const doc = coerceDoc(parsed.doc)
      if (!doc) return null
      const page0 = doc.pages[0]?.id
      if (!page0) return null
      const ui = coerceUi(parsed.ui, page0)
      if (!doc.pages.some((p) => p.id === ui.activePageId)) {
        ui.activePageId = page0
      }
      return { doc, ui }
    }

    const legacyDoc = coerceDoc(parsed)
    if (legacyDoc && legacyDoc.pages[0]) {
      return {
        doc: legacyDoc,
        ui: {
          activePageId: legacyDoc.pages[0].id,
          viewportByPageId: {},
        },
      }
    }
  } catch {
    /* ignore */
  }
  return null
}

export function saveFlowDesignPersisted(payload: FlowDesignPersistedV1): void {
  try {
    localStorage.setItem(FLOW_DESIGN_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

export function initialFlowDesignPersisted(): LoadedFlowDesignPersisted {
  const doc = createEmptyFlowDesignDocument()
  const pid = doc.pages[0]!.id
  return {
    doc,
    ui: { activePageId: pid, viewportByPageId: {} },
  }
}
