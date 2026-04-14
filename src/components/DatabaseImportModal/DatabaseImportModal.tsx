import type { Edge, Node } from '@xyflow/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  convertDatabaseMapToReactFlow,
  parseDatabaseMapJson,
} from '../../import/databaseMapToReactFlow'
import {
  Backdrop,
  EngineTab,
  EngineTabs,
  ErrorText,
  FileInput,
  GhostBtn,
  JsonTextarea,
  Overlay,
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PrimaryBtn,
  Row,
  SecondaryBtn,
  Section,
  SectionLabel,
  SqlTextarea,
  InlineHint,
  Subtitle,
  Title,
} from './DatabaseImportModal.styles'

export type DatabaseImportModalProps = {
  open: boolean
  onClose: () => void
  /** Scripts para copiar: MySQL/MariaDB e PostgreSQL */
  sqlScripts: { mysql: string; postgresql: string }
  primaryColor: string
  edgeStroke: string
  /** Confirma substituição do diagrama atual */
  onConfirmReplace: (message: string) => Promise<boolean>
  onApply: (nodes: Node[], edges: Edge[]) => void
}

export function DatabaseImportModal({
  open,
  onClose,
  sqlScripts,
  primaryColor,
  edgeStroke,
  onConfirmReplace,
  onApply,
}: DatabaseImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [engine, setEngine] = useState<'mysql' | 'postgresql'>('mysql')
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copySqlHint, setCopySqlHint] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const activeSql = engine === 'mysql' ? sqlScripts.mysql : sqlScripts.postgresql

  useEffect(() => {
    if (!open) {
      setEngine('mysql')
      setJsonText('')
      setError(null)
      setCopySqlHint(null)
      setBusy(false)
    }
  }, [open])

  const handleCopySql = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(activeSql)
      setCopySqlHint('Script copiado para a área de transferência.')
      window.setTimeout(() => setCopySqlHint(null), 2500)
    } catch {
      setCopySqlHint('Não foi possível copiar automaticamente; selecione o texto manualmente.')
    }
  }, [activeSql])

  const handleFile = useCallback((file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const t = typeof reader.result === 'string' ? reader.result : ''
      setJsonText(t)
      setError(null)
    }
    reader.onerror = () => setError('Falha ao ler o arquivo.')
    reader.readAsText(file, 'UTF-8')
  }, [])

  const handleApply = useCallback(async () => {
    setError(null)
    const meta = parseDatabaseMapJson(jsonText)
    if (!meta) {
      setError(
        'JSON inválido ou formato inesperado. Esperado: fk_info, pk_info, columns e tables (mesmo formato MySQL/PG dos scripts do projeto).',
      )
      return
    }

    const ok = await onConfirmReplace(
      'O diagrama atual será substituído pelo importado. Deseja continuar?',
    )
    if (!ok) return

    setBusy(true)
    try {
      const { nodes, edges } = convertDatabaseMapToReactFlow(meta, {
        primaryColor,
        edgeStroke,
      })
      onApply(nodes, edges)
      onClose()
    } finally {
      setBusy(false)
    }
  }, [
    jsonText,
    primaryColor,
    edgeStroke,
    onApply,
    onClose,
    onConfirmReplace,
  ])

  if (!open) return null

  const engineHint =
    engine === 'mysql' ? (
      <>
        Script para <strong>MySQL</strong> ou <strong>MariaDB</strong>. Rode no cliente, copie o
        JSON da coluna de resultado.
      </>
    ) : (
      <>
        Script para <strong>PostgreSQL</strong>. Rode no cliente (<code>psql</code> ou similar),
        copie o JSON da coluna <code>metadata_json_to_import</code>.
      </>
    )

  return (
    <Overlay role="dialog" aria-modal="true" aria-labelledby="db-import-title">
      <Backdrop type="button" aria-label="Fechar" onClick={onClose} />
      <Panel className="nodrag nopan" onClick={(e) => e.stopPropagation()}>
        <PanelHeader>
          <Title id="db-import-title">Importar esquema do banco</Title>
          <Subtitle>
            Escolha o motor, copie o SQL correspondente, execute no banco e cole abaixo o JSON
            gerado. O formato do JSON é o mesmo para MySQL e PostgreSQL (tabelas, colunas, FKs).
          </Subtitle>
        </PanelHeader>
        <PanelBody>
          <Section>
            <SectionLabel>1. Motor e script SQL</SectionLabel>
            <EngineTabs role="tablist" aria-label="Motor do banco">
              <EngineTab
                type="button"
                role="tab"
                aria-selected={engine === 'mysql'}
                $active={engine === 'mysql'}
                onClick={() => setEngine('mysql')}
              >
                MySQL / MariaDB
              </EngineTab>
              <EngineTab
                type="button"
                role="tab"
                aria-selected={engine === 'postgresql'}
                $active={engine === 'postgresql'}
                onClick={() => setEngine('postgresql')}
              >
                PostgreSQL
              </EngineTab>
            </EngineTabs>
            <Subtitle>{engineHint}</Subtitle>
            <SqlTextarea readOnly value={activeSql} spellCheck={false} />
            <Row>
              <SecondaryBtn type="button" onClick={handleCopySql}>
                Copiar script
              </SecondaryBtn>
              {copySqlHint ? <InlineHint>{copySqlHint}</InlineHint> : null}
            </Row>
          </Section>
          <Section>
            <SectionLabel>2. JSON gerado pela consulta</SectionLabel>
            <JsonTextarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value)
                setError(null)
              }}
              placeholder='Cole o JSON aqui ou use "Carregar arquivo .json"...'
              spellCheck={false}
            />
            <Row>
              <SecondaryBtn
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                Carregar arquivo .json
              </SecondaryBtn>
              <FileInput
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </Row>
            {error ? <ErrorText>{error}</ErrorText> : null}
          </Section>
        </PanelBody>
        <PanelFooter>
          <GhostBtn type="button" onClick={onClose} disabled={busy}>
            Cancelar
          </GhostBtn>
          <PrimaryBtn type="button" onClick={handleApply} disabled={busy || !jsonText.trim()}>
            {busy ? 'Aplicando…' : 'Aplicar ao diagrama'}
          </PrimaryBtn>
        </PanelFooter>
      </Panel>
    </Overlay>
  )
}
