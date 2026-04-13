import type { DemoUser, UserStatus } from '../data/demoUsers'

const STORAGE_KEY = 'flow-user-profile-overrides'
const VERSION = 1

export type UserProfilePatch = Partial<
  Pick<DemoUser, 'name' | 'email' | 'role' | 'status'>
>

type Payload = {
  v: number
  patches: Record<string, UserProfilePatch>
}

function isStatus(x: unknown): x is UserStatus {
  return x === 'active' || x === 'inactive'
}

function isPatch(x: unknown): x is UserProfilePatch {
  if (!x || typeof x !== 'object') return false
  const p = x as Record<string, unknown>
  if (p.name !== undefined && typeof p.name !== 'string') return false
  if (p.email !== undefined && typeof p.email !== 'string') return false
  if (p.role !== undefined && typeof p.role !== 'string') return false
  if (p.status !== undefined && !isStatus(p.status)) return false
  return true
}

function loadPayload(): Payload {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { v: VERSION, patches: {} }
    const data = JSON.parse(raw) as Partial<Payload>
    if (data.v !== VERSION || !data.patches || typeof data.patches !== 'object')
      return { v: VERSION, patches: {} }
    const patches: Record<string, UserProfilePatch> = {}
    for (const [id, val] of Object.entries(data.patches)) {
      if (isPatch(val)) patches[id] = val
    }
    return { v: VERSION, patches }
  } catch {
    return { v: VERSION, patches: {} }
  }
}

function savePayload(p: Payload): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    window.dispatchEvent(new Event('flow-app-users-changed'))
  } catch (err) {
    console.warn('[usuários] Não foi possível salvar ajustes de perfil:', err)
  }
}

export function getProfilePatch(userId: string): UserProfilePatch | undefined {
  return loadPayload().patches[userId]
}

export function mergeProfilePatch(user: DemoUser): DemoUser {
  const p = getProfilePatch(user.id)
  return p ? { ...user, ...p } : user
}

export function setProfilePatch(userId: string, patch: UserProfilePatch): void {
  const payload = loadPayload()
  const prev = payload.patches[userId] ?? {}
  payload.patches[userId] = { ...prev, ...patch }
  savePayload(payload)
}

export function clearProfilePatch(userId: string): void {
  const payload = loadPayload()
  if (!(userId in payload.patches)) return
  delete payload.patches[userId]
  savePayload(payload)
}
