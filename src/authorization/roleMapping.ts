import { USER_ROLE_OPTIONS } from '../data/demoUsers'
import type { RoleSlug } from './types'

const LABEL_TO_SLUG: Record<string, RoleSlug> = {
  Administradora: 'admin',
  Editor: 'editor',
  Visualizadora: 'viewer',
}

/** Slugs derivados dos rótulos atuais do cadastro de usuários. */
export function roleLabelToSlug(label: string): RoleSlug {
  return LABEL_TO_SLUG[label] ?? 'viewer'
}

export function slugToDefaultLabel(slug: RoleSlug): string {
  const entry = Object.entries(LABEL_TO_SLUG).find(([, s]) => s === slug)
  return entry?.[0] ?? slug
}

export function isKnownRoleLabel(label: string): boolean {
  return (USER_ROLE_OPTIONS as readonly string[]).includes(label)
}
