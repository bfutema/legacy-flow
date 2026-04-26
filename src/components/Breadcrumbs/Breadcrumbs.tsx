import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getUserById } from '../../data/directoryUsers'
import { resolveProjectById } from '../../data/projects'
import { isProjectMonorepo } from '../../hooks/useProjectMonorepo'
import { findArchitectureBlock } from '../../pages/subprojectFiles/architectureBlocksLoader'
import {
  CrumbLink,
  Current,
  CurrentMenuButton,
  CurrentMenuItem,
  CurrentMenuPopup,
  CurrentMenuWrap,
  Nav,
  Sep,
} from './Breadcrumbs.styles'

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

  const projWorkspaceFiles = normalized.match(/^\/projects\/([^/]+)\/workspace-files$/)
  if (projWorkspaceFiles) {
    const p = resolveProjectById(projWorkspaceFiles[1])
    return [
      { label: 'Projetos', path: '/projects' },
      { label: p?.name ?? 'Projeto', path: `/projects/${projWorkspaceFiles[1]}` },
      { label: 'Explorador de arquivos' },
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

function siblingPagesForPath(pathname: string): CrumbItem[] | null {
  const normalized = pathname.replace(/\/$/, '') || '/'
  const model = normalized.match(/^\/projects\/([^/]+)\/modeling$/)
  const arch = normalized.match(/^\/projects\/([^/]+)\/architecture$/)
  const filesHub = normalized.match(/^\/projects\/([^/]+)\/subproject-files$/)
  const workspace = normalized.match(/^\/projects\/([^/]+)\/workspace-files$/)

  const projectId = model?.[1] ?? arch?.[1] ?? filesHub?.[1] ?? workspace?.[1]
  if (!projectId) return null

  const filesEntry = isProjectMonorepo(projectId)
    ? {
        label: 'Explorador de arquivos',
        path: `/projects/${projectId}/workspace-files`,
      }
    : {
        label: 'Arquivos dos subprojetos',
        path: `/projects/${projectId}/subproject-files`,
      }

  return [
    { label: 'Modelagem', path: `/projects/${projectId}/modeling` },
    { label: 'Arquitetura', path: `/projects/${projectId}/architecture` },
    filesEntry,
  ]
}

export function Breadcrumbs() {
  const { pathname } = useLocation()
  const [refreshTick, setRefreshTick] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLSpanElement>(null)
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
  const siblingPages = useMemo(
    () => siblingPagesForPath(pathname),
    [pathname, refreshTick],
  )

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onDown = (ev: MouseEvent) => {
      const target = ev.target as Node | null
      if (!target || !menuRef.current) return
      if (!menuRef.current.contains(target)) setMenuOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  return (
    <Nav aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        const showSep = i > 0

        return (
          <span key={`${item.label}-${i}`} style={{ display: 'contents' }}>
            {showSep ? <Sep aria-hidden>/</Sep> : null}
            {isLast || !item.path ? (
              isLast && siblingPages ? (
                <CurrentMenuWrap ref={menuRef}>
                  <CurrentMenuButton
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((v) => !v)}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </CurrentMenuButton>
                  {menuOpen ? (
                    <CurrentMenuPopup role="menu">
                      {siblingPages.map((p) => (
                        <CurrentMenuItem
                          key={p.path}
                          to={p.path ?? '#'}
                          $active={p.path === pathname}
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                        >
                          {p.label}
                        </CurrentMenuItem>
                      ))}
                    </CurrentMenuPopup>
                  ) : null}
                </CurrentMenuWrap>
              ) : (
                <Current aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </Current>
              )
            ) : (
              <CrumbLink to={item.path}>{item.label}</CrumbLink>
            )}
          </span>
        )
      })}
    </Nav>
  )
}
