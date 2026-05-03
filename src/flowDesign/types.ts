/**
 * Modelo de documento do Flow Design Studio (protótipo interno estilo Figma).
 * Evoluir com `schemaVersion` + migrações em `persistence/`.
 */

export const FLOW_DESIGN_SCHEMA_VERSION = 1 as const

export type FlowDesignNodeType = 'frame' | 'rect' | 'text'

export type FlowDesignNodeBase = {
  id: string
  type: FlowDesignNodeType
  /** Rótulo opcional na árvore / inspetor */
  name: string
  x: number
  y: number
  w: number
  h: number
  rotation: number
  locked: boolean
  visible: boolean
}

export type FlowDesignFrameNode = FlowDesignNodeBase & {
  type: 'frame'
  fill: string
  stroke: string
  strokeWidth: number
  radius: number
}

export type FlowDesignRectNode = FlowDesignNodeBase & {
  type: 'rect'
  fill: string
  stroke: string
  strokeWidth: number
  radius: number
}

export type FlowDesignTextNode = FlowDesignNodeBase & {
  type: 'text'
  fill: string
  fontSize: number
  fontWeight: number
  text: string
  align: 'left' | 'center' | 'right'
}

export type FlowDesignNode = FlowDesignFrameNode | FlowDesignRectNode | FlowDesignTextNode

export type FlowDesignPage = {
  id: string
  name: string
  nodes: FlowDesignNode[]
}

export type FlowDesignDocument = {
  schemaVersion: typeof FLOW_DESIGN_SCHEMA_VERSION
  meta: {
    title: string
    updatedAt: string
  }
  pages: FlowDesignPage[]
}

export type FlowDesignViewport = {
  x: number
  y: number
  zoom: number
}

/** Estado persistido além do documento (retomar sessão). */
export type FlowDesignSessionUi = {
  activePageId: string
  viewportByPageId: Record<string, FlowDesignViewport>
}

export type FlowDesignPersistedV1 = {
  v: 1
  doc: FlowDesignDocument
  ui: FlowDesignSessionUi
}
