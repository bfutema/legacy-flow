import { useEffect, useMemo, useState } from 'react'
import { Can } from '../contexts/AbilityContext'
import { getDirectoryUsers } from '../data/directoryUsers'
import { UsersDirectoryView } from '../components/UsersDirectoryView/UsersDirectoryView'
import {
  Lead,
  NewUserCta,
  PageTitle,
  UsersActions,
  UsersTop,
} from './Users.styles'

export function Users() {
  const [listTick, setListTick] = useState(0)
  useEffect(() => {
    const onList = () => setListTick((n) => n + 1)
    window.addEventListener('flow-app-users-changed', onList)
    return () => window.removeEventListener('flow-app-users-changed', onList)
  }, [])
  const users = useMemo(() => getDirectoryUsers(), [listTick])

  return (
    <>
      <UsersTop>
        <PageTitle>Usuários</PageTitle>
        <UsersActions>
          <Can I="create" a="User">
            <NewUserCta to="/users/new">Novo usuário</NewUserCta>
          </Can>
        </UsersActions>
      </UsersTop>
      <Lead>
        Equipe demo mais usuários cadastrados neste navegador. Escolha tabela,
        cards ou lista para visualizar.
      </Lead>
      <UsersDirectoryView users={users} />
    </>
  )
}
