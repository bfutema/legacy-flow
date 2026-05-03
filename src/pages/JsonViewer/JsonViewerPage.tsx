import '@xyflow/react/dist/style.css'
import Editor from '@monaco-editor/react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from '@xyflow/react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useThemeMode } from '../../contexts/ThemeContext'
import {
  defineFlowMonacoThemes,
  flowMonacoThemeForAppMode,
} from '../../monaco/flowMonacoThemes'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import {
  loadJsonViewerDocument,
  saveJsonViewerDocument,
} from '../../persistence/jsonViewerContentStorage'
import {
  clampJsonViewerEditorWidth,
  loadJsonViewerEditorWidth,
  saveJsonViewerEditorWidth,
} from '../../persistence/jsonViewerUiStorage'
import {
  collectAllExpandedPathIds,
  jsonTextToFlowGraph,
  pathExistsInTree,
  pruneExpandedAfterCollapse,
} from './jsonToFlowGraph'
import { JsonViewerNode } from './JsonViewerNode'
import {
  EditorPane,
  EditorToolbar,
  FlowError,
  FlowPane,
  JsonFlowHost,
  JsonMonacoWrap,
  PageLead,
  PageRoot,
  PageTitle,
  Split,
  SplitResizeHandle,
  StatusBadge,
  TopStrip,
} from './JsonViewerPage.styles'
import type { editor } from 'monaco-editor'

const SAMPLE_JSON = `{
  "fruits": [
    { "name": "Maçã", "color": "#e74c3c", "details": { "tipo": "pomácea", "safra": "outono" } },
    { "name": "Banana", "color": "#f1c40f" }
  ]
}`

function readInitialJsonText(): string {
  return loadJsonViewerDocument() ?? SAMPLE_JSON
}

const nodeTypes = { jsonNode: JsonViewerNode } satisfies NodeTypes

function FitOnGraphChange({ nodes }: { nodes: Node[] }) {
  const { fitView } = useReactFlow()
  useEffect(() => {
    if (nodes.length === 0) return
    const t = window.setTimeout(() => {
      fitView({ padding: 0.2, duration: 220 })
    }, 30)
    return () => window.clearTimeout(t)
  }, [nodes, fitView])
  return null
}

function JsonFlowPanel({
  nodes,
  edges,
  error,
  colorMode,
}: {
  nodes: Node[]
  edges: Edge[]
  error: string | null
  colorMode: 'light' | 'dark'
}) {
  const flowKey = useMemo(
    () => (error ? `err-${error}` : `${nodes.map((n) => n.id).join('|')}|${edges.map((e) => e.id).join('|')}`),
    [error, nodes, edges],
  )

  if (error) {
    return <FlowError role="alert">{error}</FlowError>
  }
  return (
    <ReactFlow
      key={flowKey}
      colorMode={colorMode}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.15}
      maxZoom={1.5}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{
        type: 'smoothstep',
        style: { strokeWidth: 2 },
      }}
    >
      <Background variant={BackgroundVariant.Dots} gap={14} size={1} />
      <Controls
        position="bottom-left"
        showZoom
        showFitView
        showInteractive={false}
      />
      <FitOnGraphChange nodes={nodes} />
    </ReactFlow>
  )
}

const STACK_MEDIA = '(max-width: 900px)'

export function JsonViewerPage() {
  const { mode } = useThemeMode()
  const isStacked = useMediaQuery(STACK_MEDIA)
  const splitRef = useRef<HTMLDivElement>(null)
  const pasteDisposableRef = useRef<{ dispose: () => void } | null>(null)
  const [leftPx, setLeftPx] = useState(loadJsonViewerEditorWidth)
  const [text, setText] = useState(readInitialJsonText)
  const [expandedPaths, setExpandedPaths] = useState(() => {
    try {
      return collectAllExpandedPathIds(JSON.parse(readInitialJsonText()))
    } catch {
      return new Set<string>()
    }
  })
  useEffect(() => {
    try {
      const root = JSON.parse(text) as unknown
      setExpandedPaths((prev) => {
        const next = new Set<string>()
        for (const id of prev) {
          if (pathExistsInTree(root, id)) next.add(id)
        }
        return next
      })
    } catch {
      /* mantém expansão anterior enquanto JSON inválido */
    }
  }, [text])

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        JSON.parse(text)
        saveJsonViewerDocument(text)
      } catch {
        /* só persiste JSON válido */
      }
    }, 600)
    return () => window.clearTimeout(t)
  }, [text])

  useEffect(
    () => () => {
      pasteDisposableRef.current?.dispose()
    },
    [],
  )

  const onToggleExpand = useCallback((childPathId: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(childPathId)) {
        return pruneExpandedAfterCollapse(next, childPathId)
      }
      next.add(childPathId)
      return next
    })
  }, [])

  const handleEditorMount = useCallback((ed: editor.IStandaloneCodeEditor) => {
    pasteDisposableRef.current?.dispose()
    pasteDisposableRef.current = ed.onDidPaste(() => {
      queueMicrotask(() => {
        const raw = ed.getValue()
        try {
          const p = JSON.parse(raw)
          const formatted = JSON.stringify(p, null, 2)
          ed.setValue(formatted)
          setText(formatted)
          saveJsonViewerDocument(formatted)
          setExpandedPaths(collectAllExpandedPathIds(p))
        } catch {
          /* colar inválido: não formata */
        }
      })
    })
  }, [])

  useLayoutEffect(() => {
    if (isStacked || !splitRef.current) return
    const el = splitRef.current
    const apply = () => {
      setLeftPx((w) => clampJsonViewerEditorWidth(w, el.clientWidth))
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isStacked])

  const onResizePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (isStacked) return
      const el = splitRef.current
      if (!el) return
      e.preventDefault()
      const btn = e.currentTarget
      btn.setPointerCapture(e.pointerId)
      const pid = e.pointerId
      const startX = e.clientX
      const startW = leftPx

      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return
        setLeftPx(() =>
          clampJsonViewerEditorWidth(startW + ev.clientX - startX, el.clientWidth),
        )
      }
      const finish = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', finish)
        window.removeEventListener('pointercancel', finish)
        try {
          btn.releasePointerCapture(pid)
        } catch {
          /* ignore */
        }
        setLeftPx((w) => {
          const c = clampJsonViewerEditorWidth(w, el.clientWidth)
          saveJsonViewerEditorWidth(c)
          return c
        })
      }

      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', finish)
      window.addEventListener('pointercancel', finish)
    },
    [isStacked, leftPx],
  )

  const graph = useMemo(
    () => jsonTextToFlowGraph(text, expandedPaths, onToggleExpand),
    [text, expandedPaths, onToggleExpand],
  )
  const valid = graph.ok
  const nodes = graph.ok ? graph.nodes : []
  const edges = graph.ok ? graph.edges : []
  const error = graph.ok ? null : graph.error
  const onFormat = useCallback(() => {
    if (!valid) return
    try {
      const p = JSON.parse(text)
      setText(JSON.stringify(p, null, 2))
    } catch {
      /* ignore */
    }
  }, [text, valid])

  return (
    <PageRoot>
      <TopStrip>
        <PageTitle>JSON Viewer</PageTitle>
        <PageLead>
          Edite JSON à esquerda (salvo automaticamente quando válido). Ao colar, o conteúdo é
          formatado e o grafo reabre com todos os níveis expandidos (até um limite de nós).
          Use + / − nas caixas para recolher ou expandir ramos. Arraste a barra central para
          ajustar a largura do editor.
        </PageLead>
      </TopStrip>
      <Split ref={splitRef} $stacked={isStacked}>
        <EditorPane
          $stacked={isStacked}
          style={!isStacked ? { width: leftPx, flex: '0 0 auto' } : undefined}
        >
          <EditorToolbar>
            <StatusBadge $ok={valid}>{valid ? 'JSON válido' : 'JSON inválido'}</StatusBadge>
            <button
              type="button"
              onClick={onFormat}
              disabled={!valid}
              style={{
                marginLeft: 'auto',
                fontSize: '0.72rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.35rem',
                border: '1px solid',
                cursor: valid ? 'pointer' : 'not-allowed',
                opacity: valid ? 1 : 0.45,
              }}
            >
              Formatar
            </button>
          </EditorToolbar>
          <JsonMonacoWrap>
            <Editor
              height="100%"
              language="json"
              beforeMount={defineFlowMonacoThemes}
              theme={flowMonacoThemeForAppMode(mode)}
              value={text}
              onChange={(v) => setText(v ?? '')}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                padding: { top: 8 },
                formatOnPaste: true,
                bracketPairColorization: { enabled: true },
              }}
              aria-label="Editor JSON"
            />
          </JsonMonacoWrap>
        </EditorPane>
        {!isStacked ? (
          <SplitResizeHandle
            aria-label="Redimensionar painéis"
            aria-orientation="vertical"
            aria-valuenow={Math.round(leftPx)}
            onPointerDown={onResizePointerDown}
          />
        ) : null}
        <FlowPane $stacked={isStacked}>
          <JsonFlowHost>
            <ReactFlowProvider>
              <JsonFlowPanel
                nodes={nodes}
                edges={edges}
                error={error}
                colorMode={mode}
              />
            </ReactFlowProvider>
          </JsonFlowHost>
        </FlowPane>
      </Split>
    </PageRoot>
  )
}
