/** localStorage — protótipo versionado junto ao app Flow */
export const FLOW_DESIGN_STORAGE_KEY = 'flow-design-studio:v1'

export const FLOW_DESIGN_DEFAULT_VIEWPORT = {
  x: 80,
  y: 80,
  zoom: 1,
} as const

export const FLOW_DESIGN_ZOOM_MIN = 0.08
export const FLOW_DESIGN_ZOOM_MAX = 4

/** Tamanhos iniciais ao criar nós pela toolbar */
export const FLOW_DESIGN_NEW_FRAME = { w: 960, h: 540 } as const
export const FLOW_DESIGN_NEW_RECT = { w: 160, h: 100 } as const
export const FLOW_DESIGN_NEW_TEXT = { w: 280, h: 48 } as const
