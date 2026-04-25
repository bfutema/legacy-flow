import { memo, useCallback, useMemo, useState } from 'react'
import { FiFile, FiFolder } from 'react-icons/fi'
import { ARCHITECTURE_KIND_LABEL } from '../../components/ProjectArchitectureCanvas/architectureKindMeta'
import type { ArchitectureBlockSummary } from './architectureBlocksLoader'
import { mockContentForPath } from './mockFileContent'
import { pathsToTree, type PathTreeNode } from './pathTree'
import { extractSymbolsFromContent } from './extractSymbols'
import {
  BreadcrumbBar,
  CodeScroll,
  CodeTable,
  CrumbLink,
  CrumbPart,
  CrumbSep,
  LineCode,
  LineNo,
  MainColumn,
  MetaBar,
  PageRoot,
  Shell,
  SymbolRow,
  SymbolsColumn,
  SymbolsHeader,
  SymbolsScroll,
  SymbolsSearch,
  Tab,
  TabRow,
  TreeColumn,
  TreeHeader,
  TreeRowBtn,
  TreeScroll,
  TreeSearch,
} from './SubprojectFilesLayout.styles'

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
}: {
  nodes: PathTreeNode[]
  depth: number
  selectedPath: string
  onPick: (path: string, file: boolean) => void
}) {
  return (
    <>
      {nodes.map((n) => (
        <div key={n.fullPath}>
          <TreeRowBtn
            type="button"
            $depth={depth}
            $active={selectedPath === n.fullPath}
            onClick={() => onPick(n.fullPath, n.file)}
          >
            {n.file ? (
              <FiFile size={12} aria-hidden style={{ opacity: 0.75, flexShrink: 0 }} />
            ) : (
              <FiFolder size={12} aria-hidden style={{ opacity: 0.75, flexShrink: 0 }} />
            )}
            {n.name}
          </TreeRowBtn>
          {n.children.length > 0 ? (
            <FileTree
              nodes={n.children}
              depth={depth + 1}
              selectedPath={selectedPath}
              onPick={onPick}
            />
          ) : null}
        </div>
      ))}
    </>
  )
})

type Props = {
  projectId: string
  projectName: string
  block: ArchitectureBlockSummary
}

export function SubprojectFilesExplorer({ projectId, projectName, block }: Props) {
  const paths = useMemo(
    () => block.data.generatedPaths ?? [],
    [block.data.generatedPaths],
  )
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

  const [treeQuery, setTreeQuery] = useState('')
  const [symQuery, setSymQuery] = useState('')
  const filteredTree = useMemo(
    () => filterTree(tree, treeQuery),
    [tree, treeQuery],
  )

  const [selectedPath, setSelectedPath] = useState(() => flatFiles[0] ?? '')
  const content = useMemo(
    () => (selectedPath ? mockContentForPath(selectedPath) : '// Sem arquivos de exemplo'),
    [selectedPath],
  )
  const symbols = useMemo(() => extractSymbolsFromContent(content), [content])
  const filteredSymbols = useMemo(() => {
    const q = symQuery.trim().toLowerCase()
    if (!q) return symbols
    return symbols.filter((s) => s.toLowerCase().includes(q))
  }, [symbols, symQuery])

  const lineRows = useMemo(() => content.split('\n'), [content])

  const onPick = useCallback((path: string, file: boolean) => {
    if (file) setSelectedPath(path)
  }, [])

  const crumbs = useMemo(() => {
    const root = projectName
    const slug = block.data.slug ?? block.data.label
    const segs = selectedPath ? selectedPath.split('/').filter(Boolean) : []
    return { root, slug, segs }
  }, [projectName, block.data.slug, block.data.label, selectedPath])

  return (
    <PageRoot>
      <Shell>
        <TreeColumn>
          <TreeHeader>Arquivos</TreeHeader>
          <TreeSearch
            placeholder="Ir para arquivo…"
            value={treeQuery}
            onChange={(e) => setTreeQuery(e.target.value)}
            aria-label="Filtrar árvore de arquivos"
          />
          <TreeScroll>
            {filteredTree.length > 0 ? (
              <FileTree
                nodes={filteredTree}
                depth={0}
                selectedPath={selectedPath}
                onPick={onPick}
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
    </PageRoot>
  )
}
