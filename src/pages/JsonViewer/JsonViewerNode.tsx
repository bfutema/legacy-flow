import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import type { JsonCrackNodeData, JsonRow as JsonRowData } from './jsonToFlowGraph'
import {
  ColorSwatch,
  JsonKey,
  JsonNodeBody,
  JsonNodeCard,
  JsonNodeHeader,
  JsonTableRow,
  JsonValue,
  JsonValueCell,
  NestedRowFlex,
  NestedSummary,
  PrimitiveRowGrid,
  ToggleNestBtn,
  TruncNote,
} from './JsonViewerNode.styles'

function RowView({ row, data }: { row: JsonRowData; data: JsonCrackNodeData }) {
  if (row.kind === 'truncated') {
    return (
      <JsonTableRow>
        <TruncNote>{row.message}</TruncNote>
      </JsonTableRow>
    )
  }

  if (row.kind === 'primitive') {
    return (
      <JsonTableRow>
        <PrimitiveRowGrid>
          <JsonKey>{row.key}:</JsonKey>
          <JsonValueCell>
            {row.colorHex ? <ColorSwatch $hex={row.colorHex} title={row.colorHex} /> : null}
            <JsonValue>{row.valueText}</JsonValue>
          </JsonValueCell>
        </PrimitiveRowGrid>
      </JsonTableRow>
    )
  }

  const icon = row.expanded ? <FiMinus aria-hidden /> : <FiPlus aria-hidden />
  return (
    <JsonTableRow>
      <ToggleNestBtn
        aria-expanded={row.expanded}
        aria-label={row.expanded ? `Recolher ${row.key}` : `Expandir ${row.key}`}
        onClick={() => data.onToggleExpand(row.childPathId)}
      >
        {icon}
      </ToggleNestBtn>
      <NestedRowFlex>
        <JsonKey>{row.key}:</JsonKey>
        <NestedSummary>{row.summary}</NestedSummary>
      </NestedRowFlex>
      {row.expanded ? (
        <Handle
          type="source"
          position={Position.Right}
          id={row.handleId}
          style={{
            position: 'absolute',
            right: -6,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      ) : null}
    </JsonTableRow>
  )
}

export function JsonViewerNode({ data }: NodeProps) {
  const d = data as JsonCrackNodeData
  return (
    <JsonNodeCard>
      <JsonNodeHeader>
        <Handle
          type="target"
          position={Position.Left}
          style={{
            left: -6,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
        {d.header}
      </JsonNodeHeader>
      <JsonNodeBody>
        {d.rows.map((row, i) => (
          <RowView key={i} row={row} data={d} />
        ))}
      </JsonNodeBody>
    </JsonNodeCard>
  )
}
