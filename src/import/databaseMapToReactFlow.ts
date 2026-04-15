import type { Node } from '@xyflow/react'
import {
  defaultRelationshipEdgeData,
  type RelationshipEdge,
} from '../edges/relationshipTypes'
import { TABLE_NODE_DRAG_HANDLE } from '../nodes/initialFlow'
import type { TableField, TableNodeData } from '../nodes/tableTypes'
import { computeChartDbLikePositions } from './chartDbLikeLayout'

/** `schema.table` — único entre engines (MySQL com schema; PostgreSQL multi-schema). */
export function qualifiedTableId(schema: string, table: string): string {
  const s = (schema ?? '').trim()
  const t = (table ?? '').trim()
  return s ? `${s}.${t}` : t
}

function displayTableName(qualifiedId: string, allQualifiedIds: string[]): string {
  const schemas = new Set(
    allQualifiedIds
      .filter((id) => id.includes('.'))
      .map((id) => id.slice(0, id.lastIndexOf('.'))),
  )
  if (schemas.size <= 1 && qualifiedId.includes('.')) {
    return qualifiedId.slice(qualifiedId.lastIndexOf('.') + 1)
  }
  return qualifiedId
}

function splitQualifiedId(qualifiedId: string): { schemaName: string; tableName: string } {
  const idx = qualifiedId.lastIndexOf('.')
  if (idx <= 0 || idx >= qualifiedId.length - 1) {
    return { schemaName: '', tableName: qualifiedId }
  }
  return {
    schemaName: qualifiedId.slice(0, idx),
    tableName: qualifiedId.slice(idx + 1),
  }
}

/** Formato gerado pelos scripts em `src/sql/mysql-*.sql` ou `src/sql/psql-*.sql`. */
export type DatabaseMapFkRow = {
  schema: string
  table: string
  column: string
  foreign_key_name?: string
  reference_schema: string
  reference_table: string
  reference_column: string
  fk_def?: string
}

export type DatabaseMapPkRow = {
  schema: string
  table: string
  column: string
  pk_def?: string
}

export type DatabaseMapColumnRow = {
  schema: string
  table: string
  name: string
  type: string
  character_maximum_length?: string | null
  precision?: null | { precision: number; scale: number }
  ordinal_position: number
  nullable: boolean
  default?: string
  collation?: string
  is_identity?: boolean
  comment?: string
  /** PostgreSQL */
  is_array?: boolean
}

export type DatabaseMapTableRow = {
  schema: string
  table: string
  rows?: number
  type?: string
  engine?: string
  collation?: string
  comment?: string
}

export type DatabaseMapMetadata = {
  fk_info: DatabaseMapFkRow[]
  pk_info: DatabaseMapPkRow[]
  columns: DatabaseMapColumnRow[]
  indexes?: unknown[]
  tables: DatabaseMapTableRow[]
  views?: unknown[]
  check_constraints?: unknown[]
  custom_types?: unknown[]
  database_name?: string
  version?: string
}

function pkSetKey(schema: string, table: string, column: string): string {
  return `${schema}\0${table}\0${column.trim()}`
}

function parseCharMaxLen(raw: string | null | undefined): number | null {
  if (raw == null || raw === '' || raw === 'null') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function coercePrecision(
  p: DatabaseMapColumnRow['precision'],
): { precision: number; scale: number } | null {
  if (!p || typeof p !== 'object' || !('precision' in p)) return null
  const raw = p as { precision: unknown; scale: unknown }
  const pr =
    typeof raw.precision === 'string' ? Number(raw.precision) : raw.precision
  const sc = typeof raw.scale === 'string' ? Number(raw.scale) : raw.scale
  if (Number.isFinite(pr) && Number.isFinite(sc)) {
    return { precision: Number(pr), scale: Number(sc) }
  }
  return null
}

function formatColumnType(col: DatabaseMapColumnRow): string {
  let base = (col.type || 'unknown').toLowerCase()
  const len = parseCharMaxLen(col.character_maximum_length ?? undefined)
  if (
    (base === 'varchar' ||
      base === 'char' ||
      base === 'character varying' ||
      base === 'text' ||
      base === 'binary' ||
      base === 'varbinary') &&
    len != null
  ) {
    if (base === 'character varying') base = 'varchar'
    base = `${base} (${len})`
  } else {
    const coerced = coercePrecision(col.precision)
    if (coerced) {
      base = `${base} (${coerced.precision}, ${coerced.scale})`
    }
  }
  if (col.is_array) {
    return `${base}[]`
  }
  return base
}

function columnToField(
  col: DatabaseMapColumnRow,
  pkColumns: Set<string>,
): TableField {
  const name = col.name.trim()
  const isPk = pkColumns.has(pkSetKey(col.schema, col.table, name))
  const def = (col.default ?? '').trim()
  const hasDefault = def.length > 0
  const field: TableField = {
    key: name,
    name,
    type: formatColumnType(col),
    pk: isPk,
  }

  if (isPk) {
    return field
  }

  if (col.nullable) {
    field.optional = true
  } else {
    field.required = true
  }

  if (hasDefault) {
    field.hasDefault = true
    field.defaultValueSql = def
  }

  return field
}

function collectTableNames(meta: DatabaseMapMetadata): Set<string> {
  const names = new Set<string>()
  for (const c of meta.columns) {
    names.add(qualifiedTableId(c.schema, c.table))
  }
  for (const t of meta.tables) {
    const typ = (t.type || '').toUpperCase()
    if (
      typ === 'BASE TABLE' ||
      typ === 'VIEW' ||
      typ === 'MATERIALIZED VIEW'
    ) {
      names.add(qualifiedTableId(t.schema, t.table))
    }
  }
  for (const fk of meta.fk_info) {
    names.add(qualifiedTableId(fk.schema, fk.table))
    names.add(qualifiedTableId(fk.reference_schema, fk.reference_table))
  }
  return names
}

function normalizeImportedMetadata(meta: DatabaseMapMetadata): DatabaseMapMetadata {
  return {
    ...meta,
    pk_info: meta.pk_info.map((pk) => ({
      ...pk,
      column: pk.column.trim(),
    })),
    columns: meta.columns.map((c) => {
      const coerced = coercePrecision(c.precision)
      return {
        ...c,
        name: c.name.trim(),
        precision: coerced ?? c.precision,
      }
    }),
  }
}

export function isDatabaseMapMetadata(v: unknown): v is DatabaseMapMetadata {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return (
    Array.isArray(o.fk_info) &&
    Array.isArray(o.pk_info) &&
    Array.isArray(o.columns) &&
    Array.isArray(o.tables)
  )
}

/** Valida JSON e aplica normalização numérica (ex.: precision como string no PG). */
export function parseDatabaseMapJson(raw: string): DatabaseMapMetadata | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw) as unknown
  } catch {
    return null
  }
  if (!isDatabaseMapMetadata(parsed)) return null
  return normalizeImportedMetadata(parsed)
}

export type ConvertDatabaseMapOptions = {
  primaryColor: string
  edgeStroke: string
}

/**
 * Converte o JSON de metadados do banco em nós/arestas do diagrama ER (React Flow).
 */
export function convertDatabaseMapToReactFlow(
  meta: DatabaseMapMetadata,
  options: ConvertDatabaseMapOptions,
): {
  nodes: Node<TableNodeData, 'table'>[]
  edges: RelationshipEdge[]
} {
  const { primaryColor, edgeStroke } = options

  const metaNorm = normalizeImportedMetadata(meta)

  const pkColumns = new Set<string>()
  for (const pk of metaNorm.pk_info) {
    pkColumns.add(pkSetKey(pk.schema, pk.table, pk.column))
  }

  const colsByTable = new Map<string, DatabaseMapColumnRow[]>()
  for (const c of metaNorm.columns) {
    const q = qualifiedTableId(c.schema, c.table)
    const list = colsByTable.get(q)
    if (list) list.push(c)
    else colsByTable.set(q, [c])
  }

  const tableNames = [...collectTableNames(metaNorm)].sort((a, b) =>
    a.localeCompare(b),
  )

  const tableNameSet = new Set(tableNames)
  const layoutLinks: { a: string; b: string }[] = []
  for (const fk of metaNorm.fk_info) {
    const refId = qualifiedTableId(fk.reference_schema, fk.reference_table)
    const tgtId = qualifiedTableId(fk.schema, fk.table)
    if (tableNameSet.has(refId) && tableNameSet.has(tgtId) && refId !== tgtId) {
      layoutLinks.push({ a: refId, b: tgtId })
    }
  }

  const fieldCountById = new Map<string, number>()
  for (const name of tableNames) {
    fieldCountById.set(name, colsByTable.get(name)?.length ?? 1)
  }

  const positions = computeChartDbLikePositions(
    tableNames,
    fieldCountById,
    layoutLinks,
  )

  const nodes: Node<TableNodeData, 'table'>[] = tableNames.map((qualifiedId) => {
    const cols = colsByTable.get(qualifiedId) ?? []
    cols.sort((a, b) => a.ordinal_position - b.ordinal_position)

    const fields: TableField[] =
      cols.length > 0
        ? cols.map((c) => columnToField(c, pkColumns))
        : [
            {
              key: 'id',
              name: 'id',
              type: '?',
              pk: true,
            },
          ]

    const pos = positions.get(qualifiedId) ?? { x: 100, y: 100 }
    const parsed = splitQualifiedId(qualifiedId)
    const tableName = displayTableName(qualifiedId, tableNames)

    return {
      id: qualifiedId,
      type: 'table' as const,
      dragHandle: TABLE_NODE_DRAG_HANDLE,
      position: pos,
      data: {
        schemaName: parsed.schemaName || undefined,
        tableName,
        fields,
        primaryColor,
      },
    }
  })

  const nodeIds = new Set(tableNames)

  const fieldNamesByTable = new Map<string, Set<string>>()
  for (const n of nodes) {
    const d = n.data
    fieldNamesByTable.set(n.id, new Set(d.fields.map((f) => f.name)))
  }

  const edges: RelationshipEdge[] = []
  const seenEdge = new Set<string>()

  for (const fk of metaNorm.fk_info) {
    const srcTable = qualifiedTableId(fk.reference_schema, fk.reference_table)
    const tgtTable = qualifiedTableId(fk.schema, fk.table)
    if (!nodeIds.has(srcTable) || !nodeIds.has(tgtTable)) continue

    const srcFields = fieldNamesByTable.get(srcTable)
    const tgtFields = fieldNamesByTable.get(tgtTable)
    if (!srcFields || !tgtFields) continue
    const fkCol = fk.column.trim()
    const refCol = fk.reference_column.trim()
    if (!srcFields.has(refCol) || !tgtFields.has(fkCol)) {
      continue
    }

    const eid = `${srcTable}:${refCol}->${tgtTable}:${fkCol}`
    if (seenEdge.has(eid)) continue
    seenEdge.add(eid)

    edges.push({
      id: `import-${eid.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
      type: 'relationshipStep',
      source: srcTable,
      target: tgtTable,
      sourceHandle: `${refCol}-out`,
      targetHandle: `${fkCol}-in`,
      data: { ...defaultRelationshipEdgeData },
      style: {
        stroke: edgeStroke,
        strokeWidth: 1.5,
        strokeDasharray: '6 4',
      },
    })
  }

  return { nodes, edges }
}
