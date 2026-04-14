import type { AppRawRule } from '../authorization/types'
import type { RoleSlug } from '../authorization/types'

const STORAGE_KEY = 'flow-permission-role-rules'
const VERSION = 1

type StorableSlug = RoleSlug | 'guest'

type Payload = {
  v: number
  /** Regras por papel; `admin` é ignorado em runtime (sempre manage all). */
  rulesByRole: Partial<Record<StorableSlug, AppRawRule[]>>
}

function isRawRule(x: unknown): x is AppRawRule {
  if (!x || typeof x !== 'object') return false
  const r = x as Record<string, unknown>
  return typeof r.action === 'string' && typeof r.subject === 'string'
}

export function loadRoleRuleOverrides(): Partial<Record<StorableSlug, AppRawRule[]>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as Partial<Payload>
    if (data.v !== VERSION || !data.rulesByRole || typeof data.rulesByRole !== 'object') {
      return {}
    }
    const out: Partial<Record<StorableSlug, AppRawRule[]>> = {}
    for (const key of Object.keys(data.rulesByRole) as StorableSlug[]) {
      const arr = data.rulesByRole[key]
      if (!Array.isArray(arr)) continue
      out[key] = arr.filter(isRawRule)
    }
    return out
  } catch {
    return {}
  }
}

export function saveRoleRuleOverrides(
  rulesByRole: Partial<Record<StorableSlug, AppRawRule[]>>,
): void {
  try {
    const payload: Payload = { v: VERSION, rulesByRole }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    window.dispatchEvent(new Event('flow-permissions-changed'))
  } catch (err) {
    console.warn('[permissões] Falha ao salvar regras de papel:', err)
  }
}

/** Atualiza só um papel (ou visitante) e mantém os demais. */
export function patchRoleRules(
  slug: StorableSlug,
  rules: AppRawRule[],
): void {
  const cur = loadRoleRuleOverrides()
  saveRoleRuleOverrides({ ...cur, [slug]: rules })
}

/** Remove override persistido e volta aos defaults em código. */
export function clearRoleRules(slug: StorableSlug): void {
  const cur = loadRoleRuleOverrides()
  const next = { ...cur }
  delete next[slug]
  saveRoleRuleOverrides(next)
}
