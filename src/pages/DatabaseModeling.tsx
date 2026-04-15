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
  initialDbEdges,
  initialDbNodes,
  TABLE_NODE_DRAG_HANDLE,
} from '../nodes/initialFlow'
import { TableNode } from '../nodes/TableNode'
import type { TableNodeData } from '../nodes/tableTypes'
import {
  BackLink,
  CardinalityField,
  CardinalityFieldLabel,
  CardinalityPanel,
  CardinalityPanelTitle,
  CardinalitySelect,
  FlowHost,
  FlowPersistHint,
  FsButton,
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

function DatabaseFlowCanvas({
  projectId,
  projectPrimaryColor,
  sqlEngine,
}: {
  projectId: string
  projectPrimaryColor: string
  sqlEngine: string
}) {
  const { confirm } = useConfirmDialog()
  const theme = useTheme()
  const hostRef = useRef<HTMLDivElement>(null)
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)

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

  useEffect(() => {
    if (schemaFilter === ALL_SCHEMAS_FILTER) return
    if (!schemaOptions.includes(schemaFilter)) {
      setSchemaFilter(ALL_SCHEMAS_FILTER)
    }
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

      return confirm({
        title: tables.length === 1 ? 'Excluir tabela' : 'Excluir tabelas',
        message,
        confirmLabel: 'Excluir',
        cancelLabel: 'Cancelar',
      })
    },
    [confirm],
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
          schemaName: fallbackSchema,
          tableName: `tabela_${tableCount + 1}`,
          fields: [{ key: 'id', name: 'id', type: 'int8', pk: true }],
          primaryColor: projectPrimaryColor,
        },
      }
      return [...nds, node]
    })
  }, [projectPrimaryColor, setNodes, sqlEngine])

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
    if (schemaFilter === ALL_SCHEMAS_FILTER) return nodes
    return nodes.filter((n) => {
      if (n.type !== 'table') return true
      const d = n.data as TableNodeData
      const schema = d.schemaName?.trim() ?? ''
      return schema === schemaFilter
    })
  }, [nodes, schemaFilter])

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

  return (
    <FlowHost ref={hostRef}>
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
        <Panel position="top-right">
          <PanelActions>
            <SchemaFilterWrap className="nodrag nopan">
              <SchemaFilterLabel>{namespaceLabel}</SchemaFilterLabel>
              <SchemaFilterSelect
                value={schemaFilter}
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
          </PanelActions>
               </Panel>
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

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <ModelingDatabaseProvider engine={primaryDatabase} primaryColor={primaryColor}>
      <ModelingPageRoot>
        <BackLink to={`/projects/${project.id}`}>← Voltar ao projeto</BackLink>
        <PageTitle>Modelagem — {project.name}</PageTitle>
        <FlowPersistHint>
          O diagrama é salvo automaticamente neste navegador ao mover tabelas, editar
          campos ou relações.
        </FlowPersistHint>
        <DatabaseFlowCanvas
          key={project.id}
          projectId={project.id}
          projectPrimaryColor={primaryColor}
          sqlEngine={primaryDatabase}
        />
      </ModelingPageRoot>
    </ModelingDatabaseProvider>
  )
}
