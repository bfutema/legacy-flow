import {
  FLOW_DESIGN_SCHEMA_VERSION,
  type FlowDesignDocument,
  type FlowDesignFrameNode,
  type FlowDesignPage,
  type FlowDesignRectNode,
  type FlowDesignTextNode,
} from './types'
import { newFlowDesignId } from './id'

export function createEmptyFlowDesignDocument(title = 'Sem título'): FlowDesignDocument {
  const pageId = newFlowDesignId()
  const page: FlowDesignPage = {
    id: pageId,
    name: 'Página 1',
    nodes: [],
  }
  return {
    schemaVersion: FLOW_DESIGN_SCHEMA_VERSION,
    meta: {
      title,
      updatedAt: new Date().toISOString(),
    },
    pages: [page],
  }
}

export function defaultFrameNode(at: { x: number; y: number }): FlowDesignFrameNode {
  return {
    id: newFlowDesignId(),
    type: 'frame',
    name: 'Frame',
    x: at.x,
    y: at.y,
    w: 960,
    h: 540,
    rotation: 0,
    locked: false,
    visible: true,
    fill: '#ffffff',
    stroke: '#cbd5e1',
    strokeWidth: 1,
    radius: 8,
  }
}

export function defaultRectNode(at: { x: number; y: number }): FlowDesignRectNode {
  return {
    id: newFlowDesignId(),
    type: 'rect',
    name: 'Retângulo',
    x: at.x,
    y: at.y,
    w: 160,
    h: 100,
    rotation: 0,
    locked: false,
    visible: true,
    fill: 'rgba(79, 70, 229, 0.25)',
    stroke: '#4f46e5',
    strokeWidth: 2,
    radius: 6,
  }
}

export function defaultTextNode(at: { x: number; y: number }): FlowDesignTextNode {
  return {
    id: newFlowDesignId(),
    type: 'text',
    name: 'Texto',
    x: at.x,
    y: at.y,
    w: 280,
    h: 48,
    rotation: 0,
    locked: false,
    visible: true,
    fill: '#0f172a',
    fontSize: 18,
    fontWeight: 600,
    text: 'Texto',
    align: 'left',
  }
}
