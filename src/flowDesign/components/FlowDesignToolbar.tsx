import {
  HiArrowUp,
  HiPlus,
  HiSquare2Stack,
  HiStop,
  HiTrash,
} from 'react-icons/hi2'
import { useFlowDesign } from '../state/FlowDesignContext'
import type { QuickAddKind } from '../state/flowDesignReducer'
import { ToolBtn, ToolbarRoot, ToolbarSep } from './FlowDesignToolbar.styles'

const ic = { size: 17 as const, 'aria-hidden': true as const }

function emitQuickAdd(kind: QuickAddKind) {
  window.dispatchEvent(new CustomEvent('flow-design-quick-add', { detail: { kind } }))
}

export function FlowDesignToolbar() {
  const { state, dispatch } = useFlowDesign()
  const hasSel = state.selection.length > 0

  return (
    <ToolbarRoot>
      <ToolBtn type="button" onClick={() => emitQuickAdd('frame')} title="Adicionar frame">
        <HiSquare2Stack {...ic} />
        Frame
      </ToolBtn>
      <ToolBtn type="button" onClick={() => emitQuickAdd('rect')} title="Adicionar retângulo">
        <HiStop {...ic} />
        Retângulo
      </ToolBtn>
      <ToolBtn type="button" onClick={() => emitQuickAdd('text')} title="Adicionar texto">
        <HiPlus {...ic} />
        Texto
      </ToolBtn>
      <ToolbarSep aria-hidden />
      <ToolBtn
        type="button"
        disabled={!hasSel}
        onClick={() => dispatch({ type: 'BRING_TO_FRONT', ids: state.selection })}
        title="Trazer para frente"
      >
        <HiArrowUp {...ic} />
        Frente
      </ToolBtn>
      <ToolBtn
        type="button"
        disabled={!hasSel}
        onClick={() => dispatch({ type: 'DELETE_NODES', ids: state.selection })}
        title="Remover selecionados"
      >
        <HiTrash {...ic} />
        Remover
      </ToolBtn>
    </ToolbarRoot>
  )
}
