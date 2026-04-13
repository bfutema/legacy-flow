/** Cor estável por id de usuário da plataforma (colaborador na timeline). */
const PALETTE = [
  '#2dd4bf',
  '#60a5fa',
  '#fb923c',
  '#c084fc',
  '#34d399',
  '#f472b6',
  '#818cf8',
  '#fbbf24',
  '#38bdf8',
  '#a78bfa',
  '#4ade80',
  '#fb7185',
] as const

export function collaboratorColorForUserId(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return PALETTE[Math.abs(h) % PALETTE.length]!
}
