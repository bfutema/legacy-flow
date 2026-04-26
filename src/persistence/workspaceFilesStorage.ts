export const WORKSPACE_FILES_STORAGE_VERSION = 'v1'

export function workspaceFilesStorageKey(projectId: string): string {
  return `flow-workspace-files:${WORKSPACE_FILES_STORAGE_VERSION}:${projectId}`
}
