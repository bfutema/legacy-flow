import { useTheme } from 'styled-components'

type FlowMarkProps = {
  size?: number
  className?: string
}

/**
 * Marca Flow: três barras ascendentes — leitura imediata de painel, evolução e “fluxo” * de trabalho, sem ruído visual. Cores derivadas do tema.
 */
export function FlowMark({ size = 28, className }: FlowMarkProps) {
  const theme = useTheme()
  const p = theme.primary

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="4" y="19" width="7" height="9" rx="2" fill={p} fillOpacity={0.38} />
      <rect x="12.5" y="13" width="7" height="15" rx="2" fill={p} fillOpacity={0.62} />
      <rect x="21" y="6" width="7" height="22" rx="2" fill={p} />
    </svg>
  )
}
