import {
  WorkspaceNavChevron,
  WorkspaceNavIconWrap,
  WorkspaceNavLinkApf,
  WorkspaceNavLinkArchitecture,
  WorkspaceNavLinkFiles,
  WorkspaceNavLinkModeling,
  WorkspaceNavLinkSqlScripts,
  WorkspaceNavList,
  WorkspaceNavRowBody,
  WorkspaceNavRowDesc,
  WorkspaceNavRowLocked,
  WorkspaceNavRowTitle,
} from './ProjectDetail.styles'

const iconDb = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
)

const iconArch = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
  </svg>
)

const iconFiles = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
)

const iconApf = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </svg>
)

const iconSql = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <path d="M4 7h4v10H4zM10 5h4v14h-4zM16 9h4v6h-4z" />
  </svg>
)

type ProjectWorkspaceNavProps = {
  projectId: string
  isMonorepo: boolean
  canUpdateProject: boolean
}

export function ProjectWorkspaceNav({
  projectId,
  isMonorepo,
  canUpdateProject,
}: ProjectWorkspaceNavProps) {
  return (
    <WorkspaceNavList>
      {canUpdateProject ? (
        <WorkspaceNavLinkModeling to={`/projects/${projectId}/modeling`}>
          <WorkspaceNavIconWrap>{iconDb}</WorkspaceNavIconWrap>
          <WorkspaceNavRowBody>
            <WorkspaceNavRowTitle>Modelagem do banco de dados</WorkspaceNavRowTitle>
            <WorkspaceNavRowDesc>
              Editor visual com grade, zoom e minimapa.
            </WorkspaceNavRowDesc>
          </WorkspaceNavRowBody>
          <WorkspaceNavChevron aria-hidden>→</WorkspaceNavChevron>
        </WorkspaceNavLinkModeling>
      ) : (
        <WorkspaceNavRowLocked $variant="modeling">
          <WorkspaceNavIconWrap>{iconDb}</WorkspaceNavIconWrap>
          <WorkspaceNavRowBody>
            <WorkspaceNavRowTitle>Modelagem do banco de dados</WorkspaceNavRowTitle>
            <WorkspaceNavRowDesc>
              Peça permissão para editar projeto e modelagem.
            </WorkspaceNavRowDesc>
          </WorkspaceNavRowBody>
        </WorkspaceNavRowLocked>
      )}
      {canUpdateProject ? (
        <WorkspaceNavLinkSqlScripts to={`/projects/${projectId}/sql-scripts`}>
          <WorkspaceNavIconWrap>{iconSql}</WorkspaceNavIconWrap>
          <WorkspaceNavRowBody>
            <WorkspaceNavRowTitle>Scripts SQL do projeto</WorkspaceNavRowTitle>
            <WorkspaceNavRowDesc>
              Biblioteca com editor Monaco: salve e reutilize consultas e rotinas.
            </WorkspaceNavRowDesc>
          </WorkspaceNavRowBody>
          <WorkspaceNavChevron aria-hidden>→</WorkspaceNavChevron>
        </WorkspaceNavLinkSqlScripts>
      ) : (
        <WorkspaceNavRowLocked $variant="sqlScripts">
          <WorkspaceNavIconWrap>{iconSql}</WorkspaceNavIconWrap>
          <WorkspaceNavRowBody>
            <WorkspaceNavRowTitle>Scripts SQL do projeto</WorkspaceNavRowTitle>
            <WorkspaceNavRowDesc>
              Disponível com permissão de edição do projeto.
            </WorkspaceNavRowDesc>
          </WorkspaceNavRowBody>
        </WorkspaceNavRowLocked>
      )}
      {canUpdateProject ? (
        <WorkspaceNavLinkArchitecture to={`/projects/${projectId}/architecture`}>
          <WorkspaceNavIconWrap>{iconArch}</WorkspaceNavIconWrap>
          <WorkspaceNavRowBody>
            <WorkspaceNavRowTitle>Mapa de arquitetura</WorkspaceNavRowTitle>
            <WorkspaceNavRowDesc>
              Serviços, filas e clientes em canvas dedicado.
            </WorkspaceNavRowDesc>
          </WorkspaceNavRowBody>
          <WorkspaceNavChevron aria-hidden>→</WorkspaceNavChevron>
        </WorkspaceNavLinkArchitecture>
      ) : (
        <WorkspaceNavRowLocked $variant="architecture">
          <WorkspaceNavIconWrap>{iconArch}</WorkspaceNavIconWrap>
          <WorkspaceNavRowBody>
            <WorkspaceNavRowTitle>Mapa de arquitetura</WorkspaceNavRowTitle>
            <WorkspaceNavRowDesc>
              Disponível com permissão de edição do projeto.
            </WorkspaceNavRowDesc>
          </WorkspaceNavRowBody>
        </WorkspaceNavRowLocked>
      )}
      <WorkspaceNavLinkApf to={`/projects/${projectId}/apf`}>
        <WorkspaceNavIconWrap>{iconApf}</WorkspaceNavIconWrap>
        <WorkspaceNavRowBody>
          <WorkspaceNavRowTitle>Pontos de função (APF)</WorkspaceNavRowTitle>
          <WorkspaceNavRowDesc>
            IFPUG: contagem, fator de ajuste e estimativa de horas/custo com base no projeto.
          </WorkspaceNavRowDesc>
        </WorkspaceNavRowBody>
        <WorkspaceNavChevron aria-hidden>→</WorkspaceNavChevron>
      </WorkspaceNavLinkApf>
      <WorkspaceNavLinkFiles
        to={
          isMonorepo
            ? `/projects/${projectId}/workspace-files`
            : `/projects/${projectId}/subproject-files`
        }
      >
        <WorkspaceNavIconWrap>{iconFiles}</WorkspaceNavIconWrap>
        <WorkspaceNavRowBody>
          <WorkspaceNavRowTitle>
            {isMonorepo ? 'Explorador de arquivos' : 'Arquivos dos subprojetos'}
          </WorkspaceNavRowTitle>
          <WorkspaceNavRowDesc>
            {isMonorepo
              ? 'Árvore única do monorepo (apps/ e packages/); duplo-clique em um bloco no mapa.'
              : 'Um repositório por bloco; duplo-clique no mapa abre o subprojeto.'}
          </WorkspaceNavRowDesc>
        </WorkspaceNavRowBody>
        <WorkspaceNavChevron aria-hidden>→</WorkspaceNavChevron>
      </WorkspaceNavLinkFiles>
    </WorkspaceNavList>
  )
}
