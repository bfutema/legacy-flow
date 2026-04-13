import { TaskKanban } from '../components/TaskKanban'
import { BoardFill, Lead, PageRoot, PageTitle, TopStrip } from './TaskBoard.styles'

export function TaskBoard() {
  return (
    <PageRoot>
      <TopStrip>
        <PageTitle>Tarefas</PageTitle>
        <Lead>
          Kanban de tarefas — use o quadro abaixo como área isolada para evoluir filtros,
          cartões e integrações sem misturar com o restante da aplicação.
        </Lead>
      </TopStrip>
      <BoardFill>
        <TaskKanban />
      </BoardFill>
    </PageRoot>
  )
}
