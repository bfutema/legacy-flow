import { Fragment, useCallback, useMemo, useState } from 'react'
import { mergeRulesForSlug } from '../authorization/createAbility'
import { GUEST_DEFAULT } from '../authorization/defaultRoleRules'
import { PERMISSION_CATALOG } from '../authorization/permissionCatalog'
import { slugToDefaultLabel } from '../authorization/roleMapping'
import {
  catalogIdsToRules,
  rulesToCatalogIdSet,
} from '../authorization/ruleCodec'
import type { RoleSlug } from '../authorization/types'
import {
  clearRoleRules,
  loadRoleRuleOverrides,
  saveRoleRuleOverrides,
} from '../persistence/permissionRoleStorage'
import {
  AdminNote,
  Check,
  GhostBtn,
  GroupCell,
  GroupRow,
  Lead,
  Muted,
  PageTitle,
  PrimaryBtn,
  Root,
  SavedFlash,
  Table,
  TableScroll,
  Td,
  TdCenter,
  Th,
  ThCenter,
  Toolbar,
} from './AccessControl.styles'

type MatrixSlug = RoleSlug | 'guest'

function initialGuestSet(): Set<string> {
  const overrides = loadRoleRuleOverrides()
  const rules = Object.prototype.hasOwnProperty.call(overrides, 'guest')
    ? (overrides.guest ?? [])
    : GUEST_DEFAULT
  return rulesToCatalogIdSet(rules)
}

function usePermissionMatrix() {
  const [editor, setEditor] = useState(() =>
    rulesToCatalogIdSet(mergeRulesForSlug('editor')),
  )
  const [viewer, setViewer] = useState(() =>
    rulesToCatalogIdSet(mergeRulesForSlug('viewer')),
  )
  const [guest, setGuest] = useState(() => initialGuestSet())
  const [saved, setSaved] = useState(false)

  const persist = useCallback(() => {
    saveRoleRuleOverrides({
      editor: catalogIdsToRules(editor),
      viewer: catalogIdsToRules(viewer),
      guest: catalogIdsToRules(guest),
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2400)
  }, [editor, viewer, guest])

  const resetAllDefaults = useCallback(() => {
    clearRoleRules('editor')
    clearRoleRules('viewer')
    clearRoleRules('guest')
    setEditor(rulesToCatalogIdSet(mergeRulesForSlug('editor')))
    setViewer(rulesToCatalogIdSet(mergeRulesForSlug('viewer')))
    setGuest(rulesToCatalogIdSet(GUEST_DEFAULT))
  }, [])

  const toggle = useCallback(
    (slug: MatrixSlug, id: string, checked: boolean) => {
      const apply = (prev: Set<string>) => {
        const next = new Set(prev)
        if (checked) next.add(id)
        else next.delete(id)
        return next
      }
      if (slug === 'editor') setEditor((p) => apply(p))
      if (slug === 'viewer') setViewer((p) => apply(p))
      if (slug === 'guest') setGuest((p) => apply(p))
    },
    [],
  )

  return {
    editor,
    viewer,
    guest,
    toggle,
    persist,
    resetAllDefaults,
    saved,
  }
}

export function AccessControl() {
  const {
    editor,
    viewer,
    guest,
    toggle,
    persist,
    resetAllDefaults,
    saved,
  } = usePermissionMatrix()

  const groups = useMemo(() => {
    const m = new Map<string, typeof PERMISSION_CATALOG>()
    for (const item of PERMISSION_CATALOG) {
      const g = item.group
      if (!m.has(g)) m.set(g, [])
      m.get(g)!.push(item)
    }
    return [...m.entries()]
  }, [])

  return (
    <Root>
      <PageTitle>Controle de acesso</PageTitle>
      <Lead>
        Permissões granulares por papel (RBAC). As regras seguem o modelo CASL
        (ação + recurso) para facilitar a mesma política na API depois. O papel{' '}
        <strong>{slugToDefaultLabel('admin')}</strong> ignora esta matriz e mantém
        acesso total.
      </Lead>
      <AdminNote>
        <strong>Visitante</strong> aplica-se a quem faz login com um e-mail que
        não existe no diretório. Ajuste com cuidado: é o nível mais restritivo
        para contas não reconhecidas.
      </AdminNote>
      <Toolbar>
        <PrimaryBtn type="button" onClick={persist}>
          Salvar alterações
        </PrimaryBtn>
        <GhostBtn type="button" onClick={resetAllDefaults}>
          Restaurar padrões (editor, visualizador e visitante)
        </GhostBtn>
        {saved ? <SavedFlash>Salvo neste navegador.</SavedFlash> : null}
      </Toolbar>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <Th>Permissão</Th>
              <ThCenter>{slugToDefaultLabel('editor')}</ThCenter>
              <ThCenter>{slugToDefaultLabel('viewer')}</ThCenter>
              <ThCenter>Visitante</ThCenter>
            </tr>
          </thead>
          <tbody>
            {groups.map(([groupName, items]) => (
              <Fragment key={groupName}>
                <GroupRow>
                  <GroupCell colSpan={4}>{groupName}</GroupCell>
                </GroupRow>
                {items.map((item) => (
                  <tr key={item.id}>
                    <Td>
                      {item.label}
                      {item.description ? (
                        <Muted>{item.description}</Muted>
                      ) : null}
                    </Td>
                    <TdCenter>
                      <Check
                        type="checkbox"
                        checked={editor.has(item.id)}
                        onChange={(e) =>
                          toggle('editor', item.id, e.target.checked)
                        }
                        aria-label={`${item.label} — ${slugToDefaultLabel('editor')}`}
                      />
                    </TdCenter>
                    <TdCenter>
                      <Check
                        type="checkbox"
                        checked={viewer.has(item.id)}
                        onChange={(e) =>
                          toggle('viewer', item.id, e.target.checked)
                        }
                        aria-label={`${item.label} — ${slugToDefaultLabel('viewer')}`}
                      />
                    </TdCenter>
                    <TdCenter>
                      <Check
                        type="checkbox"
                        checked={guest.has(item.id)}
                        onChange={(e) =>
                          toggle('guest', item.id, e.target.checked)
                        }
                        aria-label={`${item.label} — visitante`}
                      />
                    </TdCenter>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </Table>
      </TableScroll>
    </Root>
  )
}
