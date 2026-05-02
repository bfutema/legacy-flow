import '@xyflow/react/dist/style.css'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import {
  addEdge,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react'
import {
  CARDINALITY_OPTIONS,
  defaultRelationshipEdgeData,
  type CardinalityEnd,
  type RelationshipEdgeData,
} from '../edges/relationshipTypes'
import { RelationshipStepEdge } from '../edges/RelationshipStepEdge'
import { DatabaseImportModal } from '../components/DatabaseImportModal/DatabaseImportModal'
import { Navigate, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'
import { useConfirmDialog } from '../contexts/ConfirmDialogContext'
import { ModelingDatabaseProvider } from '../contexts/ModelingDatabaseContext'
import { resolveProjectById } from '../data/projects'
import { useProjectPrimaryColor } from '../hooks/useProjectPrimaryColor'
import { useProjectPrimaryDatabase } from '../hooks/useProjectPrimaryDatabase'
import {
  loadModelingFlow,
  saveModelingFlow,
} from '../persistence/modelingFlowStorage'
import {
  appendModelingHistory,
  clearModelingHistory,
  getModelingHistoryChangedEventName,
  loadModelingHistory,
  type ModelingHistoryEntry,
} from '../persistence/modelingHistoryStorage'
import {
  clearModelingRevisions,
  createModelingRevision,
  getModelingRevisionsChangedEventName,
  hasPendingRevisionChanges,
  loadModelingRevisions,
  type ModelingRevision,
} from '../persistence/modelingRevisionsStorage'
import { HiOutlineClock, HiOutlineTrash } from 'react-icons/hi2'
import {
  initialDbEdges,
  initialDbNodes,
  TABLE_NODE_DRAG_HANDLE,
} from '../nodes/initialFlow'
import { TableNode } from '../nodes/TableNode'
import type { TableNodeData } from '../nodes/tableTypes'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ADMIN_MOBILE_MEDIA } from '../layouts/adminShellTokens'
import {
  BackLink,
  HistoryEmpty,
  HistoryEntryDetail,
  HistoryEntryTime,
  HistoryEntryTitle,
  HistoryFilterSelect,
  HistoryHeader,
  HistoryHint,
  HistoryItem,
  HistoryList,
  HistoryPanel,
  HistoryPanelToggle,
  RevisionChangeItem,
  RevisionChanges,
  RevisionFeedback,
  RevisionSaveButton,
  CardinalityField,
  CardinalityFieldLabel,
  CardinalityPanel,
  CardinalityPanelTitle,
  CardinalitySelect,
  FlowHost,
  FlowPersistHint,
  FlowSqlScriptsLink,
  FsButton,
  ModelingControlsStrip,
  ModelingPageRoot,
  PageTitle,
  PanelActions,
  SchemaFilterLabel,
  SchemaFilterSelect,
  SchemaFilterWrap,
} from './DatabaseModeling.styles'
import mysqlDbMapSql from '../sql/mysql-generate-db-map-in-object.sql?raw'
import psqlDbMapSql from '../sql/psql-generate-db-map-in-object.sql?raw'

const nodeTypes = { table: TableNode }

const edgeTypes = { relationshipStep: RelationshipStepEdge }

const PERSIST_DEBOUNCE_MS = 450
const ALL_SCHEMAS_FILTER = '__all__'
const THEATER_STORAGE_KEY = 'flow-theater-mode:modeling'

function defaultSchemaByEngine(engine: string): string {
  if (engine === 'postgresql') return 'public'
  if (engine === 'mssql') return 'dbo'
  if (engine === 'mysql') return 'default'
  return 'default'
}

function namespaceLabelByEngine(engine: string): string {
  if (engine === 'mysql') return 'Banco/Schema'
  return 'Schema'
}

type HistoryScope = 'applied' | 'timeline' | 'revisions'

type CurrentStateItem = {
  id: string
  title: string
  details: string
}

function formatHistoryWhen(iso: string): string {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return iso
  }
}

function DatabaseFlowCanvas({
  projectId,
  projectPrimaryColor,
  sqlEngine,
  theaterMode,
  onToggleTheater,
}: {
  projectId: string
  projectPrimaryColor: string
  sqlEngine: string
  theaterMode: boolean
  onToggleTheater: () => void
}) {
  const { confirm } = useConfirmDialog()
  const theme = useTheme()
  const isMobileControls = useMediaQuery(ADMIN_MOBILE_MEDIA)
  const hostRef = useRef<HTMLDivElement>(null)
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyScope, setHistoryScope] = useState<HistoryScope>('applied')
  const [historyEntries, setHistoryEntries] = useState<ModelingHistoryEntry[]>([])
  const [revisions, setRevisions] = useState<ModelingRevision[]>([])
  const [revisionFeedback, setRevisionFeedback] = useState('')

  const initialFlow = useMemo(() => {
    const saved = loadModelingFlow(projectId)
    if (saved) return { nodes: saved.nodes, edges: saved.edges }
    return { nodes: initialDbNodes, edges: initialDbEdges }
  }, [projectId])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges)
  const [selectedRelEdgeId, setSelectedRelEdgeId] = useState<string | null>(
    null,
  )
  const [schemaFilter, setSchemaFilter] = useState(ALL_SCHEMAS_FILTER)
  const namespaceLabel = useMemo(() => namespaceLabelByEngine(sqlEngine), [sqlEngine])

  /** Injeta a cor do projeto no `data` de cada nó — confiável com React Flow + memo */
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.type !== 'table') return n
        const d = n.data as TableNodeData
        if (d.primaryColor === projectPrimaryColor) return n
        return {
          ...n,
          data: { ...d, primaryColor: projectPrimaryColor },
        }
      }),
    )
  }, [projectPrimaryColor, setNodes])

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.type !== 'table') return n
        const d = n.data as TableNodeData
        if (d.projectId === projectId) return n
        return { ...n, data: { ...d, projectId } }
      }),
    )
  }, [projectId, setNodes])

  /** Diagramas antigos no localStorage sem `dragHandle` — alinhar com cabeçalho como única alça */
  useEffect(() => {
    setNodes((nds) => {
      let changed = false
      const next = nds.map((n) => {
        if (n.type !== 'table') return n
        if (n.dragHandle === TABLE_NODE_DRAG_HANDLE) return n
        changed = true
        return { ...n, dragHandle: TABLE_NODE_DRAG_HANDLE }
      })
      return changed ? next : nds
    })
  }, [projectId, setNodes])

  /** Diagramas antigos podem não ter schema; aplicar default por engine. */
  useEffect(() => {
    const fallbackSchema = defaultSchemaByEngine(sqlEngine)
    setNodes((nds) => {
      let changed = false
      const next = nds.map((n) => {
        if (n.type !== 'table') return n
        const d = n.data as TableNodeData
        const cur = d.schemaName?.trim() ?? ''
        if (cur) return n
        changed = true
        return { ...n, data: { ...d, schemaName: fallbackSchema } }
      })
      return changed ? next : nds
    })
  }, [sqlEngine, setNodes])

  const schemaOptions = useMemo(() => {
    const set = new Set<string>()
    for (const n of nodes) {
      if (n.type !== 'table') continue
      const d = n.data as TableNodeData
      const schema = d.schemaName?.trim() ?? ''
      if (schema) set.add(schema)
    }
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [nodes])

  const effectiveSchemaFilter = useMemo(() => {
    if (schemaFilter === ALL_SCHEMAS_FILTER) return ALL_SCHEMAS_FILTER
    return schemaOptions.includes(schemaFilter)
      ? schemaFilter
      : ALL_SCHEMAS_FILTER
  }, [schemaFilter, schemaOptions])

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === hostRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      saveModelingFlow(projectId, nodes, edges)
    }, PERSIST_DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [projectId, nodes, edges])

  useEffect(() => {
    const refresh = () => setHistoryEntries(loadModelingHistory(projectId))
    refresh()
    const onChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId?: string }>).detail
      if (detail?.projectId && detail.projectId !== projectId) return
      refresh()
    }
    const eventName = getModelingHistoryChangedEventName()
    window.addEventListener(eventName, onChanged)
    return () => window.removeEventListener(eventName, onChanged)
  }, [projectId])

  useEffect(() => {
    const refresh = () => setRevisions(loadModelingRevisions(projectId))
    refresh()
    const onChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId?: string }>).detail
      if (detail?.projectId && detail.projectId !== projectId) return
      refresh()
    }
    const eventName = getModelingRevisionsChangedEventName()
    window.addEventListener(eventName, onChanged)
    return () => window.removeEventListener(eventName, onChanged)
  }, [projectId])

  const toggleFullscreen = useCallback(() => {
    const el = hostRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      void el.requestFullscreen()
    } else {
      void document.exitFullscreen()
    }
  }, [])

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'relationshipStep',
            data: { ...defaultRelationshipEdgeData },
          },
          eds,
        ),
      ),
    [setEdges],
  )

  const patchRelationshipCardinality = useCallback(
    (edgeId: string, field: keyof RelationshipEdgeData, value: CardinalityEnd) => {
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id !== edgeId || e.type !== 'relationshipStep') return e
          const prev = (e.data ?? {}) as Partial<RelationshipEdgeData>
          return {
            ...e,
            data: {
              ...defaultRelationshipEdgeData,
              ...prev,
              [field]: value,
            },
          }
        }),
      )
    },
    [setEdges],
  )

  const onEdgeClick = useCallback(
    (_event: MouseEvent, edge: Edge) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edge.id
            ? { ...e, animated: true }
            : { ...e, animated: false },
        ),
      )
    },
    [setEdges],
  )

  const onPaneClick = useCallback(() => {
    setEdges((eds) => eds.map((e) => ({ ...e, animated: false })))
  }, [setEdges])

  const onSelectionChange = useCallback(
    ({ edges: selectedEdges }: { edges: Edge[] }) => {
      setSelectedRelEdgeId(
        selectedEdges.length === 1 ? selectedEdges[0].id : null,
      )
    },
    [],
  )

  const cardinalityEdge = useMemo(() => {
    if (!selectedRelEdgeId) return null
    const e = edges.find((x) => x.id === selectedRelEdgeId)
    if (!e || e.type !== 'relationshipStep') return null
    const d = {
      ...defaultRelationshipEdgeData,
      ...(e.data as Partial<RelationshipEdgeData> | undefined),
    }
    return { id: e.id, data: d }
  }, [edges, selectedRelEdgeId])

  const onBeforeDelete = useCallback(
    async ({ nodes: nodesToRemove }: { nodes: Node[]; edges: Edge[] }) => {
      const tables = nodesToRemove.filter((n) => n.type === 'table')
      if (tables.length === 0) return true

      const names = tables.map(
        (n) => (n.data as TableNodeData).tableName,
      )
      const message =
        tables.length === 1
          ? `A tabela "${names[0]}" será excluída. As relações ligadas a ela serão removidas.`
          : `${tables.length} tabelas serão excluídas (${names.join(', ')}). As relações ligadas serão removidas.`

      const ok = await confirm({
        title: tables.length === 1 ? 'Excluir tabela' : 'Excluir tabelas',
        message,
        confirmLabel: 'Excluir',
        cancelLabel: 'Cancelar',
      })
      if (!ok) return false
      for (const table of tables) {
        const td = table.data as TableNodeData
        const full = td.schemaName?.trim()
          ? `${td.schemaName.trim()}.${td.tableName}`
          : td.tableName
        appendModelingHistory(projectId, {
          action: 'table_deleted',
          entityKey: `table:${table.id}`,
          label: `Tabela removida: "${full}"`,
        })
      }
      return true
    },
    [confirm, projectId],
  )

  const confirmReplaceDiagram = useCallback(
    (message: string) =>
      confirm({
        title: 'Importar do banco',
        message,
        confirmLabel: 'Substituir diagrama',
        cancelLabel: 'Cancelar',
      }),
    [confirm],
  )

  const handleApplyDatabaseImport = useCallback(
    (nextNodes: Node[], nextEdges: Edge[]) => {
      setNodes(nextNodes)
      setEdges(nextEdges)
      window.requestAnimationFrame(() => {
        flowInstanceRef.current?.fitView({ padding: 0.2 })
      })
    },
    [setEdges, setNodes],
  )

  const addTable = useCallback(() => {
    const fallbackSchema = defaultSchemaByEngine(sqlEngine)
    setNodes((nds) => {
      const tableCount = nds.filter((n) => n.type === 'table').length
      const node: Node<TableNodeData, 'table'> = {
        id: `table_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        type: 'table',
        dragHandle: TABLE_NODE_DRAG_HANDLE,
        position: {
          x: 60 + (tableCount % 4) * 280,
          y: 40 + Math.floor(tableCount / 4) * 240,
        },
        data: {
          projectId,
          schemaName: fallbackSchema,
          tableName: `tabela_${tableCount + 1}`,
          fields: [{ key: 'id', name: 'id', type: 'int8', pk: true }],
          primaryColor: projectPrimaryColor,
        },
      }
      appendModelingHistory(projectId, {
        action: 'table_created',
        entityKey: `table:${node.id}`,
        label: `Tabela criada: "${fallbackSchema}.${node.data.tableName}"`,
      })
      return [...nds, node]
    })
  }, [projectPrimaryColor, setNodes, sqlEngine, projectId])

  const colorMode = theme.mode === 'dark' ? 'dark' : 'light'

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'relationshipStep' as const,
      data: { ...defaultRelationshipEdgeData },
      animated: false,
      style: {
        stroke: theme.textMuted,
        strokeWidth: 1.5,
        strokeDasharray: '6 4',
      },
    }),
    [theme.textMuted],
  )

  const nodesForView = useMemo(() => {
    if (effectiveSchemaFilter === ALL_SCHEMAS_FILTER) return nodes
    return nodes.filter((n) => {
      if (n.type !== 'table') return true
      const d = n.data as TableNodeData
      const schema = d.schemaName?.trim() ?? ''
      return schema === effectiveSchemaFilter
    })
  }, [nodes, effectiveSchemaFilter])

  const visibleNodeIds = useMemo(
    () => new Set(nodesForView.map((n) => n.id)),
    [nodesForView],
  )

  const edgesForView = useMemo(
    () =>
      edges.filter(
        (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target),
      ),
    [edges, visibleNodeIds],
  )

  const historyTimeline = useMemo(
    () => [...historyEntries].reverse(),
    [historyEntries],
  )

  const hasPendingRevision = useMemo(
    () => hasPendingRevisionChanges(projectId, nodes),
    [projectId, nodes, revisions],
  )

  const currentStateItems = useMemo<CurrentStateItem[]>(() => {
    const tables = nodes
      .filter((n) => n.type === 'table')
      .map((n) => {
        const d = n.data as TableNodeData
        return {
          nodeId: n.id,
          schemaName: d.schemaName?.trim() ?? '',
          tableName: d.tableName,
          fields: d.fields,
        }
      })
      .sort((a, b) =>
        `${a.schemaName}.${a.tableName}`.localeCompare(
          `${b.schemaName}.${b.tableName}`,
        ),
      )

    const items: CurrentStateItem[] = []
    for (const t of tables) {
      const fullTable = t.schemaName ? `${t.schemaName}.${t.tableName}` : t.tableName
      items.push({
        id: `table:${t.nodeId}`,
        title: `Tabela ativa: ${fullTable}`,
        details: `${t.fields.length} campo(s)`,
      })
      for (const f of t.fields) {
        items.push({
          id: `field:${t.nodeId}:${f.key}`,
          title: `Campo ativo: ${fullTable}.${f.name}`,
          details: `Tipo: ${f.type}`,
        })
      }
    }
    return items
  }, [nodes])

  const saveRevision = useCallback(() => {
    const result = createModelingRevision(projectId, nodes)
    if (!result.created) {
      setRevisionFeedback('Sem mudanças desde a última revisão salva.')
      return
    }
    setRevisionFeedback(`Revisão r${result.revision.number} salva com sucesso.`)
    setHistoryOpen(true)
    setHistoryScope('revisions')
  }, [nodes, projectId])

  const clearEntireModel = useCallback(async () => {
    const ok = await confirm({
      title: 'Limpar toda a modelagem',
      message:
        'Isso apaga todas as tabelas e relações do diagrama, o histórico de eventos e todas as revisões salvas deste projeto neste navegador. O canvas ficará vazio. Esta ação não pode ser desfeita.',
      confirmLabel: 'Limpar tudo',
      cancelLabel: 'Cancelar',
    })
    if (!ok) return
    clearModelingHistory(projectId)
    clearModelingRevisions(projectId)
    setNodes([])
    setEdges([])
    setSelectedRelEdgeId(null)
    setSchemaFilter(ALL_SCHEMAS_FILTER)
    setRevisionFeedback('')
    setHistoryEntries([])
    setRevisions([])
    saveModelingFlow(projectId, [], [])
  }, [confirm, projectId, setEdges, setNodes])

  return (
    <FlowHost ref={hostRef} $theater={theaterMode}>
      <ReactFlow
        colorMode={colorMode}
        onInit={(inst) => {
          flowInstanceRef.current = inst
        }}
        nodes={nodesForView}
        edges={edgesForView}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onBeforeDelete={onBeforeDelete}
        connectionLineType={ConnectionLineType.Step}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode={['Backspace', 'Delete']}
        selectionOnDrag
        panOnScroll
        zoomOnScroll
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        {cardinalityEdge ? (
          <Panel position="top-left">
            <CardinalityPanel className="nodrag nopan">
              <CardinalityPanelTitle>Cardinalidade da relação</CardinalityPanelTitle>
              <CardinalityField>
                <CardinalityFieldLabel>Na origem (saída)</CardinalityFieldLabel>
                <CardinalitySelect
                  value={cardinalityEdge.data.sourceCardinality}
                  onChange={(ev) =>
                    patchRelationshipCardinality(
                      cardinalityEdge.id,
                      'sourceCardinality',
                      ev.target.value as CardinalityEnd,
                    )
                  }
                  aria-label="Cardinalidade na origem"
                >
                  {CARDINALITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </CardinalitySelect>
              </CardinalityField>
              <CardinalityField>
                <CardinalityFieldLabel>No destino (entrada)</CardinalityFieldLabel>
                <CardinalitySelect
                  value={cardinalityEdge.data.targetCardinality}
                  onChange={(ev) =>
                    patchRelationshipCardinality(
                      cardinalityEdge.id,
                      'targetCardinality',
                      ev.target.value as CardinalityEnd,
                    )
                  }
                  aria-label="Cardinalidade no destino"
                >
                  {CARDINALITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </CardinalitySelect>
              </CardinalityField>
            </CardinalityPanel>
          </Panel>
        ) : null}
        <Background
          id="db-grid"
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1.25}
        />
        <Controls
          showZoom
          showFitView
          showInteractive
          position="bottom-left"
        />
        <Panel position="top-left" className="modeling-controls-panel">
          <ModelingControlsStrip $mobile={isMobileControls} className="nodrag nopan">
            <SchemaFilterWrap className="nodrag nopan">
              <SchemaFilterLabel>{namespaceLabel}</SchemaFilterLabel>
              <SchemaFilterSelect
                  value={effectiveSchemaFilter}
                onChange={(e) => setSchemaFilter(e.target.value)}
                aria-label="Filtrar tabelas por schema"
              >
                <option value={ALL_SCHEMAS_FILTER}>Todos os schemas</option>
                {schemaOptions.map((schema) => (
                  <option key={schema} value={schema}>
                    {schema}
                  </option>
                ))}
              </SchemaFilterSelect>
            </SchemaFilterWrap>
            <PanelActions className="nodrag nopan">
              <FsButton
                type="button"
                onClick={() => setImportModalOpen(true)}
                title="Importar esquema: script MySQL/MariaDB + JSON gerado na consulta"
                aria-label="Importar esquema a partir de script MySQL ou MariaDB e JSON"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                <span className="fs-btn-label">Importar do banco</span>
              </FsButton>
              <FsButton
                type="button"
                onClick={addTable}
                title="Adicionar nova tabela ao canvas"
                aria-label="Adicionar nova tabela ao canvas"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="fs-btn-label">Nova tabela</span>
              </FsButton>
              <FsButton
                type="button"
                onClick={onToggleTheater}
                title={
                  theaterMode
                    ? 'Sair do modo teatro'
                    : 'Ativar modo teatro (oculta título e preenche o conteúdo)'
                }
                aria-label={theaterMode ? 'Sair do modo teatro' : 'Ativar modo teatro'}
              >
                {theaterMode ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M4 7h16M7 4v3M17 4v3M4 17h16M7 20v-3M17 20v-3" />
                    </svg>
                    <span className="fs-btn-label">Sair teatro</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M4 7h16M7 4v3M17 4v3M4 17h16M7 20v-3M17 20v-3" />
                    </svg>
                    <span className="fs-btn-label">Modo teatro</span>
                  </>
                )}
              </FsButton>
              <FsButton
                type="button"
                onClick={toggleFullscreen}
                title={
                  isFullscreen
                    ? 'Sair da tela cheia (Esc)'
                    : 'Expandir canvas em tela cheia'
                }
                aria-label={
                  isFullscreen
                    ? 'Sair da tela cheia'
                    : 'Expandir canvas em tela cheia'
                }
              >
                {isFullscreen ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
                    </svg>
                    <span className="fs-btn-label">Sair da tela cheia</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                    </svg>
                    <span className="fs-btn-label">Tela cheia</span>
                  </>
                )}
              </FsButton>
              <FsButton
                type="button"
                onClick={() => setHistoryOpen((v) => !v)}
                title={historyOpen ? 'Fechar histórico da modelagem' : 'Abrir histórico da modelagem'}
                aria-label={historyOpen ? 'Fechar histórico da modelagem' : 'Abrir histórico da modelagem'}
                aria-expanded={historyOpen}
                aria-controls="modeling-history-list"
              >
                <HiOutlineClock aria-hidden />
                <span className="fs-btn-label">Histórico</span>
              </FsButton>
              <RevisionSaveButton
                type="button"
                onClick={saveRevision}
                title="Salvar revisão da modelagem"
                aria-label="Salvar revisão da modelagem"
                $pending={hasPendingRevision}
                $projectPrimary={projectPrimaryColor}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                  <path d="M17 21v-8H7v8M7 3v5h8" />
                </svg>
                <span className="fs-btn-label">Salvar revisão</span>
              </RevisionSaveButton>
              <FsButton
                type="button"
                onClick={() => void clearEntireModel()}
                title="Limpar diagrama, histórico e revisões (irreversível)"
                aria-label="Limpar toda a modelagem, histórico e revisões"
              >
                <HiOutlineTrash aria-hidden />
                <span className="fs-btn-label">Limpar tudo</span>
              </FsButton>
            </PanelActions>
          </ModelingControlsStrip>
        </Panel>
        {historyOpen ? (
          <Panel position="top-right" className="modeling-history-panel">
            <HistoryPanel className="nodrag nopan">
              <HistoryHeader>
                <HistoryPanelToggle
                  type="button"
                  onClick={() => setHistoryOpen(false)}
                  aria-expanded={historyOpen}
                  aria-controls="modeling-history-list"
                >
                  Histórico da modelagem
                </HistoryPanelToggle>
                <HistoryFilterSelect
                  value={historyScope}
                  onChange={(e) => setHistoryScope(e.target.value as HistoryScope)}
                  aria-label="Filtrar histórico da modelagem"
                >
                  <option value="applied">Estado atual</option>
                  <option value="timeline">Linha do tempo</option>
                  <option value="revisions">Revisões</option>
                </HistoryFilterSelect>
              </HistoryHeader>
              {revisionFeedback ? <RevisionFeedback>{revisionFeedback}</RevisionFeedback> : null}
              <HistoryHint>
                {historyScope === 'applied'
                  ? 'Mostra somente o estado atual aplicado no modelo.'
                  : historyScope === 'timeline'
                    ? 'Mostra o histórico de mudanças em ordem cronológica.'
                    : 'Revisões manuais salvas por você (estilo migrations).'}
              </HistoryHint>
              {historyScope === 'applied' ? (
                currentStateItems.length > 0 ? (
                  <HistoryList id="modeling-history-list">
                    {currentStateItems.map((item) => (
                      <HistoryItem key={item.id}>
                        <HistoryEntryTitle>{item.title}</HistoryEntryTitle>
                        <HistoryEntryDetail>{item.details}</HistoryEntryDetail>
                      </HistoryItem>
                    ))}
                  </HistoryList>
                ) : (
                  <HistoryEmpty id="modeling-history-list">
                    Ainda não há tabelas/campos no modelo.
                  </HistoryEmpty>
                )
              ) : historyScope === 'timeline' ? (
                historyTimeline.length > 0 ? (
                  <HistoryList id="modeling-history-list">
                    {historyTimeline.map((entry) => (
                      <HistoryItem key={entry.id}>
                        <HistoryEntryTitle>{entry.label}</HistoryEntryTitle>
                        {entry.details ? (
                          <HistoryEntryDetail>{entry.details}</HistoryEntryDetail>
                        ) : null}
                        <HistoryEntryTime>{formatHistoryWhen(entry.atIso)}</HistoryEntryTime>
                      </HistoryItem>
                    ))}
                  </HistoryList>
                ) : (
                  <HistoryEmpty id="modeling-history-list">
                    Nenhuma mudança registrada ainda.
                  </HistoryEmpty>
                )
              ) : revisions.length > 0 ? (
                <HistoryList id="modeling-history-list">
                  {revisions.map((revision) => (
                    <HistoryItem key={revision.id}>
                      <HistoryEntryTitle>
                        Revisão r{revision.number}
                      </HistoryEntryTitle>
                      <HistoryEntryTime>{formatHistoryWhen(revision.createdAtIso)}</HistoryEntryTime>
                      {revision.changes.length > 0 ? (
                        <RevisionChanges>
                          {revision.changes.map((change, index) => (
                            <RevisionChangeItem key={`${revision.id}_${index}`}>
                              {change}
                            </RevisionChangeItem>
                          ))}
                        </RevisionChanges>
                      ) : (
                        <HistoryEntryDetail>Sem mudanças detectadas.</HistoryEntryDetail>
                      )}
                    </HistoryItem>
                  ))}
                </HistoryList>
              ) : (
                <HistoryEmpty id="modeling-history-list">
                  Nenhuma revisão salva ainda.
                </HistoryEmpty>
              )}
            </HistoryPanel>
          </Panel>
        ) : null}
      </ReactFlow>
      <DatabaseImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        sqlScripts={{ mysql: mysqlDbMapSql, postgresql: psqlDbMapSql }}
        primaryColor={projectPrimaryColor}
        edgeStroke={theme.textMuted}
        onConfirmReplace={confirmReplaceDiagram}
        onApply={handleApplyDatabaseImport}
      />
    </FlowHost>
  )
}

export function DatabaseModeling() {
  const { projectId } = useParams<{ projectId: string }>()
  const [metaTick, setMetaTick] = useState(0)
  useEffect(() => {
    const onMeta = () => setMetaTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', onMeta)
    return () => window.removeEventListener('flow-project-meta-changed', onMeta)
  }, [])
  const project = useMemo(
    () => (projectId ? resolveProjectById(projectId) : undefined),
    [projectId, metaTick],
  )
  const { primaryDatabase } = useProjectPrimaryDatabase(projectId)
  const { primaryColor } = useProjectPrimaryColor(projectId)
  const [theaterMode, setTheaterMode] = useState(() => {
    try {
      return localStorage.getItem(THEATER_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(THEATER_STORAGE_KEY, theaterMode ? '1' : '0')
    } catch (err) {
      console.warn('[modelagem] Não foi possível persistir modo teatro:', err)
    }
  }, [theaterMode])

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <ModelingDatabaseProvider engine={primaryDatabase} primaryColor={primaryColor}>
      <ModelingPageRoot $theater={theaterMode}>
        {!theaterMode ? (
          <BackLink to={`/projects/${project.id}`}>← Voltar ao projeto</BackLink>
        ) : null}
        {!theaterMode ? <PageTitle>Modelagem — {project.name}</PageTitle> : null}
        {!theaterMode ? (
          <FlowPersistHint>
            O diagrama é salvo automaticamente neste navegador ao mover tabelas, editar
            campos ou relações.
          </FlowPersistHint>
        ) : null}
        {!theaterMode ? (
          <FlowSqlScriptsLink to={`/projects/${project.id}/sql-scripts`}>
            Scripts SQL salvos neste projeto (editor Monaco) →
          </FlowSqlScriptsLink>
        ) : null}
        <DatabaseFlowCanvas
          key={project.id}
          projectId={project.id}
          projectPrimaryColor={primaryColor}
          sqlEngine={primaryDatabase}
          theaterMode={theaterMode}
          onToggleTheater={() => setTheaterMode((v) => !v)}
        />
      </ModelingPageRoot>
    </ModelingDatabaseProvider>
  )
}
