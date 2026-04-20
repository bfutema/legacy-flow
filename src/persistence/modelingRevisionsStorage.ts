import type { Node } from '@xyflow/react'
import type { TableNodeData } from '../nodes/tableTypes'

type RevisionFieldSnapshot = {
  key: string
  name: string
  type: string
}

type RevisionTableSnapshot = {
  id: string
  schemaName: string
  tableName: string
  fields: RevisionFieldSnapshot[]
}

type RevisionSnapshot = {
  tables: RevisionTableSnapshot[]
}

export type ModelingRevision = {
  id: string
  number: number
  createdAtIso: string
  changes: string[]
  snapshot: RevisionSnapshot
}

type PersistedModelingRevisions = {
  v: number
  revisions: ModelingRevision[]
}

type CreateRevisionResult =
  | { created: true; revision: ModelingRevision }
  | { created: false; reason: 'no_changes' }

const VERSION = 1
const MAX_REVISIONS = 80
const MODELING_REVISIONS_EVENT = 'flow-modeling-revisions-changed'

export const modelingRevisionsStorageKey = (projectId: string) =>
  `flow-modeling-revisions:${projectId}`

export function getModelingRevisionsChangedEventName(): string {
  return MODELING_REVISIONS_EVENT
}

function emitModelingRevisionsChanged(projectId: string): void {
  window.dispatchEvent(
    new CustomEvent(MODELING_REVISIONS_EVENT, { detail: { projectId } }),
  )
}

function tableFullName(table: { schemaName?: string; tableName: string }): string {
  const schema = table.schemaName?.trim() ?? ''
  return schema ? `${schema}.${table.tableName}` : table.tableName
}

function snapshotFromNodes(nodes: Node[]): RevisionSnapshot {
  const tables = nodes
    .filter((n) => n.type === 'table')
    .map((n) => {
      const d = n.data as TableNodeData
      return {
        id: n.id,
        schemaName: d.schemaName?.trim() ?? '',
        tableName: d.tableName,
        fields: d.fields.map((f) => ({
          key: f.key,
          name: f.name,
          type: f.type,
        })),
      }
    })
    .sort((a, b) => a.id.localeCompare(b.id))

  return { tables }
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

export function loadModelingRevisions(projectId: string): ModelingRevision[] {
  try {
    const raw = localStorage.getItem(modelingRevisionsStorageKey(projectId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as Partial<PersistedModelingRevisions>
    if (!parsed || parsed.v !== VERSION) return []
    return safeArray<ModelingRevision>(parsed.revisions)
  } catch {
    return []
  }
}

function diffSnapshots(prev: RevisionSnapshot | null, next: RevisionSnapshot): string[] {
  if (!prev) {
    return [`Estado inicial com ${next.tables.length} tabela(s).`]
  }

  const changes: string[] = []
  const prevTables = new Map(prev.tables.map((t) => [t.id, t]))
  const nextTables = new Map(next.tables.map((t) => [t.id, t]))

  for (const [tableId, table] of nextTables) {
    const old = prevTables.get(tableId)
    if (!old) {
      changes.push(
        `+ Tabela ${tableFullName(table)} criada (${table.fields.length} campo(s)).`,
      )
      continue
    }

    const oldName = tableFullName(old)
    const newName = tableFullName(table)
    if (oldName !== newName) {
      changes.push(`~ Tabela renomeada: ${oldName} -> ${newName}.`)
    }

    const oldFields = new Map(old.fields.map((f) => [f.key, f]))
    const newFields = new Map(table.fields.map((f) => [f.key, f]))

    for (const [fieldKey, field] of newFields) {
      const oldField = oldFields.get(fieldKey)
      if (!oldField) {
        changes.push(`+ Campo ${newName}.${field.name} (${field.type}) adicionado.`)
        continue
      }
      if (oldField.name !== field.name) {
        changes.push(`~ Campo renomeado em ${newName}: ${oldField.name} -> ${field.name}.`)
      }
      if (oldField.type !== field.type) {
        changes.push(
          `~ Tipo alterado em ${newName}.${field.name}: ${oldField.type} -> ${field.type}.`,
        )
      }
    }

    for (const [fieldKey, field] of oldFields) {
      if (!newFields.has(fieldKey)) {
        changes.push(`- Campo ${oldName}.${field.name} removido.`)
      }
    }
  }

  for (const [tableId, table] of prevTables) {
    if (!nextTables.has(tableId)) {
      changes.push(`- Tabela ${tableFullName(table)} removida.`)
    }
  }

  return changes
}

/** `true` quando o modelo atual difere da última revisão salva (ou ainda não há revisões). */
export function hasPendingRevisionChanges(projectId: string, nodes: Node[]): boolean {
  const currentSnapshot = snapshotFromNodes(nodes)
  const currentHash = JSON.stringify(currentSnapshot)
  const previous = loadModelingRevisions(projectId)
  const last = previous[0] ?? null
  const lastHash = last ? JSON.stringify(last.snapshot) : null
  return lastHash !== currentHash
}

export function createModelingRevision(
  projectId: string,
  nodes: Node[],
): CreateRevisionResult {
  const currentSnapshot = snapshotFromNodes(nodes)
  const currentHash = JSON.stringify(currentSnapshot)
  const previous = loadModelingRevisions(projectId)
  const last = previous[0] ?? null
  const lastHash = last ? JSON.stringify(last.snapshot) : null

  if (lastHash === currentHash) {
    return { created: false, reason: 'no_changes' }
  }

  const revision: ModelingRevision = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    number: (last?.number ?? 0) + 1,
    createdAtIso: new Date().toISOString(),
    changes: diffSnapshots(last?.snapshot ?? null, currentSnapshot),
    snapshot: currentSnapshot,
  }

  try {
    const revisions = [revision, ...previous].slice(0, MAX_REVISIONS)
    const payload: PersistedModelingRevisions = { v: VERSION, revisions }
    localStorage.setItem(modelingRevisionsStorageKey(projectId), JSON.stringify(payload))
    emitModelingRevisionsChanged(projectId)
  } catch (err) {
    console.warn('[modelagem] Não foi possível salvar revisão:', err)
  }

  return { created: true, revision }
}

export function clearModelingRevisions(projectId: string): void {
  try {
    localStorage.removeItem(modelingRevisionsStorageKey(projectId))
    emitModelingRevisionsChanged(projectId)
  } catch (err) {
    console.warn('[modelagem] Não foi possível limpar as revisões:', err)
  }
}
