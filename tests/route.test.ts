import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from '../src/route'
import { games } from '../src/catalog'

const app = readFileSync('src/App.vue', 'utf8')
const routeBlock = app.slice(app.indexOf('const routes'), app.indexOf('const titles'))
const P24 = app.slice(app.indexOf('const P24'), app.indexOf('const MISSING'))
const known = (k: string) => new RegExp(`[{ ,]${k}: `).test(routeBlock) || new RegExp(`[ \\n]${k}: \\[`).test(P24)

describe('routes', () => {
  it('menu for empty hashes', () => { for (const h of ['', '#', '#/']) expect(resolve(h, known).kind).toBe('menu') })
  it('every game on the menu, the Blessing and Credits has a route', () => {
    for (const id of [...games.map(g => g.href.slice(2)), 'blessing', 'credits', 'gamenight']) expect(resolve(`#/${id}`, known)).toEqual({ kind: 'game', id })
  })
  it('#/scores redirects to the scored Game Night', () => {
    expect(resolve('#/scores', known)).toEqual({ kind: 'redirect', to: 'gamenight' })
    expect(resolve('#/Scores', known)).toEqual({ kind: 'redirect', to: 'gamenight' })
  })
  it('unknown routes are missing, not the menu', () => {
    for (const h of ['#/nope', '#/guess-who', '#/%20x']) expect(resolve(h, known).kind).toBe('missing')
  })
  it('ignores sub-paths and queries', () => expect(resolve('#/guess/1?x=2', known)).toEqual({ kind: 'game', id: 'guess' }))
  it('the not-found screen has a friendly message and a way back', () => {
    const v = readFileSync('src/views/NotFound.vue', 'utf8')
    expect(v).toContain('That page isn’t here'); expect(v).toContain('href="#/"'); expect(v).toContain('Back to all games')
  })
})
