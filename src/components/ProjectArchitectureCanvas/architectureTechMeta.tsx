import {
  SiAdonisjs,
  SiAngular,
  SiExpress,
  SiFastify,
  SiKoa,
  SiNestjs,
  SiNextdotjs,
  SiVite,
  SiVuedotjs,
} from 'react-icons/si'
import type { ComponentType, ReactNode } from 'react'
import type { ArchitectureBlockKind } from './architectureTypes'

export type ArchitectureClientTech = 'vite' | 'nextjs' | 'vuejs' | 'angular'
export type ArchitectureServiceTech =
  | 'fastify'
  | 'express'
  | 'koa'
  | 'nestjs'
  | 'adonisjs'

export type ArchitectureRuntimeTech = ArchitectureClientTech | ArchitectureServiceTech

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
}

export function defaultTechForKind(kind: ArchitectureBlockKind): ArchitectureRuntimeTech | undefined {
  if (kind === 'client') return 'vite'
  if (kind === 'service') return 'fastify'
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
  return []
}

function isAllowedForKind(kind: ArchitectureBlockKind, tech: ArchitectureRuntimeTech): boolean {
  return allowedTechsForKind(kind).includes(tech)
}

export function normalizeTechForNode(
  kind: ArchitectureBlockKind,
  tech?: ArchitectureRuntimeTech,
  techHint?: string,
): ArchitectureRuntimeTech | undefined {
  if (tech && isAllowedForKind(kind, tech)) return tech
  const byHint = techHint ? TECH_FROM_HINT[techHint.trim().toLowerCase()] : undefined
  if (byHint && isAllowedForKind(kind, byHint)) return byHint
  return defaultTechForKind(kind)
}
