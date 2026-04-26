import {
  SiAdonisjs,
  SiAngular,
  SiExpress,
  SiFastify,
  SiGooglecloud,
  SiKoa,
  SiNestjs,
  SiNextdotjs,
  SiVite,
  SiVuedotjs,
} from 'react-icons/si'
import { FaAws, FaMicrosoft } from 'react-icons/fa6'
import type { ComponentType, ReactNode } from 'react'
import type { ProjectCloudProvider } from '../../data/cloudProviders'
import type { ArchitectureBlockKind } from './architectureTypes'

export type ArchitectureClientTech = 'vite' | 'nextjs' | 'vuejs' | 'angular'
export type ArchitectureServiceTech =
  | 'fastify'
  | 'express'
  | 'koa'
  | 'nestjs'
  | 'adonisjs'
export type ArchitectureQueueTech = 'aws-sqs' | 'gcp-pubsub' | 'azure-service-bus'

export type ArchitectureRuntimeTech =
  | ArchitectureClientTech
  | ArchitectureServiceTech
  | ArchitectureQueueTech

export const ARCH_CLIENT_TECHS: ArchitectureClientTech[] = [
  'vite',
  'nextjs',
  'vuejs',
  'angular',
]
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
}

function defaultQueueTechForCloud(cloud: ProjectCloudProvider): ArchitectureQueueTech {
  if (cloud === 'gcp') return 'gcp-pubsub'
  if (cloud === 'azure') return 'azure-service-bus'
  return 'aws-sqs'
}

export function defaultTechForKind(
  kind: ArchitectureBlockKind,
  projectCloud: ProjectCloudProvider = 'aws',
): ArchitectureRuntimeTech | undefined {
  if (kind === 'client') return 'vite'
  if (kind === 'service') return 'fastify'
  if (kind === 'queue') return defaultQueueTechForCloud(projectCloud)
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

export function allowedTechsForKind(kind: ArchitectureBlockKind): ArchitectureRuntimeTech[] {
  if (kind === 'client') return ARCH_CLIENT_TECHS
  if (kind === 'service') return ARCH_SERVICE_TECHS
  if (kind === 'queue') return ARCH_QUEUE_TECHS
  return []
}

function isAllowedForKind(kind: ArchitectureBlockKind, tech: ArchitectureRuntimeTech): boolean {
  return allowedTechsForKind(kind).includes(tech)
}

export function normalizeTechForNode(
  kind: ArchitectureBlockKind,
  tech?: ArchitectureRuntimeTech,
  techHint?: string,
  projectCloud: ProjectCloudProvider = 'aws',
): ArchitectureRuntimeTech | undefined {
  if (tech && isAllowedForKind(kind, tech)) return tech
  const byHint = techHint ? TECH_FROM_HINT[techHint.trim().toLowerCase()] : undefined
  if (byHint && isAllowedForKind(kind, byHint)) return byHint
  return defaultTechForKind(kind, projectCloud)
}
