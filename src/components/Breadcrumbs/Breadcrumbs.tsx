import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { resolveProjectById } from '../../data/projects'
import { CrumbLink, Current, Nav, Sep } from './Breadcrumbs.styles'

type CrumbItem = { label: string; path?: string }

const ROUTE_TREE: Record<string, CrumbItem[]> = {
  '/': [{ label: 'Dashboard' }],
  /** Cada seção começa pelo próprio nome; o caminho vai “adentrando” nas sub-rotas. */
  '/reports': [{ label: 'Relatórios' }],
  '/projects': [{ label: 'Projetos' }],
}

function crumbsForPath(pathname: string): CrumbItem[] {
  const normalized = pathname.replace(/\/$/, '') || '/'
  const direct = ROUTE_TREE[normalized]
  if (direct) return direct

  if (normalized === '/projects/new') {
    return [
      { label: 'Projetos', path: '/projects' },
      { label: 'Novo projeto' },
    ]
  }

  const projDetail = normalized.match(/^\/projects\/([^/]+)$/)
  if (projDetail) {
    const p = resolveProjectById(projDetail[1])
    return [
      { label: 'Projetos', path: '/projects' },
      { label: p?.name ?? 'Projeto' },
    ]
  }

  const projModel = normalized.match(/^\/projects\/([^/]+)\/modeling$/)
  if (projModel) {
    const p = resolveProjectById(projModel[1])
    return [
      { label: 'Projetos', path: '/projects' },
      { label: p?.name ?? 'Projeto', path: `/projects/${projModel[1]}` },
      { label: 'Modelagem' },
    ]
  }

  const fallback: CrumbItem[] = [{ label: 'Dashboard', path: '/' }]
  const tail = normalized.replace(/^\//, '')
  if (tail && tail !== '') {
    fallback.push({
      label: tail.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    })
  }
  return fallback
}

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const [, setMetaTick] = useState(0)
  useEffect(() => {
    const onMeta = () => setMetaTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', onMeta)
    return () => window.removeEventListener('flow-project-meta-changed', onMeta)
  }, [])
  const items = crumbsForPath(pathname)

  return (
    <Nav aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        const showSep = i > 0

        return (
          <span key={`${item.label}-${i}`} style={{ display: 'contents' }}>
            {showSep ? <Sep aria-hidden>/</Sep> : null}
            {isLast || !item.path ? (
              <Current aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </Current>
            ) : (
              <CrumbLink to={item.path}>{item.label}</CrumbLink>
            )}
          </span>
        )
      })}
    </Nav>
  )
}
