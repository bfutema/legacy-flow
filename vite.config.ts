import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function viteBase(): string {
  const p = process.env.VITE_BASE_PATH?.trim()
  if (!p || p === '/') return '/'
  return p.endsWith('/') ? p : `${p}/`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /** GitHub Pages (subpath): export VITE_BASE_PATH="/<repo>/" antes do build (ex.: script deploy). */
  base: viteBase(),
})
