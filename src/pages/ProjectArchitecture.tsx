import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ProjectArchitectureCanvas } from '../components/ProjectArchitectureCanvas'
import { resolveProjectById } from '../data/projects'
import { useProjectMonorepo } from '../hooks/useProjectMonorepo'
import {
  BackLink,
  ModelingPageRoot,
  PageTitle,
} from './DatabaseModeling.styles'

const THEATER_STORAGE_KEY = 'flow-theater-mode:architecture'

export function ProjectArchitecture() {
  const { projectId } = useParams<{ projectId: string }>()
  const [metaTick, setMetaTick] = useState(0)
  const [theaterMode, setTheaterMode] = useState(() => {
    try {
      return localStorage.getItem(THEATER_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const onMeta = () => setMetaTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', onMeta)
    return () => window.removeEventListener('flow-project-meta-changed', onMeta)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(THEATER_STORAGE_KEY, theaterMode ? '1' : '0')
    } catch (err) {
      console.warn('[arquitetura] Não foi possível persistir modo teatro:', err)
    }
  }, [theaterMode])

  const project = useMemo(
    () => (projectId ? resolveProjectById(projectId) : undefined),
    // metaTick: mesmo padrão de DatabaseModeling — re-resolve ao salvar metadados do projeto.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- metaTick é dependência só para invalidar
    [projectId, metaTick],
  )

  const { isMonorepo } = useProjectMonorepo(projectId)

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <ModelingPageRoot $theater={theaterMode}>
      {!theaterMode ? (
        <BackLink to={`/projects/${project.id}`}>← Voltar ao projeto</BackLink>
      ) : null}
      {!theaterMode ? <PageTitle>Arquitetura — {project.name}</PageTitle> : null}
      <ProjectArchitectureCanvas
        key={project.id}
        projectId={project.id}
        theaterMode={theaterMode}
        onToggleTheater={() => setTheaterMode((v) => !v)}
        isMonorepo={isMonorepo}
      />
    </ModelingPageRoot>
  )
}
