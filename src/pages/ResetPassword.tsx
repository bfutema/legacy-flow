import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AuthPageStack,
  Button,
  FieldError,
  Form,
  Input,
  Label,
  RowLinks,
  RouterLink,
  Subtitle,
  SuccessPanel,
  Title,
} from '../layouts/AuthLayout.styles'

export function ResetPassword() {
  const [params] = useSearchParams()
  const token = useMemo(() => params.get('token') ?? '', [params])

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (password !== confirm) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setDone(true)
    }, 500)
  }

  const mismatch =
    confirm.length > 0 && password.length > 0 && password !== confirm

  return (
    <AuthPageStack>
      <Title>Redefinir senha</Title>
      {done ? (
        <SuccessPanel>
          Sua senha foi atualizada. Você já pode entrar no dashboard com a nova senha.
        </SuccessPanel>
      ) : (
        <Subtitle>
          {token
            ? 'Escolha uma senha forte e confirme abaixo para concluir.'
            : 'Em produção, o link enviado por e-mail inclui um token (ex.: ?token=…). Sem ele, use apenas para desenvolvimento.'}
        </Subtitle>
      )}
      {!done ? (
        <Form onSubmit={handleSubmit}>
          <Label>
            Nova senha
            <Input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </Label>
          <Label>
            Confirmar senha
            <Input
              type="password"
              name="confirm"
              autoComplete="new-password"
              placeholder="Repita a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={6}
              required
            />
          </Label>
          {mismatch ? (
            <FieldError>As senhas não coincidem.</FieldError>
          ) : null}
          <Button
            type="submit"
            disabled={loading || password !== confirm || !password}
          >
            {loading ? 'Salvando…' : 'Salvar nova senha'}
          </Button>
        </Form>
      ) : null}
      <RowLinks>
        <RouterLink to="/login">Ir para o login</RouterLink>
      </RowLinks>
    </AuthPageStack>
  )
}
