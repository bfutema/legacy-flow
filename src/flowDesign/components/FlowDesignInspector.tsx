import { useFlowDesign } from '../state/FlowDesignContext'
import type {
  FlowDesignFrameNode,
  FlowDesignNode,
  FlowDesignRectNode,
  FlowDesignTextNode,
} from '../types'
import {
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldRow,
  FieldSelect,
  FieldTextArea,
  InspectorEmpty,
  InspectorRoot,
  ToggleRow,
} from './FlowDesignInspector.styles'

function numOr(v: string, fallback: number): number {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) ? n : fallback
}

function FrameFields({
  node,
  onPatch,
}: {
  node: FlowDesignFrameNode
  onPatch: (p: Partial<FlowDesignNode>) => void
}) {
  return (
    <>
      <FieldGroup>
        <FieldLabel>Preenchimento</FieldLabel>
        <FieldInput
          type="text"
          value={node.fill}
          onChange={(e) => onPatch({ fill: e.target.value })}
          aria-label="Cor de preenchimento"
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>Borda</FieldLabel>
        <FieldRow>
          <FieldInput
            type="text"
            value={node.stroke}
            onChange={(e) => onPatch({ stroke: e.target.value })}
            aria-label="Cor da borda"
          />
          <FieldInput
            type="number"
            value={node.strokeWidth}
            min={0}
            onChange={(e) => onPatch({ strokeWidth: numOr(e.target.value, node.strokeWidth) })}
            aria-label="Espessura da borda"
          />
        </FieldRow>
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>Raio (px)</FieldLabel>
        <FieldInput
          type="number"
          min={0}
          value={node.radius}
          onChange={(e) => onPatch({ radius: numOr(e.target.value, node.radius) })}
        />
      </FieldGroup>
    </>
  )
}

function RectFields({
  node,
  onPatch,
}: {
  node: FlowDesignRectNode
  onPatch: (p: Partial<FlowDesignNode>) => void
}) {
  return (
    <>
      <FieldGroup>
        <FieldLabel>Preenchimento</FieldLabel>
        <FieldInput
          type="text"
          value={node.fill}
          onChange={(e) => onPatch({ fill: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>Borda</FieldLabel>
        <FieldRow>
          <FieldInput
            type="text"
            value={node.stroke}
            onChange={(e) => onPatch({ stroke: e.target.value })}
          />
          <FieldInput
            type="number"
            min={0}
            value={node.strokeWidth}
            onChange={(e) => onPatch({ strokeWidth: numOr(e.target.value, node.strokeWidth) })}
          />
        </FieldRow>
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>Raio (px)</FieldLabel>
        <FieldInput
          type="number"
          min={0}
          value={node.radius}
          onChange={(e) => onPatch({ radius: numOr(e.target.value, node.radius) })}
        />
      </FieldGroup>
    </>
  )
}

function TextFields({
  node,
  onPatch,
}: {
  node: FlowDesignTextNode
  onPatch: (p: Partial<FlowDesignNode>) => void
}) {
  return (
    <>
      <FieldGroup>
        <FieldLabel>Conteúdo</FieldLabel>
        <FieldTextArea
          value={node.text}
          onChange={(e) => onPatch({ text: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>Tipografia</FieldLabel>
        <FieldRow>
          <FieldInput
            type="number"
            min={8}
            value={node.fontSize}
            onChange={(e) => onPatch({ fontSize: numOr(e.target.value, node.fontSize) })}
            aria-label="Tamanho da fonte"
          />
          <FieldInput
            type="number"
            min={100}
            step={100}
            value={node.fontWeight}
            onChange={(e) => onPatch({ fontWeight: numOr(e.target.value, node.fontWeight) })}
            aria-label="Peso da fonte"
          />
        </FieldRow>
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>Cor do texto</FieldLabel>
        <FieldInput
          type="text"
          value={node.fill}
          onChange={(e) => onPatch({ fill: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>Alinhamento</FieldLabel>
        <FieldSelect
          value={node.align}
          onChange={(e) =>
            onPatch({
              align: e.target.value as FlowDesignTextNode['align'],
            })
          }
        >
          <option value="left">Esquerda</option>
          <option value="center">Centro</option>
          <option value="right">Direita</option>
        </FieldSelect>
      </FieldGroup>
    </>
  )
}

export function FlowDesignInspector() {
  const { state, dispatch } = useFlowDesign()
  const pageId = state.ui.activePageId
  const page = state.doc.pages.find((p) => p.id === pageId)
  const nodes = page?.nodes ?? []

  if (state.selection.length === 0) {
    return (
      <InspectorRoot>
        <InspectorEmpty>Nenhum elemento selecionado. Clique em um frame, retângulo ou texto.</InspectorEmpty>
      </InspectorRoot>
    )
  }

  if (state.selection.length > 1) {
    return (
      <InspectorRoot>
        <InspectorEmpty>
          {state.selection.length} elementos selecionados. Para editar propriedades detalhadas, selecione
          apenas um (Shift + clique para alternar).
        </InspectorEmpty>
      </InspectorRoot>
    )
  }

  const id = state.selection[0]!
  const node = nodes.find((n) => n.id === id)
  if (!node) {
    return (
      <InspectorRoot>
        <InspectorEmpty>Elemento não encontrado nesta página.</InspectorEmpty>
      </InspectorRoot>
    )
  }

  const onPatch = (patch: Partial<FlowDesignNode>) => {
    dispatch({ type: 'UPDATE_NODE', id: node.id, patch })
  }

  return (
    <InspectorRoot>
      <FieldGroup>
        <FieldLabel>Nome</FieldLabel>
        <FieldInput
          type="text"
          value={node.name}
          onChange={(e) => onPatch({ name: e.target.value })}
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>Posição e tamanho</FieldLabel>
        <FieldRow>
          <FieldInput
            type="number"
            value={Math.round(node.x)}
            onChange={(e) => onPatch({ x: numOr(e.target.value, node.x) })}
            aria-label="X"
          />
          <FieldInput
            type="number"
            value={Math.round(node.y)}
            onChange={(e) => onPatch({ y: numOr(e.target.value, node.y) })}
            aria-label="Y"
          />
        </FieldRow>
        <FieldRow style={{ marginTop: '0.45rem' }}>
          <FieldInput
            type="number"
            min={1}
            value={Math.round(node.w)}
            onChange={(e) => onPatch({ w: Math.max(1, numOr(e.target.value, node.w)) })}
            aria-label="Largura"
          />
          <FieldInput
            type="number"
            min={1}
            value={Math.round(node.h)}
            onChange={(e) => onPatch({ h: Math.max(1, numOr(e.target.value, node.h)) })}
            aria-label="Altura"
          />
        </FieldRow>
      </FieldGroup>

      <ToggleRow>
        <input
          type="checkbox"
          checked={node.visible}
          onChange={(e) => onPatch({ visible: e.target.checked })}
        />
        Visível
      </ToggleRow>
      <ToggleRow>
        <input
          type="checkbox"
          checked={node.locked}
          onChange={(e) => onPatch({ locked: e.target.checked })}
        />
        Travado
      </ToggleRow>

      {node.type === 'frame' ? <FrameFields node={node} onPatch={onPatch} /> : null}
      {node.type === 'rect' ? <RectFields node={node} onPatch={onPatch} /> : null}
      {node.type === 'text' ? <TextFields node={node} onPatch={onPatch} /> : null}
    </InspectorRoot>
  )
}
