export type TableField = {
  /** Identificador estável para handles (`${key}-in` / `${key}-out`) */
  key: string
  name: string
  type: string
  pk?: boolean
  /** Restrição UNIQUE (chave primária já implica unicidade) */
  unique?: boolean
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
  projectId?: string
  /** Namespace lógico da tabela (schema no PostgreSQL/SQL Server; database no MySQL). */
  schemaName?: string
  tableName: string
  fields: TableField[]
  /** Cor do header do nó (hex), espelha o projeto — presente após sync no canvas */
  primaryColor?: string
}
