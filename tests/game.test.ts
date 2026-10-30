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
  it('every figure has a fact with a reference, and every picture has a CC BY-SA credit with attribution and source', () => {
    for (const f of F) {
      expect(f.fact.length).toBeGreaterThan(10); expect(f.ref).toMatch(/\d/)
      if (f.image) {
        const c = (credits as Record<string, { licence: string; licenceUrl: string; attribution: string; source: string }>)[f.id]
        expect(c.licence).toMatch(/CC BY-SA/)
        expect(c.licenceUrl).toBe('https://creativecommons.org/licenses/by-sa/3.0/')
        expect(c.attribution).toBe('Illustrations by Jim Padgett, courtesy of Sweet Publishing, licensed CC BY-SA 3.0')
        expect(c.source).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
      }
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

import { newMatch, flipFor, toggleSecretShown, endTurn, reveal, guess } from '../src/game'
describe('pass the device', () => {
  const seq = (...v: number[]) => { let i = 0; return () => v[i++ % v.length] }
  it('defaults names and gives each player their own secret and board', () => {
    const m = newMatch(F, ['  ', 'Jonah'], seq(0, 0.5))
    expect(m.players.map(p => p.name)).toEqual(['Player 1', 'Jonah'])
    expect(m.players[0].game.secretId).toBe(F[0].id); expect(m.players[1].game.secretId).toBe(F[12].id)
    expect(m.covered).toBe(true); expect(m.turn).toBe(0)
  })
  it('flips and the show-my-person toggle belong to the current player and persist across turns', () => {
    let m = reveal(newMatch(F, ['A', 'B'], seq(0, 0.5)))
    m = toggleSecretShown(flipFor(m, 'moses'))
    expect(m.players[0].secretShown).toBe(true)
    m = endTurn(m)
    expect(m.turn).toBe(1); expect(m.covered).toBe(true); expect(m.players[0].secretShown).toBe(false)
    m = flipFor(reveal(m), 'ruth')
    expect(isDown(m.players[1].game, 'ruth')).toBe(true); expect(isDown(m.players[1].game, 'moses')).toBe(false)
    m = endTurn(m)
    expect(isDown(m.players[0].game, 'moses')).toBe(true); expect(isDown(m.players[0].game, 'ruth')).toBe(false)
  })
  it('a right guess against the opponent wins, a wrong one passes the turn', () => {
    const m = reveal(newMatch(F, ['A', 'B'], seq(0, 0.5)))
    const wrong = guess(m, F[0].id) // player 1's own secret, not the opponent's
    expect(wrong.winner).toBeNull(); expect(wrong.turn).toBe(1); expect(wrong.covered).toBe(true); expect(wrong.lastGuess?.right).toBe(false)
    const right = guess(m, F[12].id)
    expect(right.winner).toBe(0); expect(right.lastGuess).toEqual({ by: 0, id: F[12].id, right: true })
  })
})
