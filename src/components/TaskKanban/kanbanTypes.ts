export type KanbanTask = {
  id: string
  title: string
  subtitle?: string
}

export type KanbanColumnData = {
  title: string
  /** Cor do cabeçalho da coluna (estilo Monday) */
  headerColor: string
  /** Cor da faixa lateral nos cartões desta coluna */
  accentColor: string
  taskIds: string[]
}

export type KanbanState = {
  columnOrder: string[]
  columns: Record<string, KanbanColumnData>
  tasks: Record<string, KanbanTask>
}

export const DND_ID = {
  col: (columnId: string) => `s-col-${columnId}`,
  parseCol: (id: string | number) =>
    String(id).startsWith('s-col-') ? String(id).slice('s-col-'.length) : null,
  task: (taskId: string) => `task-${taskId}`,
  parseTask: (id: string | number) =>
    String(id).startsWith('task-') ? String(id).slice('task-'.length) : null,
  drop: (columnId: string) => `drop-${columnId}`,
  parseDrop: (id: string | number) =>
    String(id).startsWith('drop-') ? String(id).slice('drop-'.length) : null,
}
