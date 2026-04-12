export const PRIMARY_DATABASES = ['mysql', 'postgresql', 'mssql'] as const

export type PrimaryDatabaseType = (typeof PRIMARY_DATABASES)[number]

export function isPrimaryDatabaseType(v: string): v is PrimaryDatabaseType {
  return (PRIMARY_DATABASES as readonly string[]).includes(v)
}

export const PRIMARY_DATABASE_LABELS: Record<PrimaryDatabaseType, string> = {
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  mssql: 'Microsoft SQL Server',
}
