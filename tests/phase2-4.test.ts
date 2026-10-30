import { describe, it, expect } from 'vitest'
import { BSB, inVerse } from './bsb'
import * as P from '../src/phase24'
import { TAGS, matches } from '../src/tags'
import { readFileSync } from 'node:fs'

const verses = [...P.TABOO, ...P.FILL, ...P.SKETCH, ...P.SCENES, ...P.PSALMS, ...P.THANKS_VERSES]
const seq = (xs: number[]) => { let i = 0; return () => xs[i++ % xs.length] }
const NEW = ['taboo', 'sketch', 'alphabet', 'fill', 'act', 'framefreeze', 'simon', 'catechism', 'finish', 'thanks']

describe('Phase 2-4 Scripture is exact BSB', () => {
  it.each(verses.map(v => [v.verse + ' ' + v.evidence, v] as const))('%s', (_, v) => {
    expect(BSB.get(v.verse)).toBe(v.text)
    expect(inVerse(v.verse, v.evidence)).toBe(true)
    expect(v.ref.split(' ').pop()).toBe(v.verse.split(' ')[1])
  })
  it('every Scripture card is flagged for The Scholar', () => expect(verses.every(v => v.needsReview)).toBe(true))
})
describe('Phase 2: table and word games', () => {
  it('Forbidden Words cards have four banned words and none is the answer', () => {
    for (const c of P.TABOO) { expect(c.banned).toHaveLength(4); expect(c.banned.map(b => b.toLowerCase())).not.toContain(c.word.toLowerCase()) }
  })
  it.each(P.FILL.map(f => [f.verse, f] as const))('Fill the Verse %s blanks a real word exactly once', (_, f) => {
    const b = P.blankOut(f.text, f.blank)
    expect(b).toContain('_____'); expect(b).not.toBe(f.text); expect(b.split('_____')).toHaveLength(2)
  })
  it('blankOut matches whole words only', () => expect(P.blankOut('Joyful joy', 'joy')).toBe('Joyful _____'))
  it('Bible Alphabet gives one card per letter with a category', () => {
    const d = P.alphabetDeck(seq([0.5]))
    expect(d).toHaveLength(P.ALPHA_LETTERS.length)
    expect(d.every(c => c.word.endsWith(`beginning with ${c.letter}`))).toBe(true)
  })
  it('sessions end after every team has had its turns', () => {
    expect(P.sessionOver(3, 2, 2)).toBe(false); expect(P.sessionOver(4, 2, 2)).toBe(true)
  })
})
describe('Phase 3: active decks', () => {
  it('Act It Out has a little-ones tier and an everyone tier', () => {
    expect(P.SCENES.filter(s => s.tier === 'little').length).toBeGreaterThanOrEqual(8)
    expect(P.SCENES.filter(s => s.tier === 'grown').length).toBeGreaterThanOrEqual(6)
  })
  it('Simon Peter Says mixes real calls and tricks, and tricks never say the phrase', () => {
    const d = P.simonDeck(seq([0.1, 0.9, 0.5, 0.2]))
    expect(d.some(c => c.says)).toBe(true); expect(d.some(c => !c.says)).toBe(true)
    for (const c of d) expect(c.text.startsWith('Simon Peter says')).toBe(c.says)
  })
})
describe('Phase 4: worship and catechism', () => {
  it('catechism and hymns are public domain and flagged for review', () => {
    for (const q of P.CATECHISM) { expect(q.source).toMatch(/1647/); expect(q.needsReview).toBe(true) }
    for (const h of P.HYMNS) { const y = Number(h.source.match(/\d{4}/)![0]); expect(y).toBeLessThan(1900); expect(h.needsReview).toBe(true) }
  })
  it('Finish the Line psalms split a real verse into two halves', () => {
    for (const p of P.PSALMS) { expect(p.text.startsWith(p.start)).toBe(true); expect(p.start.length).toBeLessThan(p.text.length) }
    expect(P.finishDeck(seq([0.3])).length).toBe(P.PSALMS.length + P.HYMNS.length)
  })
  it('worship rounds never name a winner; prayer is never scored', () => {
    const f = P.finish(['A', 'B'], [5, 1], 'worship')
    expect(f.kind).toBe('gentle'); expect(f.names).toEqual([]); expect(P.finishHeadline(f)).toBe('Well done together')
  })
  it('no prompt jokes about God’s name, prayer, the cross or judgement', () => {
    const all = [...P.THANKS_PROMPTS, ...P.MOVES, ...P.TABOO.map(t => t.word), ...P.SCENES.map(s => s.word)].join(' ').toLowerCase()
    for (const w of ['lol', 'joke', 'funny', 'judgement day']) expect(all).not.toContain(w)
  })
})
describe('Celebration', () => {
  it('names the winner, shares a tie, and celebrates co-op together', () => {
    expect(P.finish(['Sun', 'Star'], [3, 1], 'compete')).toEqual({ kind: 'win', names: ['Sun'] })
    expect(P.finishHeadline(P.finish(['Sun', 'Star'], [2, 2], 'compete'))).toBe('Sun and Star share the win!')
    expect(P.finish(['Family'], [4], 'coop').kind).toBe('together')
  })
  it('the burst is hidden for reduced motion and the result is announced', () => {
    const v = readFileSync('src/views/Celebrate.vue', 'utf8')
    expect(v).toMatch(/prefers-reduced-motion: reduce\) \{ \.burst \{ display: none/)
    expect(v).toContain('aria-live="polite"'); expect(v).toContain('h.value?.focus()')
  })
})
describe('Menu and routes', () => {
  const menu = readFileSync('src/catalog.ts', 'utf8') + readFileSync('src/views/Menu.vue', 'utf8'), app = readFileSync('src/App.vue', 'utf8')
  it.each(NEW)('%s is tagged, in the menu and routed', id => {
    expect(TAGS[id]).toBeTruthy(); expect(menu).toContain(`'#/${id}'`); expect(app).toMatch(new RegExp(`\\b${id}: \\[`))
  })
  it('the menu has 35 games and the little-ones filter finds the new active decks', () => {
    expect(menu.match(/href: '#\//g)).toHaveLength(35)
    for (const id of ['act', 'framefreeze', 'simon']) expect(matches(TAGS[id], { age: 'little', energy: 'active' })).toBe(true)
  })
  it('the menu has an empty state when no game fits', () => expect(menu).toContain('No game fits all of those'))
})
