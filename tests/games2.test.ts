import { describe, it, expect } from 'vitest'
import F from '../src/figures.json'
import { BSB, inVerse } from './bsb'
import * as G from '../src/games2'
import type { Figure } from '../src/game'

const seq = (...xs: number[]) => { let i = 0; return () => xs[i++ % xs.length] }
const checked: [string, G.Checked][] = [
  ...G.FACTS.map(f => [f.text, f] as [string, G.Checked]),
  ...G.QUIZ.flatMap(r => r.questions.map(q => [q.q, q] as [string, G.Checked])),
  ...[...G.LADDERS, ...G.SNAKES].map(j => [j.name, j] as [string, G.Checked]),
  ...G.JOURNEY_CARDS.map(c => [c.title, c] as [string, G.Checked]),
  ['ark', G.ARK_VERSE],
]

describe('every Bible claim is backed by the BSB', () => {
  it.each(checked)('%s', (_, c) => {
    expect(BSB.get(c.verse), c.verse).toBeTruthy()
    expect(inVerse(c.verse, c.evidence), `${c.verse} lacks "${c.evidence}"`).toBe(true)
    expect(c.ref.endsWith(c.verse.split(' ')[1])).toBe(true)
  })
  it('ladder and snake texts quote their verse', () => {
    for (const j of [...G.LADDERS, ...G.SNAKES]) expect(inVerse(j.verse, j.text), j.name).toBe(true)
  })
})

describe('Rolling', () => {
  it('gives 1 to 6', () => { expect(G.rollDie(() => 0)).toBe(1); expect(G.rollDie(() => 0.9999)).toBe(6) })
})

describe('Charades', () => {
  it('scores got-it for the team playing and passes without points', () => {
    let c = G.newCharades(['Red', 'Blue'], seq(0.3))
    const first = G.currentPrompt(c)
    c = G.gotIt(c); expect(c.teams.scores).toEqual([1, 0]); expect(G.currentPrompt(c)).not.toBe(first)
    c = G.pass(c); expect(c.teams.scores).toEqual([1, 0]); expect(c.passed).toBe(1)
    c = G.nextTeam(c); c = G.gotIt(c); expect(c.teams.scores).toEqual([1, 1]); expect(c.got).toBe(1)
  })
  it('every prompt has a picture and figures exist', () => {
    for (const p of G.PROMPTS) { expect(p.figureId || p.scene || p.icon).toBeTruthy(); if (p.figureId) expect(F.some(f => f.id === p.figureId)).toBe(true) }
  })
  it('timer counts down and stops at zero', () => {
    let t = G.startTimer(2); t = G.tick(t); expect(t).toEqual({ left: 1, running: true }); t = G.tick(t); expect(t).toEqual({ left: 0, running: false }); expect(G.tick(t)).toEqual(t)
  })
})

describe('Real or made up?', () => {
  it('deals half real, half made up and only advances once revealed', () => {
    let v = G.newVote(seq(0.1, 0.7, 0.4), 10)
    expect(v.deck.filter(f => f.real).length).toBe(5)
    expect(G.nextFact(v).at).toBe(0)
    v = G.nextFact(G.revealFact(v)); expect(v.at).toBe(1); expect(v.revealed).toBe(false)
  })
  it('fake facts say "Made up!" and real ones "Yes!"', () => {
    for (const f of G.FACTS) expect(f.truth.startsWith(f.real ? 'Yes!' : 'Made up!')).toBe(true)
  })
})

describe('Draw it', () => {
  it('builds and undoes strokes', () => {
    let s = G.startStroke([], '#000', 1, 1); s = G.addPoint(s, 2, 2); expect(s[0].points).toHaveLength(2)
    s = G.startStroke(s, '#f00', 5, 5); expect(G.undo(s)).toHaveLength(1)
    expect(G.addPoint([], 1, 1)).toEqual([])
  })
})

describe('Quiz night', () => {
  it('has 3 rounds of 5 with the answer among the choices', () => {
    expect(G.QUIZ).toHaveLength(3)
    for (const r of G.QUIZ) { expect(r.questions).toHaveLength(5); for (const q of r.questions) expect(q.choices).toContain(q.answer) }
  })
  it('needs 2 to 4 teams', () => { expect(() => G.newQuizNight(['A'])).toThrow(); expect(() => G.newQuizNight(['A', 'B', 'C', 'D', 'E'])).toThrow() })
  it('awards toggle and play runs through 15 questions', () => {
    let n = G.newQuizNight(['A', 'B', 'C'])
    n = G.award(n, 1); n = G.award(n, 2); n = G.award(n, 2); expect(n.teams.scores).toEqual([0, 1, 0])
    for (let i = 0; i < 15; i++) n = G.nextQuestion(n)
    expect(G.quizNightDone(n)).toBe(true); expect(G.leaders(n.teams)).toEqual(['B'])
  })
})

describe('Pilgrim\u2019s Way (after The Pilgrim\u2019s Progress)', () => {
  it('ladders go up, snakes go down, no square has two', () => {
    G.LADDERS.forEach(l => expect(l.to).toBeGreaterThan(l.from)); G.SNAKES.forEach(s => expect(s.to).toBeLessThan(s.from))
    const froms = [...G.LADDERS, ...G.SNAKES].map(j => j.from), tos = [...G.LADDERS, ...G.SNAKES].map(j => j.to)
    expect(new Set(froms).size).toBe(froms.length); froms.forEach(f => expect(tos).not.toContain(f))
  })
  it('climbs a help and passes the turn', () => {
    const r = G.snakesMove(G.newRace(['A', 'B']), 8)
    expect(r.players[0].pos).toBe(15); expect(r.turn).toBe(1); expect(r.jump?.name).toBe('Help')
  })
  it('a danger slides you back and is reported for the pop-up', () => {
    const r = G.snakesMove({ ...G.newRace(['A', 'B']), players: [{ name: 'A', pos: 50 }, { name: 'B', pos: 1 }] }, 3)
    expect(r.players[0].pos).toBe(41); expect(r.jump?.name).toBe('Apollyon')
  })
  it('landmarks run from the City of Destruction to the Celestial City, and every help and danger has a story caption', () => {
    expect(G.LANDMARKS[0]).toEqual({ square: 1, name: 'City of Destruction' }); expect(G.LANDMARKS.at(-1)).toEqual({ square: 100, name: 'Celestial City' })
    for (const j of [...G.LADDERS, ...G.SNAKES]) expect(j.story.length).toBeGreaterThan(20)
    expect(G.TOKENS.map(t => t.id)).toEqual(['burden', 'scroll', 'key', 'shield', 'staff'])
  })
  it('a six gives another go, and you need the exact roll to finish', () => {
    let r = G.newRace(['A', 'B']); r = G.snakesMove(r, 6); expect(r.turn).toBe(0)
    r = { ...r, players: [{ name: 'A', pos: 97 }, r.players[1]], turn: 0 }
    expect(G.snakesMove(r, 5).players[0].pos).toBe(97)
    const w = G.snakesMove(r, 3); expect(w.winner).toBe(0); expect(G.snakesMove(w, 2)).toBe(w)
  })
  it('lays the board out in a snake pattern', () => {
    expect(G.squareXY(1)).toEqual({ col: 0, row: 9 }); expect(G.squareXY(11)).toEqual({ col: 9, row: 8 }); expect(G.squareXY(100)).toEqual({ col: 0, row: 0 })
  })
})

describe('Out of Egypt', () => {
  it('story cards move players and the end wins', () => {
    let r = G.journeyMove(G.newRace(['A', 'B']), 2)
    expect(r.card?.title).toBe('Leaving Egypt'); expect(r.players[0].pos).toBe(5)
    const near = { ...G.newRace(['A', 'B']), players: [{ name: 'A', pos: 26 }, { name: 'B', pos: 1 }] }
    expect(G.journeyMove(near, 4).winner).toBe(0)
    const back = { ...near, players: [{ name: 'A', pos: 21 }, { name: 'B', pos: 1 }] }
    expect(G.journeyMove(back, 3).players[0].pos).toBe(22)
  })
  it('cards sit on unique spaces inside the route', () => {
    const s = G.JOURNEY_CARDS.map(c => c.space); expect(new Set(s).size).toBe(s.length); s.forEach(x => expect(x).toBeLessThanOrEqual(G.ROUTE_LENGTH))
  })
})

describe('Ark rescue', () => {
  it('everyone wins when all pairs are aboard', () => {
    let a = G.newArk(['A', 'B']); for (let i = 0; i < 4; i++) a = G.arkRoll(a, 6)
    expect(a.result).toBe('won'); expect(a.loaded).toBe(8)
  })
  it('too much rain means try again together', () => {
    let a = G.newArk(['A']); for (let i = 0; i < G.RAIN_MAX; i++) a = G.arkRoll(a, 1)
    expect(a.result).toBe('again'); expect(G.arkRoll(a, 6)).toBe(a)
  })
})

describe('Top trumps', () => {
  const figs = F as Figure[]
  it('has gentle stats for all 24 figures', () => {
    expect(Object.keys(G.STATS).sort()).toEqual(figs.map(f => f.id).sort())
    for (const s of Object.values(G.STATS)) for (const t of G.TRAITS) { expect(s[t]).toBeGreaterThanOrEqual(1); expect(s[t]).toBeLessThanOrEqual(10) }
  })
  it('deals 12 each and the higher card takes both', () => {
    const t = G.newTrumps(figs, seq(0.5)); expect(t.hands[0]).toHaveLength(12)
    const fixed: G.Trumps = { hands: [['ruth', 'noah'], ['jonah']], turn: 0, pot: [], last: null, rounds: 0 }
    const n = G.playTrait(fixed, 'kindness'); expect(n.hands).toEqual([['noah', 'ruth', 'jonah'], []]); expect(G.trumpsWinner(n)).toBe(0)
  })
  it('a tie leaves both cards in the middle for the next winner', () => {
    const t: G.Trumps = { hands: [['noah', 'ruth'], ['joseph', 'jonah']], turn: 0, pot: [], last: null, rounds: 0 }
    const n = G.playTrait(t, 'courage'); expect(n.last?.winner).toBeNull(); expect(n.pot).toEqual(['noah', 'joseph'])
    const m = G.playTrait(n, 'kindness'); expect(m.hands[0]).toEqual(['noah', 'joseph', 'ruth', 'jonah'])
  })
  it('computer picks its best trait', () => { expect(G.computerTrait('solomon')).toBe('wisdom') })
})
