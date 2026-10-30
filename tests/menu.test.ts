import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { TAGS } from '../src/tags'
import { MOOD, deal, surprise, forWho, source, recent, remember } from '../src/menu'
import { FILL } from '../src/phase24-data'
const ids = Object.keys(TAGS)
describe('Menu redesign', () => {
  it('every game sits in exactly one mood row and has a source badge', () => { for (const k of ids) { expect(MOOD[k], k).toBeTruthy(); expect(source(k)).toMatch(/^From /) } })
  it('deals move, laugh, calm for each audience', () => {
    for (const who of [null, 'little', 'grown'] as const) for (let i = 0; i < 30; i++) {
      const l = deal(ids, who); expect(l).toHaveLength(3)
      expect(MOOD[l[0]]).toBe('move'); expect(MOOD[l[1]]).toBe('laugh'); expect(['quiet', 'think']).toContain(MOOD[l[2]])
      for (const k of l) expect(forWho(k, who)).toBe(true)
    }
  })
  it('little ones skip reading-heavy games; grown-ups skip toddler games', () => {
    expect(forWho('balderdash', 'little')).toBe(false); expect(forWho('jericho', 'little')).toBe(true); expect(forWho('pairs', 'grown')).toBe(false)
    expect(forWho(surprise(ids, 'little')!, 'little')).toBe(true)
  })
  it('remembers the last three games, newest first', () => {
    localStorage.clear()
    for (const k of ['fill', 'simon', 'taboo', 'fill', 'credits']) remember(k)
    expect(recent()).toEqual(['fill', 'taboo', 'simon'])
  })
  it('menu has the hero, who toggle, blessing round and verse of the night', () => {
    const m = readFileSync('src/views/Menu.vue', 'utf8'), app = readFileSync('src/App.vue', 'utf8')
    for (const s of ['Play now', 'Surprise me', 'Little ones with us', 'Grown-ups and friends', 'Again!', 'Blessing Round', 'Berean Standard Bible', "localStorage.setItem('bgn-who'"]) expect(m).toContain(s)
    expect(app).toContain('blessing: Blessing'); expect(FILL.every(v => v.needsReview)).toBe(true)
    expect(m).not.toMatch(/streak/i)
  })
})

describe('deal never repeats', () => {
  it('has no duplicates and avoids the last lineup when it can', () => {
    const ids = Object.keys(MOOD)
    for (const who of [null, 'little', 'grown'] as const) for (let i = 0; i < 200; i++) {
      const a = deal(ids, who); expect(new Set(a).size).toBe(a.length)
      const b = deal(ids, who, Math.random, a); expect(new Set(b).size).toBe(b.length)
    }
  })
})
