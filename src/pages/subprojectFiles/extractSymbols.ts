/** Lista curta de “símbolos” para o painel lateral (estilo GitHub). */
export function extractSymbolsFromContent(content: string): string[] {
  const out: string[] = []
  for (const line of content.split('\n')) {
    const t = line.trim()
    if (
      /^(export\s+(async\s+)?function\s+\w+)/.test(t) ||
      /^(export\s+(type|const|interface|class)\s+\w+)/.test(t)
    ) {
      out.push(t.replace(/\s+/g, ' ').slice(0, 80))
    }
  }
  return out.slice(0, 24)
}
