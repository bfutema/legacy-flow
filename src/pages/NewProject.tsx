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
  FieldBlock,
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
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n || submitting) return
    setSubmitting(true)
    try {
      const project = createUserProject({
        name: n,
        description: description.trim(),
        primaryDatabase,
        primaryColor,
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
        Defina nome, descrição, motor SQL e cor. O diagrama inicia com o modelo de
        referência; alterações ficam salvas neste navegador.
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
