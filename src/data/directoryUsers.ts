import { loadAppUsers, updateAppUser } from '../persistence/appUsersStorage'
import {
  clearProfilePatch,
  mergeProfilePatch,
  setProfilePatch,
  type UserProfilePatch,
} from '../persistence/userProfileOverridesStorage'
import { DEMO_USERS, type DemoUser } from './demoUsers'

/** Usuários demo + cadastrados neste navegador, com ajustes locais de perfil. */
export function getDirectoryUsers(): DemoUser[] {
  const demo = DEMO_USERS.map((u) => mergeProfilePatch(u))
  const app = loadAppUsers().map((u) => mergeProfilePatch(u))
  return [...demo, ...app]
}

export function getUserById(id: string): DemoUser | undefined {
  return getDirectoryUsers().find((u) => u.id === id)
}

export function getUserByEmail(email: string): DemoUser | undefined {
  const em = email.trim().toLowerCase()
  return getDirectoryUsers().find((u) => u.email.toLowerCase() === em)
}

export function updateDirectoryUser(
  id: string,
  patch: UserProfilePatch,
): boolean {
  const inApp = loadAppUsers().some((u) => u.id === id)
  if (inApp) {
    const ok = updateAppUser(id, patch)
    if (ok) clearProfilePatch(id)
    return ok
  }
  setProfilePatch(id, patch)
  return true
}

export function isEmailTakenByOther(
  email: string,
  exceptUserId: string,
): boolean {
  const em = email.trim().toLowerCase()
  return getDirectoryUsers().some(
    (u) => u.id !== exceptUserId && u.email.toLowerCase() === em,
  )
}
