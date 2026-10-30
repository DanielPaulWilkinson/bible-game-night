import { describe, it, expect } from 'vitest'
import { BSB, inVerse } from './bsb'
import * as B from '../src/balderdash'
import * as T from '../src/turn'
import * as N from '../src/gamenight'
import * as C from '../src/charades'
import { TAGS, matches } from '../src/tags'
import { readFileSync } from 'node:fs'

const first = () => 0
describe('Balderdash data', () => {
  it.each(B.ENTRIES.map(e => [e.id, e] as const))('%s has a real answer, reference and exact BSB text', (_, e) => {
    expect(e.realAnswer?.trim(), 'realAnswer missing').toBeTruthy()
    expect(e.reference?.trim(), 'reference missing').toBeTruthy()
    expect(inVerse(e.verse, e.evidence), `${e.verse} lacks "${e.evidence}"`).toBe(true)
    expect(BSB.get(e.verse)).toBe(e.text)
    expect(e.reference.split(' ').pop()!.startsWith(e.verse.split(' ')[1].split(':')[0])).toBe(true)
  })
  it('has 50 entries: 45 bluff and 5 true-or-false, ids unique', () => {
    expect(B.ENTRIES).toHaveLength(50)
    expect(B.ENTRIES.filter(e => e.kind === 'truefalse')).toHaveLength(5)
    expect(new Set(B.ENTRIES.map(e => e.id)).size).toBe(50)
  })
  it('Jesus’s own words are true-or-false cards, never bluffs', () => {
    for (const id of ['talitha', 'ephphatha']) expect(B.ENTRIES.find(e => e.id === id)!.kind).toBe('truefalse')
  })
  it('the kids deck only has K entries', () => expect(B.deck('K', first).every(e => e.tier === 'K')).toBe(true))
})
describe('Balderdash play', () => {
  const e = B.ENTRIES.find(x => x.id === 'ebenezer')!
  it('rejects bluffs that use God’s name, prayer, the cross or judgement', () => {
    for (const s of ['The Lord’s rock', 'a prayer stone', 'cross-shaped', 'day of judgement', 'God help']) expect(B.bluffAllowed(s)).toBe(false)
    expect(B.bluffAllowed('a big stone hat')).toBe(true); expect(B.bluffAllowed('  ')).toBe(false)
  })
  it('mixes the real answer with clean, unique bluffs', () => {
    const o = B.options(e, [{ author: 1, text: 'Stone hat' }, { author: 2, text: 'stone hat' }, { author: 3, text: 'God’s rock' }], first)
    expect(o).toHaveLength(2); expect(o.filter(x => x.author === null)).toHaveLength(1)
  })
  it('true-or-false cards never take bluffs', () => {
    const tf = B.ENTRIES.find(x => x.kind === 'truefalse')!
    const o = B.options(tf, [{ author: 1, text: 'sneaky' }], first)
    expect(o.map(x => x.text).sort()).toEqual(['Made up', 'True'])
  })
  it('kids get 2 or 3 choices with exactly one real', () => {
    for (const n of [2, 3]) { const o = B.kidChoices(e, n, first); expect(o).toHaveLength(n); expect(o.filter(x => x.author === null)).toHaveLength(1) }
  })
  it('scores 2 for the real answer and 1 per vote fooled, never for fooling yourself', () => {
    const opts: B.Option[] = [{ text: 'real', author: null }, { text: 'b1', author: 1 }, { text: 'b2', author: 2 }]
    expect(B.score(opts, { 1: 0, 2: 1, 3: 1 }, 4)).toEqual([0, 4, 0, 0])
    expect(B.score(opts, { 1: 1 }, 4)).toEqual([0, 0, 0, 0])
    expect(B.score(opts, { 3: 0 }, 4, 2)).toEqual([0, 0, 0, 4])
  })
})
describe('Shared turn screen', () => {
  it('counts correct and skips, rotates players and resets the turn', () => {
    let t = T.newTurns(['A', 'B'])
    t = T.markCorrect(t, 'x'); t = T.markSkip(t, 'y'); t = T.markCorrect(t, 'z')
    expect(t.scores).toEqual([2, 0]); expect(t.correct).toBe(2); expect(t.skipped).toBe(1); expect(t.log).toHaveLength(3)
    t = T.nextPlayer(t); expect(t.player).toBe(1); expect(t.correct).toBe(0); t = T.nextPlayer(t); expect(t.player).toBe(0)
  })
  it('a shared family score has one score and the multiplier applies', () => {
    let t = T.newTurns(['A', 'B', 'C'], true, 2); t = T.markCorrect(t, 'x')
    expect(t.players).toEqual(['Family']); expect(t.scores).toEqual([2]); expect(T.nextPlayer(t).player).toBe(0)
  })
  it('names every leader on a tie', () => { const t = { ...T.newTurns(['A', 'B']), scores: [3, 3] }; expect(T.leaders(t)).toEqual(['A', 'B']) })
  it('tilt fires once down for correct, once up for skip, and re-arms only near upright', () => {
    let s: T.TiltState = { armed: true }, g
    ;[s, g] = T.tiltStep(s, 50); expect(g).toBe('correct')
    ;[s, g] = T.tiltStep(s, 60); expect(g).toBeNull()
    ;[s, g] = T.tiltStep(s, -50); expect(g).toBeNull()
    ;[s, g] = T.tiltStep(s, 5); expect(s.armed).toBe(true)
    ;[s, g] = T.tiltStep(s, -40); expect(g).toBe('skip')
    ;[, g] = T.tiltStep({ armed: true }, 20); expect(g).toBeNull()
  })
  it('reads pitch from the sensors in portrait and both landscapes', () => {
    expect(T.pitchFrom(90, 0, 0)).toBe(0); expect(T.pitchFrom(40, 0, 0)).toBeGreaterThan(T.TILT_FIRE)
    expect(Math.abs(T.pitchFrom(0, 89, 90))).toBeLessThan(T.TILT_REARM); expect(T.pitchFrom(0, 40, 90)).toBeGreaterThan(T.TILT_FIRE); expect(T.pitchFrom(0, -40, 90)).toBeLessThan(-T.TILT_FIRE)
    expect(Math.abs(T.pitchFrom(0, -89, -90))).toBeLessThan(T.TILT_REARM); expect(T.pitchFrom(0, -40, -90)).toBeGreaterThan(T.TILT_FIRE)
  })
})
describe('Game Night', () => {
  it('is three rounds in 15 minutes and only the last is double', () => {
    expect(N.GAME_NIGHT).toHaveLength(3); expect(N.totalMinutes()).toBe(15)
    expect(N.GAME_NIGHT.map(r => r.mult)).toEqual([1, 1, 2])
  })
  it('doubles points in the last round and ends after three', () => {
    let n = N.newNight(['Us', 'Them']); n = N.addPoints(n, 0, 1); n = N.nextRound(n); n = N.nextRound(n); n = N.addPoints(n, 1, 3)
    expect(n.scores).toEqual([1, 6]); expect(N.nightOver(n)).toBe(false); expect(N.nightOver(N.nextRound(n))).toBe(true)
  })
  it.each(N.BLESSING.map(b => [b.ref, b] as const))('blessing %s is exact BSB', (_, b) => { expect(BSB.get(b.verse)).toBe(b.text); expect(inVerse(b.verse, b.evidence)).toBe(true) })
})
describe('Two-tier Charades', () => {
  it.each(C.STORY_PROMPTS.map(p => [p.word, p] as const))('grown-up prompt %s is backed by the BSB', (_, p) => { expect(inVerse(p.verse, p.evidence)).toBe(true); expect(BSB.get(p.verse)).toBe(p.text) })
  it('little ones get pictures and no pictures of Jesus', () => {
    const d = C.charadesDeck('little', first); expect(d.length).toBeGreaterThan(10)
    for (const c of d) { expect(c.little!.figureId || c.little!.scene || c.little!.icon).toBeTruthy(); expect(`${c.little!.figureId}${c.little!.scene}`).not.toMatch(/jesus/i) }
  })
  it('grown-ups get story cards with references', () => expect(C.charadesDeck('grown', first).every(c => c.story?.ref)).toBe(true))
  it('draws cards in order and wraps', () => {
    let d: C.Deck = { cards: C.charadesDeck('grown', first), at: 0 }; const seen = []
    for (let i = 0; i <= d.cards.length; i++) { const [c, n] = C.draw(d); seen.push(c); d = n }
    expect(seen[0]).toBe(seen[seen.length - 1])
  })
  it('makes 2 to 4 teams, families when hosting', () => {
    expect(C.teamNames(1)).toHaveLength(2); expect(C.teamNames(9)).toHaveLength(4); expect(C.teamNames(3, true)).toEqual(['Family 1', 'Family 2', 'Family 3'])
  })
})
describe('Tags and filters', () => {
  const routes = [...readFileSync('src/App.vue', 'utf8').matchAll(/(\w+): [A-Z]\w+[,} ]/g)].map(m => m[1]).filter(r => !['credits', 'gamenight'].includes(r))
  it('every game is tagged with the full schema', () => {
    expect(routes.length).toBe(25)
    for (const r of routes) {
      const t = TAGS[r]; expect(t, r).toBeTruthy()
      expect(['little', 'all', 'adults']).toContain(t.age); expect(t.players.length).toBeGreaterThan(0)
      expect(['active', 'table', 'quiet']).toContain(t.energy); expect(['coop', 'teams', 'competitive']).toContain(t.style)
      expect(t.minutes).toBeGreaterThan(0); expect(t.needs.length).toBeGreaterThan(0)
    }
  })
  it('filters combine', () => {
    const ids = (f: Parameters<typeof matches>[1]) => Object.keys(TAGS).filter(k => matches(TAGS[k], f))
    expect(ids({})).toHaveLength(Object.keys(TAGS).length)
    expect(ids({ energy: 'active', style: 'coop' }).sort()).toEqual(['act', 'feed', 'framefreeze', 'jericho', 'sheep', 'simon'])
    expect(ids({ age: 'little' })).toContain('charades'); expect(ids({ age: 'adults' })).not.toContain('pairs')
    expect(ids({ short: true }).every(k => TAGS[k].minutes <= 10)).toBe(true)
    expect(ids({ players: 'couples' })).toContain('balderdash')
  })
})
