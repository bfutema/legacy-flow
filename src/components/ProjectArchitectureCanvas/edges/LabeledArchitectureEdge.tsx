import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react'
import type { CSSProperties } from 'react'
import type { ArchitectureEdgeData } from '../architectureTypes'
import { EdgeLabel } from './LabeledArchitectureEdge.styles'

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
  const label = (data as ArchitectureEdgeData | undefined)?.label

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
        <EdgeLabel
          $dashed={dashed}
          className="nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            ...(selected ? { boxShadow: '0 0 0 2px rgba(129, 140, 248, 0.45)' } : {}),
          }}
        >
          {label ?? '—'}
        </EdgeLabel>
      </EdgeLabelRenderer>
    </>
  )
})
