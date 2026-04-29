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
import { PROJECT_CLOUD_LABELS } from '../../data/cloudProviders'
import { useProjectCloud } from '../../hooks/useProjectCloud'
import { useProjectPrimaryDatabase } from '../../hooks/useProjectPrimaryDatabase'
import { defaultMonorepoRoleForKind } from '../../pages/subprojectFiles/workspaceSeedPaths'
import { ArchitectureLayoutContext } from './ArchitectureLayoutContext'
import { FsButton } from '../../pages/DatabaseModeling.styles'
import {
  ARCH_CLIENT_SURFACES,
  ARCH_CLIENT_SURFACE_LABELS,
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
  RailSection,
  RailTitle,
  SmallInput,
  SmallSelect,
  SideRail,
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

function normalizeBlockSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function ArchitectureFlowWorkbench({
  projectId,
  theaterMode,
  onToggleTheater,
  isMonorepo,
}: {
  projectId: string
  theaterMode: boolean
  onToggleTheater: () => void
  isMonorepo: boolean
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
  const addPanelCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const initial = useMemo(() => {
    const saved = loadArchitectureFlow(projectId)
    if (saved) return { nodes: saved.nodes, edges: saved.edges }
    return createDemoArchitectureNodes(projectId)
  }, [projectId])

  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges)
  const [visibleKinds, setVisibleKinds] =
    useState<Record<ArchitectureBlockKind, boolean>>(defaultKindVisibility)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const { projectCloud } = useProjectCloud(projectId)
  const { primaryDatabase } = useProjectPrimaryDatabase(projectId)
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
      selectedBlockData.projectCloud ?? projectCloud,
      selectedBlockData.projectPrimaryDatabase ?? primaryDatabase,
      selectedBlockData.clientSurface,
    )
  }, [selectedBlockData, projectCloud, primaryDatabase])
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

  useEffect(() => {
    const onEsc = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setAddPanelOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('keydown', onEsc)
      if (addPanelCloseTimerRef.current) clearTimeout(addPanelCloseTimerRef.current)
    }
  }, [])

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
        if (
          d.projectId === projectId &&
          d.projectCloud === projectCloud &&
          d.projectPrimaryDatabase === primaryDatabase
        ) {
          return n
        }
        return {
          ...n,
          data: { ...d, projectId, projectCloud, projectPrimaryDatabase: primaryDatabase },
        }
      }),
    )
  }, [projectCloud, projectId, primaryDatabase, setNodes])

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
        animated: true,
        style: {
          stroke: theme.textMuted,
          strokeWidth: 1.65,
          ...(e.style as CSSProperties | undefined),
        },
      })),
    [edges, theme.textMuted],
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
      const data = node.data as ArchitectureBlockNodeData
      if (data.kind === 'database') {
        navigate(`/projects/${projectId}/modeling`)
        return
      }
      if (isMonorepo) {
        navigate(
          `/projects/${projectId}/workspace-files?focus=${encodeURIComponent(node.id)}`,
        )
      } else {
        navigate(`/projects/${projectId}/subproject-files/${node.id}`)
      }
    },
    [isMonorepo, navigate, projectId],
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
      const clientSurface = kind === 'client' ? 'web' : undefined
      const runtime = defaultTechForKind(kind, projectCloud, primaryDatabase, clientSurface)
      const newNode: Node<ArchitectureBlockNodeData> = {
        id,
        type: 'architectureBlock',
        position: pos,
        data: {
          projectId,
          label: `${labelBase} novo`,
          kind,
          clientSurface,
          projectCloud,
          projectPrimaryDatabase: primaryDatabase,
          runtime,
          techHint: runtime ? techLabel(runtime) : '',
          slug: `${kind}-${id.slice(-6)}`,
          monorepoRole: defaultMonorepoRoleForKind(kind),
          generatedPaths:
            kind === 'queue'
              ? []
              : ['… estrutura será gerada pela CLI / backend (em breve)'],
        },
      }
      setNodes((nds) => [...nds, newNode])
      setAddPanelOpen(false)
      setAddQuery('')
    },
    [projectCloud, primaryDatabase, projectId, screenToFlowPosition, setNodes],
  )

  const updateSelectedRuntime = useCallback(
    (runtime: string) => {
      if (!selectedNodeId) return
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== selectedNodeId || n.type !== 'architectureBlock') return n
          const data = n.data as ArchitectureBlockNodeData
          if (!allowedTechsForKind(data.kind, data.clientSurface).includes(runtime as never)) {
            return n
          }
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

  const updateSelectedClientSurface = useCallback(
    (clientSurface: ArchitectureBlockNodeData['clientSurface']) => {
      if (!selectedNodeId || !clientSurface) return
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== selectedNodeId || n.type !== 'architectureBlock') return n
          const data = n.data as ArchitectureBlockNodeData
          if (data.kind !== 'client') return n
          const keepRuntime =
            data.runtime &&
            allowedTechsForKind('client', clientSurface).includes(data.runtime)
              ? data.runtime
              : defaultTechForKind('client', projectCloud, primaryDatabase, clientSurface)
          return {
            ...n,
            data: {
              ...data,
              clientSurface,
              runtime: keepRuntime,
              techHint: techLabel(keepRuntime) ?? data.techHint,
            },
          }
        }),
      )
    },
    [primaryDatabase, projectCloud, selectedNodeId, setNodes],
  )

  const updateSelectedLabel = useCallback(
    (label: string) => {
      if (!selectedNodeId) return
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== selectedNodeId || n.type !== 'architectureBlock') return n
          const data = n.data as ArchitectureBlockNodeData
          return {
            ...n,
            data: {
              ...data,
              label: label.trimStart(),
            },
          }
        }),
      )
    },
    [selectedNodeId, setNodes],
  )

  const updateSelectedSlug = useCallback(
    (slug: string) => {
      if (!selectedNodeId) return
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== selectedNodeId || n.type !== 'architectureBlock') return n
          const data = n.data as ArchitectureBlockNodeData
          return {
            ...n,
            data: {
              ...data,
              slug: slug.trimStart(),
            },
          }
        }),
      )
    },
    [selectedNodeId, setNodes],
  )

  const updateSelectedMonorepoRole = useCallback(
    (monorepoRole: ArchitectureBlockNodeData['monorepoRole']) => {
      if (!selectedNodeId || !monorepoRole) return
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== selectedNodeId || n.type !== 'architectureBlock') return n
          const data = n.data as ArchitectureBlockNodeData
          return {
            ...n,
            data: { ...data, monorepoRole },
          }
        }),
      )
    },
    [selectedNodeId, setNodes],
  )

  return (
    <>
      <FlowHost ref={hostRef} className="architecture-flow-host" $theater={theaterMode}>
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
                  onClick={onToggleTheater}
                  title={
                    theaterMode
                      ? 'Sair do modo teatro'
                      : 'Ativar modo teatro (oculta título e expande o canvas)'
                  }
                  aria-label={theaterMode ? 'Sair do modo teatro' : 'Ativar modo teatro'}
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
                    <path d="M4 7h16M7 4v3M17 4v3M4 17h16M7 20v-3M17 20v-3" />
                  </svg>
                  <span className="fs-btn-label">
                    {theaterMode ? 'Sair teatro' : 'Modo teatro'}
                  </span>
                </FsButton>
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
                  onMouseEnter={() => {
                    if (addPanelCloseTimerRef.current) {
                      clearTimeout(addPanelCloseTimerRef.current)
                      addPanelCloseTimerRef.current = null
                    }
                    setAddPanelOpen(true)
                  }}
                  onMouseLeave={() => {
                    addPanelCloseTimerRef.current = setTimeout(() => {
                      setAddPanelOpen(false)
                    }, 260)
                  }}
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
            {selectedBlockData ? (
              <RailSection>
                <RailTitle>Nome do subprojeto</RailTitle>
                <InlineLabel htmlFor="arch-block-label-input">
                  Edite o nome exibido no bloco
                </InlineLabel>
                <SmallInput
                  id="arch-block-label-input"
                  value={selectedBlockData.label}
                  maxLength={64}
                  onChange={(e) => updateSelectedLabel(e.target.value)}
                  onBlur={(e) => {
                    const next = e.target.value.trim()
                    if (!next) {
                      updateSelectedLabel('Bloco sem nome')
                    } else if (next !== e.target.value) {
                      updateSelectedLabel(next)
                    }
                  }}
                  placeholder="Nome do bloco"
                />
              </RailSection>
            ) : null}
            {selectedBlockData ? (
              <RailSection>
                <RailTitle>Slug do bloco</RailTitle>
                <InlineLabel htmlFor="arch-block-slug-input">
                  Identificador técnico (URL / codegen)
                </InlineLabel>
                <SmallInput
                  id="arch-block-slug-input"
                  value={selectedBlockData.slug ?? ''}
                  maxLength={64}
                  onChange={(e) => updateSelectedSlug(e.target.value)}
                  onBlur={(e) => {
                    const next = normalizeBlockSlug(e.target.value)
                    updateSelectedSlug(next)
                  }}
                  placeholder="ex.: api-principal"
                />
              </RailSection>
            ) : null}
            {selectedBlockData && isMonorepo && selectedBlockData.kind !== 'database' ? (
              <RailSection>
                <RailTitle>Pasta no monorepo</RailTitle>
                <InlineLabel htmlFor="arch-monorepo-role-select">
                  Raiz apps/ ou packages/
                </InlineLabel>
                <SmallSelect
                  id="arch-monorepo-role-select"
                  value={
                    selectedBlockData.monorepoRole ??
                    defaultMonorepoRoleForKind(selectedBlockData.kind)
                  }
                  onChange={(e) =>
                    updateSelectedMonorepoRole(
                      e.target.value as ArchitectureBlockNodeData['monorepoRole'],
                    )
                  }
                >
                  <option value="app">Aplicação (apps/)</option>
                  <option value="package">Pacote (packages/)</option>
                </SmallSelect>
              </RailSection>
            ) : null}
            {selectedBlockData &&
            ['client', 'service', 'queue', 'database'].includes(selectedBlockData.kind) ? (
              <RailSection>
                {selectedBlockData.kind === 'client' ? (
                  <>
                    <RailTitle>Tipo do cliente</RailTitle>
                    <InlineLabel htmlFor="arch-client-surface-select">
                      Plataforma do app cliente
                    </InlineLabel>
                    <SmallSelect
                      id="arch-client-surface-select"
                      value={selectedBlockData.clientSurface ?? 'web'}
                      onChange={(e) =>
                        updateSelectedClientSurface(
                          e.target.value as ArchitectureBlockNodeData['clientSurface'],
                        )
                      }
                    >
                      {ARCH_CLIENT_SURFACES.map((surface) => (
                        <option key={surface} value={surface}>
                          {ARCH_CLIENT_SURFACE_LABELS[surface]}
                        </option>
                      ))}
                    </SmallSelect>
                  </>
                ) : null}
                <RailTitle>Tecnologia do bloco</RailTitle>
                <InlineLabel htmlFor="arch-runtime-select">
                  {selectedBlockData.label}
                </InlineLabel>
                <SmallSelect
                  id="arch-runtime-select"
                  value={
                    selectedBlockTech ??
                    allowedTechsForKind(
                      selectedBlockData.kind,
                      selectedBlockData.clientSurface,
                    )[0] ??
                    ''
                  }
                  onChange={(e) => updateSelectedRuntime(e.target.value)}
                >
                  {allowedTechsForKind(
                    selectedBlockData.kind,
                    selectedBlockData.clientSurface,
                  ).map((tech) => (
                    <option key={tech} value={tech}>
                      {techLabel(tech)}
                    </option>
                  ))}
                </SmallSelect>
                {selectedBlockData.kind === 'queue' ? (
                  <InlineLabel htmlFor="arch-runtime-select" style={{ marginTop: '0.35rem' }}>
                    Cloud padrão do projeto: {PROJECT_CLOUD_LABELS[projectCloud]}
                  </InlineLabel>
                ) : null}
                {selectedBlockData.kind === 'database' ? (
                  <InlineLabel htmlFor="arch-runtime-select" style={{ marginTop: '0.35rem' }}>
                    Banco principal do projeto: {primaryDatabase}
                  </InlineLabel>
                ) : null}
              </RailSection>
            ) : null}
            </SideRail>
          </Panel>
        </ReactFlow>
      </FlowHost>
    </>
  )
}

export type ProjectArchitectureCanvasProps = {
  projectId: string
  theaterMode?: boolean
  onToggleTheater?: () => void
  /** Padrão true: layout monorepo. */
  isMonorepo?: boolean
}

export function ProjectArchitectureCanvas({
  projectId,
  theaterMode = false,
  onToggleTheater,
  isMonorepo = true,
}: ProjectArchitectureCanvasProps) {
  return (
    <ArchitectureLayoutContext.Provider value={{ isMonorepo }}>
      <PageShell $theater={theaterMode}>
        <ReactFlowProvider>
          <ArchitectureFlowWorkbench
            key={projectId}
            projectId={projectId}
            theaterMode={theaterMode}
            onToggleTheater={onToggleTheater ?? (() => undefined)}
            isMonorepo={isMonorepo}
          />
        </ReactFlowProvider>
      </PageShell>
    </ArchitectureLayoutContext.Provider>
  )
}
