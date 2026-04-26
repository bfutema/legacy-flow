import {
  SiAdonisjs,
  SiAngular,
  SiElectron,
  SiExpress,
  SiExpo,
  SiFastify,
  SiFlutter,
  SiGooglecloud,
  SiKoa,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiVite,
  SiVuedotjs,
} from 'react-icons/si'
import { FaAws, FaMicrosoft } from 'react-icons/fa6'
import { FiTerminal } from 'react-icons/fi'
import type { ComponentType, ReactNode } from 'react'
import type { ProjectCloudProvider } from '../../data/cloudProviders'
import type { PrimaryDatabaseType } from '../../data/databaseEngines'
import type { ArchitectureBlockKind } from './architectureTypes'

export type ArchitectureClientSurface = 'web' | 'mobile' | 'desktop' | 'cli'
export const ARCH_CLIENT_SURFACES: ArchitectureClientSurface[] = [
  'web',
  'mobile',
  'desktop',
  'cli',
]
export const ARCH_CLIENT_SURFACE_LABELS: Record<ArchitectureClientSurface, string> = {
  web: 'Web',
  mobile: 'Mobile',
  desktop: 'Desktop',
  cli: 'CLI',
}

export type ArchitectureClientTech =
  | 'vite'
  | 'nextjs'
  | 'vuejs'
  | 'angular'
  | 'electron'
  | 'expo'
  | 'react-native'
  | 'flutter'
  | 'cli'
export type ArchitectureServiceTech =
  | 'fastify'
  | 'express'
  | 'koa'
  | 'nestjs'
  | 'adonisjs'
export type ArchitectureQueueTech = 'aws-sqs' | 'gcp-pubsub' | 'azure-service-bus'
export type ArchitectureDatabaseTech = 'mysql' | 'psql' | 'mssql'

export type ArchitectureRuntimeTech =
  | ArchitectureClientTech
  | ArchitectureServiceTech
  | ArchitectureQueueTech
  | ArchitectureDatabaseTech

export const ARCH_CLIENT_TECHS: ArchitectureClientTech[] = [
  'vite',
  'nextjs',
  'vuejs',
  'angular',
  'electron',
  'expo',
  'react-native',
  'flutter',
  'cli',
]
export const ARCH_CLIENT_WEB_TECHS: ArchitectureClientTech[] = [
  'vite',
  'nextjs',
  'vuejs',
  'angular',
]
export const ARCH_CLIENT_MOBILE_TECHS: ArchitectureClientTech[] = [
  'expo',
  'react-native',
  'flutter',
]
export const ARCH_CLIENT_DESKTOP_TECHS: ArchitectureClientTech[] = ['electron']
export const ARCH_CLIENT_CLI_TECHS: ArchitectureClientTech[] = ['cli']
export const ARCH_SERVICE_TECHS: ArchitectureServiceTech[] = [
  'fastify',
  'express',
  'koa',
  'nestjs',
  'adonisjs',
]
export const ARCH_QUEUE_TECHS: ArchitectureQueueTech[] = [
  'aws-sqs',
  'gcp-pubsub',
  'azure-service-bus',
]
export const ARCH_DATABASE_TECHS: ArchitectureDatabaseTech[] = [
  'mysql',
  'psql',
  'mssql',
]

const TECH_LABEL: Record<ArchitectureRuntimeTech, string> = {
  vite: 'Vite',
  nextjs: 'NextJs',
  vuejs: 'VueJs',
  angular: 'Angular',
  fastify: 'Fastify',
  express: 'Express',
  koa: 'Koa',
  nestjs: 'NestJs',
  adonisjs: 'AdonisJs',
  'aws-sqs': 'AWS SQS',
  'gcp-pubsub': 'GCP Pub/Sub',
  'azure-service-bus': 'Azure Service Bus',
  mysql: 'MySQL',
  psql: 'psql',
  mssql: 'MSSQL',
  electron: 'Electron',
  expo: 'Expo',
  'react-native': 'React Native',
  flutter: 'Flutter',
  cli: 'CLI',
}

const TECH_ICON = {
  vite: SiVite,
  nextjs: SiNextdotjs,
  vuejs: SiVuedotjs,
  angular: SiAngular,
  fastify: SiFastify,
  express: SiExpress,
  koa: SiKoa,
  nestjs: SiNestjs,
  adonisjs: SiAdonisjs,
  'aws-sqs': FaAws,
  'gcp-pubsub': SiGooglecloud,
  'azure-service-bus': FaMicrosoft,
  mysql: SiMysql,
  psql: SiPostgresql,
  mssql: FaMicrosoft,
  electron: SiElectron,
  expo: SiExpo,
  'react-native': SiReact,
  flutter: SiFlutter,
  cli: FiTerminal,
} satisfies Record<ArchitectureRuntimeTech, ComponentType<{ size?: number }>>

const TECH_FROM_HINT: Record<string, ArchitectureRuntimeTech> = {
  react: 'vite',
  node: 'fastify',
  'node / http': 'fastify',
  fastify: 'fastify',
  express: 'express',
  koa: 'koa',
  nestjs: 'nestjs',
  'nest js': 'nestjs',
  adonisjs: 'adonisjs',
  'adonis js': 'adonisjs',
  nextjs: 'nextjs',
  'next js': 'nextjs',
  vuejs: 'vuejs',
  'vue js': 'vuejs',
  angular: 'angular',
  vite: 'vite',
  sqs: 'aws-sqs',
  'aws sqs': 'aws-sqs',
  'gcp pub/sub': 'gcp-pubsub',
  pubsub: 'gcp-pubsub',
  'google pubsub': 'gcp-pubsub',
  'azure service bus': 'azure-service-bus',
  servicebus: 'azure-service-bus',
  mysql: 'mysql',
  postgresql: 'psql',
  psql: 'psql',
  mssql: 'mssql',
  'sql server': 'mssql',
  electron: 'electron',
  expo: 'expo',
  'react native': 'react-native',
  flutter: 'flutter',
  cli: 'cli',
  terminal: 'cli',
  commandline: 'cli',
}

function defaultQueueTechForCloud(cloud: ProjectCloudProvider): ArchitectureQueueTech {
  if (cloud === 'gcp') return 'gcp-pubsub'
  if (cloud === 'azure') return 'azure-service-bus'
  return 'aws-sqs'
}

function defaultClientTechForSurface(
  clientSurface: ArchitectureClientSurface,
): ArchitectureClientTech {
  if (clientSurface === 'mobile') return 'expo'
  if (clientSurface === 'desktop') return 'electron'
  if (clientSurface === 'cli') return 'cli'
  return 'vite'
}

function defaultDatabaseTechForProject(db: PrimaryDatabaseType): ArchitectureDatabaseTech {
  if (db === 'postgresql') return 'psql'
  if (db === 'mssql') return 'mssql'
  return 'mysql'
}

export function defaultTechForKind(
  kind: ArchitectureBlockKind,
  projectCloud: ProjectCloudProvider = 'aws',
  projectPrimaryDatabase: PrimaryDatabaseType = 'mysql',
  clientSurface: ArchitectureClientSurface = 'web',
): ArchitectureRuntimeTech | undefined {
  if (kind === 'client') return defaultClientTechForSurface(clientSurface)
  if (kind === 'service') return 'fastify'
  if (kind === 'queue') return defaultQueueTechForCloud(projectCloud)
  if (kind === 'database') return defaultDatabaseTechForProject(projectPrimaryDatabase)
  return undefined
}

export function techLabel(tech?: ArchitectureRuntimeTech): string | undefined {
  if (!tech) return undefined
  return TECH_LABEL[tech]
}

export function techIcon(tech?: ArchitectureRuntimeTech) {
  if (!tech) return undefined
  return TECH_ICON[tech]
}

export function renderTechIcon(
  tech: ArchitectureRuntimeTech | undefined,
  size = 12,
): ReactNode {
  if (!tech) return null
  const Icon = TECH_ICON[tech]
  return <Icon size={size} aria-hidden />
}

export function allowedTechsForKind(
  kind: ArchitectureBlockKind,
  clientSurface: ArchitectureClientSurface = 'web',
): ArchitectureRuntimeTech[] {
  if (kind === 'client') {
    if (clientSurface === 'mobile') return ARCH_CLIENT_MOBILE_TECHS
    if (clientSurface === 'desktop') return ARCH_CLIENT_DESKTOP_TECHS
    if (clientSurface === 'cli') return ARCH_CLIENT_CLI_TECHS
    return ARCH_CLIENT_WEB_TECHS
  }
  if (kind === 'service') return ARCH_SERVICE_TECHS
  if (kind === 'queue') return ARCH_QUEUE_TECHS
  if (kind === 'database') return ARCH_DATABASE_TECHS
  return []
}

function isAllowedForKind(
  kind: ArchitectureBlockKind,
  tech: ArchitectureRuntimeTech,
  clientSurface: ArchitectureClientSurface,
): boolean {
  return allowedTechsForKind(kind, clientSurface).includes(tech)
}

export function normalizeTechForNode(
  kind: ArchitectureBlockKind,
  tech?: ArchitectureRuntimeTech,
  techHint?: string,
  projectCloud: ProjectCloudProvider = 'aws',
  projectPrimaryDatabase: PrimaryDatabaseType = 'mysql',
  clientSurface: ArchitectureClientSurface = 'web',
): ArchitectureRuntimeTech | undefined {
  if (tech && isAllowedForKind(kind, tech, clientSurface)) return tech
  const byHint = techHint ? TECH_FROM_HINT[techHint.trim().toLowerCase()] : undefined
  if (byHint && isAllowedForKind(kind, byHint, clientSurface)) return byHint
  return defaultTechForKind(kind, projectCloud, projectPrimaryDatabase, clientSurface)
}
