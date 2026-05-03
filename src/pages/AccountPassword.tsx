import { InlineLink, Lead, PageRoot, PageTitle } from './AccountPages.styles'

export function AccountPassword() {
  return (
    <PageRoot>
      <PageTitle>Alterar senha</PageTitle>
      <Lead>
        Para redefinir a senha, use o fluxo por e-mail: enviamos um link seguro para você criar
        uma nova senha.
      </Lead>
      <Lead>
        <InlineLink to="/forgot-password">Ir para “Esqueci minha senha”</InlineLink>
      </Lead>
    </PageRoot>
  )
}
