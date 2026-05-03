import { FlowDesignProvider } from '../flowDesign/state/FlowDesignContext'
import { FlowDesignShell } from '../flowDesign/components/FlowDesignShell'

export function FlowDesignStudioPage() {
  return (
    <FlowDesignProvider>
      <FlowDesignShell />
    </FlowDesignProvider>
  )
}
