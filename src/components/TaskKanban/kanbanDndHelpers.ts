import { arrayMove } from '@dnd-kit/sortable'
import { DND_ID } from './kanbanTypes'
import type { KanbanState } from './kanbanTypes'

export function findColumnForTask(state: KanbanState, taskId: string): string | null {
  for (const colId of state.columnOrder) {
    if (state.columns[colId]?.taskIds.includes(taskId)) return colId
  }
  return null
}

/**
 * Em colunas aninhadas com tarefas, o `over` ao soltar uma coluna quase nunca é `s-col-*`:
 * o collision costuma acertar um cartão (`task-*`) ou a zona da coluna (`drop-*`).
 */
/** Coluna que recebe o ponteiro durante o drag (Monday-style highlight). */
export function resolveColumnIdFromOver(
  state: KanbanState,
  overId: string | number,
): string | null {
  const oid = String(overId)
  if (oid.startsWith('s-col-')) {
    return DND_ID.parseCol(oid)
  }
  if (oid.startsWith('task-')) {
    const tid = DND_ID.parseTask(oid)
    return tid ? findColumnForTask(state, tid) : null
  }
  if (oid.startsWith('drop-')) {
    return DND_ID.parseDrop(oid)
  }
  return null
}

export function isOverColumn(
  state: KanbanState,
  overId: string | number | null | undefined,
  columnId: string,
): boolean {
  if (overId == null) return false
  return resolveColumnIdFromOver(state, overId) === columnId
}

export function reorderColumns(
  state: KanbanState,
  activeColId: string,
  overColId: string,
): KanbanState {
  const oldIndex = state.columnOrder.indexOf(activeColId)
  const newIndex = state.columnOrder.indexOf(overColId)
  if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return state
  return {
    ...state,
    columnOrder: arrayMove(state.columnOrder, oldIndex, newIndex),
  }
}

/** Remove task de uma coluna e insere em outra (ou na mesma) na posição indicada. */
export function moveTaskInState(
  state: KanbanState,
  taskId: string,
  fromCol: string,
  toCol: string,
  /** Se definido, insere antes deste id; senão no fim */
  beforeTaskId: string | null,
): KanbanState {
  const from = state.columns[fromCol]
  const to = state.columns[toCol]
  if (!from || !to) return state

  const without = from.taskIds.filter((id) => id !== taskId)
  let nextTo = [...to.taskIds].filter((id) => id !== taskId)

  if (fromCol === toCol) {
    nextTo = without
    let insertAt = nextTo.length
    if (beforeTaskId) {
      const i = nextTo.indexOf(beforeTaskId)
      if (i >= 0) insertAt = i
    }
    const copy = [...nextTo]
    copy.splice(insertAt, 0, taskId)
    return {
      ...state,
      columns: {
        ...state.columns,
        [toCol]: { ...to, taskIds: copy },
      },
    }
  }

  let insertAt = nextTo.length
  if (beforeTaskId) {
    const i = nextTo.indexOf(beforeTaskId)
    if (i >= 0) insertAt = i
  }
  nextTo.splice(insertAt, 0, taskId)

  return {
    ...state,
    columns: {
      ...state.columns,
      [fromCol]: { ...from, taskIds: without },
      [toCol]: { ...to, taskIds: nextTo },
    },
  }
}

/** Reordena tarefas dentro da mesma coluna (índices no array atual). */
export function reorderTasksInColumn(
  state: KanbanState,
  columnId: string,
  oldIndex: number,
  newIndex: number,
): KanbanState {
  const col = state.columns[columnId]
  if (!col) return state
  return {
    ...state,
    columns: {
      ...state.columns,
      [columnId]: {
        ...col,
        taskIds: arrayMove(col.taskIds, oldIndex, newIndex),
      },
    },
  }
}
