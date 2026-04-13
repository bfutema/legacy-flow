import type { DemoUser, UserStatus } from '../data/demoUsers'

const STORAGE_KEY = 'flow-app-users'
const VERSION = 1

type Payload = {
  v: number
  items: DemoUser[]
}

function isUserShape(x: unknown): x is DemoUser {
  if (!x || typeof x !== 'object') return false
  const u = x as Record<string, unknown>
  return (
    typeof u.id === 'string' &&
    typeof u.name === 'string' &&
    typeof u.email === 'string' &&
    typeof u.role === 'string' &&
    (u.status === 'active' || u.status === 'inactive') &&
    typeof u.createdAt === 'string'
  )
}

export function loadAppUsers(): DemoUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as Partial<Payload>
    if (data.v !== VERSION || !Array.isArray(data.items)) return []
    return data.items.filter(isUserShape)
  } catch {
    return []
  }
}

export function saveAppUsers(items: DemoUser[]): void {
  try {
    const payload: Payload = { v: VERSION, items }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    window.dispatchEvent(new Event('flow-app-users-changed'))
  } catch (err) {
    console.warn('[usuários] Não foi possível salvar usuários do app:', err)
  }
}

export function generateAppUserId(): string {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

export type NewAppUserInput = {
  name: string
  email: string
  role: string
  status: UserStatus
}

export function addAppUser(input: NewAppUserInput): DemoUser {
  const user: DemoUser = {
    id: generateAppUserId(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role.trim(),
    status: input.status,
    createdAt: new Date().toISOString(),
  }
  const list = loadAppUsers()
  list.push(user)
  saveAppUsers(list)
  return user
}

export type AppUserUpdate = Partial<
  Pick<DemoUser, 'name' | 'email' | 'role' | 'status'>
>

export function updateAppUser(id: string, patch: AppUserUpdate): boolean {
  const list = loadAppUsers()
  const idx = list.findIndex((u) => u.id === id)
  if (idx < 0) return false
  const cur = list[idx]
  const next: DemoUser = {
    ...cur,
    name: patch.name !== undefined ? patch.name.trim() : cur.name,
    email:
      patch.email !== undefined
        ? patch.email.trim().toLowerCase()
        : cur.email,
    role: patch.role !== undefined ? patch.role.trim() : cur.role,
    status: patch.status !== undefined ? patch.status : cur.status,
  }
  list[idx] = next
  saveAppUsers(list)
  return true
}
