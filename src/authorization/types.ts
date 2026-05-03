import type { MongoAbility, RawRuleOf } from '@casl/ability'

/** Verbos alinhados ao CASL (API futura). */
export type AppAction = 'manage' | 'create' | 'read' | 'update' | 'delete'

/**
 * Recursos da aplicação (subjects CASL).
 * Use strings estáveis — espelhar na API com @casl/ability.
 */
export type AppSubject =
  | 'all'
  | 'Dashboard'
  | 'Project'
  | 'User'
  | 'Report'
  | 'Timeline'
  | 'TaskBoard'
  | 'Organogram'
  | 'Security'
  | 'JsonViewer'
  | 'FlowDesign'

export type AppAbilities = [AppAction, AppSubject]

export type AppAbility = MongoAbility<AppAbilities>

export type AppRawRule = RawRuleOf<AppAbility>

/** Papéis persistidos (rótulos do cadastro → slug). */
export type RoleSlug = 'admin' | 'editor' | 'viewer'
