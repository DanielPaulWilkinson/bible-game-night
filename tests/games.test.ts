import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import figures from '../src/figures.json'
import sceneCredits from '../src/scenecredits.json'
import type { Figure } from '../src/game'
import { shuffle, SYMBOLS, newPairs, flipCard, pairsDone, QUOTES, newQuiz, answer, nextRound, quizDone,
  STORIES, newOrder, place, moveTo, orderRight, orderComplete, rightSlots, bingoCard, newCaller, callNext, calledIds, hasLine,
  JOURNEYS, project, stepStop } from '../src/games'

const F = figures as Figure[]
const seeded = (s = 1) => () => (s = (s * 16807) % 2147483647) / 2147483647

describe('shuffle', () => {
  it('keeps every item', () => expect(shuffle([1, 2, 3, 4, 5], seeded()).sort()).toEqual([1, 2, 3, 4, 5]))
})

describe('Pairs', () => {
  it('every symbol belongs to a real figure', () => SYMBOLS.forEach(s => expect(F.some(f => f.id === s.id)).toBe(true)))
  it('easy has 6 pairs and normal 10', () => {
    expect(newPairs(6, seeded()).cards).toHaveLength(12); expect(newPairs(10, seeded()).cards).toHaveLength(20)
  })
  it('matches a figure with its symbol and closes a miss on the next tap', () => {
    let p = newPairs(6, seeded(3))
    const [a] = p.cards; const twin = p.cards.find(c => c.figureId === a.figureId && c.key !== a.key)!
    const other = p.cards.find(c => c.figureId !== a.figureId)!
    p = flipCard(p, a.key); p = flipCard(p, other.key)
    expect(p.open).toHaveLength(2); expect(p.matched).toEqual([])
    p = flipCard(p, a.key); expect(p.open).toEqual([a.key])
    p = flipCard(p, twin.key); expect(p.matched).toEqual([a.figureId]); expect(p.moves).toBe(2)
  })
  it('can be finished', () => {
    let p = newPairs(6, seeded(5))
    for (const id of new Set(p.cards.map(c => c.figureId))) for (const c of p.cards.filter(c => c.figureId === id)) p = flipCard(p, c.key)
    expect(pairsDone(p)).toBe(true); expect(p.moves).toBe(6)
  })
})

describe('Who said it?', () => {
  const kjv = new Map(readFileSync('tests/kjv-fixture.txt', 'utf8').trim().split('\n').map((l: string) => l.split('\t') as [string, string]))
  const norm = (s: string) => s.toLowerCase().replace(/[\u2019']/g, "'").replace(/[.,;:?!]/g, '').replace(/æ/g, 'ae').replace(/\s+/g, ' ').trim()
  it.each(QUOTES.map(q => [q.figureId, q] as const))('%s quote is word for word in the KJV verse', (_, q) => {
    const verse = kjv.get(q.verse); expect(verse, q.verse).toBeTruthy()
    expect(norm(verse!)).toContain(norm(q.text))
    const [bk, cv] = [q.verse.split(' ')[0], q.verse.split(' ')[1]]
    expect(q.ref.endsWith(cv), `${q.ref} vs ${bk} ${cv}`).toBe(true)
  })
  it('fixture matches the full KJV text when it is available', () => {
    const full = '../bible-companion/public/data/verses.txt'
    if (!existsSync(full)) return
    const all = readFileSync(full, 'utf8')
    for (const [ref, text] of kjv) expect(all.includes(`${ref}\t${text}\n`)).toBe(true)
  })
  it('every quote is by a figure and figures are unique', () => {
    QUOTES.forEach(q => expect(F.some(f => f.id === q.figureId)).toBe(true))
    expect(new Set(QUOTES.map(q => q.figureId)).size).toBe(QUOTES.length)
  })
  it('makes 10 rounds of 3 different choices including the speaker', () => {
    const q = newQuiz(F, seeded(7))
    expect(q.rounds).toHaveLength(10)
    q.rounds.forEach(r => { expect(new Set(r.choices).size).toBe(3); expect(r.choices).toContain(r.quote.figureId) })
  })
  it('scores, locks the answer, and finishes', () => {
    let q = newQuiz(F, seeded(9))
    q = answer(q, q.rounds[0].quote.figureId); q = answer(q, 'nobody'); expect(q.score).toBe(1)
    q = nextRound(q); q = answer(q, q.rounds[1].choices.find(c => c !== q.rounds[1].quote.figureId)!); expect(q.score).toBe(1)
    for (let i = 0; i < 20; i++) q = nextRound(answer(q, 'x'))
    expect(quizDone(q)).toBe(true)
  })
})

describe('Story order', () => {
  it('each story has 4 or 5 scenes with credited pictures', () => STORIES.forEach(s => {
    expect(s.scenes.length).toBeGreaterThanOrEqual(4); expect(s.scenes.length).toBeLessThanOrEqual(5)
    s.scenes.forEach(sc => expect((sceneCredits as Record<string, unknown>)[sc.id]).toBeTruthy())
  }))
  it('never starts already in order', () => { for (let i = 1; i < 30; i++) STORIES.forEach(s => expect(newOrder(s, seeded(i)).pool).not.toEqual(s.scenes.map(x => x.id))) })
  it('tap to place, tap to send back, and spot the right order', () => {
    let o = newOrder(STORIES[0], seeded(2))
    for (const sc of STORIES[0].scenes) o = place(o, sc.id)
    expect(orderRight(o)).toBe(true)
    o = place(o, 'noah-1'); expect(orderComplete(o)).toBe(false); expect(o.pool).toEqual(['noah-1'])
    o = moveTo(o, 'noah-1', 0); expect(orderRight(o)).toBe(true)
    o = moveTo(o, 'noah-5', 0); expect(orderRight(o)).toBe(false); expect(rightSlots(o)[0]).toBe(false)
  })
})

describe('Bingo', () => {
  it('a card has 16 different figures', () => expect(new Set(bingoCard(F, seeded())).size).toBe(16))
  it('the caller draws every figure once', () => {
    let c = newCaller(F, seeded(4)); for (let i = 0; i < 30; i++) c = callNext(c)
    expect(new Set(calledIds(c)).size).toBe(24)
  })
  it('spots rows, columns and diagonals only', () => {
    const card = bingoCard(F, seeded(6))
    expect(hasLine(card, card.slice(4, 8))).toBe(true)
    expect(hasLine(card, [0, 4, 8, 12].map(i => card[i + 1]))).toBe(true)
    expect(hasLine(card, [0, 5, 10, 15].map(i => card[i]))).toBe(true)
    expect(hasLine(card, [3, 6, 9, 12].map(i => card[i]))).toBe(true)
    expect(hasLine(card, [0, 1, 2, 4, 5].map(i => card[i]))).toBe(false)
  })
})

describe('Journey map', () => {
  it('every stop has a caption, a reference, and sits on the map', () => JOURNEYS.forEach(j => j.stops.forEach(s => {
    expect(s.caption.length).toBeGreaterThan(5); expect(s.ref).toMatch(/^(Genesis|Acts) \d+:\d+/)
    const p = project(s.lon, s.lat); expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThanOrEqual(1000); expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(700)
  })))
  it('steps stay in range', () => { const j = JOURNEYS[0]; expect(stepStop(j, 0, -1)).toBe(0); expect(stepStop(j, j.stops.length - 1, 1)).toBe(j.stops.length - 1); expect(stepStop(j, 1, 1)).toBe(2) })
})
