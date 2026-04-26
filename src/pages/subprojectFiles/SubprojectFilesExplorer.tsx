import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
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
import { useThemeMode } from '../../contexts/ThemeContext'
import { useProjectCloud } from '../../hooks/useProjectCloud'
import { useProjectPrimaryDatabase } from '../../hooks/useProjectPrimaryDatabase'
import { mockContentForPath } from './mockFileContent'
import { pathsToTree, type PathTreeNode } from './pathTree'
import {
  BreadcrumbSpacer,
  BreadcrumbBar,
  CodeScroll,
  ConfirmActions,
  ConfirmModal,
  ConfirmText,
  ConfirmTitle,
  EditorThemeSelect,
  EditorHost,
  CrumbLink,
  CrumbPart,
  CrumbSep,
  MainColumn,
  MetaBar,
  ModalBackdrop,
  PageRoot,
  Shell,
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
const MONACO_EDITOR_THEME_STORAGE_KEY = `flow-monaco-editor-theme:${EXPLORER_STORAGE_VERSION}`
const DRACULA_DARK_THEME = 'flow-dracula-dark'
const FLOW_DARK_THEME = 'flow-app-dark'
const FLOW_LIGHT_THEME = 'flow-app-light'
type ExplorerEditorTheme = 'dracula' | 'flow'

type ExplorerLocalState = {
  paths: string[]
  fileContents?: Record<string, string>
  lastOpenedFilePath?: string
  selectedPath?: string
  selectedIsFile?: boolean
  treeQuery?: string
  expandedFolders?: string[]
}

function loadGlobalMonacoEditorTheme(): ExplorerEditorTheme {
  try {
    const raw = localStorage.getItem(MONACO_EDITOR_THEME_STORAGE_KEY)
    if (raw === 'dracula' || raw === 'flow') return raw
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (parsed === 'dracula' || parsed === 'flow') return parsed
    }
  } catch {
    /* ignore */
  }
  return 'flow'
}

function saveGlobalMonacoEditorTheme(theme: ExplorerEditorTheme): void {
  try {
    localStorage.setItem(MONACO_EDITOR_THEME_STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
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

function inferLanguageFromPath(path: string): string {
  const name = path.toLowerCase()
  if (name.endsWith('.tsx')) return 'typescript'
  if (name.endsWith('.ts')) return 'typescript'
  if (name.endsWith('.jsx')) return 'javascript'
  if (name.endsWith('.js') || name.endsWith('.mjs') || name.endsWith('.cjs')) return 'javascript'
  if (name.endsWith('.json')) return 'json'
  if (name.endsWith('.css')) return 'css'
  if (name.endsWith('.html')) return 'html'
  if (name.endsWith('.md')) return 'markdown'
  if (name.endsWith('.sql')) return 'sql'
  if (name.endsWith('.sh')) return 'shell'
  if (name.endsWith('.yml') || name.endsWith('.yaml')) return 'yaml'
  return 'plaintext'
}

function defineMonacoThemes(monaco: Parameters<NonNullable<React.ComponentProps<typeof Editor>['beforeMount']>>[0]) {
  monaco.editor.defineTheme(DRACULA_DARK_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6272A4' },
      { token: 'keyword', foreground: 'FF79C6' },
      { token: 'string', foreground: 'F1FA8C' },
      { token: 'number', foreground: 'BD93F9' },
      { token: 'type.identifier', foreground: '8BE9FD' },
      { token: 'identifier', foreground: 'F8F8F2' },
      { token: 'delimiter', foreground: 'F8F8F2' },
    ],
    colors: {
      'editor.background': '#282A36',
      'editor.foreground': '#F8F8F2',
      'editorLineNumber.foreground': '#6272A4',
      'editorLineNumber.activeForeground': '#F8F8F2',
      'editorCursor.foreground': '#FF79C6',
      'editor.selectionBackground': '#44475A',
      'editor.inactiveSelectionBackground': '#3A3E55',
      'editor.lineHighlightBackground': '#2E3140',
      'editorIndentGuide.background1': '#3B3E4F',
      'editorIndentGuide.activeBackground1': '#6272A4',
    },
  })

  monaco.editor.defineTheme(FLOW_DARK_THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '64748B' },
      { token: 'keyword', foreground: 'A78BFA' },
      { token: 'string', foreground: '34D399' },
      { token: 'number', foreground: '38BDF8' },
      { token: 'type.identifier', foreground: 'F9A8D4' },
      { token: 'identifier', foreground: 'E2E8F0' },
      { token: 'delimiter', foreground: 'CBD5E1' },
    ],
    colors: {
      'editor.background': '#0B1220',
      'editor.foreground': '#E2E8F0',
      'editorLineNumber.foreground': '#64748B',
      'editorLineNumber.activeForeground': '#A78BFA',
      'editorCursor.foreground': '#A78BFA',
      'editor.selectionBackground': '#1E293B',
      'editor.inactiveSelectionBackground': '#172033',
      'editor.lineHighlightBackground': '#0F172A',
      'editorIndentGuide.background1': '#1E293B',
      'editorIndentGuide.activeBackground1': '#475569',
    },
  })

  monaco.editor.defineTheme(FLOW_LIGHT_THEME, {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '64748B' },
      { token: 'keyword', foreground: '7C3AED' },
      { token: 'string', foreground: '059669' },
      { token: 'number', foreground: '0284C7' },
      { token: 'type.identifier', foreground: 'DB2777' },
      { token: 'identifier', foreground: '0F172A' },
      { token: 'delimiter', foreground: '334155' },
    ],
    colors: {
      'editor.background': '#F8FAFC',
      'editor.foreground': '#0F172A',
      'editorLineNumber.foreground': '#94A3B8',
      'editorLineNumber.activeForeground': '#7C3AED',
      'editorCursor.foreground': '#7C3AED',
      'editor.selectionBackground': '#E2E8F0',
      'editor.inactiveSelectionBackground': '#EEF2F7',
      'editor.lineHighlightBackground': '#F1F5F9',
      'editorIndentGuide.background1': '#E2E8F0',
      'editorIndentGuide.activeBackground1': '#CBD5E1',
    },
  })
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
  const { mode } = useThemeMode()
  const shellRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { projectCloud } = useProjectCloud(projectId)
  const { primaryDatabase } = useProjectPrimaryDatabase(projectId)
  const [paths, setPaths] = useState<string[]>([])
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [lastOpenedFilePath, setLastOpenedFilePath] = useState('')
  const [editorTheme, setEditorTheme] = useState<ExplorerEditorTheme>(loadGlobalMonacoEditorTheme)
  const [treeQuery, setTreeQuery] = useState('')
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
          setFileContents(parsed.fileContents ?? {})
          setLastOpenedFilePath(parsed.lastOpenedFilePath ?? '')
          setSelectedPath(parsed.selectedPath ?? '')
          setSelectedIsFile(parsed.selectedIsFile ?? true)
          setTreeQuery(parsed.treeQuery ?? '')
          setExpandedFolders(new Set(parsed.expandedFolders ?? []))
          setStorageReady(true)
          return
        }
      } catch {
        // fallback para seed inicial abaixo
      }
    }
    setPaths(block.data.generatedPaths ?? [])
    setFileContents({})
    setLastOpenedFilePath('')
    setSelectedPath('')
    setSelectedIsFile(true)
    setTreeQuery('')
    setExpandedFolders(new Set())
    setStorageReady(true)
  }, [block.data.generatedPaths, block.nodeId, projectId])

  useEffect(() => {
    if (!storageReady) return
    const payload: ExplorerLocalState = {
      paths,
      fileContents,
      lastOpenedFilePath,
      selectedPath,
      selectedIsFile,
      treeQuery,
      expandedFolders: [...expandedFolders],
    }
    localStorage.setItem(storageKey(projectId, block.nodeId), JSON.stringify(payload))
  }, [
    paths,
    fileContents,
    lastOpenedFilePath,
    projectId,
    block.nodeId,
    selectedPath,
    selectedIsFile,
    treeQuery,
    expandedFolders,
    storageReady,
  ])

  useEffect(() => {
    saveGlobalMonacoEditorTheme(editorTheme)
  }, [editorTheme])

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
    if (!selectedPath && lastOpenedFilePath && flatFiles.includes(lastOpenedFilePath)) {
      setSelectedPath(lastOpenedFilePath)
      setSelectedIsFile(true)
      return
    }
    if (!selectedPath || !flatFiles.includes(selectedPath)) {
      if (selectedIsFile) {
        setSelectedPath(flatFiles[0] ?? '')
      }
    }
  }, [flatFiles, lastOpenedFilePath, selectedPath, selectedIsFile])
  const selectedFilePath = useMemo(
    () => (selectedPath && flatFiles.includes(selectedPath) ? selectedPath : ''),
    [flatFiles, selectedPath],
  )
  const selectedLanguage = useMemo(
    () => inferLanguageFromPath(selectedFilePath),
    [selectedFilePath],
  )
  const monacoThemeName = useMemo(
    () => {
      if (editorTheme === 'flow') {
        return mode === 'light' ? FLOW_LIGHT_THEME : FLOW_DARK_THEME
      }
      return DRACULA_DARK_THEME
    },
    [editorTheme, mode],
  )
  const content = useMemo(
    () => {
      if (!selectedFilePath) return '// Selecione um arquivo'
      return fileContents[selectedFilePath] ?? mockContentForPath(selectedFilePath)
    },
    [fileContents, selectedFilePath],
  )

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
    if (file) setLastOpenedFilePath(path)
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
      setFileContents((prev) =>
        prev[next] ? prev : { ...prev, [next]: mockContentForPath(next) },
      )
      setSelectedPath(next)
      setSelectedIsFile(true)
      setLastOpenedFilePath(next)
    }
    cancelCreate()
  }, [cancelCreate, creatingDraft, creatingKind, creatingParentPath])

  const askRemove = useCallback((path: string, file: boolean) => {
    if (file) {
      setPaths((prev) => prev.filter((p) => p !== path))
      setFileContents((prev) => {
        const next = { ...prev }
        delete next[path]
        return next
      })
      setLastOpenedFilePath((prev) => (prev === path ? '' : prev))
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
    setFileContents((prev) => {
      if (oldPath === nextPath) return prev
      if (isDir) {
        const fromPrefix = asFolder(oldPath)
        const toPrefix = asFolder(baseTarget)
        const mapped: Record<string, string> = {}
        for (const [k, v] of Object.entries(prev)) {
          if (k.startsWith(fromPrefix)) mapped[`${toPrefix}${k.slice(fromPrefix.length)}`] = v
          else mapped[k] = v
        }
        return mapped
      }
      const copy = { ...prev }
      if (copy[oldPath]) {
        copy[nextPath] = copy[oldPath]
        delete copy[oldPath]
      }
      return copy
    })

    if (selectedPath === oldPath) {
      setSelectedPath(nextPath)
    } else if (isDir && selectedPath.startsWith(asFolder(oldPath))) {
      const fromPrefix = asFolder(oldPath)
      const toPrefix = asFolder(baseTarget)
      setSelectedPath(`${toPrefix}${selectedPath.slice(fromPrefix.length)}`)
    }
    setLastOpenedFilePath((prev) => {
      if (!prev) return prev
      if (prev === oldPath) return nextPath
      if (isDir && prev.startsWith(asFolder(oldPath))) {
        const fromPrefix = asFolder(oldPath)
        const toPrefix = asFolder(baseTarget)
        return `${toPrefix}${prev.slice(fromPrefix.length)}`
      }
      return prev
    })
    cancelRename()
  }, [cancelRename, editingDraft, editingPath, selectedPath])

  const confirmRemoveFolder = useCallback(() => {
    if (!pendingDelete || pendingDelete.file) return
    const folder = asFolder(pendingDelete.path)
    setPaths((prev) => prev.filter((p) => p !== folder && !p.startsWith(folder)))
    setFileContents((prev) => {
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(prev)) {
        if (!k.startsWith(folder)) next[k] = v
      }
      return next
    })
    setLastOpenedFilePath((prev) =>
      prev && (prev === folder || prev.startsWith(folder)) ? '' : prev,
    )
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
    setFileContents((prev) => {
      if (!prev[cleanDrag]) return prev
      const copy = { ...prev }
      copy[nextPath] = copy[cleanDrag]
      delete copy[cleanDrag]
      return copy
    })
    setSelectedPath(nextPath)
    setLastOpenedFilePath((prev) => (prev === cleanDrag ? nextPath : prev))
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
            <BreadcrumbSpacer />
            <EditorThemeSelect
              aria-label="Tema do editor"
              title="Tema do editor Monaco"
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value as ExplorerEditorTheme)}
            >
              <option value="dracula">Tema: Dracula</option>
              <option value="flow">Tema: Flow</option>
            </EditorThemeSelect>
          </BreadcrumbBar>
          <MetaBar>
            <span>
              <strong style={{ color: 'inherit' }}>Preview local</strong> ·{' '}
              {content.split('\n').length} linhas · {ARCHITECTURE_KIND_LABEL[block.data.kind]}
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
            {selectedFilePath ? (
              <EditorHost>
                <Editor
                  path={selectedFilePath}
                  language={selectedLanguage}
                  beforeMount={defineMonacoThemes}
                  theme={monacoThemeName}
                  value={content}
                  onChange={(value) =>
                    setFileContents((prev) => ({
                      ...prev,
                      [selectedFilePath]: value ?? '',
                    }))
                  }
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbersMinChars: 3,
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    wordWrap: 'off',
                  }}
                />
              </EditorHost>
            ) : flatFiles.length === 0 ? (
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
              <p
                style={{
                  padding: '1rem 0.85rem',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  opacity: 0.85,
                }}
              >
                Selecione um arquivo na árvore para visualizar e editar o conteúdo.
              </p>
            )}
          </CodeScroll>
        </MainColumn>

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
