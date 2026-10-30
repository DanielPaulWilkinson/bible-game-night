import { describe, it, expect } from 'vitest'
import figures from '../src/figures.json'
import credits from '../src/credits.json'
import { newGame, pickSecret, toggle, isDown, stillUp, initial, type Figure } from '../src/game'
const F = figures as Figure[]

describe('figures', () => {
  it('has 24 unique people from both Testaments with several women', () => {
    expect(F).toHaveLength(24)
    expect(new Set(F.map(f => f.id)).size).toBe(24)
    expect(F.filter(f => f.gender === 'woman').length).toBeGreaterThanOrEqual(6)
    expect(F.some(f => f.testament === 'old') && F.some(f => f.testament === 'new')).toBe(true)
  })
  it('every figure has a fact with a reference, and every picture has a public-domain credit', () => {
    for (const f of F) {
      expect(f.fact.length).toBeGreaterThan(10); expect(f.ref).toMatch(/\d/)
      if (f.image) expect((credits as Record<string, { licence: string }>)[f.id].licence).toMatch(/public domain/i)
    }
  })
  it('leaves Jesus out of the cast', () => expect(F.some(f => /jesus/i.test(f.name))).toBe(false))
})

describe('game logic', () => {
  it('picks the secret person from the rng', () => {
    expect(pickSecret(F, () => 0)).toBe(F[0].id)
    expect(pickSecret(F, () => 0.9999)).toBe(F[23].id)
  })
  it('a new game starts with all cards up and a different secret person', () => {
    const g1 = newGame(F, () => 0)
    const g2 = newGame(F, () => 0, toggle(g1, 'moses'))
    expect(g2.down).toEqual([]); expect(g2.secretId).not.toBe(g1.secretId)
  })
  it('toggling flips a card down and back up without mutating', () => {
    const g = newGame(F, () => 0)
    const a = toggle(g, 'jonah')
    expect(isDown(a, 'jonah')).toBe(true); expect(isDown(g, 'jonah')).toBe(false)
    expect(stillUp(a, F)).toBe(23)
    expect(isDown(toggle(a, 'jonah'), 'jonah')).toBe(false)
  })
  it('throws with no figures and makes initials', () => {
    expect(() => pickSecret([])).toThrow(); expect(initial(' ruth')).toBe('R')
  })
})
