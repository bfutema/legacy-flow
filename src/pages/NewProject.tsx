import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  isPrimaryDatabaseType,
  PRIMARY_DATABASE_LABELS,
  PRIMARY_DATABASES,
} from '../data/databaseEngines'
import {
  createUserProject,
  DEFAULT_PROJECT_PRIMARY_COLOR,
} from '../data/projects'
import {
  BackLink,
  ColorBoxInput,
  ColorBoxLabel,
  ColorHint,
  ColorRow,
  DateField,
  DateInput,
  DateRow,
  FieldBlock,
  FieldError,
  FieldHint,
  Form,
  Label,
  Lead,
  PageTitle,
  Root,
  SubmitButton,
  TextArea,
  TextInput,
} from './NewProject.styles'
import {
  DbHint,
  DbLabel,
  DbSelect,
  DbSettingRow,
} from './ProjectDetail.styles'

export function NewProject() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [primaryDatabase, setPrimaryDatabase] = useState<
    (typeof PRIMARY_DATABASES)[number]
  >('mysql')
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PROJECT_PRIMARY_COLOR)
  const [timelineStart, setTimelineStart] = useState('')
  const [timelineEnd, setTimelineEnd] = useState('')
  const [dateError, setDateError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n || submitting) return
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
    setSubmitting(true)
    try {
      const project = createUserProject({
        name: n,
        description: description.trim(),
        primaryDatabase,
        primaryColor,
        ...(ts && te
          ? { timelineStartDate: ts, timelineEndDate: te }
          : {}),
      })
      navigate(`/projects/${project.id}`, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Root>
      <BackLink to="/projects">← Voltar aos projetos</BackLink>
      <PageTitle>Novo projeto</PageTitle>
      <Lead>
        Defina nome, descrição, motor SQL e cor. Opcionalmente informe o período do
        projeto para a Timeline; se não preencher, a faixa mostrará &quot;Não
        definido&quot; até haver alocações. O diagrama inicia com o modelo de referência;
        alterações ficam salvas neste navegador.
      </Lead>
      <Form onSubmit={handleSubmit}>
        <FieldBlock>
          <Label htmlFor="new-project-name">Nome</Label>
          <TextInput
            id="new-project-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Portal do cliente"
            autoComplete="off"
            autoFocus
            required
          />
        </FieldBlock>
        <FieldBlock>
          <Label htmlFor="new-project-desc">Descrição</Label>
          <TextArea
            id="new-project-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Resumo do escopo ou observações."
            rows={4}
          />
        </FieldBlock>
        <FieldBlock>
          <Label>Período na Timeline (opcional)</Label>
          <FieldHint>
            Usado no texto de período da linha do projeto quando ainda não há barras de
            alocação. Deixe vazio ou preencha início e fim.
          </FieldHint>
          <DateRow>
            <DateField>
              <Label htmlFor="new-project-start">Início</Label>
              <DateInput
                id="new-project-start"
                value={timelineStart}
                onChange={(e) => {
                  setTimelineStart(e.target.value)
                  setDateError(null)
                }}
                aria-label="Data de início do projeto na timeline"
              />
            </DateField>
            <DateField>
              <Label htmlFor="new-project-end">Fim</Label>
              <DateInput
                id="new-project-end"
                value={timelineEnd}
                onChange={(e) => {
                  setTimelineEnd(e.target.value)
                  setDateError(null)
                }}
                aria-label="Data de fim do projeto na timeline"
              />
            </DateField>
          </DateRow>
          {dateError ? <FieldError role="alert">{dateError}</FieldError> : null}
        </FieldBlock>
        <DbSettingRow>
          <DbLabel htmlFor="new-project-db">Motor SQL (sugestões na modelagem)</DbLabel>
          <DbSelect
            id="new-project-db"
            value={primaryDatabase}
            onChange={(e) => {
              const v = e.target.value
              if (isPrimaryDatabaseType(v)) setPrimaryDatabase(v)
            }}
          >
            {PRIMARY_DATABASES.map((key) => (
              <option key={key} value={key}>
                {PRIMARY_DATABASE_LABELS[key]}
              </option>
            ))}
          </DbSelect>
          <DbHint>
            Tipos sugeridos ao editar colunas no diagrama seguem este motor.
          </DbHint>
        </DbSettingRow>
        <FieldBlock>
          <Label>Cor primária (cabeçalhos das tabelas)</Label>
          <ColorRow>
            <ColorBoxLabel title="Cor dos cabeçalhos na modelagem">
              <ColorBoxInput
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                aria-label="Cor primária"
              />
            </ColorBoxLabel>
            <ColorHint>Clique na caixa para escolher a cor.</ColorHint>
          </ColorRow>
        </FieldBlock>
        <SubmitButton type="submit" disabled={!name.trim() || submitting}>
          {submitting ? 'Criando…' : 'Criar projeto'}
        </SubmitButton>
      </Form>
    </Root>
  )
}
