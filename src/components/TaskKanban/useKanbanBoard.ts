import { useCallback, useEffect, useState } from 'react'
import type { KanbanColumnData, KanbanState, KanbanTask } from './kanbanTypes'
import { loadKanbanState, saveKanbanState } from './kanbanStorage'
import { DEFAULT_KANBAN_STATE } from './defaultKanbanState'

const HEADER_PRESETS = [
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#64748b',
  '#8b5cf6',
  '#14b8a6',
  '#3b82f6',
  '#eab308',
]

function newColumnId(): string {
  return `col-${crypto.randomUUID().slice(0, 8)}`
}

function newTaskId(): string {
  return `task-${crypto.randomUUID().slice(0, 8)}`
}

export function useKanbanBoard() {
  const [state, setState] = useState<KanbanState>(loadKanbanState)

  useEffect(() => {
    saveKanbanState(state)
  }, [state])

  const setBoardState = useCallback((next: KanbanState | ((prev: KanbanState) => KanbanState)) => {
    setState(next)
  }, [])

  const addColumn = useCallback(() => {
    setState((s) => {
      const id = newColumnId()
      const color = HEADER_PRESETS[s.columnOrder.length % HEADER_PRESETS.length]
      return {
        ...s,
        columnOrder: [...s.columnOrder, id],
        columns: {
          ...s.columns,
          [id]: {
            title: 'Nova coluna',
            headerColor: color,
            accentColor: color,
            taskIds: [],
          },
        },
      }
    })
  }, [])

  const removeColumn = useCallback((columnId: string) => {
    setState((s) => {
      if (s.columnOrder.length <= 1) return s
      const col = s.columns[columnId]
      if (!col) return s
      const targetId = s.columnOrder.find((cid) => cid !== columnId) ?? s.columnOrder[0]
      if (!targetId || targetId === columnId) return s
      const target = s.columns[targetId]
      if (!target) return s
      const restCols = { ...s.columns }
      delete restCols[columnId]
      return {
        ...s,
        columnOrder: s.columnOrder.filter((id) => id !== columnId),
        columns: {
          ...restCols,
          [targetId]: {
            ...target,
            taskIds: [...target.taskIds, ...col.taskIds],
          },
        },
      }
    })
  }, [])

  const updateColumn = useCallback(
    (columnId: string, patch: Partial<Pick<KanbanColumnData, 'title' | 'headerColor' | 'accentColor'>>) => {
      setState((s) => {
        const col = s.columns[columnId]
        if (!col) return s
        return {
          ...s,
          columns: {
            ...s.columns,
            [columnId]: { ...col, ...patch },
          },
        }
      })
    },
    [],
  )

  const addTask = useCallback((columnId: string) => {
    const id = newTaskId()
    setState((s) => {
      const col = s.columns[columnId]
      if (!col) return s
      const n = Object.keys(s.tasks).length + 1
      const task: KanbanTask = {
        id,
        title: `Tarefa ${n}`,
        subtitle: 'Clique para editar depois',
      }
      return {
        ...s,
        tasks: { ...s.tasks, [id]: task },
        columns: {
          ...s.columns,
          [columnId]: { ...col, taskIds: [...col.taskIds, id] },
        },
      }
    })
  }, [])

  const updateTask = useCallback((taskId: string, patch: Partial<Pick<KanbanTask, 'title' | 'subtitle'>>) => {
    setState((s) => {
      const t = s.tasks[taskId]
      if (!t) return s
      return {
        ...s,
        tasks: { ...s.tasks, [taskId]: { ...t, ...patch } },
      }
    })
  }, [])

  const resetBoard = useCallback(() => {
    setState(structuredClone(DEFAULT_KANBAN_STATE))
  }, [])

  return {
    state,
    setBoardState,
    addColumn,
    removeColumn,
    updateColumn,
    addTask,
    updateTask,
    resetBoard,
  }
}
