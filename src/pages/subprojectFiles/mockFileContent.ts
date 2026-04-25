/** Conteúdo de demonstração até existir backend/CLI real. */
export function mockContentForPath(relativePath: string): string {
  const base = relativePath.split('/').pop() ?? relativePath
  return `/**
 * Preview local — ${relativePath}
 * Substituído por conteúdo real quando o gerador estiver integrado.
 */

export const MODULE = '${base.replace(/'/g, "\\'")}'

export function describeModule(): string {
  return \`Arquivo: \${MODULE}\`
}

export async function bootstrap(): Promise<void> {
  // TODO: wiring com API / monorepo
  await Promise.resolve()
}
`
}
