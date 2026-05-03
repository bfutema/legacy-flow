import type { Edge, Node } from '@xyflow/react'

const X_GAP = 300
const Y_GAP = 18
const MAX_ROWS_PER_NODE = 60

export type PathSeg = string | number

export const PATH_ROOT_ID = pathIdFromSegments(['$'])

export function pathIdFromSegments(segments: PathSeg[]): string {
  return JSON.stringify(segments)
}

export function segmentsFromPathId(id: string): PathSeg[] {
  return JSON.parse(id) as PathSeg[]
}

export function getAtPath(root: unknown, segments: PathSeg[]): unknown {
  let cur: unknown = root
  for (let i = 1; i < segments.length; i++) {
    if (cur === null || typeof cur !== 'object') return undefined
    const s = segments[i]
    if (typeof s === 'number') {
      if (!Array.isArray(cur)) return undefined
      cur = cur[s]
    } else {
      if (Array.isArray(cur)) return undefined
      cur = (cur as Record<string, unknown>)[s]
    }
  }
  return cur
}

export function pathExistsInTree(root: unknown, pathId: string): boolean {
  try {
    const segs = segmentsFromPathId(pathId)
    if (!Array.isArray(segs) || segs.length === 0 || segs[0] !== '$') return false
    return getAtPath(root, segs) !== undefined
  } catch {
    return false
  }
}

function isDescendantPath(descId: string, ancestorId: string): boolean {
  const d = segmentsFromPathId(descId)
  const a = segmentsFromPathId(ancestorId)
  if (d.length <= a.length) return false
  for (let i = 0; i < a.length; i++) {
    if (d[i] !== a[i]) return false
  }
  return true
}

const MAX_AUTO_EXPAND_PATHS = 500

/**
 * Todos os caminhos de objetos/arrays aninhados (para abrir o grafo inteiro por padrão).
 * Limitado para evitar travamento em JSON enormes.
 */
export function collectAllExpandedPathIds(root: unknown): Set<string> {
  const out = new Set<string>()
  let added = 0

  function walk(segments: PathSeg[], value: unknown): void {
    if (added >= MAX_AUTO_EXPAND_PATHS) return
    if (value === null || typeof value !== 'object') return

    const entries: [PathSeg, unknown][] = Array.isArray(value)
      ? value.map((item, i) => [i as PathSeg, item])
      : (Object.keys(value as object) as string[]).map((k) => [
          k,
          (value as Record<string, unknown>)[k],
        ])

    for (const [keySeg, childVal] of entries) {
      if (added >= MAX_AUTO_EXPAND_PATHS) return
      if (childVal !== null && typeof childVal === 'object') {
        const childSegs = [...segments, keySeg]
        out.add(pathIdFromSegments(childSegs))
        added++
        walk(childSegs, childVal)
      }
    }
  }

  walk(['$'], root)
  return out
}

/** Ao colapsar um nó, remove ele e todos os descendentes expandidos. */
export function pruneExpandedAfterCollapse(
  expanded: ReadonlySet<string>,
  collapsedPathId: string,
): Set<string> {
  const next = new Set<string>()
  for (const id of expanded) {
    if (id === collapsedPathId || isDescendantPath(id, collapsedPathId)) continue
    next.add(id)
  }
  return next
}

export type JsonRow =
  | {
      kind: 'primitive'
      key: string
      valueText: string
      colorHex?: string
    }
  | {
      kind: 'nested'
      key: string
      summary: string
      childPathId: string
      expanded: boolean
      handleId: string
    }
  | { kind: 'truncated'; message: string }

export type JsonCrackNodeData = {
  pathId: string
  header: string
  rows: JsonRow[]
  onToggleExpand: (childPathId: string) => void
}

function nestedSummary(v: unknown): string {
  if (Array.isArray(v)) return `[${v.length} ${v.length === 1 ? 'item' : 'itens'}]`
  const n = Object.keys(v as object).length
  return `{${n} ${n === 1 ? 'chave' : 'chaves'}}`
}

function formatPrimitive(_key: string, v: unknown): { valueText: string; colorHex?: string } {
  if (v === null) return { valueText: 'null' }
  if (typeof v === 'string') {
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v)
    return { valueText: JSON.stringify(v), colorHex: hex ? v : undefined }
  }
  if (typeof v === 'number' || typeof v === 'boolean') return { valueText: String(v) }
  return { valueText: String(v) }
}

function headerForNode(segments: PathSeg[], value: unknown, edgeLabel: string | null): string {
  if (segments.length === 1) {
    if (Array.isArray(value)) return `Array (${value.length})`
    if (value !== null && typeof value === 'object') return 'Object'
    return 'JSON'
  }
  return edgeLabel ?? '…'
}

function buildRows(segments: PathSeg[], value: unknown, expanded: ReadonlySet<string>): JsonRow[] {
  const rows: JsonRow[] = []
  let nestedHandleSeq = 0

  if (value === null || typeof value !== 'object') {
    const { valueText, colorHex } = formatPrimitive('', value)
    rows.push({ kind: 'primitive', key: 'valor', valueText, colorHex })
    return rows
  }

  const entries: [string, unknown][] = Array.isArray(value)
    ? value.map((item, i) => [String(i), item])
    : Object.entries(value as Record<string, unknown>)

  let count = 0
  for (const [k, v] of entries) {
    if (count >= MAX_ROWS_PER_NODE) {
      rows.push({
        kind: 'truncated',
        message: `… +${entries.length - MAX_ROWS_PER_NODE} omitidos`,
      })
      break
    }
    count++
    const keySeg: PathSeg = Array.isArray(value) ? Number(k) : k
    const displayKey = Array.isArray(value) ? `[${k}]` : k
    const childPathId = pathIdFromSegments([...segments, keySeg])

    if (v !== null && typeof v === 'object') {
      const handleId = `src-${nestedHandleSeq++}`
      rows.push({
        kind: 'nested',
        key: displayKey,
        summary: nestedSummary(v),
        childPathId,
        expanded: expanded.has(childPathId),
        handleId,
      })
    } else {
      const { valueText, colorHex } = formatPrimitive(displayKey, v)
      rows.push({ kind: 'primitive', key: displayKey, valueText, colorHex })
    }
  }

  if (rows.length === 0 && !Array.isArray(value)) {
    rows.push({ kind: 'primitive', key: '(vazio)', valueText: '{}' })
  }
  if (rows.length === 0 && Array.isArray(value)) {
    rows.push({ kind: 'primitive', key: '(vazio)', valueText: '[]' })
  }

  return rows
}

/** Alturas alinhadas ao layout tipo-tabela do JsonViewerNode (linhas + header). */
const ROW_H = 30
const HDR_H = 32
const PAD_Y = 8

export function estimateNodeHeight(rowCount: number): number {
  return PAD_Y + HDR_H + Math.max(1, rowCount) * ROW_H + PAD_Y
}

type Draft = {
  pathId: string
  parentId: string | null
  edgeLabel: string | null
  layoutX: number
  layoutY: number
  height: number
  rowCount: number
  children: Draft[]
}

function layoutDraft(d: Draft, depth: number, yStart: number): number {
  d.layoutX = depth * X_GAP
  if (!d.children.length) {
    d.layoutY = yStart
    return yStart + d.height + Y_GAP
  }
  let cur = yStart
  for (const c of d.children) {
    cur = layoutDraft(c, depth + 1, cur)
  }
  const firstY = d.children[0].layoutY
  const lastY = d.children[d.children.length - 1].layoutY
  const lastH = d.children[d.children.length - 1].height
  d.layoutY = (firstY + lastY + lastH) / 2 - d.height / 2
  return cur
}

function buildDraftTree(
  root: unknown,
  expanded: ReadonlySet<string>,
  pathId: string,
  parentId: string | null,
  edgeLabel: string | null,
): Draft | null {
  const segs = segmentsFromPathId(pathId)
  const val = getAtPath(root, segs)
  if (val === undefined) return null

  const rows = buildRows(segs, val, expanded)
  const h = estimateNodeHeight(rows.length)
  const d: Draft = {
    pathId,
    parentId,
    edgeLabel,
    layoutX: 0,
    layoutY: 0,
    height: h,
    rowCount: rows.length,
    children: [],
  }

  if (val === null || typeof val !== 'object') {
    return d
  }

  const keys: PathSeg[] = Array.isArray(val)
    ? val.map((_, i) => i)
    : Object.keys(val as object)

  for (const keySeg of keys) {
    const childId = pathIdFromSegments([...segs, keySeg])
    const childVal = getAtPath(root, [...segs, keySeg])
    if (childVal === null || typeof childVal !== 'object') continue
    if (!expanded.has(childId)) continue
    const label = Array.isArray(val) ? `[${String(keySeg)}]` : String(keySeg)
    const ch = buildDraftTree(root, expanded, childId, pathId, label)
    if (ch) d.children.push(ch)
  }

  return d
}

function draftToFlow(
  d: Draft,
  root: unknown,
  expanded: ReadonlySet<string>,
  onToggleExpand: (childPathId: string) => void,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const walk = (x: Draft) => {
    const segs = segmentsFromPathId(x.pathId)
    const val = getAtPath(root, segs)!
    const rows = buildRows(segs, val, expanded)
    const header = headerForNode(segs, val, x.edgeLabel)

    nodes.push({
      id: x.pathId,
      type: 'jsonNode',
      position: { x: x.layoutX, y: x.layoutY },
      data: {
        pathId: x.pathId,
        header,
        rows,
        onToggleExpand,
      } satisfies JsonCrackNodeData,
    })

    for (const c of x.children) {
      const parentRows = rows
      const edgeRow = parentRows.find(
        (r): r is Extract<JsonRow, { kind: 'nested' }> =>
          r.kind === 'nested' && r.childPathId === c.pathId && r.expanded,
      )
      edges.push({
        id: `e-${c.pathId}`,
        source: x.pathId,
        target: c.pathId,
        sourceHandle: edgeRow?.handleId,
        label: c.edgeLabel ?? '',
        type: 'smoothstep',
        style: { strokeWidth: 2 },
        labelStyle: { fill: '#e2e8f0', fontSize: 11, fontWeight: 600 },
        labelBgStyle: { fill: 'rgba(15,23,42,0.78)' },
        labelBgPadding: [4, 2] as [number, number],
        labelBgBorderRadius: 4,
      })
      walk(c)
    }
  }

  walk(d)
  return { nodes, edges }
}

export type JsonGraphResult =
  | { ok: true; nodes: Node[]; edges: Edge[] }
  | { ok: false; error: string }

export function jsonTextToFlowGraph(
  jsonText: string,
  expandedPaths: ReadonlySet<string>,
  onToggleExpand: (childPathId: string) => void,
): JsonGraphResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'JSON inválido'
    return { ok: false, error: msg }
  }

  const rootDraft = buildDraftTree(parsed, expandedPaths, PATH_ROOT_ID, null, null)
  if (!rootDraft) {
    return { ok: false, error: 'Não foi possível montar o grafo' }
  }

  layoutDraft(rootDraft, 0, 40)
  const { nodes, edges } = draftToFlow(rootDraft, parsed, expandedPaths, onToggleExpand)
  return { ok: true, nodes, edges }
}
