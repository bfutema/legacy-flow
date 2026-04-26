import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { defaultMonorepoRoleForKind } from '../../../pages/subprojectFiles/workspaceSeedPaths'
import { useArchitectureLayout } from '../ArchitectureLayoutContext'
import { ARCHITECTURE_KIND_LABEL } from '../architectureKindMeta'
import {
  normalizeTechForNode,
  renderTechIcon,
  techLabel,
} from '../architectureTechMeta'
import type { ArchitectureRfNode } from '../architectureTypes'
import {
  Body,
  CardInner,
  DragStrip,
  KindBadge,
  MonorepoBadge,
  Root,
  SlugRow,
  TechHint,
  Title,
  TitleRow,
} from './ArchitectureBlockNode.styles'
import { ARCHITECTURE_KIND_ACCENT } from '../architectureKindMeta'

export const ArchitectureBlockNode = memo(function ArchitectureBlockNode({
  data,
  selected,
}: NodeProps<ArchitectureRfNode>) {
  const { isMonorepo } = useArchitectureLayout()
  const accent = ARCHITECTURE_KIND_ACCENT[data.kind]
  const monorepoRole = data.monorepoRole ?? defaultMonorepoRoleForKind(data.kind)
  const nodeTech = normalizeTechForNode(
    data.kind,
    data.runtime,
    data.techHint,
    data.projectCloud,
    data.projectPrimaryDatabase,
    data.clientSurface,
  )
  const nodeTechLabel = techLabel(nodeTech)
  return (
    <Root $accent={accent} $selected={selected}>
      <CardInner>
        <DragStrip $accent={accent} aria-hidden />
        <Body>
          <TitleRow>
            <Title>{data.label}</Title>
            <KindBadge $kind={data.kind}>{ARCHITECTURE_KIND_LABEL[data.kind]}</KindBadge>
          </TitleRow>
          {nodeTechLabel ? (
            <TechHint>
              {renderTechIcon(nodeTech, 11)}
              {nodeTechLabel}
            </TechHint>
          ) : null}
          {data.slug ? <SlugRow title="Slug para codegen / monorepo">{data.slug}</SlugRow> : null}
          {isMonorepo && data.kind !== 'database' ? (
            <MonorepoBadge title="Pasta raiz no monorepo">
              {monorepoRole === 'package' ? 'packages/' : 'apps/'}
            </MonorepoBadge>
          ) : null}
        </Body>
      </CardInner>
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 8, height: 8, border: 'none', background: accent }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 8, height: 8, border: 'none', background: accent }}
      />
    </Root>
  )
})
