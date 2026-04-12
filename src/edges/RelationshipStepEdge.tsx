import {
  memo,
  useCallback,
  useMemo,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { useTheme } from 'styled-components'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  Position,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react'
import {
  CARDINALITY_DISPLAY,
  defaultRelationshipEdgeData,
  type RelationshipEdge,
} from './relationshipTypes'
import { CardinalityBadge } from './RelationshipStepEdge.styles'

/** Badge para fora do handle (origem e destino usam a mesma regra). */
function labelNearHandle(
  x: number,
  y: number,
  pos: Position,
  dist: number,
) {
  switch (pos) {
    case Position.Left:
      return { lx: x - dist, ly: y }
    case Position.Right:
      return { lx: x + dist, ly: y }
    case Position.Top:
      return { lx: x, ly: y - dist }
    case Position.Bottom:
      return { lx: x, ly: y + dist }
    default:
      return { lx: x, ly: y }
  }
}

function RelationshipStepEdgeImpl({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Bottom,
  targetPosition = Position.Top,
  style,
  markerEnd,
  markerStart,
  data,
  interactionWidth,
  selected,
}: EdgeProps<RelationshipEdge>) {
  const theme = useTheme()
  const { setNodes, setEdges } = useReactFlow()
  const d = data ?? defaultRelationshipEdgeData
  const sourceLabel = CARDINALITY_DISPLAY[d.sourceCardinality]
  const targetLabel = CARDINALITY_DISPLAY[d.targetCardinality]

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
  })

  const dist = 28
  const sourcePos = labelNearHandle(sourceX, sourceY, sourcePosition, dist)
  const targetPos = labelNearHandle(targetX, targetY, targetPosition, dist)

  const edgeStyle = useMemo(() => {
    const base = (style ?? {}) as CSSProperties
    if (selected) {
      return {
        ...base,
        stroke: theme.primary,
        strokeWidth: 2,
        strokeDasharray: '6 4',
      }
    }
    return {
      ...base,
      stroke: theme.textMuted,
      strokeWidth: 1.5,
      strokeDasharray: '6 4',
    }
  }, [style, selected, theme.primary, theme.textMuted])

  const selectThisRelationship = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })))
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === id
          ? { ...edge, selected: true, animated: true }
          : { ...edge, selected: false, animated: false },
      ),
    )
  }, [id, setNodes, setEdges])

  const stopLabelPointerBubble = useCallback(
    (e: ReactMouseEvent | ReactPointerEvent) => {
      e.stopPropagation()
    },
    [],
  )

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        labelX={labelX}
        labelY={labelY}
        style={edgeStyle}
        markerEnd={markerEnd}
        markerStart={markerStart}
        interactionWidth={interactionWidth}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${sourcePos.lx}px,${sourcePos.ly}px)`,
            zIndex: 1000,
            /* .react-flow__edgelabel-renderer usa pointer-events: none — sem isso o clique não chega na badge */
            pointerEvents: 'all',
          }}
          onPointerDownCapture={stopLabelPointerBubble}
          onMouseDownCapture={stopLabelPointerBubble}
          onClick={(e) => {
            e.stopPropagation()
            selectThisRelationship()
          }}
        >
          <CardinalityBadge title="Cardinalidade na origem — clique para editar">
            {sourceLabel}
          </CardinalityBadge>
        </div>
        <div
          className="nodrag nopan"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetPos.lx}px,${targetPos.ly}px)`,
            zIndex: 1000,
            pointerEvents: 'all',
          }}
          onPointerDownCapture={stopLabelPointerBubble}
          onMouseDownCapture={stopLabelPointerBubble}
          onClick={(e) => {
            e.stopPropagation()
            selectThisRelationship()
          }}
        >
          <CardinalityBadge title="Cardinalidade no destino — clique para editar">
            {targetLabel}
          </CardinalityBadge>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export const RelationshipStepEdge = memo(RelationshipStepEdgeImpl)
