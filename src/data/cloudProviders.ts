export const PROJECT_CLOUDS = ['aws', 'gcp', 'azure'] as const

export type ProjectCloudProvider = (typeof PROJECT_CLOUDS)[number]

export function isProjectCloudProvider(v: string): v is ProjectCloudProvider {
  return (PROJECT_CLOUDS as readonly string[]).includes(v)
}

export const PROJECT_CLOUD_LABELS: Record<ProjectCloudProvider, string> = {
  aws: 'AWS',
  gcp: 'Google Cloud',
  azure: 'Microsoft Azure',
}

