import type { Plugin } from 'vite'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve, relative } from 'node:path'

let outDir = 'dist'
const walk = (d: string, root = d): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p, root) : [relative(root, p).split('\\').join('/')] })

/** Writes dist/sw.js listing every built file, versioned by a hash of the build, so a new deploy gets a new cache. */
export const serviceWorker = (): Plugin => ({
  name: 'bgn-sw',
  apply: 'build',
  configResolved(c) { outDir = resolve(c.root, c.build.outDir) },
  closeBundle() {
    const files = walk(outDir).filter(f => f !== 'sw.js' && !f.endsWith('.map') && !f.startsWith('.'))
    const h = createHash('sha256'); for (const f of files.sort()) h.update(f).update(readFileSync(join(outDir, f)))
    writeFileSync(join(outDir, 'sw.js'), swSource(h.digest('hex').slice(0, 12), files))
  },
})

export const swSource = (version: string, files: string[]) => `// Bible Game Night offline cache ${version}
const CACHE = 'bgn-${version}'
const BUILT = ${JSON.stringify(files)}
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', ...BUILT.filter(f => f !== 'index.html')])).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('bgn-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', e => {
  const r = e.request
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return
  if (r.mode === 'navigate') {
    // Network first for the page, so a new deploy shows on the next load; cached copy when offline.
    e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return res }).catch(() => caches.match('./')))
    return
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)) } return res })))
})
`
