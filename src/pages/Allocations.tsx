import { useEffect, useState } from 'react'
import { HiCalendarDays, HiMagnifyingGlass } from 'react-icons/hi2'
import { SmartTimeline, type TimelineScale } from '../components/SmartTimeline'
import { getAllProjects, resolveProjectById } from '../data/projects'
import {
  AllocationsRoot,
  Chip,
  ChipRemove,
  ChipsRow,
  CollaboratorsToggle,
  DateButton,
  FiltersLeft,
  FiltersRight,
  FiltersStrip,
  PageTitle,
  ScaleBtn,
  ScaleGroup,
  SearchInput,
  SearchWrap,
  TimelineFill,
  TitleRow,
  ToggleTrack,
  TopStrip,
} from './Allocations.styles'

function initialFilterChips(): string[] {
  return getAllProjects()
    .slice(0, 2)
    .map((p) => resolveProjectById(p.id)?.name ?? p.name)
}

export function Allocations() {
  const [collaboratorsOn, setCollaboratorsOn] = useState(true)
  const [chips, setChips] = useState<string[]>(initialFilterChips)

  useEffect(() => {
    const onList = () =>
      setChips((c) => {
        const names = new Set(
          getAllProjects().map((p) => resolveProjectById(p.id)?.name ?? p.name),
        )
        return c.filter((x) => names.has(x))
      })
    window.addEventListener('flow-user-projects-changed', onList)
    return () => window.removeEventListener('flow-user-projects-changed', onList)
  }, [])
  const [scale, setScale] = useState<TimelineScale>('day')

  function removeChip(label: string) {
    setChips((c) => c.filter((x) => x !== label))
  }

  return (
    <AllocationsRoot>
      <TopStrip>
        <TitleRow>
          <PageTitle>Timeline</PageTitle>
          <CollaboratorsToggle
            type="button"
            $on={collaboratorsOn}
            onClick={() => setCollaboratorsOn((v) => !v)}
            aria-pressed={collaboratorsOn}
          >
            Colaboradores
            <ToggleTrack $on={collaboratorsOn} aria-hidden />
          </CollaboratorsToggle>
        </TitleRow>
      </TopStrip>

      <FiltersStrip>
        <FiltersLeft>
          <SearchWrap>
            <HiMagnifyingGlass aria-hidden />
            <SearchInput
              type="search"
              placeholder="Digite o nome de um usuário ou projeto"
              aria-label="Buscar usuário ou projeto"
            />
          </SearchWrap>
          {chips.length > 0 ? (
            <ChipsRow>
              {chips.map((c, i) => (
                <Chip
                  key={c}
                  type="button"
                  $delayIndex={i}
                  onClick={() => removeChip(c)}
                  aria-label={`Remover filtro ${c}`}
                >
                  {c}
                  <ChipRemove aria-hidden>×</ChipRemove>
                </Chip>
              ))}
            </ChipsRow>
          ) : null}
        </FiltersLeft>
        <FiltersRight>
          <ScaleGroup role="group" aria-label="Escala da timeline">
            {(
              [
                ['day', 'Dia'],
                ['week', 'Semana'],
                ['month', 'Mês'],
              ] as const
            ).map(([value, label]) => (
              <ScaleBtn
                key={value}
                type="button"
                $active={scale === value}
                onClick={() => setScale(value)}
              >
                {label}
              </ScaleBtn>
            ))}
          </ScaleGroup>
          <DateButton type="button">
            <HiCalendarDays aria-hidden />
            Escolher data
          </DateButton>
        </FiltersRight>
      </FiltersStrip>

      <TimelineFill>
        <SmartTimeline
          scale={scale}
          onScaleChange={setScale}
          aria-label="Planejamento de alocações usuários e projetos"
        />
      </TimelineFill>
    </AllocationsRoot>
  )
}
