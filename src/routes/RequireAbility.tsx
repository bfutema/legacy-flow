import { useAbility } from '@casl/react'
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { AbilityContext } from '../contexts/AbilityContext'
import type { AppAction, AppSubject } from '../authorization/types'

type Props = {
  I: AppAction
  a: AppSubject
  children: ReactNode
}

/** Protege rota: sem permissão CASL, redireciona ao dashboard. */
export function RequireAbility({ I, a, children }: Props) {
  const ability = useAbility(AbilityContext)
  if (!ability.can(I, a)) {
    return <Navigate to="/" replace />
  }
  return children
}
