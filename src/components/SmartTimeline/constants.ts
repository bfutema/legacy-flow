/**
 * Valores de layout e defaults da UI. Ajustar quando o canvas real existir.
 */
export const TIMELINE_UI = {
  /** Largura da coluna fixa (projetos / usuários). */
  laneWidth: 260,
  /** Coluna recolhida: só ícones / avatares + botão de expandir. */
  laneWidthCollapsed: 48,
  /** Recuo extra (px) à esquerda nas linhas de colaborador vs projeto — efeito escadinha. */
  laneUserExtraIndentPx: 14,
  /** Largura de cada dia na régua (px). */
  dayColumnWidth: 44,
  /** Uma coluna = uma semana inteira (visão Semana). */
  weekColumnWidth: 88,
  /** Uma coluna = um mês calendário (visão Mês). */
  monthColumnWidth: 120,
  /** Altura das linhas de colaborador (igual à de projeto para alinhar a grade). */
  userRowHeight: 50,
  /** Altura das barras Gantt na grade. */
  ganttBarThickness: 26,
  /** Quadrado de cor na lane (input) — um pouco menor que a barra. */
  laneColorSwatchSize: 22,
  /** Linha de projeto: nome + período em duas linhas; mesma altura que `userRowHeight`. */
  projectRowHeight: 50,
  headerLaneMinHeight: 72,
  /** Colunas extras renderizadas fora da viewport (cada lado). */
  virtualBufferCols: 6,
  /** Dias adicionados ao chegar perto da borda do scroll. */
  extendChunkDays: 45,
  /** Semanas adicionadas na visão por semana. */
  extendChunkWeeks: 8,
  /** Distância (px) da borda para disparar extensão. */
  extendThresholdPx: 280,
  /** Máximo de colunas no modelo; remove do lado oposto ao crescer. */
  maxBufferCols: 520,
  /** Máximo de colunas (semanas) na visão Semana. */
  maxBufferWeeks: 96,
  /** Meses adicionados ao rolar na visão Mês. */
  extendChunkMonths: 6,
  /** Máximo de colunas (meses) na visão Mês. */
  maxBufferMonths: 48,
} as const
