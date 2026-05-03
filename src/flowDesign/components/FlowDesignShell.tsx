import { FlowDesignCanvas } from './FlowDesignCanvas'
import { FlowDesignInspector } from './FlowDesignInspector'
import { FlowDesignPagesPanel } from './FlowDesignPagesPanel'
import {
  CanvasFill,
  CanvasRegion,
  DocTitleInput,
  Panel,
  PanelScroll,
  PanelTitle,
  StudioBody,
  StudioHint,
  StudioRoot,
  StudioTopBar,
} from './FlowDesignShell.styles'
import { FlowDesignToolbar } from './FlowDesignToolbar'
import { useFlowDesign } from '../state/FlowDesignContext'

export function FlowDesignShell() {
  const { state, dispatch } = useFlowDesign()

  return (
    <StudioRoot>
      <StudioTopBar>
        <DocTitleInput
          aria-label="Título do arquivo"
          value={state.doc.meta.title}
          onChange={(e) => dispatch({ type: 'PATCH_DOC_META', title: e.target.value })}
        />
        <StudioHint>
          Flow Design Studio · protótipo local · dados em{' '}
          <code style={{ fontSize: '0.68rem' }}>localStorage</code>
        </StudioHint>
      </StudioTopBar>
      <StudioBody>
        <Panel>
          <PanelTitle>Páginas</PanelTitle>
          <FlowDesignPagesPanel />
        </Panel>
        <CanvasRegion>
          <FlowDesignToolbar />
          <CanvasFill>
            <FlowDesignCanvas />
          </CanvasFill>
        </CanvasRegion>
        <Panel>
          <PanelTitle>Propriedades</PanelTitle>
          <PanelScroll>
            <FlowDesignInspector />
          </PanelScroll>
        </Panel>
      </StudioBody>
    </StudioRoot>
  )
}
