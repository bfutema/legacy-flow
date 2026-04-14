import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  AuthPageStack,
  Button,
  Form,
  Input,
  Label,
  RowLinks,
  RouterLink,
  Subtitle,
  Title,
} from '../layouts/AuthLayout.styles'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    window.setTimeout(() => {
      login(email.trim())
      setLoading(false)
      navigate(from, { replace: true })
    }, 400)
  }

  return (
    <AuthPageStack>
      <Title>Entrar</Title>
      <Subtitle>Entre com seu e-mail e senha para continuar.</Subtitle>
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
        <Label>
          Senha
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Label>
        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
      </Form>
      <RowLinks>
        <RouterLink to="/forgot-password">Esqueci minha senha</RouterLink>
      </RowLinks>
    </AuthPageStack>
  )
}
