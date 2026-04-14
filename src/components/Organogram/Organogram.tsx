import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { OrgGroupNode, OrgPersonNode } from './Organogram.types'
import { isOrgGroup } from './Organogram.types'
import {
  AccentCorner,
  Avatar,
  BranchColumn,
  CardFooterExpand,
  Column,
  ConnectorSlot,
  CountLine,
  DeltaBadge,
  EmptyHint,
  ExpandBtn,
  Forest,
  GroupCard,
  GroupCardInner,
  GroupRow,
  GroupTitle,
  KebabBtn,
  Metric,
  MetricLabel,
  MetricsRow,
  PersonBranchColumn,
  PersonCard,
  PersonMetric,
  PersonName,
  PersonRole,
  PersonRow,
  ScrollArea,
  TreeRoot,
} from './Organogram.styles'

type OrganogramCtx = {
  toggle: (node: OrgGroupNode) => void
  isExpanded: (node: OrgGroupNode) => boolean
}

const Ctx = createContext<OrganogramCtx | null>(null)

function useOrganogram() {
  const v = useContext(Ctx)
  if (!v) throw new Error('Organogram: contexto ausente')
  return v
}

function BranchDownSvg({ count, accent }: { count: number; accent: string }) {
  if (count < 1) return null
  const forkY = 18
  const bottom = 52
  if (count === 1) {
    return (
      <svg
        viewBox="0 0 100 56"
        preserveAspectRatio="none"
        width="100%"
        height={52}
        style={{ display: 'block' }}
        aria-hidden
      >
        <path
          d={`M 50 0 L 50 ${bottom}`}
          stroke={accent}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  const xs = Array.from({ length: count }, (_, i) => ((i + 0.5) / count) * 100)
  const hLeft = Math.min(...xs)
  const hRight = Math.max(...xs)
  return (
    <svg
      viewBox="0 0 100 56"
      preserveAspectRatio="none"
      width="100%"
      height={52}
      style={{ display: 'block' }}
      aria-hidden
    >
      <path
        d={`M 50 0 L 50 ${forkY}`}
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${hLeft} ${forkY} L ${hRight} ${forkY}`}
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      {xs.map((x, i) => (
        <path
          key={i}
          d={`M ${x} ${forkY} L ${x} ${bottom}`}
          stroke={accent}
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

const iconKebab = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="12" cy="6" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="18" r="1.6" />
  </svg>
)

function GroupCardView({
  node,
  expanded,
  onToggle,
}: {
  node: OrgGroupNode
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <GroupCard>
      <GroupCardInner>
        <AccentCorner $color={node.accent} aria-hidden />
        <GroupTitle>{node.title}</GroupTitle>
        {node.countLabel ? <CountLine>{node.countLabel}</CountLine> : null}
        <MetricsRow>
          <Metric>
            <MetricLabel>Custo:</MetricLabel>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>{node.cost.display}</span>
              {node.cost.deltaPct != null ? (
                <DeltaBadge $positive={node.costPositive ?? true}>
                  {node.cost.deltaPct >= 0 ? '+' : ''}
                  {node.cost.deltaPct}%
                </DeltaBadge>
              ) : null}
            </span>
          </Metric>
          <Metric>
            <MetricLabel>Horas:</MetricLabel>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>{node.hours.display}</span>
              {node.hours.deltaPct != null ? (
                <DeltaBadge $positive={node.hoursPositive ?? false}>
                  {node.hours.deltaPct >= 0 ? '+' : ''}
                  {node.hours.deltaPct}%
                </DeltaBadge>
              ) : null}
            </span>
          </Metric>
        </MetricsRow>
        <KebabBtn type="button" aria-label="Opções do grupo">
          {iconKebab}
        </KebabBtn>
      </GroupCardInner>
      <CardFooterExpand>
        <ExpandBtn
          type="button"
          $accent={node.accent}
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={expanded ? 'Recolher ramo' : 'Expandir ramo'}
        >
          {expanded ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          )}
        </ExpandBtn>
      </CardFooterExpand>
    </GroupCard>
  )
}

function PersonCardView({ person }: { person: OrgPersonNode }) {
  const initials =
    person.initials ??
    person.name
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  return (
    <PersonCard>
      <Avatar aria-hidden>{initials}</Avatar>
      <PersonName>{person.name}</PersonName>
      <PersonRole>{person.role}</PersonRole>
      <PersonMetric>Custo: {person.costLabel}</PersonMetric>
      <PersonMetric>Horas: {person.hoursLabel}</PersonMetric>
    </PersonCard>
  )
}

function splitChildren(nodes: (OrgGroupNode | OrgPersonNode)[]) {
  const groups: OrgGroupNode[] = []
  const persons: OrgPersonNode[] = []
  for (const n of nodes) {
    if (isOrgGroup(n)) groups.push(n)
    else persons.push(n)
  }
  return { groups, persons }
}

function GroupBranch({ node }: { node: OrgGroupNode }) {
  const { isExpanded, toggle } = useOrganogram()
  const expanded = isExpanded(node)
  const { groups, persons } = splitChildren(node.children)
  const hasStructuralChildren = groups.length + persons.length > 0

  return (
    <Column>
      <GroupCardView
        node={node}
        expanded={expanded}
        onToggle={() => toggle(node)}
      />
      {expanded && hasStructuralChildren ? (
        <>
          {groups.length > 0 ? (
            <>
              <ConnectorSlot>
                <BranchDownSvg count={groups.length} accent={node.accent} />
              </ConnectorSlot>
              <GroupRow>
                {groups.map((g) => (
                  <BranchColumn key={g.id}>
                    <GroupBranch node={g} />
                  </BranchColumn>
                ))}
              </GroupRow>
            </>
          ) : null}
          {persons.length > 0 ? (
            <>
              <ConnectorSlot>
                <BranchDownSvg count={persons.length} accent={node.accent} />
              </ConnectorSlot>
              <PersonRow>
                {persons.map((p) => (
                  <PersonBranchColumn key={p.id}>
                    <PersonCardView person={p} />
                  </PersonBranchColumn>
                ))}
              </PersonRow>
            </>
          ) : null}
        </>
      ) : null}
      {expanded && !hasStructuralChildren ? (
        <EmptyHint>Nenhum subgrupo ou colaborador neste nó.</EmptyHint>
      ) : null}
    </Column>
  )
}

function OrganogramProvider({ children }: { children: ReactNode }) {
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({})

  const isExpanded = useCallback(
    (node: OrgGroupNode) => {
      if (node.id in expandedMap) return expandedMap[node.id]!
      return node.defaultExpanded ?? true
    },
    [expandedMap],
  )

  const toggle = useCallback((node: OrgGroupNode) => {
    setExpandedMap((e) => {
      const cur = node.id in e ? e[node.id]! : (node.defaultExpanded ?? true)
      return { ...e, [node.id]: !cur }
    })
  }, [])

  const value = useMemo(() => ({ toggle, isExpanded }), [toggle, isExpanded])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export type OrganogramProps = {
  /** Raízes da floresta (vários departamentos lado a lado). */
  roots: OrgGroupNode[]
}

/**
 * Visualização hierárquica tipo organograma: grupos expansíveis, métricas e folhas de pessoas.
 * Estado de expandir/recolher fica encapsulado no componente.
 */
export function Organogram({ roots }: OrganogramProps) {
  return (
    <OrganogramProvider>
      <ScrollArea>
        <Forest>
          {roots.map((r) => (
            <TreeRoot key={r.id}>
              <GroupBranch node={r} />
            </TreeRoot>
          ))}
        </Forest>
      </ScrollArea>
    </OrganogramProvider>
  )
}
