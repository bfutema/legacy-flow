import { createMongoAbility } from '@casl/ability'
import { createContextualCan } from '@casl/react'
import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createAbilityForSession } from '../authorization/createAbility'
import type { AppAbilities, AppAbility } from '../authorization/types'
import { useAuth } from './AuthContext'

export const AbilityContext = createContext<AppAbility>(
  createMongoAbility<AppAbilities>([]),
)

export const Can = createContextualCan(AbilityContext.Consumer)

export function AbilityProvider({ children }: { children: ReactNode }) {
  const { userEmail } = useAuth()
  const [permTick, setPermTick] = useState(0)

  useEffect(() => {
    const bump = () => setPermTick((n) => n + 1)
    window.addEventListener('flow-permissions-changed', bump)
    window.addEventListener('flow-app-users-changed', bump)
    return () => {
      window.removeEventListener('flow-permissions-changed', bump)
      window.removeEventListener('flow-app-users-changed', bump)
    }
  }, [])

  const ability = useMemo(
    () => createAbilityForSession(userEmail),
    // permTick: eventos flow-permissions-changed / flow-app-users-changed
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recalcular ability ao alterar papéis
    [userEmail, permTick],
  )

  return (
    <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  )
}
