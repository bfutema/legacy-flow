export type UserStatus = 'active' | 'inactive'

export const USER_ROLE_OPTIONS = [
  'Administradora',
  'Editor',
  'Visualizadora',
] as const

export type DemoUser = {
  id: string
  name: string
  email: string
  role: string
  status: UserStatus
  createdAt: string
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'u1',
    name: 'Administrador Flow',
    email: 'admin@flow.com',
    role: 'Administradora',
    status: 'active',
    createdAt: '2025-11-02T10:15:00.000Z',
  },
  {
    id: 'u2',
    name: 'Bruno Silva',
    email: 'bruno.silva@flow.com',
    role: 'Editor',
    status: 'active',
    createdAt: '2026-01-18T14:22:33.000Z',
  },
  {
    id: 'u3',
    name: 'Carla Mendes',
    email: 'carla.mendes@flow.com',
    role: 'Visualizadora',
    status: 'active',
    createdAt: '2026-02-05T09:00:12.000Z',
  },
  {
    id: 'u4',
    name: 'Diego Alves',
    email: 'diego.alves@flow.com',
    role: 'Editor',
    status: 'inactive',
    createdAt: '2025-08-30T16:45:00.000Z',
  },
  {
    id: 'u5',
    name: 'Elena Rocha',
    email: 'elena.rocha@flow.com',
    role: 'Editor',
    status: 'active',
    createdAt: '2025-12-11T11:30:45.000Z',
  },
  {
    id: 'u6',
    name: 'Felipe Nunes',
    email: 'felipe.nunes@flow.com',
    role: 'Visualizadora',
    status: 'active',
    createdAt: '2026-03-01T08:05:18.000Z',
  },
  {
    id: 'u7',
    name: 'Gabriela Dias',
    email: 'gabriela.dias@flow.com',
    role: 'Editor',
    status: 'inactive',
    createdAt: '2025-10-20T13:12:00.000Z',
  },
  {
    id: 'u8',
    name: 'Henrique Pinto',
    email: 'henrique.pinto@flow.com',
    role: 'Visualizadora',
    status: 'active',
    createdAt: '2026-04-10T17:40:22.000Z',
  },
]
