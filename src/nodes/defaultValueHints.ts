import type { PrimaryDatabaseType } from '../data/databaseEngines'

export type InferredDefaultKind =
  | 'boolean'
  | 'integer'
  | 'numeric'
  | 'text'
  | 'datetime'
  | 'uuid'
  | 'json'
  | 'generic'

/** Classifica o tipo da coluna (string livre) para sugestões de DEFAULT. */
export function inferDefaultKind(typeRaw: string): InferredDefaultKind {
  const t = typeRaw.toLowerCase().replace(/\s+/g, ' ').trim()

  if (
    /\bbool(ean)?\b/.test(t) ||
    /^bit(\(1\))?$/i.test(t.replace(/\s/g, ''))
  ) {
    return 'boolean'
  }
  if (
    /\b(small|medium|big)?int\b/.test(t) ||
    /\bint[248]\b/.test(t) ||
    /\b(int2|int4|int8)\b/.test(t) ||
    /\bserial\b/.test(t) ||
    /\bbigserial\b/.test(t)
  ) {
    return 'integer'
  }
  if (
    /\b(decimal|numeric|float|double|real|money)\b/.test(t) ||
    /\b(fixed)\b/.test(t)
  ) {
    return 'numeric'
  }
  if (/\b(json|jsonb)\b/.test(t)) {
    return 'json'
  }
  if (/\buuid\b/.test(t) || /\buniqueidentifier\b/.test(t)) {
    return 'uuid'
  }
  if (
    /\b(date|time|timestamp|datetime|year)\b/.test(t) ||
    /\b(smalldate|datetime2|datetimeoffset)\b/.test(t)
  ) {
    return 'datetime'
  }
  if (
    /\b(char|varchar|nvarchar|nchar|text|ntext|clob|string|citext)\b/.test(t) ||
    /\benum\b/.test(t)
  ) {
    return 'text'
  }
  return 'generic'
}

export type DefaultSuggestion = { value: string; label: string }

export function suggestedDefaultsForType(
  typeRaw: string,
  engine: PrimaryDatabaseType,
): DefaultSuggestion[] {
  const kind = inferDefaultKind(typeRaw)
  const out: DefaultSuggestion[] = []

  switch (kind) {
    case 'boolean':
      out.push(
        { value: 'true', label: 'true' },
        { value: 'false', label: 'false' },
      )
      if (engine === 'mysql' || engine === 'mssql') {
        out.push({ value: '1', label: '1 (verdadeiro)' })
        out.push({ value: '0', label: '0 (falso)' })
      }
      return out
    case 'integer':
      out.push(
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '-1', label: '-1' },
      )
      return out
    case 'numeric':
      out.push(
        { value: '0', label: '0' },
        { value: '0.0', label: '0.0' },
      )
      return out
    case 'text':
      out.push(
        { value: "''", label: "'' (vazio)" },
        { value: "'ativo'", label: "'ativo'" },
      )
      return out
    case 'json':
      out.push(
        { value: "'{}'", label: "'{}'" },
        { value: "'[]'", label: "'[]'" },
      )
      return out
    case 'uuid':
      if (engine === 'postgresql') {
        out.push(
          { value: 'gen_random_uuid()', label: 'gen_random_uuid()' },
          { value: 'uuid_generate_v4()', label: 'uuid_generate_v4()' },
        )
      } else if (engine === 'mysql') {
        out.push({ value: 'UUID()', label: 'UUID()' })
      } else {
        out.push({ value: 'NEWID()', label: 'NEWID()' })
      }
      return out
    case 'datetime':
      if (engine === 'postgresql') {
        out.push(
          { value: 'now()', label: 'now()' },
          { value: 'CURRENT_TIMESTAMP', label: 'CURRENT_TIMESTAMP' },
          { value: 'CURRENT_DATE', label: 'CURRENT_DATE' },
        )
      } else if (engine === 'mysql') {
        out.push(
          { value: 'CURRENT_TIMESTAMP', label: 'CURRENT_TIMESTAMP' },
          { value: 'CURRENT_DATE', label: 'CURRENT_DATE' },
          { value: 'NOW()', label: 'NOW()' },
        )
      } else {
        out.push(
          { value: 'GETDATE()', label: 'GETDATE()' },
          { value: 'SYSUTCDATETIME()', label: 'SYSUTCDATETIME()' },
          { value: 'GETUTCDATE()', label: 'GETUTCDATE()' },
        )
      }
      return out
    default:
      out.push({ value: 'NULL', label: 'NULL' })
      return out
  }
}
