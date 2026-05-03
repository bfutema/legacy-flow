import { useMemo } from 'react'
import { useAbility } from '@casl/react'
import { AbilityContext } from '../contexts/AbilityContext'
import { useAuth } from '../contexts/AuthContext'
import { getUserByEmail } from '../data/directoryUsers'
import { displayNameFromEmail } from '../utils/userDisplay'
import { InlineLink, Lead, PageRoot, PageTitle } from './AccountPages.styles'

export function AccountProfile() {
  const { userEmail } = useAuth()
  const ability = useAbility(AbilityContext)
  const dirUser = useMemo(
    () => (userEmail ? getUserByEmail(userEmail) : undefined),
    [userEmail],
  )

  const displayName = dirUser?.name ?? displayNameFromEmail(userEmail ?? '')
  const canSeeDirectoryProfile =
    Boolean(dirUser) && ability.can('read', 'User')

  return (
    <PageRoot>
      <PageTitle>Meu perfil</PageTitle>
      <Lead>
        Visão resumida da sua conta neste ambiente. Os dados vêm do cadastro local de usuários
        quando o seu e-mail está associado a um perfil.
      </Lead>
      <Lead>
        <strong>Nome:</strong> {displayName}
      </Lead>
      <Lead>
        <strong>E-mail:</strong> {userEmail ?? '—'}
      </Lead>
      {canSeeDirectoryProfile && dirUser ? (
        <Lead>
          <InlineLink to={`/users/${dirUser.id}`}>Abrir perfil completo na lista de usuários</InlineLink>
        </Lead>
      ) : null}
    </PageRoot>
  )
}
