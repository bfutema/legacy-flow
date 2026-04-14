import { PERMISSION_CATALOG } from './permissionCatalog'
import type { AppRawRule } from './types'

const catalogKey = (action: string, subject: string) => `${action}:${subject}`

/** Conjunto de ids do catálogo cobertos pelas regras (inclui expansão de manage all). */
export function rulesToCatalogIdSet(rules: AppRawRule[]): Set<string> {
  const set = new Set<string>()
  for (const r of rules) {
    const actions = Array.isArray(r.action) ? r.action : [r.action]
    const subjects = Array.isArray(r.subject) ? r.subject : [r.subject]
    for (const action of actions) {
      for (const subject of subjects) {
        if (subject === 'all' && action === 'manage') {
          for (const item of PERMISSION_CATALOG) {
            set.add(item.id)
          }
          return set
        }
        if (subject && subject !== 'all') {
          set.add(catalogKey(action, subject as string))
        }
      }
    }
  }
  return set
}

export function catalogIdsToRules(ids: Iterable<string>): AppRawRule[] {
  const byKey = new Map(PERMISSION_CATALOG.map((p) => [p.id, p] as const))
  const out: AppRawRule[] = []
  const seen = new Set<string>()
  for (const id of ids) {
    const item = byKey.get(id)
    if (!item || seen.has(id)) continue
    seen.add(id)
    out.push({ action: item.action, subject: item.subject })
  }
  return out
}
