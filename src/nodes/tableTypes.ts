export type TableField = {
  /** Identificador estável para handles (`${key}-in` / `${key}-out`) */
  key: string
  name: string
  type: string
  pk?: boolean
  /** Campo obrigatório (diamante cheio), se não for PK */
  required?: boolean
  /** Campo opcional (diamante vazio) */
  optional?: boolean
  /** Inclui cláusula DEFAULT no SQL */
  hasDefault?: boolean
  /** Expressão SQL do DEFAULT (sem a palavra DEFAULT), ex.: true, 'ativo', CURRENT_TIMESTAMP */
  defaultValueSql?: string
}

export type TableNodeData = {
  tableName: string
  fields: TableField[]
  /** Cor do header do nó (hex), espelha o projeto — presente após sync no canvas */
  primaryColor?: string
}
