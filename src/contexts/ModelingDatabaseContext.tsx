import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import type { PrimaryDatabaseType } from '../data/databaseEngines'

export type ModelingProjectContextValue = {
  engine: PrimaryDatabaseType
  /** Cor primária do projeto — header dos nós de tabela */
  primaryColor: string
}

const ModelingDatabaseContext =
  createContext<ModelingProjectContextValue | null>(null)

export function ModelingDatabaseProvider({
  engine,
  primaryColor,
  children,
}: {
  engine: PrimaryDatabaseType
  primaryColor: string
  children: ReactNode
}) {
  const value = useMemo(
    () => ({ engine, primaryColor }),
    [engine, primaryColor],
  )
  return (
    <ModelingDatabaseContext.Provider value={value}>
      {children}
    </ModelingDatabaseContext.Provider>
  )
}

export function useModelingDatabase(): ModelingProjectContextValue {
  const ctx = useContext(ModelingDatabaseContext)
  if (ctx === null) {
    throw new Error(
      'useModelingDatabase must be used within ModelingDatabaseProvider',
    )
  }
  return ctx
}
