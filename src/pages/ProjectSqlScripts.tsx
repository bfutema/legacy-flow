import Editor from '@monaco-editor/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useConfirmDialog } from '../contexts/ConfirmDialogContext'
import { useThemeMode } from '../contexts/ThemeContext'
import { resolveProjectById } from '../data/projects'
import {
  loadProjectSqlScripts,
  newScriptId,
  type ProjectSqlScript,
  saveProjectSqlScripts,
} from '../persistence/projectSqlScriptsStorage'
import { BackLink, PageTitle } from './DatabaseModeling.styles'
import {
  SqlMonacoWrap,
  SqlScriptListButton,
  SqlScriptListItem,
  SqlScriptListMeta,
  SqlScriptsDangerButton,
  SqlScriptsEditorPanel,
  SqlScriptsEmpty,
  SqlScriptsFeedback,
  SqlScriptsField,
  SqlScriptsGhostButton,
  SqlScriptsHint,
  SqlScriptsInput,
  SqlScriptsLabel,
  SqlScriptsLayout,
  SqlScriptsList,
  SqlScriptsModelingLink,
  SqlScriptsPrimaryButton,
  SqlScriptsRoot,
  SqlScriptsSidebar,
  SqlScriptsSidebarTitle,
  SqlScriptsTextarea,
  SqlScriptsToolbar,
} from './ProjectSqlScripts.styles'

function isoNow(): string {
  return new Date().toISOString()
}

type WorkspaceProps = {
  projectId: string
  projectName: string
}

function ProjectSqlScriptsWorkspace({ projectId, projectName }: WorkspaceProps) {
  const { confirm } = useConfirmDialog()
  const { mode } = useThemeMode()
  const [scripts, setScripts] = useState(() => loadProjectSqlScripts(projectId))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sql, setSql] = useState('')
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(
    null,
  )

  const persist = useCallback(
    (next: ProjectSqlScript[]) => {
      setScripts(next)
      saveProjectSqlScripts(projectId, next)
    },
    [projectId],
  )

  const applyScriptToForm = useCallback((s: ProjectSqlScript) => {
    setSelectedId(s.id)
    setName(s.name)
    setDescription(s.description)
    setSql(s.sql)
    setFeedback(null)
  }, [])

  const onNew = useCallback(() => {
    setSelectedId(null)
    setName('')
    setDescription('')
    setSql('')
    setFeedback(null)
  }, [])

  const onSave = useCallback(() => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setFeedback({ text: 'Informe um nome para o script.', ok: false })
      return
    }
    const now = isoNow()
    if (selectedId) {
      const next = scripts.map((s) =>
        s.id === selectedId
          ? {
              ...s,
              name: trimmedName,
              description: description.trim(),
              sql,
              updatedAt: now,
            }
          : s,
      )
      persist(next)
      setFeedback({ text: 'Script atualizado.', ok: true })
    } else {
      const id = newScriptId()
      const row: ProjectSqlScript = {
        id,
        name: trimmedName,
        description: description.trim(),
        sql,
        createdAt: now,
        updatedAt: now,
      }
      persist([...scripts, row])
      setSelectedId(id)
      setFeedback({ text: 'Script criado.', ok: true })
    }
  }, [name, description, sql, selectedId, scripts, persist])

  const onDelete = useCallback(async () => {
    if (!selectedId) return
    const ok = await confirm({
      title: 'Excluir script',
      message:
        'Esta ação remove o script deste navegador. Não há como desfazer.',
      confirmLabel: 'Excluir',
      cancelLabel: 'Cancelar',
    })
    if (!ok) return
    const next = scripts.filter((s) => s.id !== selectedId)
    persist(next)
    onNew()
    setFeedback({ text: 'Script removido.', ok: true })
  }, [selectedId, scripts, persist, confirm, onNew])

  const monacoTheme = mode === 'dark' ? 'vs-dark' : 'vs'

  return (
    <SqlScriptsRoot>
      <BackLink to={`/projects/${projectId}`}>← Voltar ao projeto</BackLink>
      <PageTitle>Scripts SQL — {projectName}</PageTitle>
      <SqlScriptsHint>
        Biblioteca local de consultas e rotinas: nome, descrição e SQL com destaque
        de sintaxe (Monaco). Os dados ficam apenas neste navegador, por projeto —
        úteis para reutilizar quando a modelagem ou o dia a dia pedirem.
      </SqlScriptsHint>
      <SqlScriptsModelingLink to={`/projects/${projectId}/modeling`}>
        ← Abrir modelagem do banco
      </SqlScriptsModelingLink>

      <SqlScriptsLayout>
        <SqlScriptsSidebar>
          <SqlScriptsSidebarTitle>Scripts salvos</SqlScriptsSidebarTitle>
          <SqlScriptsToolbar>
            <SqlScriptsPrimaryButton type="button" onClick={onNew}>
              Novo script
            </SqlScriptsPrimaryButton>
          </SqlScriptsToolbar>
          {scripts.length === 0 ? (
            <SqlScriptsEmpty>
              Nenhum script ainda. Use &quot;Novo script&quot; e salve o primeiro.
            </SqlScriptsEmpty>
          ) : (
            <SqlScriptsList>
              {scripts.map((s) => (
                <SqlScriptListItem key={s.id}>
                  <SqlScriptListButton
                    type="button"
                    $active={s.id === selectedId}
                    onClick={() => applyScriptToForm(s)}
                  >
                    {s.name || '(sem nome)'}
                    <SqlScriptListMeta title={s.description}>
                      {s.description || 'Sem descrição'}
                    </SqlScriptListMeta>
                  </SqlScriptListButton>
                </SqlScriptListItem>
              ))}
            </SqlScriptsList>
          )}
        </SqlScriptsSidebar>

        <SqlScriptsEditorPanel>
          <SqlScriptsField>
            <SqlScriptsLabel htmlFor="sql-script-name">Nome</SqlScriptsLabel>
            <SqlScriptsInput
              id="sql-script-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Índices sugeridos para pedidos"
              autoComplete="off"
            />
          </SqlScriptsField>
          <SqlScriptsField>
            <SqlScriptsLabel htmlFor="sql-script-desc">
              Descrição
            </SqlScriptsLabel>
            <SqlScriptsTextarea
              id="sql-script-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que este script faz, quando usar, observações…"
            />
          </SqlScriptsField>
          <SqlScriptsField>
            <SqlScriptsLabel>SQL</SqlScriptsLabel>
            <SqlMonacoWrap>
              <Editor
                height="320px"
                language="sql"
                theme={monacoTheme}
                value={sql}
                onChange={(v) => setSql(v ?? '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 8 },
                }}
              />
            </SqlMonacoWrap>
          </SqlScriptsField>
          {feedback ? (
            <SqlScriptsFeedback $ok={feedback.ok}>{feedback.text}</SqlScriptsFeedback>
          ) : null}
          <SqlScriptsToolbar>
            <SqlScriptsPrimaryButton type="button" onClick={onSave}>
              {selectedId ? 'Salvar alterações' : 'Salvar script'}
            </SqlScriptsPrimaryButton>
            <SqlScriptsGhostButton type="button" onClick={onNew}>
              Limpar rascunho
            </SqlScriptsGhostButton>
            {selectedId ? (
              <SqlScriptsDangerButton type="button" onClick={() => void onDelete()}>
                Excluir
              </SqlScriptsDangerButton>
            ) : null}
          </SqlScriptsToolbar>
        </SqlScriptsEditorPanel>
      </SqlScriptsLayout>
    </SqlScriptsRoot>
  )
}

export function ProjectSqlScripts() {
  const { projectId } = useParams<{ projectId: string }>()
  const [metaTick, setMetaTick] = useState(0)

  useEffect(() => {
    const onMeta = () => setMetaTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', onMeta)
    return () => window.removeEventListener('flow-project-meta-changed', onMeta)
  }, [])

  const project = useMemo(
    () => (projectId ? resolveProjectById(projectId) : undefined),
    // metaTick: mesmo padrão de DatabaseModeling — re-resolve ao salvar metadados.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- metaTick invalida cache do nome
    [projectId, metaTick],
  )

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <ProjectSqlScriptsWorkspace
      key={project.id}
      projectId={project.id}
      projectName={project.name}
    />
  )
}
