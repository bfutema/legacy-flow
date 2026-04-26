export type PathTreeNode = {
  name: string
  fullPath: string
  children: PathTreeNode[]
  file: boolean
}

type MutableNode = {
  name: string
  fullPath: string
  children: Map<string, MutableNode>
  file: boolean
}

function toPublic(node: MutableNode): PathTreeNode {
  const children = [...node.children.values()].map(toPublic)
  children.sort((a, b) => {
    if (a.file !== b.file) return a.file ? 1 : -1
    return a.name.localeCompare(b.name)
  })
  return {
    name: node.name,
    fullPath: node.fullPath,
    children,
    file: node.file,
  }
}

/** Monta árvore a partir de caminhos tipo `apps/admin/src/main.tsx`. */
export function pathsToTree(paths: string[]): PathTreeNode[] {
  const root = new Map<string, MutableNode>()

  for (const raw of paths) {
    const t = raw.trim()
    if (!t || t.startsWith('…')) continue
    const explicitDir = t.endsWith('/')
    const clean = explicitDir ? t.slice(0, -1) : t
    const parts = clean.split('/').filter(Boolean)
    if (parts.length === 0) continue

    let level = root
    let prefix = ''
    for (let i = 0; i < parts.length; i++) {
      const name = parts[i]
      const isLast = i === parts.length - 1
      const fullPath = prefix ? `${prefix}/${name}` : name
      let node = level.get(name)
      if (!node) {
        node = {
          name,
          fullPath,
          children: new Map(),
          file: false,
        }
        level.set(name, node)
      }
      if (isLast && !explicitDir) {
        node.file = true
        node.fullPath = clean
      }
      if (isLast && explicitDir) {
        node.file = false
        node.fullPath = `${clean}/`
      }
      prefix = fullPath
      level = node.children
    }
  }

  const top = [...root.values()].map(toPublic)
  top.sort((a, b) => {
    if (a.file !== b.file) return a.file ? 1 : -1
    return a.name.localeCompare(b.name)
  })
  return top
}
