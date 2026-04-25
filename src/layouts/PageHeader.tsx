import { useAbility } from '@casl/react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { AbilityContext } from '../contexts/AbilityContext'
import { useProjectPrimaryColor } from '../hooks/useProjectPrimaryColor'
import { saveProjectMetadata } from '../persistence/projectMetadataStorage'
import { formatDisplayDate } from '../utils/formatDisplayDate'
import {
  ColorBoxInput,
  ColorBoxLabel,
  DescField,
  HeaderMetaRow,
  HeaderRoot,
  SavedFlash,
  TitleField,
  TitleRow,
  TitleRowActions,
  TitleRowStart,
} from './PageHeader.styles'

type PageHeaderProps = {
  projectId: string
  title: string
  description: string
  updatedAt: string
  /** Conteúdo à direita na linha do título (ex.: excluir projeto). */
  titleTrailing?: ReactNode
}

export function PageHeader({
  projectId,
  title,
  description,
  updatedAt,
  titleTrailing,
}: PageHeaderProps) {
  const ability = useAbility(AbilityContext)
  const canUpdate = ability.can('update', 'Project')
  const { primaryColor, setPrimaryColor } = useProjectPrimaryColor(projectId)
  const [localTitle, setLocalTitle] = useState(title)
  const [localDesc, setLocalDesc] = useState(description)
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    setLocalTitle(title)
    setLocalDesc(description)
  }, [title, description, updatedAt])

  const commit = useCallback(() => {
    if (!canUpdate) return
    const n = localTitle.trim()
    if (!n) {
      setLocalTitle(title)
      setLocalDesc(description)
      return
    }
    const d = localDesc.trim()
    if (n === title.trim() && d === description.trim()) return
    saveProjectMetadata(projectId, {
      name: n,
      description: d,
      updatedAt: new Date().toISOString(),
    })
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2200)
  }, [
    projectId,
    localTitle,
    localDesc,
    title,
    description,
    canUpdate,
  ])

  return (
    <HeaderRoot>
      <TitleRow>
        <TitleRowStart>
          <ColorBoxLabel
            title="Cor dos cabeçalhos das tabelas na modelagem (salva neste navegador)"
          >
            <ColorBoxInput
              type="color"
              value={primaryColor}
              disabled={!canUpdate}
              onChange={(e) => {
                if (!canUpdate) return
                setPrimaryColor(e.target.value)
              }}
              aria-label="Cor primária do projeto"
            />
          </ColorBoxLabel>
          <TitleField
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={commit}
            readOnly={!canUpdate}
            aria-label="Nome do projeto"
            placeholder="Nome do projeto"
            autoComplete="off"
          />
        </TitleRowStart>
        {titleTrailing ? (
          <TitleRowActions>{titleTrailing}</TitleRowActions>
        ) : null}
      </TitleRow>
      <DescField
        value={localDesc}
        onChange={(e) => setLocalDesc(e.target.value)}
        onBlur={commit}
        readOnly={!canUpdate}
        aria-label="Descrição do projeto"
        placeholder="Breve descrição do escopo do projeto…"
        rows={2}
      />
      <HeaderMetaRow>
        {savedFlash ? <SavedFlash>Salvo neste navegador</SavedFlash> : null}
        <span>Última atualização: {formatDisplayDate(updatedAt)}</span>
      </HeaderMetaRow>
    </HeaderRoot>
  )
}
