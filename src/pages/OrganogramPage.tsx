import { useMemo, useState } from 'react'
import { HiFunnel } from 'react-icons/hi2'
import { format, addMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Organogram, ORGANOGRAM_DEMO_ROOTS } from '../components/Organogram'
import {
  Actions,
  ChartShell,
  GhostBtn,
  Lead,
  MonthBtn,
  MonthNav,
  PageRoot,
  PageTitle,
  PrimaryBtn,
  TitleBlock,
  TopBar,
} from './OrganogramPage.styles'

const iconHierarchy = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v6M8 9h8M8 9v10a2 2 0 002 2h4a2 2 0 002-2V9M8 21h8" />
    <circle cx="12" cy="5" r="2" />
    <circle cx="8" cy="21" r="2" />
    <circle cx="16" cy="21" r="2" />
  </svg>
)

export function OrganogramPage() {
  const [cursor, setCursor] = useState(() => new Date(2026, 3, 1))

  const monthLabel = useMemo(
    () => format(cursor, "MMMM yyyy", { locale: ptBR }),
    [cursor],
  )

  return (
    <PageRoot>
      <TopBar>
        <TitleBlock>
          <PageTitle>Grupos</PageTitle>
          <MonthNav aria-label="Referência de período (demonstração)">
            <MonthBtn
              type="button"
              onClick={() => setCursor((d) => addMonths(d, -1))}
              aria-label="Mês anterior"
            >
              ‹
            </MonthBtn>
            <span style={{ minWidth: '7.5rem', textAlign: 'center', textTransform: 'capitalize' }}>
              {monthLabel}
            </span>
            <MonthBtn
              type="button"
              onClick={() => setCursor((d) => addMonths(d, 1))}
              aria-label="Próximo mês"
            >
              ›
            </MonthBtn>
          </MonthNav>
        </TitleBlock>
        <Actions>
          <GhostBtn type="button" title="Filtro em versão futura">
            <HiFunnel aria-hidden />
            Filtrar grupo
          </GhostBtn>
          <PrimaryBtn type="button" title="Cadastro de grupo em versão futura">
            {iconHierarchy}
            Add. grupo
          </PrimaryBtn>
        </Actions>
      </TopBar>
      <Lead>
        Organograma da empresa: grupos e colaboradores com custo e horas (dados de demonstração).
        Use o botão circular para expandir ou recolher cada ramo.
      </Lead>
      <ChartShell>
        <Organogram roots={ORGANOGRAM_DEMO_ROOTS} />
      </ChartShell>
    </PageRoot>
  )
}
