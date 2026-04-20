import type { PrimaryDatabaseType } from '../data/databaseEngines'
import type { TableField } from './tableTypes'

/** Definições de created_at / updated_at / deleted_at alinhadas ao motor do projeto. */
export function auditControlFieldTemplates(
  engine: PrimaryDatabaseType,
): Omit<TableField, 'key'>[] {
  switch (engine) {
    case 'mysql':
      return [
        {
          name: 'created_at',
          type: 'timestamp',
          required: true,
          hasDefault: true,
          defaultValueSql: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          required: true,
          hasDefault: true,
          defaultValueSql: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        },
        {
          name: 'deleted_at',
          type: 'timestamp',
          optional: true,
        },
      ]
    case 'postgresql':
      return [
        {
          name: 'created_at',
          type: 'timestamptz',
          required: true,
          hasDefault: true,
          defaultValueSql: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updated_at',
          type: 'timestamptz',
          required: true,
          hasDefault: true,
          defaultValueSql: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'deleted_at',
          type: 'timestamptz',
          optional: true,
        },
      ]
    case 'mssql':
      return [
        {
          name: 'created_at',
          type: 'datetime2',
          required: true,
          hasDefault: true,
          defaultValueSql: 'SYSUTCDATETIME()',
        },
        {
          name: 'updated_at',
          type: 'datetime2',
          required: true,
          hasDefault: true,
          defaultValueSql: 'SYSUTCDATETIME()',
        },
        {
          name: 'deleted_at',
          type: 'datetime2',
          optional: true,
        },
      ]
  }
}
