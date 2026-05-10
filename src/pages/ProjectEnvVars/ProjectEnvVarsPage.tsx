import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../../contexts/AbilityContext'
import { resolveProjectById } from '../../data/projects'
import {
  envVarsForBackendSync,
  loadProjectEnvVars,
  saveProjectEnvVars,
  validateEnvKey,
  type ProjectEnvVarEntry,
} from '../../persistence/projectEnvVarsStorage'
import {
  BackLink,
  PanelSectionLabel,
  ProjectDetailRoot,
  SettingsForm,
  SettingsHeaderRow,
  SettingsPageLead,
  SettingsPageTitle,
  SettingsSavedFlash,
  SettingsSubmitButton,
  SettingsSubmitRow,
  SettingsTitleBlock,
  SideOverviewPanel,
} from '../ProjectDetail.styles'
import {
  EnvBtn,
  EnvBtnPrimary,
  EnvEmptyTd,
  EnvError,
  EnvHint,
  EnvKeyInput,
  EnvRemoveBtn,
  EnvTable,
  EnvTableWrap,
  EnvTd,
  EnvTh,
  EnvToolbar,
  EnvValueInput,
} from './ProjectEnvVarsPage.styles'

function newRow(): ProjectEnvVarEntry {
  return { id: crypto.randomUUID(), key: '', value: '' }
}

function findDuplicateKeys(items: ProjectEnvVarEntry[]): string | null {
  const seen = new Set<string>()
  for (const it of items) {
    const k = it.key.trim().toUpperCase()
    if (!k) continue
    if (seen.has(k)) return `Chave duplicada: ${k}`
    seen.add(k)
  }
  return null
}

function invalidKeyInRows(items: ProjectEnvVarEntry[]): string | null {
  for (const it of items) {
    const t = it.key.trim()
    if (!t) continue
    const v = validateEnvKey(t)
    if (!v.ok) return v.message
  }
  return null
}

function valueWithoutKeyError(items: ProjectEnvVarEntry[]): string | null {
  for (const it of items) {
    if (it.value.trim() && !it.key.trim()) {
      return 'Toda linha com valor precisa de um nome de variável.'
    }
  }
  return null
}

export function ProjectEnvVarsPage() {
  const ability = useAbility(AbilityContext)
  const { projectId } = useParams<{ projectId: string }>()
  const pid = projectId ?? ''
  const project = pid ? resolveProjectById(pid) : undefined
  const canUpdate = ability.can('update', 'Project')

  const [items, setItems] = useState<ProjectEnvVarEntry[]>([])
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    if (!pid) return
    const loaded = loadProjectEnvVars(pid)
    setItems(loaded.items.length ? loaded.items : [])
  }, [pid])

  const blockMessage = useMemo(() => {
    const d = findDuplicateKeys(items)
    if (d) return d
    const k = invalidKeyInRows(items)
    if (k) return k
    return valueWithoutKeyError(items)
  }, [items])

  const handleSave = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!pid || !canUpdate) return
      if (blockMessage) return
      const cleaned = items.filter((r) => r.key.trim() !== '')
      const normalized = cleaned.map((r) => {
        const vk = validateEnvKey(r.key)
        return {
          ...r,
          key: vk.ok ? vk.key : r.key.trim().toUpperCase(),
        }
      })
      saveProjectEnvVars(pid, {
        v: 1,
        updatedAt: new Date().toISOString(),
        items: normalized,
      })
      setItems(normalized)
      setSavedFlash(true)
      window.setTimeout(() => setSavedFlash(false), 2200)
    },
    [pid, items, canUpdate, blockMessage],
  )

  const addRow = () => setItems((prev) => [...prev, newRow()])
  const removeRow = (id: string) => setItems((prev) => prev.filter((r) => r.id !== id))

  const updateRow = (id: string, patch: Partial<Pick<ProjectEnvVarEntry, 'key' | 'value'>>) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const copyPayload = async () => {
    if (!pid) return
    const payload = envVarsForBackendSync(pid, items)
    const text = JSON.stringify(payload, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      setSavedFlash(true)
      window.setTimeout(() => setSavedFlash(false), 2200)
    } catch {
      /* ignore */
    }
  }

  if (!pid) return <Navigate to="/projects" replace />
  if (!project) return <Navigate to="/projects" replace />

  return (
    <ProjectDetailRoot>
      <BackLink to={`/projects/${project.id}/settings`}>← Configurações do projeto</BackLink>
      <SettingsHeaderRow>
        <SettingsTitleBlock>
          <SettingsPageTitle>Variáveis de ambiente</SettingsPageTitle>
          <SettingsPageLead>
            Chaves e valores por projeto, guardados neste navegador. Quando existir API de
            backend, o mesmo formato poderá ser enviado para provisionar serviços e pipelines.
          </SettingsPageLead>
        </SettingsTitleBlock>
      </SettingsHeaderRow>

      <SideOverviewPanel>
        <SettingsForm onSubmit={handleSave}>
          <PanelSectionLabel>
            Variáveis ({items.filter((r) => r.key.trim()).length})
          </PanelSectionLabel>

          <EnvToolbar style={{ marginTop: '0.75rem' }}>
            <EnvBtnPrimary type="button" onClick={addRow} disabled={!canUpdate}>
              Adicionar variável
            </EnvBtnPrimary>
            <EnvBtn type="button" onClick={() => void copyPayload()}>
              Copiar JSON (backend)
            </EnvBtn>
          </EnvToolbar>

          {blockMessage ? <EnvError role="alert">{blockMessage}</EnvError> : null}

          <EnvTableWrap>
            <EnvTable>
              <thead>
                <tr>
                  <EnvTh>Nome</EnvTh>
                  <EnvTh>Valor</EnvTh>
                  <EnvTh aria-label="Ações" style={{ width: '5.5rem' }} />
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <EnvEmptyTd colSpan={3}>
                      Nenhuma variável. Use &quot;Adicionar variável&quot; para começar (ex.:
                      DATABASE_URL, API_KEY).
                    </EnvEmptyTd>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id}>
                      <EnvTd>
                        <EnvKeyInput
                          aria-label="Nome da variável"
                          placeholder="NOME_DA_VARIAVEL"
                          value={row.key}
                          disabled={!canUpdate}
                          onChange={(e) => updateRow(row.id, { key: e.target.value })}
                          onBlur={() => {
                            const t = row.key.trim()
                            if (!t) return
                            const v = validateEnvKey(t)
                            if (v.ok) updateRow(row.id, { key: v.key })
                          }}
                        />
                      </EnvTd>
                      <EnvTd>
                        <EnvValueInput
                          aria-label={`Valor de ${row.key || 'variável'}`}
                          placeholder="valor ou segredo"
                          value={row.value}
                          disabled={!canUpdate}
                          onChange={(e) => updateRow(row.id, { value: e.target.value })}
                          autoComplete="off"
                        />
                      </EnvTd>
                      <EnvTd>
                        <EnvRemoveBtn
                          type="button"
                          disabled={!canUpdate}
                          onClick={() => removeRow(row.id)}
                        >
                          Remover
                        </EnvRemoveBtn>
                      </EnvTd>
                    </tr>
                  ))
                )}
              </tbody>
            </EnvTable>
          </EnvTableWrap>

          <EnvHint>
            <strong>Segurança:</strong> valores ficam em <code>localStorage</code> neste aparelho
            até haver backend autenticado. Evite segredos reais em ambientes compartilhados.{' '}
            <Link to={`/projects/${project.id}/settings`}>Voltar às configurações</Link>.
          </EnvHint>

          <SettingsSubmitRow style={{ marginTop: '1.15rem' }}>
            <SettingsSubmitButton type="submit" disabled={!canUpdate || Boolean(blockMessage)}>
              Salvar variáveis
            </SettingsSubmitButton>
            {savedFlash ? (
              <SettingsSavedFlash>Salvo neste navegador / copiado</SettingsSavedFlash>
            ) : null}
          </SettingsSubmitRow>
        </SettingsForm>
      </SideOverviewPanel>
    </ProjectDetailRoot>
  )
}
