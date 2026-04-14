/** Nó folha: colaborador no organograma. */
export type OrgPersonNode = {
  kind: 'person'
  id: string
  name: string
  role: string
  costLabel: string
  hoursLabel: string
  /** Iniciais para avatar quando não há imagem */
  initials?: string
}

/** Grupo / subgrupo com métricas e filhos (times ou pessoas). */
export type OrgGroupNode = {
  kind: 'group'
  id: string
  title: string
  /** Cor de destaque (indicador, linhas, botão de expandir) — hex */
  accent: string
  /** Ex.: "3 Subgrupos" ou "2 Colaboradores" */
  countLabel?: string
  cost: { display: string; deltaPct?: number }
  hours: { display: string; deltaPct?: number }
  /** Se true, delta do custo em verde; se false, vermelho */
  costPositive?: boolean
  /** Se true, delta de horas em verde; se false, vermelho */
  hoursPositive?: boolean
  children: (OrgGroupNode | OrgPersonNode)[]
  defaultExpanded?: boolean
}

export function isOrgGroup(n: OrgGroupNode | OrgPersonNode): n is OrgGroupNode {
  return n.kind === 'group'
}

export function isOrgPerson(n: OrgGroupNode | OrgPersonNode): n is OrgPersonNode {
  return n.kind === 'person'
}
