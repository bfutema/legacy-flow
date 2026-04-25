import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getUserById } from '../../data/directoryUsers'
import { resolveProjectById } from '../../data/projects'
import { findArchitectureBlock } from '../../pages/subprojectFiles/architectureBlocksLoader'
import { CrumbLink, Current, Nav, Sep } from './Breadcrumbs.styles'

type CrumbItem = { label: string; path?: string }

const ROUTE_TREE: Record<string, CrumbItem[]> = {
  '/': [{ label: 'Dashboard' }],
  /** Cada seção começa pelo próprio nome; o caminho vai “adentrando” nas sub-rotas. */
  '/reports': [{ label: 'Relatórios' }],
  '/projects': [{ label: 'Projetos' }],
  '/users': [{ label: 'Usuários' }],
  '/allocations': [{ label: 'Timeline' }],
  '/tasks': [{ label: 'Tarefas' }],
  '/organogram': [{ label: 'Organograma' }],
  '/access-control': [{ label: 'Controle de acesso' }],
}

function usersNewCrumbs(): CrumbItem[] {
  return [
    { label: 'Usuários', path: '/users' },
    { label: 'Novo usuário' },
  ]
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

  if (normalized === '/users/new') {
    return usersNewCrumbs()
  }

  const userEdit = normalized.match(/^\/users\/([^/]+)\/edit$/)
  if (userEdit) {
    const id = userEdit[1]
    const u = getUserById(id)
    return [
      { label: 'Usuários', path: '/users' },
      { label: u?.name ?? 'Usuário', path: `/users/${id}` },
      { label: 'Editar' },
    ]
  }

  const userProfile = normalized.match(/^\/users\/([^/]+)$/)
  if (userProfile) {
    const id = userProfile[1]
    const u = getUserById(id)
    return [
      { label: 'Usuários', path: '/users' },
      { label: u?.name ?? 'Perfil' },
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

  const projArchitecture = normalized.match(/^\/projects\/([^/]+)\/architecture$/)
  if (projArchitecture) {
    const p = resolveProjectById(projArchitecture[1])
    return [
      { label: 'Projetos', path: '/projects' },
      { label: p?.name ?? 'Projeto', path: `/projects/${projArchitecture[1]}` },
      { label: 'Arquitetura' },
    ]
  }

  const projSubFilesView = normalized.match(
    /^\/projects\/([^/]+)\/subproject-files\/([^/]+)$/,
  )
  if (projSubFilesView) {
    const p = resolveProjectById(projSubFilesView[1])
    const block = findArchitectureBlock(projSubFilesView[1], projSubFilesView[2])
    const sublabel = block?.data.label ?? 'Subprojeto'
    return [
      { label: 'Projetos', path: '/projects' },
      { label: p?.name ?? 'Projeto', path: `/projects/${projSubFilesView[1]}` },
      {
        label: 'Arquivos dos subprojetos',
        path: `/projects/${projSubFilesView[1]}/subproject-files`,
      },
      { label: sublabel },
    ]
  }

  const projSubFilesHub = normalized.match(/^\/projects\/([^/]+)\/subproject-files$/)
  if (projSubFilesHub) {
    const p = resolveProjectById(projSubFilesHub[1])
    return [
      { label: 'Projetos', path: '/projects' },
      { label: p?.name ?? 'Projeto', path: `/projects/${projSubFilesHub[1]}` },
      { label: 'Arquivos dos subprojetos' },
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
  const [refreshTick, setRefreshTick] = useState(0)
  useEffect(() => {
    const bump = () => setRefreshTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', bump)
    window.addEventListener('flow-app-users-changed', bump)
    window.addEventListener('flow-architecture-changed', bump)
    return () => {
      window.removeEventListener('flow-project-meta-changed', bump)
      window.removeEventListener('flow-app-users-changed', bump)
      window.removeEventListener('flow-architecture-changed', bump)
    }
  }, [])
  const items = useMemo(
    () => crumbsForPath(pathname),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refreshTick para metadados e diagrama
    [pathname, refreshTick],
  )

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
