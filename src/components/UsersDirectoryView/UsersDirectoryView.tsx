import { useEffect, useState } from 'react'
import {
  HiChevronRight,
  HiOutlineListBullet,
  HiOutlinePencilSquare,
  HiOutlineSquares2X2,
  HiOutlineTableCells,
  HiOutlineUserCircle,
} from 'react-icons/hi2'
import { Can } from '../../contexts/AbilityContext'
import type { DemoUser } from '../../data/demoUsers'
import {
  loadUsersListViewMode,
  saveUsersListViewMode,
  type UsersListViewMode,
} from '../../persistence/usersListViewModeStorage'
import { formatDisplayDate } from '../../utils/formatDisplayDate'
import {
  CardDate,
  CardEmail,
  CardGrid,
  CardMeta,
  CardName,
  HeadRow,
  ListAside,
  ListAvatar,
  ListChevron,
  ListEmail,
  ListMain,
  ListName,
  ListRoot,
  ListRow,
  ListRowLink,
  Root,
  StatusPill,
  StatusPillTable,
  Table,
  TableActionGroup,
  TableIconActionLink,
  TableRow,
  TableWrap,
  Td,
  TdActions,
  Th,
  ThActions,
  ToggleBtn,
  ToggleGroup,
  Toolbar,
  UserCardLink,
  ViewContainer,
} from './UsersDirectoryView.styles'

export type UsersViewMode = UsersListViewMode

type Props = {
  users: DemoUser[]
}

function initialLetter(name: string): string {
  const t = name.trim()
  return t ? t[0]!.toUpperCase() : '?'
}

export function UsersDirectoryView({ users }: Props) {
  const [mode, setMode] = useState<UsersViewMode>(() => loadUsersListViewMode())

  useEffect(() => {
    saveUsersListViewMode(mode)
  }, [mode])

  return (
    <Root>
      <Toolbar>
        <ToggleGroup role="group" aria-label="Modo de visualização">
          <ToggleBtn
            type="button"
            $active={mode === 'table'}
            onClick={() => setMode('table')}
            aria-pressed={mode === 'table'}
            title="Tabela"
          >
            <HiOutlineTableCells aria-hidden />
            Tabela
          </ToggleBtn>
          <ToggleBtn
            type="button"
            $active={mode === 'cards'}
            onClick={() => setMode('cards')}
            aria-pressed={mode === 'cards'}
            title="Cards"
          >
            <HiOutlineSquares2X2 aria-hidden />
            Cards
          </ToggleBtn>
          <ToggleBtn
            type="button"
            $active={mode === 'list'}
            onClick={() => setMode('list')}
            aria-pressed={mode === 'list'}
            title="Lista"
          >
            <HiOutlineListBullet aria-hidden />
            Lista
          </ToggleBtn>
        </ToggleGroup>
      </Toolbar>

      {mode === 'table' ? (
        <ViewContainer key="table">
          <TableWrap>
            <Table>
              <thead>
                <HeadRow>
                  <Th scope="col">Nome</Th>
                  <Th scope="col">E-mail</Th>
                  <Th scope="col">Função</Th>
                  <Th scope="col">Status</Th>
                  <Th scope="col">Criado em</Th>
                  <ThActions scope="col">Ações</ThActions>
                </HeadRow>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <TableRow key={u.id} $delayIndex={index}>
                    <Td>{u.name}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.role}</Td>
                    <Td>
                      <StatusPillTable $active={u.status === 'active'}>
                        {u.status === 'active' ? 'Ativo' : 'Inativo'}
                      </StatusPillTable>
                    </Td>
                    <Td>{formatDisplayDate(u.createdAt)}</Td>
                    <TdActions>
                      <TableActionGroup>
                        <TableIconActionLink
                          to={`/users/${u.id}`}
                          aria-label={`Perfil de ${u.name}`}
                          title="Perfil"
                        >
                          <HiOutlineUserCircle aria-hidden />
                        </TableIconActionLink>
                        <Can I="update" a="User">
                          <TableIconActionLink
                            to={`/users/${u.id}/edit`}
                            aria-label={`Editar ${u.name}`}
                            title="Editar"
                          >
                            <HiOutlinePencilSquare aria-hidden />
                          </TableIconActionLink>
                        </Can>
                      </TableActionGroup>
                    </TdActions>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        </ViewContainer>
      ) : null}

      {mode === 'cards' ? (
        <ViewContainer key="cards">
          <CardGrid>
            {users.map((u, index) => (
              <UserCardLink
                key={u.id}
                to={`/users/${u.id}`}
                $delayIndex={index}
                aria-label={`Perfil de ${u.name}`}
              >
                <CardName>{u.name}</CardName>
                <CardEmail>{u.email}</CardEmail>
                <CardMeta>
                  <span>{u.role}</span>
                  <StatusPill $active={u.status === 'active'}>
                    {u.status === 'active' ? 'Ativo' : 'Inativo'}
                  </StatusPill>
                </CardMeta>
                <CardDate>
                  Criado em {formatDisplayDate(u.createdAt)}
                </CardDate>
              </UserCardLink>
            ))}
          </CardGrid>
        </ViewContainer>
      ) : null}

      {mode === 'list' ? (
        <ViewContainer key="list">
          <ListRoot>
            {users.map((u, index) => (
              <ListRow key={u.id}>
                <ListRowLink
                  to={`/users/${u.id}`}
                  $delayIndex={index}
                  aria-label={`Abrir perfil de ${u.name}`}
                >
                  <ListAvatar aria-hidden>{initialLetter(u.name)}</ListAvatar>
                  <ListMain>
                    <ListName>{u.name}</ListName>
                    <ListEmail>{u.email}</ListEmail>
                  </ListMain>
                  <ListAside>
                    <span>{u.role}</span>
                    <StatusPill $active={u.status === 'active'}>
                      {u.status === 'active' ? 'Ativo' : 'Inativo'}
                    </StatusPill>
                    <span>{formatDisplayDate(u.createdAt)}</span>
                  </ListAside>
                  <ListChevron aria-hidden>
                    <HiChevronRight />
                  </ListChevron>
                </ListRowLink>
              </ListRow>
            ))}
          </ListRoot>
        </ViewContainer>
      ) : null}
    </Root>
  )
}
