import type { Node } from '@xyflow/react'
import type { RelationshipEdge } from '../edges/relationshipTypes'
import type { TableNodeData } from './tableTypes'

/** Só o cabeçalho inicia arraste — evita “área invisível” sobre handles e labels vizinhos */
export const TABLE_NODE_DRAG_HANDLE = '.table-node-drag-handle'

export const initialDbNodes: Node<TableNodeData, 'table'>[] = [
  {
    id: 'users',
    type: 'table',
    dragHandle: TABLE_NODE_DRAG_HANDLE,
    position: { x: 40, y: 40 },
    data: {
      tableName: 'users',
      fields: [
        { key: 'id', name: 'id', type: 'int8', pk: true },
        { key: 'username', name: 'username', type: 'varchar (80)', optional: true },
        { key: 'name', name: 'name', type: 'varchar (120)', optional: true },
        { key: 'email', name: 'email', type: 'varchar (255)', optional: true },
        {
          key: 'email_confirmed',
          name: 'email_confirmed',
          type: 'boolean',
          optional: true,
          hasDefault: true,
          defaultValueSql: 'false',
        },
        {
          key: 'password_hash',
          name: 'password_hash',
          type: 'varchar (255)',
          required: true,
        },
        { key: 'created_at', name: 'created_at', type: 'timestamp', required: true },
      ],
    },
  },
  {
    id: 'projects',
    type: 'table',
    dragHandle: TABLE_NODE_DRAG_HANDLE,
    position: { x: 420, y: 120 },
    data: {
      tableName: 'projects',
      fields: [
        { key: 'id', name: 'id', type: 'int8', pk: true },
        { key: 'name', name: 'name', type: 'varchar (120)', required: true },
        { key: 'user_id', name: 'user_id', type: 'int8', required: true },
      ],
    },
  },
  {
    id: 'user_roles',
    type: 'table',
    dragHandle: TABLE_NODE_DRAG_HANDLE,
    position: { x: 40, y: 420 },
    data: {
      tableName: 'user_roles',
      fields: [
        { key: 'id', name: 'id', type: 'int8', pk: true },
        { key: 'user_id', name: 'user_id', type: 'int8', required: true },
        { key: 'role_id', name: 'role_id', type: 'int8', required: true },
      ],
    },
  },
  {
    id: 'roles',
    type: 'table',
    dragHandle: TABLE_NODE_DRAG_HANDLE,
    position: { x: 420, y: 420 },
    data: {
      tableName: 'roles',
      fields: [
        { key: 'id', name: 'id', type: 'int8', pk: true },
        { key: 'name', name: 'name', type: 'varchar (80)', required: true },
        { key: 'created_at', name: 'created_at', type: 'timestamp', required: true },
      ],
    },
  },
]

export const initialDbEdges: RelationshipEdge[] = [
  {
    id: 'e-users-proj',
    type: 'relationshipStep',
    source: 'users',
    target: 'projects',
    sourceHandle: 'id-out',
    targetHandle: 'user_id-in',
    data: {
      sourceCardinality: 'exactly_one',
      targetCardinality: 'one_or_many',
    },
    style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '6 4' },
  },
  {
    id: 'e-users-ur',
    type: 'relationshipStep',
    source: 'users',
    target: 'user_roles',
    sourceHandle: 'id-out',
    targetHandle: 'user_id-in',
    data: {
      sourceCardinality: 'exactly_one',
      targetCardinality: 'one_or_many',
    },
    style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '6 4' },
  },
  {
    id: 'e-roles-ur',
    type: 'relationshipStep',
    source: 'roles',
    target: 'user_roles',
    sourceHandle: 'id-out',
    targetHandle: 'role_id-in',
    data: {
      sourceCardinality: 'exactly_one',
      targetCardinality: 'one_or_many',
    },
    style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '6 4' },
  },
]
