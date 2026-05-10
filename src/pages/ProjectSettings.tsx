import { useAbility } from '@casl/react'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  isProjectCloudProvider,
  PROJECT_CLOUD_LABELS,
  PROJECT_CLOUDS,
} from '../data/cloudProviders'
import {
  isPrimaryDatabaseType,
  PRIMARY_DATABASE_LABELS,
  PRIMARY_DATABASES,
} from '../data/databaseEngines'
import { AbilityContext } from '../contexts/AbilityContext'
import { deleteProject, resolveProjectById } from '../data/projects'
import { useProjectCloud } from '../hooks/useProjectCloud'
import { useProjectMonorepo } from '../hooks/useProjectMonorepo'
import { useProjectPrimaryColor } from '../hooks/useProjectPrimaryColor'
import { useProjectPrimaryDatabase } from '../hooks/useProjectPrimaryDatabase'
import { HelpInfoTooltip } from '../components/HelpInfoTooltip/HelpInfoTooltip'
import { TrashDeleteButton } from '../components/TrashDeleteButton/TrashDeleteButton'
import {
  saveProjectTimelineCleared,
  saveProjectTimelineRange,
} from '../persistence/projectTimelineStorage'
import { saveProjectMetadata } from '../persistence/projectMetadataStorage'
import { formatDisplayDate } from '../utils/formatDisplayDate'
import {
  BackLink,
  DbLabelInRow,
  DbLabelRow,
  DbSelect,
  HeaderPageActions,
  PanelDbSettingRow,
  PanelDivider,
  PanelSectionLabel,
  ProjectDetailRoot,
  SettingsColorBoxLabel,
  SettingsColorHint,
  SettingsColorInput,
  SettingsColorRow,
  SettingsDateField,
  SettingsDateInput,
  SettingsDateRow,
  SettingsFieldBlock,
  SettingsFieldError,
  SettingsFieldHint,
  SettingsForm,
  SettingsHeaderRow,
  SettingsLabel,
  SettingsPageLead,
  SettingsPageTitle,
  SettingsReadOnlyId,
  SettingsSavedFlash,
  SettingsSubmitButton,
  SettingsSubmitRow,
  SettingsTextArea,
  SettingsTextInput,
  SettingsTitleBlock,
  SideOverviewPanel,
} from './ProjectDetail.styles'

export function ProjectSettings() {
  const ability = useAbility(AbilityContext)
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const [infoTick, setInfoTick] = useState(0)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [timelineStart, setTimelineStart] = useState('')
  const [timelineEnd, setTimelineEnd] = useState('')
  const [dateError, setDateError] = useState<string | null>(null)
  const [savedFlash, setSavedFlash] = useState(false)
  const canUpdateProject = ability.can('update', 'Project')
  const canDeleteProject = ability.can('delete', 'Project')

  const { primaryDatabase, setPrimaryDatabase } =
    useProjectPrimaryDatabase(projectId)
  const { projectCloud, setProjectCloud } = useProjectCloud(projectId)
  const { isMonorepo, setMultiRepoLayout } = useProjectMonorepo(projectId)
  const { primaryColor, setPrimaryColor } = useProjectPrimaryColor(projectId)

  useEffect(() => {
    const bump = () => setInfoTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', bump)
    return () => {
      window.removeEventListener('flow-project-meta-changed', bump)
    }
  }, [])

  const project = useMemo(
    () => (projectId ? resolveProjectById(projectId) : undefined),
    [projectId, infoTick],
  )

  useEffect(() => {
    if (!project) return
    setName(project.name)
    setDescription(project.description)
    setTimelineStart(project.timelineStartDate?.trim() ?? '')
    setTimelineEnd(project.timelineEndDate?.trim() ?? '')
    setDateError(null)
  }, [project])

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!canUpdateProject) return
    const n = name.trim()
    if (!n) return
    const ts = timelineStart.trim()
    const te = timelineEnd.trim()
    if ((ts && !te) || (!ts && te)) {
      setDateError('Informe data de início e fim juntas, ou deixe os dois em branco.')
      return
    }
    if (ts && te && ts > te) {
      setDateError('A data de fim deve ser igual ou posterior à de início.')
      return
    }
    setDateError(null)

    saveProjectMetadata(project.id, {
      name: n,
      description: description.trim(),
      updatedAt: new Date().toISOString(),
    })

    if (ts && te) {
      saveProjectTimelineRange(project.id, ts, te)
    } else {
      saveProjectTimelineCleared(project.id)
    }

    setInfoTick((x) => x + 1)
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2200)
  }

  return (
    <ProjectDetailRoot>
      <BackLink to={`/projects/${project.id}`}>← Visão geral do projeto</BackLink>
      <SettingsHeaderRow>
        <SettingsTitleBlock>
          <SettingsPageTitle>Configurações do projeto</SettingsPageTitle>
          <SettingsPageLead>
            Altere nome, descrição, identidade visual, período na timeline e preferências
            técnicas. Valores são salvos neste navegador.
          </SettingsPageLead>
        </SettingsTitleBlock>
        {canDeleteProject ? (
          <HeaderPageActions>
            <TrashDeleteButton
              aria-label="Excluir projeto"
              confirm={{
                title: 'Excluir projeto',
                message: `Tem certeza que deseja excluir “${project.name}”? O diagrama e as alterações salvas neste aparelho serão apagados.`,
                confirmLabel: 'Excluir',
                cancelLabel: 'Cancelar',
              }}
              onSuccess={() => {
                deleteProject(project.id)
                navigate('/projects', { replace: true })
              }}
            />
          </HeaderPageActions>
        ) : null}
      </SettingsHeaderRow>
      <SideOverviewPanel>
        <SettingsForm onSubmit={handleSubmit}>
          <div>
            <PanelSectionLabel>Geral</PanelSectionLabel>
            <SettingsFieldBlock style={{ marginTop: '0.65rem' }}>
              <SettingsLabel htmlFor="settings-project-id">ID do projeto</SettingsLabel>
              <SettingsReadOnlyId
                id="settings-project-id"
                value={project.id}
                readOnly
                aria-readonly
              />
              <SettingsFieldHint>Identificador interno (somente leitura).</SettingsFieldHint>
            </SettingsFieldBlock>
            <SettingsFieldBlock>
              <SettingsLabel htmlFor="settings-project-name">Nome</SettingsLabel>
              <SettingsTextInput
                id="settings-project-name"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                disabled={!canUpdateProject}
                autoComplete="off"
                required
              />
            </SettingsFieldBlock>
            <SettingsFieldBlock>
              <SettingsLabel htmlFor="settings-project-desc">Descrição</SettingsLabel>
              <SettingsTextArea
                id="settings-project-desc"
                value={description}
                onChange={(ev) => setDescription(ev.target.value)}
                disabled={!canUpdateProject}
                rows={4}
                placeholder="Resumo do escopo ou observações."
              />
            </SettingsFieldBlock>
            <SettingsFieldHint style={{ marginTop: '0.15rem' }}>
              Última atualização registrada: {formatDisplayDate(project.updatedAt)}
            </SettingsFieldHint>
          </div>

          <PanelDivider />

          <div>
            <PanelSectionLabel>Identidade visual</PanelSectionLabel>
            <SettingsFieldBlock style={{ marginTop: '0.65rem' }}>
              <SettingsLabel>Cor primária</SettingsLabel>
              <SettingsColorRow>
                <SettingsColorBoxLabel title="Cor dos cabeçalhos das tabelas na modelagem">
                  <SettingsColorInput
                    type="color"
                    value={primaryColor}
                    disabled={!canUpdateProject}
                    onChange={(ev) => {
                      if (!canUpdateProject) return
                      setPrimaryColor(ev.target.value)
                    }}
                    aria-label="Cor primária do projeto"
                  />
                </SettingsColorBoxLabel>
                <SettingsColorHint>
                  Usada nos cabeçalhos das tabelas no diagrama de modelagem ({primaryColor}).
                </SettingsColorHint>
              </SettingsColorRow>
            </SettingsFieldBlock>
          </div>

          <PanelDivider />

          <div>
            <PanelSectionLabel>Período na timeline</PanelSectionLabel>
            <SettingsFieldHint style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              Opcional. Exibido na timeline quando não há alocações; informe início e fim
              juntos ou deixe os dois em branco para não definir período.
            </SettingsFieldHint>
            <SettingsDateRow>
              <SettingsDateField>
                <SettingsLabel htmlFor="settings-timeline-start">Início</SettingsLabel>
                <SettingsDateInput
                  id="settings-timeline-start"
                  value={timelineStart}
                  onChange={(ev) => setTimelineStart(ev.target.value)}
                  disabled={!canUpdateProject}
                />
              </SettingsDateField>
              <SettingsDateField>
                <SettingsLabel htmlFor="settings-timeline-end">Fim</SettingsLabel>
                <SettingsDateInput
                  id="settings-timeline-end"
                  value={timelineEnd}
                  onChange={(ev) => setTimelineEnd(ev.target.value)}
                  disabled={!canUpdateProject}
                />
              </SettingsDateField>
            </SettingsDateRow>
            {dateError ? <SettingsFieldError>{dateError}</SettingsFieldError> : null}
          </div>

          <PanelDivider />

          <div>
            <PanelSectionLabel>Técnico</PanelSectionLabel>
            <SettingsFieldBlock style={{ marginTop: '0.65rem' }}>
              <PanelDbSettingRow>
                <DbLabelRow>
                  <DbLabelInRow htmlFor="settings-project-primary-db">
                    Motor SQL principal
                  </DbLabelInRow>
                  <HelpInfoTooltip
                    ariaLabel="Ajuda: motor SQL e sugestões de tipo"
                    tooltipId="settings-project-primary-db-tip"
                  >
                    Tipos sugeridos ao editar colunas seguem o motor escolhido (MySQL,
                    PostgreSQL ou SQL Server).
                  </HelpInfoTooltip>
                </DbLabelRow>
                <DbSelect
                  id="settings-project-primary-db"
                  value={primaryDatabase}
                  disabled={!canUpdateProject}
                  onChange={(ev) => {
                    const v = ev.target.value
                    if (isPrimaryDatabaseType(v)) setPrimaryDatabase(v)
                  }}
                >
                  {PRIMARY_DATABASES.map((key) => (
                    <option key={key} value={key}>
                      {PRIMARY_DATABASE_LABELS[key]}
                    </option>
                  ))}
                </DbSelect>
              </PanelDbSettingRow>
            </SettingsFieldBlock>
            <SettingsFieldBlock>
              <PanelDbSettingRow>
                <DbLabelRow>
                  <DbLabelInRow htmlFor="settings-project-primary-cloud">
                    Cloud principal
                  </DbLabelInRow>
                  <HelpInfoTooltip
                    ariaLabel="Ajuda: cloud padrão do projeto"
                    tooltipId="settings-project-primary-cloud-tip"
                  >
                    Novas filas no mapa de arquitetura usam por padrão o serviço da cloud
                    escolhida (AWS SQS, GCP Pub/Sub ou Azure Service Bus). Você ainda pode
                    trocar por bloco depois.
                  </HelpInfoTooltip>
                </DbLabelRow>
                <DbSelect
                  id="settings-project-primary-cloud"
                  value={projectCloud}
                  disabled={!canUpdateProject}
                  onChange={(ev) => {
                    const v = ev.target.value
                    if (isProjectCloudProvider(v)) setProjectCloud(v)
                  }}
                >
                  {PROJECT_CLOUDS.map((key) => (
                    <option key={key} value={key}>
                      {PROJECT_CLOUD_LABELS[key]}
                    </option>
                  ))}
                </DbSelect>
              </PanelDbSettingRow>
            </SettingsFieldBlock>
            <SettingsFieldBlock>
              <PanelDbSettingRow>
                <DbLabelRow>
                  <DbLabelInRow htmlFor="settings-project-repo-layout">
                    Estrutura do código
                  </DbLabelInRow>
                  <HelpInfoTooltip
                    ariaLabel="Ajuda: layout do repositório"
                    tooltipId="settings-project-repo-layout-tip"
                  >
                    Monorepo (padrão): um explorador com pastas apps/ e packages/. Repositórios
                    separados: um cartão por bloco, como projetos distintos.
                  </HelpInfoTooltip>
                </DbLabelRow>
                <DbSelect
                  id="settings-project-repo-layout"
                  value={isMonorepo ? 'monorepo' : 'multi'}
                  disabled={!canUpdateProject}
                  onChange={(ev) => setMultiRepoLayout(ev.target.value === 'multi')}
                >
                  <option value="monorepo">Monorepo (padrão)</option>
                  <option value="multi">Repositórios separados</option>
                </DbSelect>
              </PanelDbSettingRow>
            </SettingsFieldBlock>
          </div>

          <PanelDivider />

          <div>
            <PanelSectionLabel>Deploy e backend</PanelSectionLabel>
            <SettingsFieldHint style={{ marginTop: '0.65rem' }}>
              Cadastre chaves e valores por projeto; no futuro o backend poderá receber esse
              conjunto ao criar serviços. Os dados ficam neste navegador até existir API.
            </SettingsFieldHint>
            <SettingsFieldBlock style={{ marginTop: '0.75rem' }}>
              <Link
                to={`/projects/${project.id}/environment`}
                style={{ fontWeight: 700, fontSize: '0.9rem' }}
              >
                Variáveis de ambiente →
              </Link>
            </SettingsFieldBlock>
          </div>

          <SettingsSubmitRow>
            <SettingsSubmitButton type="submit" disabled={!canUpdateProject}>
              Salvar alterações
            </SettingsSubmitButton>
            {savedFlash ? <SettingsSavedFlash>Salvo neste navegador</SettingsSavedFlash> : null}
          </SettingsSubmitRow>
        </SettingsForm>
      </SideOverviewPanel>
    </ProjectDetailRoot>
  )
}
