const STORAGE_KEY = 'flow-users-list-view-mode'

export type UsersListViewMode = 'table' | 'cards' | 'list'

function isMode(x: string): x is UsersListViewMode {
  return x === 'table' || x === 'cards' || x === 'list'
}

export function loadUsersListViewMode(): UsersListViewMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw && isMode(raw)) return raw
  } catch {
    /* ignore */
  }
  return 'table'
}

export function saveUsersListViewMode(mode: UsersListViewMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch (err) {
    console.warn('[usuários] Não foi possível salvar modo de listagem:', err)
  }
}
