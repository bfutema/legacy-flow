import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getUserById, isEmailTakenByOther, updateDirectoryUser } from '../data/directoryUsers'
import { USER_ROLE_OPTIONS, type UserStatus } from '../data/demoUsers'
import {
  BackLink,
  FieldBlock,
  Form,
  Label,
  Lead,
  PageTitle,
  Root,
  SubmitButton,
  TextInput,
} from './NewProject.styles'
import { FieldError } from './NewUser.styles'
import {
  DbHint,
  DbLabel,
  DbSelect,
  DbSettingRow,
} from './ProjectDetail.styles'

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

export function EditUser() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const [tick, setTick] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>(USER_ROLE_OPTIONS[0])
  const [status, setStatus] = useState<UserStatus>('active')
  const [submitting, setSubmitting] = useState(false)
  const [emailTaken, setEmailTaken] = useState(false)

  const user = userId ? getUserById(userId) : undefined

  useEffect(() => {
    const bump = () => setTick((n) => n + 1)
    window.addEventListener('flow-app-users-changed', bump)
    return () => window.removeEventListener('flow-app-users-changed', bump)
  }, [])

  useEffect(() => {
    if (!userId) return
    const u = getUserById(userId)
    if (!u) return
    setName(u.name)
    setEmail(u.email)
    setRole(u.role)
    setStatus(u.status)
    setEmailTaken(false)
  }, [userId, tick])

  if (!userId) {
    return <Navigate to="/users" replace />
  }

  if (!user) {
    return <Navigate to="/users" replace />
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    const em = email.trim().toLowerCase()
    if (!n || !em || submitting || !userId) return
    if (!isValidEmail(em)) return

    if (isEmailTakenByOther(em, userId)) {
      setEmailTaken(true)
      return
    }
    setEmailTaken(false)

    setSubmitting(true)
    try {
      updateDirectoryUser(userId, {
        name: n,
        email: em,
        role,
        status,
      })
      navigate(`/users/${userId}`, { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit =
    name.trim() && email.trim() && isValidEmail(email) && !submitting

  return (
    <Root>
      <BackLink to={`/users/${userId}`}>← Voltar ao perfil</BackLink>
      <PageTitle>Editar usuário</PageTitle>
      <Lead>
        Alterações são salvas neste navegador (lista demo + usuários criados aqui).
      </Lead>
      <Form onSubmit={handleSubmit}>
        <FieldBlock>
          <Label htmlFor="edit-user-name">Nome completo</Label>
          <TextInput
            id="edit-user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </FieldBlock>
        <FieldBlock>
          <Label htmlFor="edit-user-email">E-mail</Label>
          <TextInput
            id="edit-user-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailTaken(false)
            }}
            autoComplete="email"
            required
          />
          {emailTaken ? (
            <FieldError>Já existe um usuário com este e-mail.</FieldError>
          ) : null}
        </FieldBlock>
        <DbSettingRow>
          <DbLabel htmlFor="edit-user-role">Função</DbLabel>
          <DbSelect
            id="edit-user-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {USER_ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </DbSelect>
          <DbHint>Permissões ilustrativas neste template.</DbHint>
        </DbSettingRow>
        <DbSettingRow>
          <DbLabel htmlFor="edit-user-status">Status</DbLabel>
          <DbSelect
            id="edit-user-status"
            value={status}
            onChange={(e) => {
              const v = e.target.value
              if (v === 'active' || v === 'inactive') setStatus(v)
            }}
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </DbSelect>
        </DbSettingRow>
        <SubmitButton type="submit" disabled={!canSubmit}>
          {submitting ? 'Salvando…' : 'Salvar alterações'}
        </SubmitButton>
      </Form>
    </Root>
  )
}
