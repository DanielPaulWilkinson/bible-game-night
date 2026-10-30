import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { swSource } from '../sw-plugin'

describe('installable and offline', () => {
  const m = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'))
  it('manifest has the right names, colours and relative URLs', () => {
    expect(m).toMatchObject({ name: 'Bible Game Night', short_name: 'Game Night', display: 'standalone', start_url: './', scope: './', theme_color: '#1E3557', background_color: '#F3E6C8' })
  })
  it('has 192 and 512 icons plus maskable, all present', () => {
    for (const s of ['192x192', '512x512']) { expect(m.icons.some((i: any) => i.sizes === s && i.purpose === 'any')).toBe(true); expect(m.icons.some((i: any) => i.sizes === s && i.purpose === 'maskable')).toBe(true) }
    for (const i of m.icons) expect(existsSync('public/' + i.src)).toBe(true)
  })
  it('index links the manifest relatively and has the current description', () => {
    const h = readFileSync('index.html', 'utf8')
    expect(h).toContain('href="./manifest.webmanifest"'); expect(h).toContain('35 family games'); expect(h).not.toContain('Six simple')
  })
  it('service worker is versioned, precaches the build and drops old caches', () => {
    const s = swSource('abc123', ['index.html', 'assets/index-x.js'])
    expect(s).toContain("bgn-abc123"); expect(s).toContain('assets/index-x.js'); expect(s).toContain('caches.delete'); expect(s).toContain('skipWaiting')
    expect(s).not.toMatch(/['"]\/assets/)
  })
})
