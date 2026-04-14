import { useAbility } from '@casl/react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDndContext,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { AbilityContext } from '../../contexts/AbilityContext'
import {
  AddTaskBtn,
  BoardColumns,
  BoardScroll,
  ColorInput,
  ColumnBody,
  ColumnCount,
  ColumnHeader,
  ColumnShell,
  ColumnTitle,
  ColumnTitleGroup,
  DangerButton,
  DragOverlayTilt,
  EmptyColumn,
  KanbanColumnWrapper,
  ManageInput,
  ManagePanel,
  ManageRow,
  ManageTitle,
  Root,
  TaskCard,
  TaskList,
  TaskSubtitle,
  TaskTitle,
  Toolbar,
  ToolbarActions,
  ToolbarHint,
  ToolbarLeft,
  ToolButton,
} from './TaskKanban.styles'
import {
  findColumnForTask,
  isOverColumn,
  moveTaskInState,
  reorderColumns,
  reorderTasksInColumn,
  resolveColumnIdFromOver,
} from './kanbanDndHelpers'
import { DND_ID, type KanbanState, type KanbanTask } from './kanbanTypes'
import { useKanbanBoard } from './useKanbanBoard'

type TaskKanbanProps = {
  'aria-label'?: string
}

function SortableTaskCard({
  task,
  accentColor,
  canDrag,
}: {
  task: KanbanTask
  accentColor: string
  canDrag: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: DND_ID.task(task.id),
    data: { type: 'task', taskId: task.id },
    disabled: !canDrag,
  })
  const transformStr = CSS.Transform.toString(transform)
  const style = {
    transform: isDragging && transformStr ? `${transformStr} rotate(-2.75deg)` : transformStr,
    transition,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-grabbed={isDragging}
    >
      <TaskCard $accent={accentColor} $isDragging={isDragging}>
        <TaskTitle>{task.title}</TaskTitle>
        {task.subtitle ? <TaskSubtitle>{task.subtitle}</TaskSubtitle> : null}
      </TaskCard>
    </div>
  )
}

function ColumnDropZone({
  columnId,
  hasTasks,
  children,
}: {
  columnId: string
  hasTasks: boolean
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: DND_ID.drop(columnId),
    data: { type: 'drop', columnId },
  })
  return (
    <ColumnBody ref={setNodeRef} data-over={isOver ? 'true' : undefined}>
      {children}
      {hasTasks ? null : (
        <EmptyColumn>Solte tarefas aqui</EmptyColumn>
      )}
    </ColumnBody>
  )
}

type SortableColumnViewProps = {
  columnId: string
  columnIndex: number
  boardState: KanbanState
  title: string
  headerColor: string
  accentColor: string
  taskIds: string[]
  tasks: Record<string, KanbanTask>
  onAddTask: () => void
  /** `update:TaskBoard` — arrastar colunas e cartões. */
  canUpdateBoard: boolean
  /** `create:TaskBoard` — botão de nova tarefa. */
  canAddTask: boolean
}

function SortableColumnView({
  columnId,
  columnIndex,
  boardState,
  title,
  headerColor,
  accentColor,
  taskIds,
  tasks,
  onAddTask,
  canUpdateBoard,
  canAddTask,
}: SortableColumnViewProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: DND_ID.col(columnId),
    data: { type: 'column', columnId },
    disabled: !canUpdateBoard,
  })
  const { active, over } = useDndContext()
  const dropHighlight = useMemo(() => {
    if (!active) return false
    return isOverColumn(boardState, over?.id, columnId)
  }, [active, over?.id, boardState, columnId])

  const transformStr = CSS.Transform.toString(transform)
  const style = {
    transform: isDragging && transformStr ? `${transformStr} rotate(-1.25deg)` : transformStr,
    transition,
  }

  const sortableTaskIds = useMemo(() => taskIds.map((id) => DND_ID.task(id)), [taskIds])

  return (
    <KanbanColumnWrapper
      ref={setNodeRef}
      style={style}
      $index={columnIndex}
      $dropHighlight={dropHighlight}
      {...attributes}
    >
      <ColumnShell $isDragging={isDragging}>
        <ColumnHeader $headerColor={headerColor} {...(canUpdateBoard ? listeners : {})}>
          <ColumnTitleGroup>
            <ColumnTitle>{title}</ColumnTitle>
            <ColumnCount>
              {taskIds.length} {taskIds.length === 1 ? 'item' : 'itens'}
            </ColumnCount>
          </ColumnTitleGroup>
          <HiOutlineSquares2X2 size={18} aria-hidden style={{ opacity: 0.9 }} />
        </ColumnHeader>
        <ColumnDropZone columnId={columnId} hasTasks={taskIds.length > 0}>
          <TaskList>
            <SortableContext items={sortableTaskIds} strategy={verticalListSortingStrategy}>
              {taskIds.map((tid) => {
                const t = tasks[tid]
                if (!t) return null
                return (
                  <SortableTaskCard
                    key={tid}
                    task={t}
                    accentColor={accentColor}
                    canDrag={canUpdateBoard}
                  />
                )
              })}
            </SortableContext>
          </TaskList>
          {canAddTask ? (
            <AddTaskBtn type="button" onClick={onAddTask}>
              + Adicionar tarefa
            </AddTaskBtn>
          ) : null}
        </ColumnDropZone>
      </ColumnShell>
    </KanbanColumnWrapper>
  )
}

export function TaskKanban({ 'aria-label': ariaLabel = 'Quadro Kanban de tarefas' }: TaskKanbanProps) {
  const ability = useAbility(AbilityContext)
  const canUpdateBoard = ability.can('update', 'TaskBoard')
  const canAddTask = ability.can('create', 'TaskBoard')
  const {
    state,
    setBoardState,
    addColumn,
    addTask,
    removeColumn,
    updateColumn,
    resetBoard,
  } = useKanbanBoard()

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [activeColId, setActiveColId] = useState<string | null>(null)
  const [manageOpen, setManageOpen] = useState(false)

  useEffect(() => {
    if (!canUpdateBoard) setManageOpen(false)
  }, [canUpdateBoard])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onDragStart = useCallback((event: DragStartEvent) => {
    if (!canUpdateBoard) return
    const id = String(event.active.id)
    if (id.startsWith('task-')) {
      setActiveTaskId(DND_ID.parseTask(id))
      setActiveColId(null)
    } else if (id.startsWith('s-col-')) {
      setActiveColId(DND_ID.parseCol(id))
      setActiveTaskId(null)
    }
  }, [canUpdateBoard])

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      if (!canUpdateBoard) return
      const { active, over } = event
      if (!over) return
      const aid = String(active.id)
      const oid = String(over.id)

      if (aid.startsWith('s-col-')) return

      if (!aid.startsWith('task-')) return
      const taskId = DND_ID.parseTask(aid)
      if (!taskId) return

      setBoardState((s) => {
        const activeCol = findColumnForTask(s, taskId)
        if (!activeCol) return s

        if (oid.startsWith('task-')) {
          const overTaskId = DND_ID.parseTask(oid)
          if (!overTaskId || overTaskId === taskId) return s
          const overCol = findColumnForTask(s, overTaskId)
          if (!overCol) return s

          if (activeCol === overCol) {
            const col = s.columns[activeCol]
            const oldIndex = col.taskIds.indexOf(taskId)
            const newIndex = col.taskIds.indexOf(overTaskId)
            if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return s
            return reorderTasksInColumn(s, activeCol, oldIndex, newIndex)
          }

          return moveTaskInState(s, taskId, activeCol, overCol, overTaskId)
        }

        if (oid.startsWith('drop-')) {
          const dropCol = DND_ID.parseDrop(oid)
          if (!dropCol || dropCol === activeCol) return s
          return moveTaskInState(s, taskId, activeCol, dropCol, null)
        }

        if (oid.startsWith('s-col-')) {
          const overCol = DND_ID.parseCol(oid)
          if (!overCol || overCol === activeCol) return s
          return moveTaskInState(s, taskId, activeCol, overCol, null)
        }

        return s
      })
    },
    [canUpdateBoard, setBoardState],
  )

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!canUpdateBoard) return
      const { active, over } = event
      setActiveTaskId(null)
      setActiveColId(null)
      if (!over) return

      const aid = String(active.id)
      const oid = String(over.id)

      if (aid.startsWith('s-col-')) {
        const activeCol = DND_ID.parseCol(aid)
        if (!activeCol) return
        setBoardState((s) => {
          const targetCol = resolveColumnIdFromOver(s, oid)
          if (!targetCol || targetCol === activeCol) return s
          return reorderColumns(s, activeCol, targetCol)
        })
        return
      }

      if (!aid.startsWith('task-')) return

      setBoardState((s) => {
        const taskId = DND_ID.parseTask(aid)
        if (!taskId) return s
        const activeCol = findColumnForTask(s, taskId)
        if (!activeCol) return s

        if (oid.startsWith('task-')) {
          const overTaskId = DND_ID.parseTask(oid)
          if (!overTaskId || overTaskId === taskId) return s
          const overCol = findColumnForTask(s, overTaskId)
          if (!overCol || activeCol !== overCol) return s
          const col = s.columns[activeCol]
          const oldIndex = col.taskIds.indexOf(taskId)
          const newIndex = col.taskIds.indexOf(overTaskId)
          if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return s
          return reorderTasksInColumn(s, activeCol, oldIndex, newIndex)
        }

        return s
      })
    },
    [canUpdateBoard, setBoardState],
  )

  const overlayTask = activeTaskId ? state.tasks[activeTaskId] : null
  const overlayCol = activeColId ? state.columns[activeColId] : null

  const sortableColumnIds = useMemo(
    () => state.columnOrder.map((id) => DND_ID.col(id)),
    [state.columnOrder],
  )

  return (
    <Root aria-label={ariaLabel}>
      <Toolbar>
        <ToolbarLeft>
          <ToolbarHint>
            {canUpdateBoard
              ? 'Arraste o cabeçalho da coluna para reordenar. Arraste cartões entre colunas ou dentro da mesma coluna. Alterações ficam salvas neste navegador.'
              : canAddTask
                ? 'Você pode adicionar tarefas. Arrastar cartões, reordenar colunas e gerenciar o quadro exige a permissão de editar tarefas e colunas.'
                : 'Modo somente leitura: seu perfil pode ver o quadro, mas não adicionar nem mover tarefas.'}
          </ToolbarHint>
        </ToolbarLeft>
        {canUpdateBoard ? (
          <ToolbarActions>
            <ToolButton type="button" onClick={() => setManageOpen((v) => !v)}>
              {manageOpen ? 'Fechar colunas' : 'Gerenciar colunas'}
            </ToolButton>
            <ToolButton type="button" onClick={addColumn}>
              + Coluna
            </ToolButton>
            <ToolButton type="button" onClick={resetBoard}>
              Restaurar exemplo
            </ToolButton>
          </ToolbarActions>
        ) : null}
      </Toolbar>

      {manageOpen && canUpdateBoard ? (
        <ManagePanel>
          <ManageTitle>Colunas</ManageTitle>
          {state.columnOrder.map((cid, i) => {
            const c = state.columns[cid]
            if (!c) return null
            return (
              <ManageRow key={cid} $index={i}>
                <ManageInput
                  value={c.title}
                  aria-label={`Nome da coluna ${c.title}`}
                  onChange={(e) => updateColumn(cid, { title: e.target.value })}
                />
                <ColorInput
                  type="color"
                  value={c.headerColor}
                  title="Cor do cabeçalho"
                  aria-label="Cor do cabeçalho"
                  onChange={(e) =>
                    updateColumn(cid, { headerColor: e.target.value, accentColor: e.target.value })
                  }
                />
                <ColorInput
                  type="color"
                  value={c.accentColor}
                  title="Cor da faixa nos cartões"
                  aria-label="Cor da faixa nos cartões"
                  onChange={(e) => updateColumn(cid, { accentColor: e.target.value })}
                />
                <DangerButton
                  type="button"
                  disabled={state.columnOrder.length <= 1}
                  onClick={() => removeColumn(cid)}
                >
                  Remover
                </DangerButton>
              </ManageRow>
            )
          })}
        </ManagePanel>
      ) : null}

      <BoardScroll>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={sortableColumnIds} strategy={horizontalListSortingStrategy}>
            <BoardColumns>
              {state.columnOrder.map((cid, columnIndex) => {
                const c = state.columns[cid]
                if (!c) return null
                return (
                  <SortableColumnView
                    key={cid}
                    columnId={cid}
                    columnIndex={columnIndex}
                    boardState={state}
                    title={c.title}
                    headerColor={c.headerColor}
                    accentColor={c.accentColor}
                    taskIds={c.taskIds}
                    tasks={state.tasks}
                    onAddTask={() => addTask(cid)}
                    canUpdateBoard={canUpdateBoard}
                    canAddTask={canAddTask}
                  />
                )
              })}
            </BoardColumns>
          </SortableContext>

          <DragOverlay dropAnimation={null}>
            {overlayTask ? (
              <DragOverlayTilt $kind="task">
                <TaskCard
                  $accent={
                    (() => {
                      const col = findColumnForTask(state, overlayTask.id)
                      return col ? state.columns[col]?.accentColor ?? '#64748b' : '#64748b'
                    })()
                  }
                >
                  <TaskTitle>{overlayTask.title}</TaskTitle>
                  {overlayTask.subtitle ? (
                    <TaskSubtitle>{overlayTask.subtitle}</TaskSubtitle>
                  ) : null}
                </TaskCard>
              </DragOverlayTilt>
            ) : null}
            {overlayCol && !overlayTask ? (
              <DragOverlayTilt $kind="column">
                <ColumnShell $isDragging style={{ width: 280, cursor: 'grabbing' }}>
                  <ColumnHeader $headerColor={overlayCol.headerColor}>
                    <ColumnTitleGroup>
                      <ColumnTitle>{overlayCol.title}</ColumnTitle>
                      <ColumnCount>{overlayCol.taskIds.length} itens</ColumnCount>
                    </ColumnTitleGroup>
                  </ColumnHeader>
                </ColumnShell>
              </DragOverlayTilt>
            ) : null}
          </DragOverlay>
        </DndContext>
      </BoardScroll>
    </Root>
  )
}
