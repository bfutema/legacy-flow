import { HelpAnchor, HelpButton, HelpPopover } from './LoginDemoHelp.styles'

export function LoginDemoHelp() {
  return (
    <HelpAnchor>
      <HelpButton
        type="button"
        aria-label="Informações sobre o ambiente de demonstração"
        aria-describedby="login-demo-help-tip"
      >
        ?
      </HelpButton>
      <HelpPopover id="login-demo-help-tip" role="tooltip">
        Modo demonstração: qualquer senha é aceita. Conta com acesso total:{' '}
        <strong>admin@flow.com</strong>. Os demais e-mails do diretório usam o papel
        cadastrado (<strong>Administradora</strong>, <strong>Editor</strong> ou{' '}
        <strong>Visualizadora</strong>). E-mails não cadastrados entram como visitante,
        com permissões mínimas.
      </HelpPopover>
    </HelpAnchor>
  )
}
