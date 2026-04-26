import type { ArchitectureBlockKind } from '../../components/ProjectArchitectureCanvas/architectureTypes'
import type { ArchitectureBlockSummary } from './architectureBlocksLoader'

export type MonorepoRole = 'app' | 'package'

export function defaultMonorepoRoleForKind(kind: ArchitectureBlockKind): MonorepoRole {
  if (kind === 'queue' || kind === 'external') return 'package'
  return 'app'
}

function slugFromBlock(data: ArchitectureBlockSummary['data']): string {
  const s = data.slug?.trim()
  if (s) return s
  return data.label
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'block'
}

function isPlaceholderPath(p: string): boolean {
  return p.includes('…') || p.includes('em breve') || p.trim().startsWith('…')
}

function monorepoRootForBlock(data: ArchitectureBlockSummary['data']): string {
  const slug = slugFromBlock(data)
  const role = data.monorepoRole ?? defaultMonorepoRoleForKind(data.kind)
  return role === 'package' ? `packages/${slug}` : `apps/${slug}`
}

/** Prefixo `apps/slug/` ou `packages/slug/` para foco na URL (sempre com barra final). */
export function workspaceFolderPrefixForNode(
  block: ArchitectureBlockSummary | undefined,
): string {
  if (!block) return ''
  return `${monorepoRootForBlock(block.data)}/`
}

/**
 * Caminhos iniciais do workspace monorepo: um root por bloco (exc. fila vazia).
 * Paths relativos ao pacote são colocados sob apps/&lt;slug&gt;/ ou packages/&lt;slug&gt;/.
 * Se o path já começa com apps/ ou packages/, mantém como está (dados legados).
 */
export function buildWorkspaceSeedPaths(blocks: ArchitectureBlockSummary[]): string[] {
  const out: string[] = []
  for (const b of blocks) {
    if (b.data.kind === 'database') continue
    if (b.data.kind === 'queue') {
      const paths = b.data.generatedPaths?.filter((p) => !isPlaceholderPath(p)) ?? []
      if (paths.length === 0) continue
    }
    const root = monorepoRootForBlock(b.data)
    const raw = b.data.generatedPaths?.filter((p) => !isPlaceholderPath(p)) ?? []
    if (raw.length === 0) {
      out.push(`${root}/`)
      continue
    }
    for (const p of raw) {
      const norm = p.trim().replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\/+/, '')
      if (!norm) continue
      if (norm.startsWith('apps/') || norm.startsWith('packages/')) {
        out.push(norm)
      } else {
        out.push(`${root}/${norm}`)
      }
    }
  }
  return [...new Set(out)]
}
