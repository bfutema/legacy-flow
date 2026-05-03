import type { AppRawRule } from './types'
import type { RoleSlug } from './types'

/** Administrador: bypass explícito em createAbility (sempre manage all). */
export const ADMIN_MANAGE_ALL: AppRawRule[] = [{ action: 'manage', subject: 'all' }]

const EDITOR_DEFAULT: AppRawRule[] = [
  { action: 'read', subject: 'Dashboard' },
  { action: 'read', subject: 'Project' },
  { action: 'create', subject: 'Project' },
  { action: 'update', subject: 'Project' },
  { action: 'read', subject: 'User' },
  { action: 'read', subject: 'Report' },
  { action: 'read', subject: 'Timeline' },
  { action: 'create', subject: 'Timeline' },
  { action: 'delete', subject: 'Timeline' },
  { action: 'update', subject: 'Timeline' },
  { action: 'read', subject: 'TaskBoard' },
  { action: 'create', subject: 'TaskBoard' },
  { action: 'update', subject: 'TaskBoard' },
  { action: 'read', subject: 'Organogram' },
  { action: 'read', subject: 'JsonViewer' },
  { action: 'read', subject: 'FlowDesign' },
]

const VIEWER_DEFAULT: AppRawRule[] = [
  { action: 'read', subject: 'Dashboard' },
  { action: 'read', subject: 'Project' },
  { action: 'read', subject: 'User' },
  { action: 'read', subject: 'Report' },
  { action: 'read', subject: 'Timeline' },
  { action: 'read', subject: 'TaskBoard' },
  { action: 'read', subject: 'Organogram' },
  { action: 'read', subject: 'JsonViewer' },
  { action: 'read', subject: 'FlowDesign' },
]

/** Visitante: e-mail não encontrado no diretório após login. */
export const GUEST_DEFAULT: AppRawRule[] = [
  { action: 'read', subject: 'Dashboard' },
  { action: 'read', subject: 'Project' },
  { action: 'read', subject: 'JsonViewer' },
  { action: 'read', subject: 'FlowDesign' },
]

export const DEFAULT_RULES_BY_ROLE: Record<RoleSlug, AppRawRule[]> = {
  admin: ADMIN_MANAGE_ALL,
  editor: EDITOR_DEFAULT,
  viewer: VIEWER_DEFAULT,
}

export function defaultRulesForRole(slug: RoleSlug): AppRawRule[] {
  return DEFAULT_RULES_BY_ROLE[slug].map((r) => ({ ...r }))
}
