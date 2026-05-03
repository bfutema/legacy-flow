/** Nome legível a partir do local-part do e-mail (ex.: bruno.silva → Bruno Silva). */
export function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() ?? email.trim()
  if (!local) return 'Usuário'
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export function initialsFromDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
