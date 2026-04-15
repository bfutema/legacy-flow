import { useEffect, useMemo, useRef } from 'react'
import type { PrimaryDatabaseType } from '../data/databaseEngines'
import {
  suggestedDefaultsForType,
  inferDefaultKind,
} from './defaultValueHints'
import type { TableField } from './tableTypes'
import {
  ConstraintsButton,
  ConstraintsHint,
  ConstraintsPanel,
  ConstraintsRow,
  ConstraintsTitle,
  ConstraintsWrap,
  DefaultBlock,
  DefaultInput,
  SuggestionChip,
  SuggestionRow,
} from './FieldConstraintsPanel.styles'

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type Props = {
  field: TableField
  engine: PrimaryDatabaseType
  open: boolean
  onToggle: () => void
  onClose: () => void
  onPatch: (patch: Partial<TableField>) => void
}

export function FieldConstraintsPanel({
  field,
  engine,
  open,
  onToggle,
  onClose,
  onPatch,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)

  const notNull = field.pk === true || field.required === true
  const hasDefault = field.hasDefault === true
  const isUnique = field.unique === true && field.pk !== true
  const defaultSql = field.defaultValueSql ?? ''

  const suggestions = useMemo(
    () => suggestedDefaultsForType(field.type, engine),
    [field.type, engine],
  )

  const kindLabel = useMemo(() => {
    const k = inferDefaultKind(field.type)
    const map: Record<string, string> = {
      boolean: 'booleano',
      integer: 'inteiro',
      numeric: 'numérico',
      text: 'texto',
      datetime: 'data/hora',
      uuid: 'UUID',
      json: 'JSON',
      generic: 'geral',
    }
    return map[k] ?? k
  }, [field.type])

  useEffect(() => {
    if (!open) return
    const onDocDown = (e: MouseEvent) => {
      const el = wrapRef.current
      if (el && !el.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', onDocDown, true)
    return () => document.removeEventListener('mousedown', onDocDown, true)
  }, [open, onClose])

  return (
    <ConstraintsWrap ref={wrapRef}>
      <ConstraintsButton
        type="button"
        className="nodrag nopan"
        $active={open || hasDefault || isUnique}
        title="Restrições e valor padrão (DEFAULT)"
        aria-expanded={open}
        aria-label="Abrir restrições do campo"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
      >
        <GearIcon />
      </ConstraintsButton>
      {open ? (
        <ConstraintsPanel
          className="nodrag nopan"
          role="dialog"
          aria-label={`Restrições: ${field.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ConstraintsTitle>Restrições</ConstraintsTitle>
          <ConstraintsRow>
            <input
              type="checkbox"
              checked={notNull}
              disabled={field.pk === true}
              onChange={() => {
                if (field.pk) return
                if (notNull) {
                  onPatch({ required: false, optional: true })
                } else {
                  onPatch({ required: true, optional: false })
                }
              }}
            />
            <span>Obrigatório (NOT NULL)</span>
          </ConstraintsRow>
          {field.pk ? (
            <ConstraintsHint>Chave primária é sempre NOT NULL.</ConstraintsHint>
          ) : null}

          <ConstraintsRow>
            <input
              type="checkbox"
              checked={field.unique === true}
              disabled={field.pk === true}
              onChange={() => {
                if (field.pk) return
                onPatch({ unique: !field.unique })
              }}
            />
            <span>Único (UNIQUE)</span>
          </ConstraintsRow>
          {field.pk ? (
            <ConstraintsHint>Chave primária já é única; não é necessário UNIQUE.</ConstraintsHint>
          ) : null}

          <DefaultBlock>
            <ConstraintsRow>
              <input
                type="checkbox"
                checked={hasDefault}
                onChange={() => {
                  if (hasDefault) {
                    onPatch({ hasDefault: false, defaultValueSql: undefined })
                  } else {
                    const first = suggestions[0]?.value ?? ''
                    onPatch({
                      hasDefault: true,
                      defaultValueSql: defaultSql || first,
                    })
                  }
                }}
              />
              <span>Valor padrão (DEFAULT)</span>
            </ConstraintsRow>
            <ConstraintsHint>
              Tipo inferido: {kindLabel}. Sugestões adaptadas ao motor SQL.
            </ConstraintsHint>
            <DefaultInput
              className="nodrag nopan"
              value={defaultSql}
              disabled={!hasDefault}
              placeholder={
                hasDefault ? 'Expressão SQL (ex: true, CURRENT_TIMESTAMP)' : '—'
              }
              aria-label="Expressão SQL do DEFAULT"
              onChange={(e) =>
                onPatch({
                  hasDefault: true,
                  defaultValueSql: e.target.value,
                })
              }
            />
            {hasDefault && suggestions.length > 0 ? (
              <SuggestionRow>
                {suggestions.map((s, i) => (
                  <SuggestionChip
                    key={`${i}-${s.value}`}
                    type="button"
                    className="nodrag nopan"
                    title={s.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() =>
                      onPatch({
                        hasDefault: true,
                        defaultValueSql: s.value,
                      })
                    }
                  >
                    {s.label}
                  </SuggestionChip>
                ))}
              </SuggestionRow>
            ) : null}
          </DefaultBlock>
        </ConstraintsPanel>
      ) : null}
    </ConstraintsWrap>
  )
}
