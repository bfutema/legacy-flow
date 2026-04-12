/**
 * Faixa superior do admin: padding 0.75rem × 2 + área do controle 2.5rem + borda inferior 1px.
 * Tem que ser idêntico no Brand (sidebar) e no Bar (header): só `min-height: 4rem` no header
 * deixa a barra ~1px mais alta que o brand e o traço horizontal “quebra” no encontro.
 */
export const ADMIN_HEADER_BAR_HEIGHT = 'calc(0.75rem + 2.5rem + 0.75rem + 1px)'
