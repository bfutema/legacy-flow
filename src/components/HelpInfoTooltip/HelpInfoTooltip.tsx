import { useId, type ReactNode } from 'react'
import { HelpTrigger, HelpTooltipBubble, HelpWrap } from './HelpInfoTooltip.styles'

const iconHelp = (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
  </svg>
)

export type HelpInfoTooltipProps = {
  /** Rótulo curto do botão (leitor de tela). */
  ariaLabel: string
  /** Conteúdo do tooltip (texto ou fragmento). */
  children: ReactNode
  /** `id` fixo do balão (opcional); útil se vários tooltips coexistirem e precisar de IDs estáveis. */
  tooltipId?: string
}

/**
 * Padrão de ajuda: ícone “?” com texto explicativo em tooltip (hover ou foco no teclado).
 * Use para dicas longas em vez de parágrafos fixos na interface.
 */
export function HelpInfoTooltip({ ariaLabel, children, tooltipId: tooltipIdProp }: HelpInfoTooltipProps) {
  const gen = useId().replace(/:/g, '')
  const tipId = tooltipIdProp ?? `help-tip-${gen}`

  return (
    <HelpWrap>
      <HelpTrigger type="button" aria-label={ariaLabel} aria-describedby={tipId}>
        {iconHelp}
      </HelpTrigger>
      <HelpTooltipBubble id={tipId} role="tooltip">
        {children}
      </HelpTooltipBubble>
    </HelpWrap>
  )
}
