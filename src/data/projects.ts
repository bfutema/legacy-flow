import type { PrimaryDatabaseType } from './databaseEngines'
import type { ProjectCloudProvider } from './cloudProviders'
import {
  addDeletedSeedProjectId,
  loadDeletedSeedProjectIds,
} from '../persistence/deletedSeedProjectsStorage'
import { loadProjectMetadata, removeProjectMetadata } from '../persistence/projectMetadataStorage'
import {
  loadProjectTimeline,
  removeProjectTimeline,
} from '../persistence/projectTimelineStorage'
import { removeArchitectureFlow } from '../persistence/architectureFlowStorage'
import { removeModelingFlow } from '../persistence/modelingFlowStorage'
import {
  generateUserProjectId,
  loadUserProjects,
  removeUserProject,
  saveUserProjects,
  type NewProjectInput,
} from '../persistence/userProjectsStorage'
import { projectApfStorageKey } from '../persistence/projectApfStorage'
import { removeProjectEnvVars } from '../persistence/projectEnvVarsStorage'
import { workspaceFilesStorageKey } from '../persistence/workspaceFilesStorage'

/** Cor de marca do projeto (hex). Usada no header dos nós de tabela na modelagem. */
export const DEFAULT_PROJECT_PRIMARY_COLOR = '#3b82f6'

export type Project = {
  id: string
  name: string
  description: string
  updatedAt: string
  /** Banco SQL principal usado nas sugestões de tipo na modelagem */
  primaryDatabase: PrimaryDatabaseType
  /** Cor primária (hex #RRGGBB) — header das tabelas no diagrama */
  primaryColor: string
  /** Cloud principal do projeto (default para escolhas de infraestrutura). */
  primaryCloud?: ProjectCloudProvider
  /** Período opcional (YYYY-MM-DD) para exibição na Timeline quando não há barras */
  timelineStartDate?: string
  timelineEndDate?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Catálogo, pedidos e estoque integrados ao ERP.',
    updatedAt: '2026-04-08',
    primaryDatabase: 'mysql',
    primaryColor: '#c2410c',
    primaryCloud: 'aws',
  },
  {
    id: 'crm',
    name: 'CRM interno',
    description: 'Leads, contatos e pipeline comercial.',
    updatedAt: '2026-04-05',
    primaryDatabase: 'postgresql',
    primaryColor: '#8b5cf6',
    primaryCloud: 'gcp',
  },
  {
    id: 'faturamento',
    name: 'Faturamento',
    description: 'Notas fiscais, títulos e conciliação bancária.',
    updatedAt: '2026-03-28',
    primaryDatabase: 'mssql',
    primaryColor: '#059669',
    primaryCloud: 'azure',
  },
  {
    id: 'rh',
    name: 'Recursos humanos',
    description: 'Colaboradores, folha e benefícios.',
    updatedAt: '2026-03-20',
    primaryDatabase: 'postgresql',
    primaryColor: '#ea580c',
    primaryCloud: 'aws',
  },
  {
    id: 'logistica',
    name: 'Logística',
    description: 'Rotas, veículos e rastreamento de entregas.',
    updatedAt: '2026-04-01',
    primaryDatabase: 'mysql',
    primaryColor: '#0d9488',
    primaryCloud: 'gcp',
  },
  {
    id: 'bi',
    name: 'BI & relatórios',
    description: 'Data warehouse e dashboards executivos.',
    updatedAt: '2026-04-10',
    primaryDatabase: 'mssql',
    primaryColor: '#6366f1',
    primaryCloud: 'azure',
  },
]

/** Valida/normaliza hex #RRGGBB para uso no canvas (fallback seguro). */
export function normalizeProjectPrimaryColor(raw: string | undefined): string {
  const s = raw?.trim() ?? ''
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s
  return DEFAULT_PROJECT_PRIMARY_COLOR
}

function visibleSeedProjects(): Project[] {
  const hidden = loadDeletedSeedProjectIds()
  return PROJECTS.filter((p) => !hidden.has(p.id))
}

export function getProjectById(id: string): Project | undefined {
  const seed = visibleSeedProjects().find((p) => p.id === id)
  if (seed) return seed
  return loadUserProjects().find((p) => p.id === id)
}

/** Projetos seed + criados pelo usuário (localStorage). */
export function getAllProjects(): Project[] {
  return [...visibleSeedProjects(), ...loadUserProjects()]
}

const primaryDbStorageKey = (projectId: string) => `flow-primary-db:${projectId}`
const primaryColorStorageKey = (projectId: string) =>
  `flow-project-primary-color:${projectId}`
const projectMonorepoStorageKey = (projectId: string) =>
  `flow-project-monorepo:${projectId}`
const subprojectFilesKeyPrefix = (projectId: string) =>
  `flow-subproject-files:v1:${projectId}:`

function purgeProjectLocalPersistence(projectId: string): void {
  removeProjectMetadata(projectId)
  removeProjectTimeline(projectId)
  removeModelingFlow(projectId)
  removeArchitectureFlow(projectId)
  try {
    localStorage.removeItem(primaryDbStorageKey(projectId))
    localStorage.removeItem(primaryColorStorageKey(projectId))
    localStorage.removeItem(projectMonorepoStorageKey(projectId))
    localStorage.removeItem(workspaceFilesStorageKey(projectId))
    localStorage.removeItem(projectApfStorageKey(projectId))
    removeProjectEnvVars(projectId)
    const subPrefix = subprojectFilesKeyPrefix(projectId)
    for (let i = localStorage.length - 1; i >= 0; i -= 1) {
      const k = localStorage.key(i)
      if (k?.startsWith(subPrefix)) localStorage.removeItem(k)
    }
  } catch (err) {
    console.warn('[projeto] Não foi possível limpar chaves locais:', err)
  }
}

/** Remove projeto do app: lista do usuário ou demo oculta; apaga diagrama e metadados locais. */
export function deleteProject(id: string): void {
  purgeProjectLocalPersistence(id)
  if (removeUserProject(id)) return
  if (PROJECTS.some((p) => p.id === id)) {
    addDeletedSeedProjectId(id)
  }
  window.dispatchEvent(new Event('flow-user-projects-changed'))
}

export function createUserProject(input: NewProjectInput): Project {
  const id = generateUserProjectId()
  const project: Project = {
    id,
    name: input.name.trim(),
    description: input.description.trim(),
    updatedAt: new Date().toISOString(),
    primaryDatabase: input.primaryDatabase,
    primaryColor: normalizeProjectPrimaryColor(input.primaryColor),
    primaryCloud: 'aws',
    ...(input.timelineStartDate && input.timelineEndDate
      ? {
          timelineStartDate: input.timelineStartDate,
          timelineEndDate: input.timelineEndDate,
        }
      : {}),
  }
  const list = loadUserProjects()
  list.push(project)
  saveUserProjects(list)
  return project
}

/** Projeto para exibição (nome, descrição, timeline e data mesclados com localStorage, se houver). */
export function resolveProjectById(id: string): Project | undefined {
  const base = getProjectById(id)
  if (!base) return undefined
  const stored = loadProjectMetadata(id)
  const tl = loadProjectTimeline(id)

  let merged: Project = { ...base }
  if (stored) {
    merged = {
      ...merged,
      name: stored.name,
      description: stored.description,
      updatedAt: stored.updatedAt,
    }
  }
  if (tl && 'cleared' in tl) {
    merged = {
      ...merged,
      timelineStartDate: undefined,
      timelineEndDate: undefined,
    }
  } else if (tl && 'start' in tl && 'end' in tl) {
    merged = {
      ...merged,
      timelineStartDate: tl.start,
      timelineEndDate: tl.end,
    }
  }
  return merged
}
