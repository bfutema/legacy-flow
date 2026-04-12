import type { Edge } from '@xyflow/react'

/** Lado de uma relação em notação ER (min/max de ocorrências). */
export type CardinalityEnd =
  | 'exactly_one'
  | 'zero_or_one'
  | 'one_or_many'
  | 'zero_or_many'

export interface RelationshipEdgeData extends Record<string, unknown> {
  sourceCardinality: CardinalityEnd
  targetCardinality: CardinalityEnd
}

/** Texto exibido junto à linha (notação comum em diagramas ER). */
export const CARDINALITY_DISPLAY: Record<CardinalityEnd, string> = {
  exactly_one: '1',
  zero_or_one: '0..1',
  one_or_many: '1..*',
  zero_or_many: '0..*',
}

export const CARDINALITY_OPTIONS: {
  value: CardinalityEnd
  label: string
}[] = [
  { value: 'exactly_one', label: 'Exatamente um (1)' },
  { value: 'zero_or_one', label: 'Zero ou um (0..1)' },
  { value: 'one_or_many', label: 'Um ou muitos (1..*)' },
  { value: 'zero_or_many', label: 'Zero ou muitos (0..*)' },
]

export const defaultRelationshipEdgeData: RelationshipEdgeData = {
  sourceCardinality: 'exactly_one',
  targetCardinality: 'one_or_many',
}

export type RelationshipEdge = Edge<RelationshipEdgeData, 'relationshipStep'>
