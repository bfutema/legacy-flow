import type { KanbanState } from './kanbanTypes'

/** Paleta inspirada em Monday / status claros */
const COL = {
  doing: { header: '#f59e0b', accent: '#f59e0b' },
  overdue: { header: '#ef4444', accent: '#f87171' },
  hold: { header: '#eab308', accent: '#eab308' },
  done: { header: '#14b8a6', accent: '#2dd4bf' },
} as const

function seed(): KanbanState {
  const c1 = 'col-doing'
  const c2 = 'col-overdue'
  const c3 = 'col-hold'
  const c4 = 'col-done'

  const t1 = 'task-1'
  const t2 = 'task-2'
  const t3 = 'task-3'
  const t4 = 'task-4'
  const t5 = 'task-5'
  const t6 = 'task-6'
  const t7 = 'task-7'
  const t8 = 'task-8'
  const t9 = 'task-9'

  return {
    columnOrder: [c1, c2, c3, c4],
    columns: {
      [c1]: {
        title: 'Em andamento',
        headerColor: COL.doing.header,
        accentColor: COL.doing.accent,
        taskIds: [t1, t2, t3, t4],
      },
      [c2]: {
        title: 'Atrasadas',
        headerColor: COL.overdue.header,
        accentColor: COL.overdue.accent,
        taskIds: [t5, t6],
      },
      [c3]: {
        title: 'Em espera',
        headerColor: COL.hold.header,
        accentColor: COL.hold.accent,
        taskIds: [t7, t8],
      },
      [c4]: {
        title: 'Finalizadas',
        headerColor: COL.done.header,
        accentColor: COL.done.accent,
        taskIds: [t9],
      },
    },
    tasks: {
      [t1]: {
        id: t1,
        title: '#168 — Comunicação Black Friday',
        subtitle: 'Geovani A. · Polishop',
      },
      [t2]: {
        id: t2,
        title: '#172 — Ajuste checkout',
        subtitle: 'Maria S. · Polishop',
      },
      [t3]: {
        id: t3,
        title: '#175 — Banner home',
        subtitle: 'João P. · Site',
      },
      [t4]: {
        id: t4,
        title: '#180 — API estoque',
        subtitle: 'Ana L. · ERP',
      },
      [t5]: {
        id: t5,
        title: '#140 — Relatório fiscal',
        subtitle: 'Carlos M. · Polishop',
      },
      [t6]: {
        id: t6,
        title: '#155 — Migração legado',
        subtitle: 'Time backend',
      },
      [t7]: {
        id: t7,
        title: '#190 — Aguardando cliente',
        subtitle: 'Suporte · Polishop',
      },
      [t8]: {
        id: t8,
        title: '#201 — Budget Q4',
        subtitle: 'PMO',
      },
      [t9]: {
        id: t9,
        title: '#99 — Go-live loja',
        subtitle: 'Geovani A. · Polishop',
      },
    },
  }
}

export const DEFAULT_KANBAN_STATE: KanbanState = seed()
