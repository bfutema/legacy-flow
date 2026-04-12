import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react'
import { useConfirmDialog } from '../contexts/ConfirmDialogContext'
import { useModelingDatabase } from '../contexts/ModelingDatabaseContext'
import type { PrimaryDatabaseType } from '../data/databaseEngines'
import { suggestedTypesForEngine } from '../data/sqlColumnTypes'
import { FieldConstraintsPanel } from './FieldConstraintsPanel'
import {
  Body,
  DeleteFieldButton,
  ReorderFieldButton,
  ReorderGroup,
  FieldName,
  FieldNameInput,
  FieldType,
  FieldTypeColumn,
  FieldTypeInput,
  Footer,
  HashPrefix,
  Header,
  HeaderTitleText,
  Icons,
  ROW_HEIGHT_PX,
  Root,
  Row,
  RowActions,
  TitleInput,
  TypeChip,
  TypeChipGrid,
  TypeEditCell,
  TypeSuggestionHint,
  TypeSuggestionPanel,
} from './TableNode.styles'
import type { TableField, TableNodeData } from './tableTypes'

function nextCampoIndex(fields: TableField[]) {
  const re = /^campo_(\d+)$/
  let max = 0
  for (const f of fields) {
    const m = re.exec(f.name)
    if (m) max = Math.max(max, Number(m[1]))
  }
  return max + 1
}

function normalizeTableName(raw: string): string {
  return raw.trim().replace(/\s+/g, '_') || 'tabela'
}

function normalizeFieldType(raw: string): string {
  const t = raw.trim()
  return t || 'text'
}

function IconKey() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconDiamondSolid() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2L4 12l8 10 8-10L12 2z" fill="#e2e8f0" />
    </svg>
  )
}

function IconDiamondOutline() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2L4 12l8 10 8-10L12 2z"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
      />
    </svg>
  )
}

function fieldIcons(f: TableField) {
  if (f.pk) {
    return <IconKey />
  }
  if (f.required) {
    return <IconDiamondSolid />
  }
  return <IconDiamondOutline />
}

type FieldEditTarget = { key: string; part: 'name' | 'type' }

type TableRfNode = Node<TableNodeData, 'table'>

function FieldRow({
  f,
  topPx,
  stripe,
  isEditingName,
  isEditingType,
  nameDraft,
  typeDraft,
  onStartEditName,
  onStartEditType,
  onDraftChange,
  onNameCommit,
  onTypeCommit,
  onNameKeyDown,
  onTypeKeyDown,
  suggestedTypes,
  canDeleteField,
  canMoveFieldUp,
  canMoveFieldDown,
  onMoveFieldUp,
  onMoveFieldDown,
  onDeleteField,
  sqlEngine,
  constraintsOpen,
  onToggleConstraints,
  onCloseConstraints,
  onPatchField,
}: {
  f: TableField
  topPx: number
  stripe: 'even' | 'odd'
  isEditingName: boolean
  isEditingType: boolean
  nameDraft: string
  typeDraft: string
  onStartEditName: () => void
  onStartEditType: () => void
  onDraftChange: (v: string) => void
  onNameCommit: () => void
  onTypeCommit: () => void
  onNameKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  onTypeKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  suggestedTypes: string[]
  canDeleteField: boolean
  canMoveFieldUp: boolean
  canMoveFieldDown: boolean
  onMoveFieldUp: () => void
  onMoveFieldDown: () => void
  onDeleteField: () => void | Promise<void>
  sqlEngine: PrimaryDatabaseType
  constraintsOpen: boolean
  onToggleConstraints: () => void
  onCloseConstraints: () => void
  onPatchField: (patch: Partial<TableField>) => void
}) {
  const showHash = f.name === 'id'
  const nameInputRef = useRef<HTMLInputElement>(null)
  const typeInputRef = useRef<HTMLInputElement>(null)

  const suggestionListId = `${f.key}-type-suggestions`

  const filteredTypeSuggestions = useMemo(() => {
    const q = typeDraft.trim().toLowerCase()
    if (!q) return suggestedTypes.slice(0, 20)
    return suggestedTypes
      .filter((t) => t.toLowerCase().includes(q))
      .slice(0, 20)
  }, [typeDraft, suggestedTypes])

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [isEditingName])

  useEffect(() => {
    if (isEditingType && typeInputRef.current) {
      typeInputRef.current.focus()
      typeInputRef.current.select()
    }
  }, [isEditingType])

  return (
    <Fragment>
      <Handle
        type="target"
        position={Position.Left}
        id={`${f.key}-in`}
        className="table-db-handle"
        style={{ top: topPx }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${f.key}-out`}
        className="table-db-handle"
        style={{ top: topPx }}
      />
      <Row
        $stripe={stripe}
        $typeEditing={isEditingType}
        $constraintsOpen={constraintsOpen}
      >
        <Icons>{fieldIcons(f)}</Icons>
        {isEditingName ? (
          <FieldNameInput
            ref={nameInputRef}
            className="nodrag nopan"
            value={nameDraft}
            onChange={(e) => onDraftChange(e.target.value)}
            onBlur={onNameCommit}
            onKeyDown={onNameKeyDown}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            aria-label="Nome do campo"
          />
        ) : (
          <FieldName
            title="Duplo clique para editar o nome"
            onDoubleClick={(e) => {
              e.stopPropagation()
              onStartEditName()
            }}
          >
            {showHash ? (
              <>
                <HashPrefix>#</HashPrefix>
                {f.name}
              </>
            ) : (
              f.name
            )}
          </FieldName>
        )}
        <FieldTypeColumn>
          {isEditingType ? (
            <TypeEditCell>
              <FieldTypeInput
                ref={typeInputRef}
                className="nodrag nopan"
                value={typeDraft}
                onChange={(e) => onDraftChange(e.target.value)}
                onBlur={onTypeCommit}
                onKeyDown={onTypeKeyDown}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                aria-label="Tipo do campo"
                aria-controls={suggestionListId}
                aria-expanded
                placeholder="Digite ou escolha abaixo"
                autoComplete="off"
                spellCheck={false}
              />
              <TypeSuggestionPanel
                id={suggestionListId}
                role="listbox"
                aria-label="Tipos sugeridos para o banco atual"
              >
                <TypeSuggestionHint>
                  Sugestões · Enter confirma · Esc cancela
                </TypeSuggestionHint>
                <TypeChipGrid>
                  {filteredTypeSuggestions.map((t) => (
                    <TypeChip
                      key={t}
                      type="button"
                      className="nodrag nopan"
                      title={t}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        onDraftChange(t)
                        requestAnimationFrame(() =>
                          typeInputRef.current?.focus(),
                        )
                      }}
                    >
                      {t}
                    </TypeChip>
                  ))}
                </TypeChipGrid>
              </TypeSuggestionPanel>
            </TypeEditCell>
          ) : (
            <FieldType
              className="nodrag nopan"
              title="Clique para editar o tipo"
              onClick={(e) => {
                e.stopPropagation()
                onStartEditType()
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                onStartEditType()
              }}
            >
              {f.type}
            </FieldType>
          )}
        </FieldTypeColumn>
        <FieldConstraintsPanel
          field={f}
          engine={sqlEngine}
          open={constraintsOpen}
          onToggle={onToggleConstraints}
          onClose={onCloseConstraints}
          onPatch={onPatchField}
        />
        <RowActions>
          <ReorderGroup>
            <ReorderFieldButton
              type="button"
              className="nodrag nopan"
              disabled={!canMoveFieldUp}
              title="Mover campo para cima"
              aria-label="Mover campo para cima"
              onClick={(e) => {
                e.stopPropagation()
                if (canMoveFieldUp) onMoveFieldUp()
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M18 15l-6-6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ReorderFieldButton>
            <ReorderFieldButton
              type="button"
              className="nodrag nopan"
              disabled={!canMoveFieldDown}
              title="Mover campo para baixo"
              aria-label="Mover campo para baixo"
              onClick={(e) => {
                e.stopPropagation()
                if (canMoveFieldDown) onMoveFieldDown()
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ReorderFieldButton>
          </ReorderGroup>
          <DeleteFieldButton
            type="button"
            className="nodrag nopan"
            disabled={!canDeleteField}
            title={
              canDeleteField
                ? 'Remover campo'
                : 'A tabela precisa de pelo menos um campo'
            }
            aria-label="Remover campo"
            onClick={(e) => {
              e.stopPropagation()
              if (canDeleteField) onDeleteField()
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </DeleteFieldButton>
        </RowActions>
      </Row>
    </Fragment>
  )
}

export const TableNode = memo(function TableNode({
  id,
  data,
  selected,
}: NodeProps<TableRfNode>) {
  const { setNodes, setEdges } = useReactFlow()
  const { confirm } = useConfirmDialog()
  const { engine, primaryColor: primaryFromContext } = useModelingDatabase()
  const accent = data.primaryColor ?? primaryFromContext
  const suggestedTypes = useMemo(
    () => suggestedTypesForEngine(engine),
    [engine],
  )
  const { tableName, fields } = data

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(tableName)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const [fieldEdit, setFieldEdit] = useState<FieldEditTarget | null>(null)
  const [fieldDraft, setFieldDraft] = useState('')
  const [constraintsKey, setConstraintsKey] = useState<string | null>(null)

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [editingTitle])

  const commitTableName = useCallback(() => {
    const next = normalizeTableName(titleDraft)
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id || node.type !== 'table') return node
        const prev = node.data as TableNodeData
        return {
          ...node,
          data: { ...prev, tableName: next },
        }
      }),
    )
    setEditingTitle(false)
  }, [id, titleDraft, setNodes])

  const cancelTableName = useCallback(() => {
    setTitleDraft(tableName)
    setEditingTitle(false)
  }, [tableName])

  const startEditTitle = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setTitleDraft(tableName)
      setEditingTitle(true)
      setFieldEdit(null)
      setConstraintsKey(null)
    },
    [tableName],
  )

  const closeFieldConstraints = useCallback(() => {
    setConstraintsKey(null)
  }, [])

  const updateField = useCallback(
    (fieldKey: string, patch: Partial<TableField>) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id !== id || node.type !== 'table') return node
          const prev = node.data as TableNodeData
          return {
            ...node,
            data: {
              ...prev,
              fields: prev.fields.map((fld) =>
                fld.key === fieldKey ? { ...fld, ...patch } : fld,
              ),
            },
          }
        }),
      )
    },
    [id, setNodes],
  )

  const commitFieldName = useCallback(() => {
    if (!fieldEdit || fieldEdit.part !== 'name') return
    const fieldKey = fieldEdit.key
    const next = fieldDraft.trim()
    if (!next) {
      setFieldEdit(null)
      return
    }
    const duplicate = fields.some(
      (x) => x.key !== fieldKey && x.name === next,
    )
    if (duplicate) {
      setFieldEdit(null)
      return
    }
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id || node.type !== 'table') return node
        const prev = node.data as TableNodeData
        return {
          ...node,
          data: {
            ...prev,
            fields: prev.fields.map((fld) =>
              fld.key === fieldKey ? { ...fld, name: next } : fld,
            ),
          },
        }
      }),
    )
    setFieldEdit(null)
  }, [fieldEdit, fieldDraft, fields, id, setNodes])

  const commitFieldType = useCallback(() => {
    if (!fieldEdit || fieldEdit.part !== 'type') return
    const fieldKey = fieldEdit.key
    const next = normalizeFieldType(fieldDraft)
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id || node.type !== 'table') return node
        const prev = node.data as TableNodeData
        return {
          ...node,
          data: {
            ...prev,
            fields: prev.fields.map((fld) =>
              fld.key === fieldKey ? { ...fld, type: next } : fld,
            ),
          },
        }
      }),
    )
    setFieldEdit(null)
  }, [fieldEdit, fieldDraft, id, setNodes])

  const onFieldNameKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        commitFieldName()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setFieldEdit(null)
      }
    },
    [commitFieldName],
  )

  const onFieldTypeKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        commitFieldType()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setFieldEdit(null)
      }
    },
    [commitFieldType],
  )

  const moveField = useCallback(
    (fieldKey: string, delta: -1 | 1) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id !== id || node.type !== 'table') return node
          const prev = node.data as TableNodeData
          const idx = prev.fields.findIndex((fld) => fld.key === fieldKey)
          if (idx < 0) return node
          const nextIdx = idx + delta
          if (nextIdx < 0 || nextIdx >= prev.fields.length) return node
          const nextFields = [...prev.fields]
          const [removed] = nextFields.splice(idx, 1)
          nextFields.splice(nextIdx, 0, removed)
          return {
            ...node,
            data: { ...prev, fields: nextFields },
          }
        }),
      )
    },
    [id, setNodes],
  )

  const removeField = useCallback(
    (fieldKey: string) => {
      if (fields.length <= 1) return

      setFieldEdit((cur) => (cur?.key === fieldKey ? null : cur))
      setConstraintsKey((cur) => (cur === fieldKey ? null : cur))

      setEdges((edges) =>
        edges.filter(
          (e) =>
            !(
              (e.source === id && e.sourceHandle === `${fieldKey}-out`) ||
              (e.target === id && e.targetHandle === `${fieldKey}-in`)
            ),
        ),
      )

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id !== id || node.type !== 'table') return node
          const prev = node.data as TableNodeData
          return {
            ...node,
            data: {
              ...prev,
              fields: prev.fields.filter((fld) => fld.key !== fieldKey),
            },
          }
        }),
      )
    },
    [fields.length, id, setNodes, setEdges],
  )

  const addField = useCallback(() => {
    const newKey = `f_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`
    const idx = nextCampoIndex(fields)
    const newField: TableField = {
      key: newKey,
      name: `campo_${idx}`,
      type: 'varchar(255)',
      optional: true,
    }

    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id !== id || node.type !== 'table') return node
        const prev = node.data as TableNodeData
        return {
          ...node,
          data: {
            ...prev,
            fields: [...prev.fields, newField],
          },
        }
      }),
    )
  }, [id, fields, setNodes])

  return (
    <Root $selected={selected} $accent={accent}>
      <Header
        className="table-node-drag-handle"
        $accent={accent}
        onDoubleClick={startEditTitle}
        title="Duplo clique para editar o nome da tabela"
      >
        {editingTitle ? (
          <TitleInput
            ref={titleInputRef}
            className="nodrag nopan"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTableName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commitTableName()
              }
              if (e.key === 'Escape') {
                e.preventDefault()
                cancelTableName()
              }
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Nome da tabela"
          />
        ) : (
          <HeaderTitleText>{tableName}</HeaderTitleText>
        )}
      </Header>
      <Body>
        {fields.map((f, i) => {
          /* `top` é relativo ao Body (position: relative), não ao Root — não somar altura do header */
          const centerY = i * ROW_HEIGHT_PX + ROW_HEIGHT_PX / 2
          const stripe: 'even' | 'odd' = i % 2 === 0 ? 'even' : 'odd'
          const isEditingName =
            fieldEdit?.key === f.key && fieldEdit.part === 'name'
          const isEditingType =
            fieldEdit?.key === f.key && fieldEdit.part === 'type'

          const nameDraft = isEditingName ? fieldDraft : f.name
          const typeDraft = isEditingType ? fieldDraft : f.type

          return (
            <FieldRow
              key={f.key}
              f={f}
              topPx={centerY}
              stripe={stripe}
              isEditingName={isEditingName}
              isEditingType={isEditingType}
              nameDraft={nameDraft}
              typeDraft={typeDraft}
              onStartEditName={() => {
                setFieldDraft(f.name)
                setFieldEdit({ key: f.key, part: 'name' })
                setEditingTitle(false)
                setConstraintsKey(null)
              }}
              onStartEditType={() => {
                setFieldDraft(f.type)
                setFieldEdit({ key: f.key, part: 'type' })
                setEditingTitle(false)
                setConstraintsKey(null)
              }}
              sqlEngine={engine}
              constraintsOpen={constraintsKey === f.key}
              onToggleConstraints={() => {
                setFieldEdit(null)
                setEditingTitle(false)
                setConstraintsKey((prev) => (prev === f.key ? null : f.key))
              }}
              onCloseConstraints={closeFieldConstraints}
              onPatchField={(patch) => updateField(f.key, patch)}
              onDraftChange={setFieldDraft}
              onNameCommit={commitFieldName}
              onTypeCommit={commitFieldType}
              onNameKeyDown={onFieldNameKeyDown}
              onTypeKeyDown={onFieldTypeKeyDown}
              suggestedTypes={suggestedTypes}
              canDeleteField={fields.length > 1}
              canMoveFieldUp={i > 0}
              canMoveFieldDown={i < fields.length - 1}
              onMoveFieldUp={() => moveField(f.key, -1)}
              onMoveFieldDown={() => moveField(f.key, 1)}
              onDeleteField={async () => {
                const ok = await confirm({
                  title: 'Remover campo',
                  message: `O campo "${f.name}" será removido desta tabela. As relações ligadas a ele serão removidas.`,
                  confirmLabel: 'Remover',
                  cancelLabel: 'Cancelar',
                })
                if (!ok) return
                removeField(f.key)
              }}
            />
          )
        })}
      </Body>
      <Footer
        type="button"
        className="nodrag nopan"
        onClick={(e) => {
          e.stopPropagation()
          addField()
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Novo campo
      </Footer>
    </Root>
  )
})
