import { createMongoAbility } from '@casl/ability'
import type { DemoUser } from '../data/demoUsers'
import { getUserByEmail } from '../data/directoryUsers'
import { loadRoleRuleOverrides } from '../persistence/permissionRoleStorage'
import { defaultRulesForRole, GUEST_DEFAULT } from './defaultRoleRules'
import { roleLabelToSlug } from './roleMapping'
import type { AppAbilities, AppAbility, AppRawRule, RoleSlug } from './types'

function mergeRulesForRole(slug: RoleSlug): AppRawRule[] {
  const overrides = loadRoleRuleOverrides()
  if (Object.prototype.hasOwnProperty.call(overrides, slug)) {
    const stored = overrides[slug]
    return (stored ?? []).map((r) => ({ ...r }))
  }
  return defaultRulesForRole(slug)
}

function guestRules(): AppRawRule[] {
  const overrides = loadRoleRuleOverrides()
  if (Object.prototype.hasOwnProperty.call(overrides, 'guest')) {
    const stored = overrides.guest
    return (stored ?? []).map((r) => ({ ...r }))
  }
  return GUEST_DEFAULT.map((r) => ({ ...r }))
}

/**
 * Monta a Ability CASL para o usuário autenticado (por e-mail).
 * Admin sempre `manage` em `all`. Demais papéis: override localStorage ou defaults.
 */
export function createAbilityForSession(
  userEmail: string | null,
): AppAbility {
  if (!userEmail?.trim()) {
    return createMongoAbility<AppAbilities>(guestRules())
  }

  const user = getUserByEmail(userEmail)
  if (!user) {
    return createMongoAbility<AppAbilities>(guestRules())
  }

  const slug = roleLabelToSlug(user.role)
  if (slug === 'admin') {
    return createMongoAbility<AppAbilities>([{ action: 'manage', subject: 'all' }])
  }

  return createMongoAbility<AppAbilities>(mergeRulesForSlug(slug))
}

export function mergeRulesForSlug(slug: RoleSlug): AppRawRule[] {
  if (slug === 'admin') {
    return [{ action: 'manage', subject: 'all' as const }]
  }
  return mergeRulesForRole(slug)
}

/** Uso em testes ou quando já há instância de DemoUser. */
export function createAbilityForUser(user: DemoUser | null): AppAbility {
  if (!user) {
    return createMongoAbility<AppAbilities>(guestRules())
  }
  const slug = roleLabelToSlug(user.role)
  return createMongoAbility<AppAbilities>(mergeRulesForSlug(slug))
}
