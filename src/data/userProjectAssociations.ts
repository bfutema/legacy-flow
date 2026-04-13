/**
 * Associações ilustrativas usuário → projetos (ids em `projects.ts` / criados pelo app).
 * Em produção viria da API.
 */
export const USER_PROJECT_IDS: Record<string, string[]> = {
  u1: ['ecommerce', 'bi', 'crm'],
  u2: ['ecommerce', 'faturamento'],
  u3: ['crm', 'rh'],
  u4: ['logistica'],
  u5: ['bi', 'ecommerce', 'faturamento'],
  u6: ['rh', 'crm'],
  u7: ['faturamento'],
  u8: ['logistica', 'bi'],
}

/** Usuários criados no app: fallback com alguns projetos seed. */
const FALLBACK_PROJECT_IDS = ['ecommerce', 'crm', 'bi']

export function getProjectIdsForUser(userId: string): string[] {
  const direct = USER_PROJECT_IDS[userId]
  if (direct?.length) return direct
  if (userId.startsWith('usr_')) return FALLBACK_PROJECT_IDS
  return ['ecommerce']
}
