import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useProjectPrimaryColor } from '../hooks/useProjectPrimaryColor'
import { saveProjectMetadata } from '../persistence/projectMetadataStorage'
import { formatDisplayDate } from '../utils/formatDisplayDate'
import {
  ColorBoxInput,
  ColorBoxLabel,
  DescField,
  EditHint,
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
  const { primaryColor, setPrimaryColor } = useProjectPrimaryColor(projectId)
  const [localTitle, setLocalTitle] = useState(title)
  const [localDesc, setLocalDesc] = useState(description)
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    setLocalTitle(title)
    setLocalDesc(description)
  }, [title, description, updatedAt])

  const commit = useCallback(() => {
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
              onChange={(e) => setPrimaryColor(e.target.value)}
              aria-label="Cor primária do projeto"
            />
          </ColorBoxLabel>
          <TitleField
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={commit}
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
        aria-label="Descrição do projeto"
        placeholder="Breve descrição do escopo do projeto…"
        rows={2}
      />
      <HeaderMetaRow>
        {savedFlash ? <SavedFlash>Salvo neste navegador</SavedFlash> : null}
        <span>Última atualização: {formatDisplayDate(updatedAt)}</span>
      </HeaderMetaRow>
      <EditHint>
        Clique no nome ou na descrição para editar. A cor à esquerda vale para os
        cabeçalhos das tabelas na modelagem.
      </EditHint>
    </HeaderRoot>
  )
}
