import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FiChevronDown,
  FiChevronRight,
  FiFile,
  FiFolder,
  FiMaximize2,
  FiMinimize2,
  FiTrash2,
} from 'react-icons/fi'
import { VscNewFile, VscNewFolder } from 'react-icons/vsc'
import { ARCHITECTURE_KIND_LABEL } from '../../components/ProjectArchitectureCanvas/architectureKindMeta'
import {
  normalizeTechForNode,
  renderTechIcon,
  techLabel,
} from '../../components/ProjectArchitectureCanvas/architectureTechMeta'
import type { ArchitectureBlockSummary } from './architectureBlocksLoader'
import { useProjectCloud } from '../../hooks/useProjectCloud'
import { useProjectPrimaryDatabase } from '../../hooks/useProjectPrimaryDatabase'
import { mockContentForPath } from './mockFileContent'
import { pathsToTree, type PathTreeNode } from './pathTree'
import { extractSymbolsFromContent } from './extractSymbols'
import {
  BreadcrumbBar,
  CodeScroll,
  CodeTable,
  ConfirmActions,
  ConfirmModal,
  ConfirmText,
  ConfirmTitle,
  CrumbLink,
  CrumbPart,
  CrumbSep,
  LineCode,
  LineNo,
  MainColumn,
  MetaBar,
  ModalBackdrop,
  PageRoot,
  Shell,
  SymbolRow,
  SymbolsColumn,
  SymbolsHeader,
  SymbolsScroll,
  SymbolsSearch,
  Tab,
  TabRow,
  ToolbarBtn,
  TreeActionBtn,
  TreeRowActions,
  TreeRowWrap,
  TreeColumn,
  TreeHeader,
  TreeHeaderActions,
  TreeHeaderIconBtn,
  TreeFoldBtn,
  TreeFoldSpacer,
  TreeInlineInput,
  TreeRowBtn,
  TreeScroll,
  TreeSearch,
} from './SubprojectFilesLayout.styles'

const EXPLORER_STORAGE_VERSION = 'v1'
type ExplorerLocalState = {
  paths: string[]
  selectedPath?: string
  selectedIsFile?: boolean
  treeQuery?: string
  symQuery?: string
  expandedFolders?: string[]
}

function storageKey(projectId: string, nodeId: string): string {
  return `flow-subproject-files:${EXPLORER_STORAGE_VERSION}:${projectId}:${nodeId}`
}

function isFolderPath(path: string): boolean {
  return path.endsWith('/')
}

function normalizePathInput(raw: string): string {
  return raw
    .trim()
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '')
}

function folderOfPath(path: string): string {
  const clean = isFolderPath(path) ? path.slice(0, -1) : path
  const idx = clean.lastIndexOf('/')
  return idx >= 0 ? clean.slice(0, idx) : ''
}

function asFolder(path: string): string {
  return path.endsWith('/') ? path : `${path}/`
}

function filterTree(nodes: PathTreeNode[], q: string): PathTreeNode[] {
  if (!q.trim()) return nodes
  const needle = q.trim().toLowerCase()
  const walk = (list: PathTreeNode[]): PathTreeNode[] => {
    const out: PathTreeNode[] = []
    for (const n of list) {
      const kids = walk(n.children)
      const selfHit = n.name.toLowerCase().includes(needle) || n.fullPath.toLowerCase().includes(needle)
      if (selfHit || kids.length) {
        out.push({ ...n, children: kids })
      }
    }
    return out
  }
  return walk(nodes)
}

const FileTree = memo(function FileTree({
  nodes,
  depth,
  selectedPath,
  onPick,
  onDelete,
  onDropPath,
  expandedFolders,
  onToggleFolder,
  creatingParentPath,
  creatingKind,
  creatingDraft,
  onCreatingDraftChange,
  onCommitCreate,
  onCancelCreate,
  editingPath,
  editingDraft,
  onStartRename,
  onRenameDraftChange,
  onCommitRename,
  onCancelRename,
}: {
  nodes: PathTreeNode[]
  depth: number
  selectedPath: string
  onPick: (path: string, file: boolean) => void
  onDelete: (path: string, file: boolean) => void
  onDropPath: (dragPath: string, targetPath: string, targetIsFile: boolean) => void
  expandedFolders: Set<string>
  onToggleFolder: (folderPath: string) => void
  creatingParentPath: string | null
  creatingKind: 'file' | 'folder' | null
  creatingDraft: string
  onCreatingDraftChange: (value: string) => void
  onCommitCreate: () => void
  onCancelCreate: () => void
  editingPath: string | null
  editingDraft: string
  onStartRename: (path: string) => void
  onRenameDraftChange: (value: string) => void
  onCommitRename: () => void
  onCancelRename: () => void
}) {
  return (
    <>
      {nodes.map((n) => {
        const normalizedPath = normalizePathInput(n.fullPath)
        const isExpanded = !n.file && expandedFolders.has(normalizedPath)
        return (
          <div key={n.fullPath}>
            <TreeRowWrap>
              <TreeRowBtn
                type="button"
                $depth={depth}
                $active={selectedPath === n.fullPath}
                onClick={() => onPick(n.fullPath, n.file)}
                onDoubleClick={() => onStartRename(n.fullPath)}
                draggable={n.file}
                onDragStart={(ev) => {
                  if (!n.file) return
                  ev.dataTransfer.setData('text/plain', n.fullPath)
                  ev.dataTransfer.effectAllowed = 'move'
                }}
                onDragOver={(ev) => {
                  if (!n.file) {
                    ev.preventDefault()
                    ev.dataTransfer.dropEffect = 'move'
                  }
                }}
                onDrop={(ev) => {
                  if (n.file) return
                  ev.preventDefault()
                  const dragPath = ev.dataTransfer.getData('text/plain')
                  if (!dragPath) return
                  onDropPath(dragPath, n.fullPath, n.file)
                }}
              >
                {n.file ? (
                  <TreeFoldSpacer aria-hidden />
                ) : (
                  <TreeFoldBtn
                    type="button"
                    aria-label={isExpanded ? 'Recolher pasta' : 'Expandir pasta'}
                    onClick={(ev) => {
                      ev.stopPropagation()
                      onToggleFolder(normalizedPath)
                    }}
                  >
                    {isExpanded ? (
                      <FiChevronDown size={12} aria-hidden />
                    ) : (
                      <FiChevronRight size={12} aria-hidden />
                    )}
                  </TreeFoldBtn>
                )}
                {n.file ? (
                  <FiFile size={12} aria-hidden style={{ opacity: 0.75, flexShrink: 0 }} />
                ) : (
                  <FiFolder size={12} aria-hidden style={{ opacity: 0.75, flexShrink: 0 }} />
                )}
                {editingPath === n.fullPath ? (
                  <TreeInlineInput
                    value={editingDraft}
                    autoFocus
                    onClick={(ev) => ev.stopPropagation()}
                    onChange={(ev) => onRenameDraftChange(ev.target.value)}
                    onBlur={onCommitRename}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter') onCommitRename()
                      if (ev.key === 'Escape') onCancelRename()
                    }}
                  />
                ) : (
                  n.name
                )}
              </TreeRowBtn>
              <TreeRowActions data-tree-actions="true">
                <TreeActionBtn
                  type="button"
                  $danger
                  title={n.file ? 'Remover arquivo' : 'Remover pasta'}
                  onClick={() => onDelete(n.fullPath, n.file)}
                >
                  <FiTrash2 size={11} aria-hidden />
                </TreeActionBtn>
              </TreeRowActions>
            </TreeRowWrap>
            {creatingParentPath === normalizedPath && creatingKind ? (
              <TreeRowBtn
                type="button"
                $depth={depth + 1}
                onClick={(ev) => ev.stopPropagation()}
                $active
              >
                <TreeFoldSpacer aria-hidden />
                {creatingKind === 'file' ? (
                  <FiFile size={12} aria-hidden style={{ opacity: 0.75, flexShrink: 0 }} />
                ) : (
                  <FiFolder size={12} aria-hidden style={{ opacity: 0.75, flexShrink: 0 }} />
                )}
                <TreeInlineInput
                  value={creatingDraft}
                  autoFocus
                  onClick={(ev) => ev.stopPropagation()}
                  onChange={(ev) => onCreatingDraftChange(ev.target.value)}
                  onBlur={onCommitCreate}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter') onCommitCreate()
                    if (ev.key === 'Escape') onCancelCreate()
                  }}
                />
              </TreeRowBtn>
            ) : null}
            {isExpanded && n.children.length > 0 ? (
              <FileTree
                nodes={n.children}
                depth={depth + 1}
                selectedPath={selectedPath}
                onPick={onPick}
                onDelete={onDelete}
                onDropPath={onDropPath}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                creatingParentPath={creatingParentPath}
                creatingKind={creatingKind}
                creatingDraft={creatingDraft}
                onCreatingDraftChange={onCreatingDraftChange}
                onCommitCreate={onCommitCreate}
                onCancelCreate={onCancelCreate}
                editingPath={editingPath}
                editingDraft={editingDraft}
                onStartRename={onStartRename}
                onRenameDraftChange={onRenameDraftChange}
                onCommitRename={onCommitRename}
                onCancelRename={onCancelRename}
              />
            ) : null}
          </div>
        )
      })}
    </>
  )
})

type Props = {
  projectId: string
  projectName: string
  block: ArchitectureBlockSummary
  theaterMode: boolean
  onToggleTheater: () => void
}

export function SubprojectFilesExplorer({
  projectId,
  projectName,
  block,
  theaterMode,
  onToggleTheater,
}: Props) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { projectCloud } = useProjectCloud(projectId)
  const { primaryDatabase } = useProjectPrimaryDatabase(projectId)
  const [paths, setPaths] = useState<string[]>([])
  const [treeQuery, setTreeQuery] = useState('')
  const [symQuery, setSymQuery] = useState('')
  const [selectedPath, setSelectedPath] = useState('')
  const [selectedIsFile, setSelectedIsFile] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [creatingParentPath, setCreatingParentPath] = useState<string | null>(null)
  const [creatingKind, setCreatingKind] = useState<'file' | 'folder' | null>(null)
  const [creatingDraft, setCreatingDraft] = useState('')
  const [storageReady, setStorageReady] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ path: string; file: boolean } | null>(null)
  const [editingPath, setEditingPath] = useState<string | null>(null)
  const [editingDraft, setEditingDraft] = useState('')

  useEffect(() => {
    const raw = localStorage.getItem(storageKey(projectId, block.nodeId))
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ExplorerLocalState
        if (Array.isArray(parsed.paths)) {
          setPaths(parsed.paths)
          setSelectedPath(parsed.selectedPath ?? '')
          setSelectedIsFile(parsed.selectedIsFile ?? true)
          setTreeQuery(parsed.treeQuery ?? '')
          setSymQuery(parsed.symQuery ?? '')
          setExpandedFolders(new Set(parsed.expandedFolders ?? []))
          setStorageReady(true)
          return
        }
      } catch {
        // fallback para seed inicial abaixo
      }
    }
    setPaths(block.data.generatedPaths ?? [])
    setSelectedPath('')
    setSelectedIsFile(true)
    setTreeQuery('')
    setSymQuery('')
    setExpandedFolders(new Set())
    setStorageReady(true)
  }, [block.data.generatedPaths, block.nodeId, projectId])

  useEffect(() => {
    if (!storageReady) return
    const payload: ExplorerLocalState = {
      paths,
      selectedPath,
      selectedIsFile,
      treeQuery,
      symQuery,
      expandedFolders: [...expandedFolders],
    }
    localStorage.setItem(storageKey(projectId, block.nodeId), JSON.stringify(payload))
  }, [
    paths,
    projectId,
    block.nodeId,
    selectedPath,
    selectedIsFile,
    treeQuery,
    symQuery,
    expandedFolders,
    storageReady,
  ])

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === shellRef.current)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const tree = useMemo(() => pathsToTree(paths), [paths])
  const flatFiles = useMemo(() => {
    const collect = (nodes: PathTreeNode[]): string[] => {
      const acc: string[] = []
      for (const n of nodes) {
        if (n.file) acc.push(n.fullPath)
        acc.push(...collect(n.children))
      }
      return acc
    }
    return collect(tree)
  }, [tree])

  const filteredTree = useMemo(
    () => filterTree(tree, treeQuery),
    [tree, treeQuery],
  )

  useEffect(() => {
    if (!selectedPath || !flatFiles.includes(selectedPath)) {
      if (selectedIsFile) {
        setSelectedPath(flatFiles[0] ?? '')
      }
    }
  }, [flatFiles, selectedPath, selectedIsFile])
  const selectedFilePath = useMemo(
    () => (selectedPath && flatFiles.includes(selectedPath) ? selectedPath : ''),
    [flatFiles, selectedPath],
  )
  const content = useMemo(
    () => (selectedFilePath ? mockContentForPath(selectedFilePath) : '// Selecione um arquivo'),
    [selectedFilePath],
  )
  const symbols = useMemo(() => extractSymbolsFromContent(content), [content])
  const filteredSymbols = useMemo(() => {
    const q = symQuery.trim().toLowerCase()
    if (!q) return symbols
    return symbols.filter((s) => s.toLowerCase().includes(q))
  }, [symbols, symQuery])

  const lineRows = useMemo(() => content.split('\n'), [content])
  const blockTech = useMemo(
    () =>
      normalizeTechForNode(
        block.data.kind,
        block.data.runtime,
        block.data.techHint,
        block.data.projectCloud ?? projectCloud,
        block.data.projectPrimaryDatabase ?? primaryDatabase,
        block.data.clientSurface,
      ),
    [
      block.data.kind,
      block.data.projectCloud,
      block.data.projectPrimaryDatabase,
      block.data.runtime,
      block.data.techHint,
      block.data.clientSurface,
      projectCloud,
      primaryDatabase,
    ],
  )
  const blockTechLabel = useMemo(() => techLabel(blockTech), [blockTech])

  const onPick = useCallback((path: string, file: boolean) => {
    setSelectedPath(path)
    setSelectedIsFile(file)
  }, [])

  const createParent = useMemo(() => {
    if (!selectedPath) return ''
    return selectedIsFile ? folderOfPath(selectedPath) : normalizePathInput(selectedPath)
  }, [selectedIsFile, selectedPath])

  const startCreate = useCallback(
    (kind: 'file' | 'folder') => {
      const parent = createParent
      setCreatingParentPath(parent || '')
      setCreatingKind(kind)
      setCreatingDraft(kind === 'file' ? 'new-file.ts' : 'new-folder')
      if (parent) {
        setExpandedFolders((prev) => new Set(prev).add(parent))
      }
    },
    [createParent],
  )

  const createFolder = useCallback(() => startCreate('folder'), [startCreate])
  const createFile = useCallback(() => startCreate('file'), [startCreate])

  const cancelCreate = useCallback(() => {
    setCreatingParentPath(null)
    setCreatingKind(null)
    setCreatingDraft('')
  }, [])

  const commitCreate = useCallback(() => {
    if (!creatingKind || creatingParentPath === null) return
    const name = normalizePathInput(creatingDraft)
    if (!name) {
      cancelCreate()
      return
    }
    const parent = normalizePathInput(creatingParentPath)
    if (creatingKind === 'folder') {
      const next = asFolder(parent ? `${parent}/${name}` : name)
      setPaths((prev) => (prev.includes(next) ? prev : [...prev, next]))
      setSelectedPath(next)
      setSelectedIsFile(false)
      setExpandedFolders((prev) => new Set(prev).add(parent ? `${parent}/${name}` : name))
    } else {
      const next = parent ? `${parent}/${name}` : name
      setPaths((prev) => (prev.includes(next) ? prev : [...prev, next]))
      setSelectedPath(next)
      setSelectedIsFile(true)
    }
    cancelCreate()
  }, [cancelCreate, creatingDraft, creatingKind, creatingParentPath])

  const askRemove = useCallback((path: string, file: boolean) => {
    if (file) {
      setPaths((prev) => prev.filter((p) => p !== path))
      return
    }
    setPendingDelete({ path, file })
  }, [])

  const startRename = useCallback(
    (path: string) => {
      const current = path.split('/').filter(Boolean).at(-1) ?? path
      setEditingPath(path)
      setEditingDraft(current)
    },
    [setEditingPath, setEditingDraft],
  )

  const cancelRename = useCallback(() => {
    setEditingPath(null)
    setEditingDraft('')
  }, [])

  const commitRename = useCallback(() => {
    if (!editingPath) return
    const nextName = normalizePathInput(editingDraft)
    if (!nextName) {
      cancelRename()
      return
    }
    const isDir = isFolderPath(editingPath)
    const parent = folderOfPath(editingPath)
    const baseTarget = parent ? `${parent}/${nextName}` : nextName
    const nextPath = isDir ? asFolder(baseTarget) : baseTarget
    const oldPath = editingPath

    setPaths((prev) => {
      if (oldPath === nextPath) return prev
      if (isDir) {
        const fromPrefix = asFolder(oldPath)
        const toPrefix = asFolder(baseTarget)
        const mapped = prev.map((p) => {
          if (p === fromPrefix) return toPrefix
          if (p.startsWith(fromPrefix)) return `${toPrefix}${p.slice(fromPrefix.length)}`
          return p
        })
        return [...new Set(mapped)]
      }
      return prev.map((p) => (p === oldPath ? nextPath : p))
    })

    if (selectedPath === oldPath) {
      setSelectedPath(nextPath)
    } else if (isDir && selectedPath.startsWith(asFolder(oldPath))) {
      const fromPrefix = asFolder(oldPath)
      const toPrefix = asFolder(baseTarget)
      setSelectedPath(`${toPrefix}${selectedPath.slice(fromPrefix.length)}`)
    }
    cancelRename()
  }, [cancelRename, editingDraft, editingPath, selectedPath])

  const confirmRemoveFolder = useCallback(() => {
    if (!pendingDelete || pendingDelete.file) return
    const folder = asFolder(pendingDelete.path)
    setPaths((prev) => prev.filter((p) => p !== folder && !p.startsWith(folder)))
    setPendingDelete(null)
  }, [pendingDelete])

  const moveFile = useCallback((dragPath: string, targetPath: string, targetIsFile: boolean) => {
    const cleanDrag = dragPath.trim()
    if (!cleanDrag || isFolderPath(cleanDrag)) return
    const base = cleanDrag.split('/').pop() ?? cleanDrag
    const targetDir = targetIsFile ? folderOfPath(targetPath) : normalizePathInput(targetPath)
    const nextPath = targetDir ? `${targetDir}/${base}` : base
    if (nextPath === cleanDrag) return
    setPaths((prev) => {
      if (!prev.includes(cleanDrag)) return prev
      const without = prev.filter((p) => p !== cleanDrag)
      return without.includes(nextPath) ? without : [...without, nextPath]
    })
    setSelectedPath(nextPath)
  }, [])

  const toggleFolder = useCallback((folderPath: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderPath)) next.delete(folderPath)
      else next.add(folderPath)
      return next
    })
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = shellRef.current
    if (!el) return
    if (document.fullscreenElement === el) {
      void document.exitFullscreen()
      return
    }
    void el.requestFullscreen()
  }, [])

  const crumbs = useMemo(() => {
    const root = projectName
    const slug = block.data.slug ?? block.data.label
    const segs = selectedPath ? selectedPath.split('/').filter(Boolean) : []
    return { root, slug, segs }
  }, [projectName, block.data.slug, block.data.label, selectedPath])

  return (
    <PageRoot $theater={theaterMode}>
      <Shell ref={shellRef} $theater={theaterMode}>
        <TreeColumn>
          <TreeHeader>
            <span>Arquivos</span>
            <TreeHeaderActions>
              <TreeHeaderIconBtn type="button" onClick={createFile} title="Novo arquivo">
                <VscNewFile size={15} aria-hidden />
              </TreeHeaderIconBtn>
              <TreeHeaderIconBtn type="button" onClick={createFolder} title="Nova pasta">
                <VscNewFolder size={15} aria-hidden />
              </TreeHeaderIconBtn>
              <TreeHeaderIconBtn
                type="button"
                onClick={onToggleTheater}
                title={theaterMode ? 'Sair do modo teatro' : 'Ativar modo teatro'}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M4 7h16M7 4v3M17 4v3M4 17h16M7 20v-3M17 20v-3" />
                </svg>
              </TreeHeaderIconBtn>
              <TreeHeaderIconBtn
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              >
                {isFullscreen ? (
                  <FiMinimize2 size={15} aria-hidden />
                ) : (
                  <FiMaximize2 size={15} aria-hidden />
                )}
              </TreeHeaderIconBtn>
            </TreeHeaderActions>
          </TreeHeader>
          <TreeSearch
            placeholder="Ir para arquivo…"
            value={treeQuery}
            onChange={(e) => setTreeQuery(e.target.value)}
            aria-label="Filtrar árvore de arquivos"
          />
          <TreeScroll>
            {creatingParentPath === '' && creatingKind ? (
              <TreeRowBtn
                type="button"
                $depth={0}
                onClick={(ev) => ev.stopPropagation()}
                $active
              >
                <TreeFoldSpacer aria-hidden />
                {creatingKind === 'file' ? (
                  <FiFile size={12} aria-hidden style={{ opacity: 0.75, flexShrink: 0 }} />
                ) : (
                  <FiFolder size={12} aria-hidden style={{ opacity: 0.75, flexShrink: 0 }} />
                )}
                <TreeInlineInput
                  value={creatingDraft}
                  autoFocus
                  onClick={(ev) => ev.stopPropagation()}
                  onChange={(ev) => setCreatingDraft(ev.target.value)}
                  onBlur={commitCreate}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter') commitCreate()
                    if (ev.key === 'Escape') cancelCreate()
                  }}
                />
              </TreeRowBtn>
            ) : null}
            {filteredTree.length > 0 ? (
              <FileTree
                nodes={filteredTree}
                depth={0}
                selectedPath={selectedPath}
                onPick={onPick}
                onDelete={askRemove}
                onDropPath={moveFile}
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                creatingParentPath={creatingParentPath}
                creatingKind={creatingKind}
                creatingDraft={creatingDraft}
                onCreatingDraftChange={setCreatingDraft}
                onCommitCreate={commitCreate}
                onCancelCreate={cancelCreate}
                editingPath={editingPath}
                editingDraft={editingDraft}
                onStartRename={startRename}
                onRenameDraftChange={setEditingDraft}
                onCommitRename={commitRename}
                onCancelRename={cancelRename}
              />
            ) : (
              <p style={{ padding: '0.5rem 0.65rem', fontSize: '0.78rem', opacity: 0.75 }}>
                Nenhum arquivo corresponde ao filtro.
              </p>
            )}
          </TreeScroll>
        </TreeColumn>

        <MainColumn>
          <BreadcrumbBar aria-label="Caminho do arquivo">
            <CrumbLink to={`/projects/${projectId}`}>{crumbs.root}</CrumbLink>
            <CrumbSep>/</CrumbSep>
            <CrumbLink to={`/projects/${projectId}/subproject-files`}>{crumbs.slug}</CrumbLink>
            {crumbs.segs.map((seg, i) => {
              const isLast = i === crumbs.segs.length - 1
              return (
                <span key={`${seg}-${i}`} style={{ display: 'contents' }}>
                  <CrumbSep>/</CrumbSep>
                  <CrumbPart $active={isLast}>{seg}</CrumbPart>
                </span>
              )
            })}
          </BreadcrumbBar>
          <MetaBar>
            <span>
              <strong style={{ color: 'inherit' }}>Preview local</strong> ·{' '}
              {lineRows.length} linhas · {ARCHITECTURE_KIND_LABEL[block.data.kind]}
              {blockTechLabel ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.28rem',
                    marginLeft: '0.45rem',
                  }}
                >
                  {renderTechIcon(blockTech, 13)}
                  {blockTechLabel}
                </span>
              ) : null}
            </span>
          </MetaBar>
          <TabRow>
            <Tab $active>Código</Tab>
            <Tab>Blame</Tab>
          </TabRow>
          <CodeScroll>
            {flatFiles.length === 0 ? (
              <p
                style={{
                  padding: '1rem 0.85rem',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  opacity: 0.85,
                }}
              >
                Este bloco ainda não tem caminhos de exemplo. Edite-o no diagrama de arquitetura
                ou aguarde a geração pela CLI.
              </p>
            ) : (
              <CodeTable>
                <tbody>
                  {lineRows.map((line, i) => (
                    <tr key={i}>
                      <LineNo>{i + 1}</LineNo>
                      <LineCode>{line || ' '}</LineCode>
                    </tr>
                  ))}
                </tbody>
              </CodeTable>
            )}
          </CodeScroll>
        </MainColumn>

        <SymbolsColumn>
          <SymbolsHeader>Símbolos</SymbolsHeader>
          <SymbolsSearch
            placeholder="Filtrar símbolos…"
            value={symQuery}
            onChange={(e) => setSymQuery(e.target.value)}
            aria-label="Filtrar símbolos"
          />
          <SymbolsScroll>
            {filteredSymbols.map((s) => (
              <SymbolRow key={s} type="button">
                {s}
              </SymbolRow>
            ))}
          </SymbolsScroll>
        </SymbolsColumn>
      </Shell>
      {pendingDelete && !pendingDelete.file ? (
        <ModalBackdrop>
          <ConfirmModal>
            <ConfirmTitle>Remover pasta?</ConfirmTitle>
            <ConfirmText>
              Esta ação remove a pasta <strong>{pendingDelete.path}</strong> e todos os arquivos
              dentro dela.
            </ConfirmText>
            <ConfirmActions>
              <ToolbarBtn type="button" onClick={() => setPendingDelete(null)}>
                Cancelar
              </ToolbarBtn>
              <ToolbarBtn type="button" $danger onClick={confirmRemoveFolder}>
                Remover pasta
              </ToolbarBtn>
            </ConfirmActions>
          </ConfirmModal>
        </ModalBackdrop>
      ) : null}
    </PageRoot>
  )
}
