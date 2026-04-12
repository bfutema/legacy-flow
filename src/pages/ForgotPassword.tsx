import { useState, type FormEvent } from 'react'
import {
  AuthPageStack,
  Button,
  Form,
  Input,
  Label,
  RowLinks,
  RouterLink,
  Subtitle,
  SuccessPanel,
  Title,
} from '../layouts/AuthLayout.styles'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 500)
  }

  return (
    <AuthPageStack>
      <Title>Esqueci minha senha</Title>
      {sent ? (
        <SuccessPanel>
          Se existir uma conta com esse e-mail, você receberá em instantes um link
          para criar uma nova senha. Verifique também a pasta de spam.
        </SuccessPanel>
      ) : (
        <Subtitle>Informe seu e-mail corporativo para receber o link de redefinição.</Subtitle>
      )}
      {!sent ? (
        <Form onSubmit={handleSubmit}>
          <Label>
            E-mail
            <Input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="nome@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>
          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar link'}
          </Button>
        </Form>
      ) : null}
      <RowLinks>
        <RouterLink to="/login">Voltar ao login</RouterLink>
      </RowLinks>
    </AuthPageStack>
  )
}
