/**
 * Valores de layout e defaults da UI. Ajustar quando o canvas real existir.
 */
export const TIMELINE_UI = {
  /** Largura da coluna fixa (projetos / usuários). */
  laneWidth: 260,
  /** Recuo extra (px) à esquerda nas linhas de colaborador vs projeto — efeito escadinha. */
  laneUserExtraIndentPx: 14,
  /** Largura de cada dia na régua (px). */
  dayColumnWidth: 44,
  userRowHeight: 48,
  /** Altura das barras Gantt na grade. */
  ganttBarThickness: 26,
  /** Quadrado de cor na lane (input) — um pouco menor que a barra. */
  laneColorSwatchSize: 22,
  projectRowHeight: 52,
  headerLaneMinHeight: 72,
  /** Colunas extras renderizadas fora da viewport (cada lado). */
  virtualBufferCols: 6,
  /** Dias adicionados ao chegar perto da borda do scroll. */
  extendChunkDays: 45,
  /** Distância (px) da borda para disparar extensão. */
  extendThresholdPx: 280,
  /** Máximo de colunas no modelo; remove do lado oposto ao crescer. */
  maxBufferCols: 520,
} as const
