import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { ProjectArchitectureCanvas } from '../components/ProjectArchitectureCanvas'
import { resolveProjectById } from '../data/projects'
import {
  BackLink,
  ModelingPageRoot,
  PageTitle,
} from './DatabaseModeling.styles'

export function ProjectArchitecture() {
  const { projectId } = useParams<{ projectId: string }>()
  const [metaTick, setMetaTick] = useState(0)

  useEffect(() => {
    const onMeta = () => setMetaTick((n) => n + 1)
    window.addEventListener('flow-project-meta-changed', onMeta)
    return () => window.removeEventListener('flow-project-meta-changed', onMeta)
  }, [])

  const project = useMemo(
    () => (projectId ? resolveProjectById(projectId) : undefined),
    // metaTick: mesmo padrão de DatabaseModeling — re-resolve ao salvar metadados do projeto.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- metaTick é dependência só para invalidar
    [projectId, metaTick],
  )

  if (!projectId) {
    return <Navigate to="/projects" replace />
  }

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  return (
    <ModelingPageRoot>
      <BackLink to={`/projects/${project.id}`}>← Voltar ao projeto</BackLink>
      <PageTitle>Arquitetura — {project.name}</PageTitle>
      <ProjectArchitectureCanvas
        key={project.id}
        projectId={project.id}
        projectName={project.name}
      />
    </ModelingPageRoot>
  )
}
