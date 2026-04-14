import { useEffect, useMemo, useState } from 'react'
import { Can } from '../contexts/AbilityContext'
import { getAllProjects, resolveProjectById } from '../data/projects'
import { formatDisplayDate } from '../utils/formatDisplayDate'
import { getEffectiveProjectPrimaryColor } from '../hooks/useProjectPrimaryColor'
import {
  CardDesc,
  CardMeta,
  CardTitle,
  CardTitleRow,
  Grid,
  Lead,
  NewProjectCta,
  PageTitle,
  ProjectCard,
  ProjectsActions,
  ProjectsTop,
  TitleAccent,
} from './Projects.styles'

export function Projects() {
  const [metaTick, setMetaTick] = useState(0)
  const [listTick, setListTick] = useState(0)
  useEffect(() => {
    const onMeta = () => setMetaTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', onMeta)
    return () => window.removeEventListener('flow-project-meta-changed', onMeta)
  }, [])
  useEffect(() => {
    const onList = () => setListTick((n) => n + 1)
    window.addEventListener('flow-user-projects-changed', onList)
    return () => window.removeEventListener('flow-user-projects-changed', onList)
  }, [])
  const projects = useMemo(() => getAllProjects(), [metaTick, listTick])
  return (
    <>
      <ProjectsTop>
        <PageTitle>Projetos</PageTitle>
        <ProjectsActions>
          <Can I="create" a="Project">
            <NewProjectCta to="/projects/new">Novo projeto</NewProjectCta>
          </Can>
        </ProjectsActions>
      </ProjectsTop>
      <Lead>
        Selecione um projeto para ver detalhes e abrir a modelagem do banco de
        dados.
      </Lead>
      <Grid>
        {projects.map((p, index) => {
          const accent = getEffectiveProjectPrimaryColor(p)
          const view = resolveProjectById(p.id) ?? p
          return (
            <ProjectCard
              key={p.id}
              to={`/projects/${p.id}`}
              $accent={accent}
              $delayIndex={index}
            >
              <CardTitleRow>
                <TitleAccent $accent={accent} $delayIndex={index} aria-hidden />
                <CardTitle>{view.name}</CardTitle>
              </CardTitleRow>
              <CardDesc>{view.description}</CardDesc>
              <CardMeta>Atualizado em {formatDisplayDate(view.updatedAt)}</CardMeta>
            </ProjectCard>
          )
        })}
      </Grid>
    </>
  )
}
