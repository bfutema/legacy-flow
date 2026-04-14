/**
 * GitHub Pages não faz fallback para index.html em rotas do SPA.
 * Duplicar index → 404.html faz o app carregar em refresh (Ctrl+F5) em /allocations etc.
 * @see https://docs.github.com/pages/getting-started-with-github-pages/creating-a-github-pages-site
 */
import { copyFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const indexHtml = join(dist, 'index.html')
const notFoundHtml = join(dist, '404.html')
const nojekyll = join(dist, '.nojekyll')

copyFileSync(indexHtml, notFoundHtml)
writeFileSync(nojekyll, '', 'utf8')
