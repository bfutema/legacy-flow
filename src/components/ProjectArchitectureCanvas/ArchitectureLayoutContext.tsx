import { createContext, useContext } from 'react'

export type ArchitectureLayoutContextValue = {
  isMonorepo: boolean
}

export const ArchitectureLayoutContext = createContext<ArchitectureLayoutContextValue>({
  isMonorepo: true,
})

export function useArchitectureLayout(): ArchitectureLayoutContextValue {
  return useContext(ArchitectureLayoutContext)
}
