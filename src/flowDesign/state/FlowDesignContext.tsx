import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import {
  initialFlowDesignPersisted,
  loadFlowDesignPersisted,
  saveFlowDesignPersisted,
} from '../persistence/flowDesignStudioStorage'
import {
  createFlowDesignState,
  flowDesignReducer,
  type FlowDesignAction,
  type FlowDesignState,
} from './flowDesignReducer'

type FlowDesignContextValue = {
  state: FlowDesignState
  dispatch: React.Dispatch<FlowDesignAction>
}

const FlowDesignContext = createContext<FlowDesignContextValue | null>(null)

export function FlowDesignProvider({ children }: { children: ReactNode }) {
  const boot = useMemo(() => loadFlowDesignPersisted() ?? initialFlowDesignPersisted(), [])
  const [state, dispatch] = useReducer(
    flowDesignReducer,
    boot,
    ({ doc, ui }) => createFlowDesignState(doc, ui),
  )

  useEffect(() => {
    const t = window.setTimeout(() => {
      saveFlowDesignPersisted({
        v: 1,
        doc: state.doc,
        ui: state.ui,
      })
    }, 450)
    return () => window.clearTimeout(t)
  }, [state.doc, state.ui])

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return (
    <FlowDesignContext.Provider value={value}>{children}</FlowDesignContext.Provider>
  )
}

export function useFlowDesign(): FlowDesignContextValue {
  const ctx = useContext(FlowDesignContext)
  if (!ctx) {
    throw new Error('useFlowDesign deve estar dentro de FlowDesignProvider')
  }
  return ctx
}
