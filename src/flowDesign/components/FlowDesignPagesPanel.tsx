import { useState } from 'react'
import { HiTrash } from 'react-icons/hi2'
import { useConfirmDialog } from '../../contexts/ConfirmDialogContext'
import { useFlowDesign } from '../state/FlowDesignContext'
import {
  IconGhostBtn,
  PageActions,
  PageNameInput,
  PageRow,
  PagesFooter,
  PagesList,
  PrimaryToolbarBtn,
} from './FlowDesignPagesPanel.styles'
import { PanelScroll } from './FlowDesignShell.styles'

const ic = { size: 16 as const, 'aria-hidden': true as const }

export function FlowDesignPagesPanel() {
  const { state, dispatch } = useFlowDesign()
  const { confirm } = useConfirmDialog()
  const [editingId, setEditingId] = useState<string | null>(null)

  const activeId = state.ui.activePageId

  const onDelete = async (pageId: string, name: string) => {
    if (state.doc.pages.length <= 1) return
    const ok = await confirm({
      title: 'Excluir página',
      message: `Remover a página "${name}"? O conteúdo será apagado ao salvar.`,
      confirmLabel: 'Excluir',
    })
    if (ok) dispatch({ type: 'DELETE_PAGE', pageId })
  }

  return (
    <>
      <PanelScroll>
        <PagesList>
          {state.doc.pages.map((p) => (
            <PageRow
              key={p.id}
              $active={p.id === activeId}
              tabIndex={0}
              role="button"
              aria-current={p.id === activeId ? 'true' : undefined}
              onClick={() => dispatch({ type: 'SET_ACTIVE_PAGE', pageId: p.id })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  dispatch({ type: 'SET_ACTIVE_PAGE', pageId: p.id })
                }
              }}
            >
              {editingId === p.id ? (
                <PageNameInput
                  autoFocus
                  defaultValue={p.name}
                  aria-label="Nome da página"
                  onBlur={(e) => {
                    dispatch({ type: 'RENAME_PAGE', pageId: p.id, name: e.target.value })
                    setEditingId(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {p.name}
                  </span>
                  <PageActions>
                    <IconGhostBtn
                      type="button"
                      title="Renomear"
                      aria-label={`Renomear ${p.name}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingId(p.id)
                      }}
                    >
                      ✎
                    </IconGhostBtn>
                    {state.doc.pages.length > 1 ? (
                      <IconGhostBtn
                        type="button"
                        title="Excluir página"
                        aria-label={`Excluir ${p.name}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          void onDelete(p.id, p.name)
                        }}
                      >
                        <HiTrash {...ic} />
                      </IconGhostBtn>
                    ) : null}
                  </PageActions>
                </>
              )}
            </PageRow>
          ))}
        </PagesList>
      </PanelScroll>
      <PagesFooter>
        <PrimaryToolbarBtn type="button" onClick={() => dispatch({ type: 'ADD_PAGE' })}>
          Nova página
        </PrimaryToolbarBtn>
      </PagesFooter>
    </>
  )
}
