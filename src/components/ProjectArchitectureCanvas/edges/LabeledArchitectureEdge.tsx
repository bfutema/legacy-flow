import { memo, useMemo, useState } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
import type { CSSProperties } from 'react'
import type { ArchitectureEdgeData } from '../architectureTypes'
import { EdgeLabel, EdgeLabelInput } from './LabeledArchitectureEdge.styles'

export const LabeledArchitectureEdge = memo(function LabeledArchitectureEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const edgeStyle = style as CSSProperties | undefined
  const dashed = Boolean(edgeStyle?.strokeDasharray)
  const label = useMemo(
    () => (data as ArchitectureEdgeData | undefined)?.label?.trim() || 'Nova ligação',
    [data],
  )
  const { setEdges } = useReactFlow()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(label)

  const saveDraft = () => {
    const nextLabel = draft.trim() || 'Nova ligação'
    setEdges((eds) =>
      eds.map((e) =>
        e.id === id
          ? {
              ...e,
              data: { ...(e.data as ArchitectureEdgeData | undefined), label: nextLabel },
            }
          : e,
      ),
    )
    setIsEditing(false)
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={edgeStyle}
        interactionWidth={16}
      />
      <EdgeLabelRenderer>
        {isEditing ? (
          <EdgeLabelInput
            $dashed={dashed}
            className="nodrag nopan"
            value={draft}
            autoFocus
            maxLength={40}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                saveDraft()
                return
              }
              if (e.key === 'Escape') {
                e.preventDefault()
                setDraft(label)
                setIsEditing(false)
              }
            }}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              ...(selected ? { boxShadow: '0 0 0 2px rgba(129, 140, 248, 0.45)' } : {}),
            }}
            aria-label="Editar rótulo da ligação"
          />
        ) : (
          <EdgeLabel
            type="button"
            $dashed={dashed}
            className="nodrag nopan"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              ...(selected ? { boxShadow: '0 0 0 2px rgba(129, 140, 248, 0.45)' } : {}),
            }}
            onDoubleClick={() => setIsEditing(true)}
            onClick={() => {
              if (!isEditing) setDraft(label)
            }}
            title="Duplo-clique para editar"
            aria-label={`Ligação: ${label}. Duplo-clique para editar`}
          >
            {label}
          </EdgeLabel>
        )}
      </EdgeLabelRenderer>
    </>
  )
})
