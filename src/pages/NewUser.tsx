import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDirectoryUsers } from '../data/directoryUsers'
import { USER_ROLE_OPTIONS, type UserStatus } from '../data/demoUsers'
import { addAppUser } from '../persistence/appUsersStorage'
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

export function NewUser() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<string>(USER_ROLE_OPTIONS[0])
  const [status, setStatus] = useState<UserStatus>('active')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [emailTaken, setEmailTaken] = useState(false)

  const mismatch =
    confirm.length > 0 && password.length > 0 && password !== confirm

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const n = name.trim()
    const em = email.trim().toLowerCase()
    if (!n || !em || submitting) return
    if (!isValidEmail(em)) return
    if (password.length < 6 || password !== confirm) return

    const taken = getDirectoryUsers().some(
      (u) => u.email.toLowerCase() === em,
    )
    if (taken) {
      setEmailTaken(true)
      return
    }
    setEmailTaken(false)

    setSubmitting(true)
    try {
      addAppUser({
        name: n,
        email: em,
        role,
        status,
      })
      navigate('/users', { replace: true })
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit =
    name.trim() &&
    email.trim() &&
    isValidEmail(email) &&
    password.length >= 6 &&
    password === confirm &&
    !submitting

  return (
    <Root>
      <BackLink to="/users">← Voltar aos usuários</BackLink>
      <PageTitle>Novo usuário</PageTitle>
      <Lead>
        Cadastro demonstrativo: os dados ficam neste navegador. A senha não é
        armazenada — serve só para validar o formulário como em produção.
      </Lead>
      <Form onSubmit={handleSubmit}>
        <FieldBlock>
          <Label htmlFor="new-user-name">Nome completo</Label>
          <TextInput
            id="new-user-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Maria Souza"
            autoComplete="name"
            autoFocus
            required
          />
        </FieldBlock>
        <FieldBlock>
          <Label htmlFor="new-user-email">E-mail</Label>
          <TextInput
            id="new-user-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailTaken(false)
            }}
            placeholder="nome@empresa.com"
            autoComplete="email"
            required
          />
          {emailTaken ? (
            <FieldError>Já existe um usuário com este e-mail.</FieldError>
          ) : null}
        </FieldBlock>
        <DbSettingRow>
          <DbLabel htmlFor="new-user-role">Função</DbLabel>
          <DbSelect
            id="new-user-role"
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
          <DbLabel htmlFor="new-user-status">Status</DbLabel>
          <DbSelect
            id="new-user-status"
            value={status}
            onChange={(e) => {
              const v = e.target.value
              if (v === 'active' || v === 'inactive') setStatus(v)
            }}
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </DbSelect>
          <DbHint>Usuários inativos podem ser filtrados em telas futuras.</DbHint>
        </DbSettingRow>
        <FieldBlock>
          <Label htmlFor="new-user-password">Senha</Label>
          <TextInput
            id="new-user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
        </FieldBlock>
        <FieldBlock>
          <Label htmlFor="new-user-confirm">Confirmar senha</Label>
          <TextInput
            id="new-user-confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            placeholder="Repita a senha"
            minLength={6}
            required
          />
          {mismatch ? (
            <FieldError>As senhas não coincidem.</FieldError>
          ) : null}
        </FieldBlock>
        <SubmitButton type="submit" disabled={!canSubmit}>
          {submitting ? 'Cadastrando…' : 'Cadastrar usuário'}
        </SubmitButton>
      </Form>
    </Root>
  )
}
