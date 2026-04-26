import '@xyflow/react/dist/style.css'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import {
  addEdge,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MarkerType,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from 'styled-components'
import { HelpInfoTooltip } from '../HelpInfoTooltip/HelpInfoTooltip'
import { FsButton } from '../../pages/DatabaseModeling.styles'
import {
  allowedTechsForKind,
  defaultTechForKind,
  normalizeTechForNode,
  techLabel,
} from './architectureTechMeta'
import {
  loadArchitectureFlow,
  saveArchitectureFlow,
} from '../../persistence/architectureFlowStorage'
import {
  ALL_ARCHITECTURE_KINDS,
  ARCHITECTURE_KIND_LABEL,
} from './architectureKindMeta'
import type {
  ArchitectureBlockKind,
  ArchitectureBlockNodeData,
} from './architectureTypes'
import { createDemoArchitectureNodes } from './demoInitialArchitecture'
import { LabeledArchitectureEdge } from './edges/LabeledArchitectureEdge'
import { ArchitectureBlockNode } from './nodes/ArchitectureBlockNode'
import {
  AddBlockList,
  AddBlockOption,
  AddBlockPopover,
  AddBlockSearch,
  AddBlockWrap,
  FilterRow,
  FlowHost,
  FoldSectionHead,
  InlineLabel,
  PageShell,
  PersistHintBar,
  PersistHintText,
  RailHintButton,
  RailHintLink,
  RailSection,
  RailTitle,
  RailTitleRow,
  RailTitleWithHelp,
  SegmentBtn,
  Segmented,
  SmallSelect,
  SideRail,
  StatusDot,
  StatusStrip,
  StatusStrong,
  TopLeftPanel,
  TopToolbarRow,
} from './ProjectArchitectureCanvas.styles'

const nodeTypes = { architectureBlock: ArchitectureBlockNode }
const edgeTypes = { labeledArchitecture: LabeledArchitectureEdge }

const PERSIST_DEBOUNCE_MS = 450

function defaultKindVisibility(): Record<ArchitectureBlockKind, boolean> {
  return ALL_ARCHITECTURE_KINDS.reduce(
    (acc, k) => {
      acc[k] = true
      return acc
    },
    {} as Record<ArchitectureBlockKind, boolean>,
  )
}

function ArchitectureFlowWorkbench({
  projectId,
  projectName,
}: {
  projectId: string
  projectName: string
}) {
  const theme = useTheme()
  const navigate = useNavigate()
  const colorMode = theme.mode === 'dark' ? 'dark' : 'light'
  const { fitView, screenToFlowPosition } = useReactFlow()
  const hostRef = useRef<HTMLDivElement>(null)
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didFitRef = useRef(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [addPanelOpen, setAddPanelOpen] = useState(false)
  const [addQuery, setAddQuery] = useState('')
  const addPanelRef = useRef<HTMLDivElement>(null)

  const initial = useMemo(() => {
    const saved = loadArchitectureFlow(projectId)
    if (saved) return { nodes: saved.nodes, edges: saved.edges }
    return createDemoArchitectureNodes(projectId)
  }, [projectId])

  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)
  const [edgeStyle, setEdgeStyle] = useState<'flow' | 'dash'>('flow')
  const [visibleKinds, setVisibleKinds] =
    useState<Record<ArchitectureBlockKind, boolean>>(defaultKindVisibility)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId && n.type === 'architectureBlock'),
    [nodes, selectedNodeId],
  )
  const selectedBlockData = useMemo(
    () =>
      selectedNode && selectedNode.type === 'architectureBlock'
        ? (selectedNode.data as ArchitectureBlockNodeData)
        : undefined,
    [selectedNode],
  )
  const selectedBlockTech = useMemo(() => {
    if (!selectedBlockData) return undefined
    return normalizeTechForNode(
      selectedBlockData.kind,
      selectedBlockData.runtime,
      selectedBlockData.techHint,
    )
  }, [selectedBlockData])
  const filteredKinds = useMemo(() => {
    const q = addQuery.trim().toLowerCase()
    if (!q) return ALL_ARCHITECTURE_KINDS
    return ALL_ARCHITECTURE_KINDS.filter((kind) =>
      ARCHITECTURE_KIND_LABEL[kind].toLowerCase().includes(q),
    )
  }, [addQuery])

  useEffect(() => {
    const sync = () =>
      setIsFullscreen(document.fullscreenElement === hostRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  useEffect(() => {
    if (!addPanelOpen) return
    const onPointer = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null
      if (!target || !addPanelRef.current) return
      if (!addPanelRef.current.contains(target)) {
        setAddPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [addPanelOpen])

  const toggleFullscreen = useCallback(() => {
    const el = hostRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      void el.requestFullscreen()
    } else {
      void document.exitFullscreen()
    }
  }, [])

  const schedulePersist = useCallback(
    (nextNodes: Node[], nextEdges: Edge[]) => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current)
      persistTimerRef.current = setTimeout(() => {
        persistTimerRef.current = null
        saveArchitectureFlow(projectId, nextNodes, nextEdges)
      }, PERSIST_DEBOUNCE_MS)
    },
    [projectId],
  )

  useEffect(() => {
    schedulePersist(nodes, edges)
    return () => {
      if (persistTimerRef.current) clearTimeout(persistTimerRef.current)
    }
  }, [nodes, edges, schedulePersist])

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.type !== 'architectureBlock') return n
        const d = n.data as ArchitectureBlockNodeData
        if (d.projectId === projectId) return n
        return {
          ...n,
          data: { ...d, projectId },
        }
      }),
    )
  }, [projectId, setNodes])

  /** Diagramas antigos com `dragHandle` só arrastavam pela faixa fina — remover. */
  useEffect(() => {
    setNodes((nds) => {
      let changed = false
      const next = nds.map((n) => {
        if (n.type !== 'architectureBlock' || !n.dragHandle) return n
        changed = true
        const copy = { ...n } as Node & { dragHandle?: string }
        delete copy.dragHandle
        return copy as Node
      })
      return changed ? next : nds
    })
  }, [projectId, setNodes])

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.type !== 'architectureBlock') return { ...n, hidden: false }
        const d = n.data as ArchitectureBlockNodeData
        const hidden = !visibleKinds[d.kind]
        if (n.hidden === hidden) return n
        return { ...n, hidden }
      }),
    )
  }, [visibleKinds, setNodes])

  const styledEdges = useMemo(
    () =>
      edges.map((e) => ({
        ...e,
        animated: edgeStyle === 'flow',
        style: {
          stroke: theme.textMuted,
          strokeWidth: 1.65,
          ...(edgeStyle === 'dash' ? { strokeDasharray: '5 6' } : {}),
          ...(e.style as CSSProperties | undefined),
        },
      })),
    [edges, edgeStyle, theme.textMuted],
  )

  const visibleNodeIds = useMemo(
    () => new Set(nodes.filter((n) => !n.hidden).map((n) => n.id)),
    [nodes],
  )

  const displayEdges = useMemo(
    () =>
      styledEdges.map((e) => ({
        ...e,
        hidden:
          !visibleNodeIds.has(e.source) || !visibleNodeIds.has(e.target),
      })),
    [styledEdges, visibleNodeIds],
  )

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'labeledArchitecture',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 18,
              height: 18,
            },
            data: { label: 'Nova ligação' },
          },
          eds,
        ),
      )
    },
    [setEdges],
  )

  const onNodeDoubleClick = useCallback(
    (_: ReactMouseEvent, node: Node) => {
      if (node.type !== 'architectureBlock') return
      navigate(`/projects/${projectId}/subproject-files/${node.id}`)
    },
    [navigate, projectId],
  )

  useEffect(() => {
    if (didFitRef.current) return
    const t = window.setTimeout(() => {
      fitView({ padding: 0.22, duration: 280 })
      didFitRef.current = true
    }, 80)
    return () => window.clearTimeout(t)
  }, [fitView])

  const addBlock = useCallback(
    (kind: ArchitectureBlockKind) => {
      const id = `arch_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`
      const pos = screenToFlowPosition({
        x: window.innerWidth * 0.38,
        y: window.innerHeight * 0.36,
      })
      const labelBase = ARCHITECTURE_KIND_LABEL[kind]
      const runtime = defaultTechForKind(kind)
      const newNode: Node<ArchitectureBlockNodeData> = {
        id,
        type: 'architectureBlock',
        position: pos,
        data: {
          projectId,
          label: `${labelBase} novo`,
          kind,
          runtime,
          techHint: runtime ? techLabel(runtime) : '',
          slug: `${kind}-${id.slice(-6)}`,
          generatedPaths: [
            '… estrutura será gerada pela CLI / backend (em breve)',
          ],
        },
      }
      setNodes((nds) => [...nds, newNode])
      setAddPanelOpen(false)
      setAddQuery('')
    },
    [projectId, screenToFlowPosition, setNodes],
  )

  const updateSelectedRuntime = useCallback(
    (runtime: string) => {
      if (!selectedNodeId) return
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== selectedNodeId || n.type !== 'architectureBlock') return n
          const data = n.data as ArchitectureBlockNodeData
          return {
            ...n,
            data: {
              ...data,
              runtime: runtime as ArchitectureBlockNodeData['runtime'],
              techHint: techLabel(runtime as ArchitectureBlockNodeData['runtime']) ?? data.techHint,
            },
          }
        }),
      )
    },
    [selectedNodeId, setNodes],
  )

  const nodeCount = visibleNodeIds.size
  const edgeCount = displayEdges.filter((e) => !e.hidden).length

  return (
    <>
      <FlowHost ref={hostRef} className="architecture-flow-host">
        <ReactFlow
          colorMode={colorMode}
          nodes={nodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={({ nodes: sel }) =>
            setSelectedNodeId(sel[0]?.type === 'architectureBlock' ? sel[0].id : null)
          }
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.35}
          maxZoom={1.35}
          proOptions={{ hideAttribution: true }}
          connectionLineType={ConnectionLineType.SmoothStep}
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background variant={BackgroundVariant.Dots} gap={14} size={1} />
          <Controls
            position="bottom-left"
            showZoom
            showFitView
            showInteractive
          />

          <Panel position="top-left">
            <TopLeftPanel>
              <TopToolbarRow className="nodrag nopan">
                <FsButton
                  type="button"
                  className="nodrag nopan"
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
                <AddBlockWrap
                  ref={addPanelRef}
                  className="nodrag nopan"
                  onMouseEnter={() => setAddPanelOpen(true)}
                  onMouseLeave={() => setAddPanelOpen(false)}
                >
                  <FsButton
                    type="button"
                    className="nodrag nopan"
                    onClick={() => setAddPanelOpen((v) => !v)}
                    aria-expanded={addPanelOpen}
                    aria-controls="add-block-popover"
                    title="Adicionar bloco de arquitetura"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span className="fs-btn-label">Adicionar bloco</span>
                  </FsButton>
                  <AddBlockPopover id="add-block-popover" $open={addPanelOpen}>
                    <AddBlockSearch
                      placeholder="Buscar tipo de bloco..."
                      value={addQuery}
                      onChange={(e) => setAddQuery(e.target.value)}
                      aria-label="Buscar tipo de bloco"
                    />
                    <AddBlockList>
                      {filteredKinds.map((kind) => (
                        <AddBlockOption
                          key={kind}
                          type="button"
                          onClick={() => addBlock(kind)}
                          title={`Adicionar bloco: ${ARCHITECTURE_KIND_LABEL[kind]}`}
                        >
                          <span>{ARCHITECTURE_KIND_LABEL[kind]}</span>
                          <span style={{ opacity: 0.65 }}>+{kind}</span>
                        </AddBlockOption>
                      ))}
                      {filteredKinds.length === 0 ? (
                        <span style={{ fontSize: '0.68rem', opacity: 0.75, padding: '0.25rem' }}>
                          Nenhum tipo encontrado.
                        </span>
                      ) : null}
                    </AddBlockList>
                  </AddBlockPopover>
                </AddBlockWrap>
              </TopToolbarRow>
            </TopLeftPanel>
          </Panel>

          <Panel position="top-right">
            <SideRail>
              <RailSection>
                <FoldSectionHead
                  type="button"
                  className="nodrag nopan"
                  $open={filtersOpen}
                  aria-expanded={filtersOpen}
                  onClick={() => setFiltersOpen((o) => !o)}
                >
                  <span>Filtro de elementos</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </FoldSectionHead>
                {filtersOpen
                  ? ALL_ARCHITECTURE_KINDS.map((kind) => (
                      <FilterRow key={kind}>
                        <input
                          type="checkbox"
                          checked={visibleKinds[kind]}
                          onChange={() =>
                            setVisibleKinds((v) => ({ ...v, [kind]: !v[kind] }))
                          }
                        />
                        {ARCHITECTURE_KIND_LABEL[kind]}
                      </FilterRow>
                    ))
                  : null}
              </RailSection>
            <RailSection>
              <RailTitle>Estilo de ligação</RailTitle>
              <Segmented>
                <SegmentBtn
                  type="button"
                  $active={edgeStyle === 'flow'}
                  onClick={() => setEdgeStyle('flow')}
                >
                  Fluxo
                </SegmentBtn>
                <SegmentBtn
                  type="button"
                  $active={edgeStyle === 'dash'}
                  onClick={() => setEdgeStyle('dash')}
                >
                  Tracejado
                </SegmentBtn>
              </Segmented>
            </RailSection>
            {selectedBlockData && ['client', 'service'].includes(selectedBlockData.kind) ? (
              <RailSection>
                <RailTitle>Tecnologia do bloco</RailTitle>
                <InlineLabel htmlFor="arch-runtime-select">
                  {selectedBlockData.label}
                </InlineLabel>
                <SmallSelect
                  id="arch-runtime-select"
                  value={
                    selectedBlockTech ?? allowedTechsForKind(selectedBlockData.kind)[0] ?? ''
                  }
                  onChange={(e) => updateSelectedRuntime(e.target.value)}
                >
                  {allowedTechsForKind(selectedBlockData.kind).map((tech) => (
                    <option key={tech} value={tech}>
                      {techLabel(tech)}
                    </option>
                  ))}
                </SmallSelect>
              </RailSection>
            ) : null}
            <RailSection>
              <RailTitleRow>
                <RailTitleWithHelp>Arquivos do bloco</RailTitleWithHelp>
                <HelpInfoTooltip ariaLabel="Ajuda: arquivos do bloco e subprojetos">
                  Duplo-clique em um bloco abre a visão estilo repositório (árvore, caminho e
                  símbolos). Também é possível escolher o subprojeto a partir da página do
                  projeto.
                </HelpInfoTooltip>
              </RailTitleRow>
              <RailHintLink
                className="nodrag nopan"
                to={`/projects/${projectId}/subproject-files`}
              >
                Ver todos os subprojetos →
              </RailHintLink>
              <RailHintButton
                type="button"
                className="nodrag nopan"
                disabled={!selectedNodeId}
                title={
                  selectedNodeId
                    ? 'Abrir arquivos do bloco selecionado'
                    : 'Selecione um bloco no diagrama (um clique)'
                }
                onClick={() => {
                  if (!selectedNodeId) return
                  navigate(`/projects/${projectId}/subproject-files/${selectedNodeId}`)
                }}
              >
                Abrir bloco selecionado
              </RailHintButton>
            </RailSection>
            </SideRail>
          </Panel>
        </ReactFlow>
      </FlowHost>
      <StatusStrip style={{ marginTop: '0.65rem' }}>
        <span>
          <StatusDot aria-hidden />
          <StatusStrong>Arquitetura</StatusStrong> · {projectName}
        </span>
        <span>
          {nodeCount} blocos visíveis · {edgeCount} ligações
        </span>
        <span>Salvo neste navegador (local)</span>
      </StatusStrip>
    </>
  )
}

export type ProjectArchitectureCanvasProps = {
  projectId: string
  projectName: string
}

export function ProjectArchitectureCanvas({
  projectId,
  projectName,
}: ProjectArchitectureCanvasProps) {
  return (
    <PageShell>
      <PersistHintBar>
        <PersistHintText>
          Documente serviços, filas e clientes. O layout é persistido por projeto neste
          aparelho.
        </PersistHintText>
        <HelpInfoTooltip
          ariaLabel="Ajuda: abrir arquivos e subprojetos"
          tooltipId="architecture-page-files-help"
        >
          Duplo-clique em um bloco abre a visão de arquivos (estilo repositório); pela página
          do projeto você escolhe o subprojeto antes de abrir a mesma tela.
        </HelpInfoTooltip>
      </PersistHintBar>
      <ReactFlowProvider>
        <ArchitectureFlowWorkbench
          key={projectId}
          projectId={projectId}
          projectName={projectName}
        />
      </ReactFlowProvider>
    </PageShell>
  )
}
