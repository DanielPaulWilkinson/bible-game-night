import { describe, it, expect } from 'vitest'
import { BSB, inVerse } from './bsb'
import * as G from '../src/games3'
import type { Checked } from '../src/games2'

const first = () => 0
const checked: [string, Checked][] = [
  ['jericho', G.JERICHO_VERSE], ['jericho laps', G.JERICHO_LAPS], ['feed', G.FEED_VERSE], ['noah', G.NOAH_VERSE], ['sheep', G.SHEEP_VERSE],
  ...G.POSES.map(p => [p.name, p] as [string, Checked]), ...G.STORY.map(e => [e.title, e] as [string, Checked]),
  ...G.PLACES.map(p => [p.name, p] as [string, Checked]),
]
describe('games3 Bible claims are backed by the BSB', () => {
  it.each(checked)('%s', (_, c) => {
    expect(inVerse(c.verse, c.evidence), `${c.verse} lacks "${c.evidence}"`).toBe(true)
    expect(c.ref.endsWith(c.verse.split(' ')[1])).toBe(true)
  })
  it.each(G.VERSES.map(v => [v.ref, v] as const))('memory verse %s is exact BSB text', (_, v) => expect(BSB.get(v.verse)).toBe(v.text))
})

describe('Walls of Jericho', () => {
  it('needs seven laps, then the trumpet, then the shout', () => {
    let j = G.newJericho()
    expect(G.shout(G.blow(j)).fallen).toBe(false)
    for (let i = 0; i < 9; i++) j = G.march(j)
    expect(j.laps).toBe(7); expect(G.shout(j).fallen).toBe(false)
    j = G.blow(j); expect(G.canBlow(j)).toBe(false); expect(G.shout(j).fallen).toBe(true)
  })
})
describe('Freeze', () => {
  it('never repeats the same pose twice running', () => { const p = G.POSES[0]; for (const r of [0, .5, .999]) expect(G.nextPose(p, () => r)).not.toBe(p) })
})
describe('Feed the 5,000', () => {
  it('passes the device every ten taps and finishes at 5,000', () => {
    let f = G.newFeed(3), taps = 0
    while (!G.feedDone(f)) { if (G.passNow(f)) f = G.passOn(f); else { f = G.feedTap(f); taps++ } }
    expect(f.fed).toBe(5000); expect(taps).toBe(50); expect(G.feedTap(f).fed).toBe(5000)
    expect(f.turn).toBe(1)
  })
  it('blocks taps until passed', () => { let f = G.newFeed(2); for (let i = 0; i < 15; i++) f = G.feedTap(f); expect(f.fed).toBe(1000) })
})
describe('Noah', () => {
  it('boards pairs and counts skips', () => {
    let s = G.newNoah(first, 3); s = G.guessed(s); s = G.skipAnimal(s); s = G.guessed(s)
    expect(G.animalsAboard(s)).toBe(4); expect(s.skipped).toBe(1); expect(G.noahDone(s)).toBe(true); expect(G.guessed(s)).toBe(s)
  })
})
describe('Lost sheep', () => {
  it('clamps warmth and gets louder', () => {
    let s = G.newSheep(); for (let i = 0; i < 5; i++) s = G.further(s); expect(s.warmth).toBe(0)
    const quiet = G.baaVolume(s); for (let i = 0; i < 20; i++) s = G.closer(s)
    expect(s.warmth).toBe(10); expect(G.baaVolume(s)).toBeGreaterThan(quiet); expect(G.warmthWord(10)).toBe('Boiling hot!')
    expect(G.found(G.newSheep()).found).toBe(true)
  })
})
describe('Timeline', () => {
  it('always starts with Creation and ends with New Creation, and counts mistakes', () => {
    let t = G.newTimeline(Math.random, 6)
    expect(t.cards).toHaveLength(6); expect(G.nextInStory(t).id).toBe('creation')
    t = G.placeEvent(t, 'new'); expect(t.mistakes).toBe(1)
    while (!G.timelineDone(t)) t = G.placeEvent(t, G.nextInStory(t).id)
    expect(t.placed[5].id).toBe('new'); expect(t.mistakes).toBe(1)
  })
})
describe('Verse Builder', () => {
  it('fills blanks in order and rejects wrong words', () => {
    let b = G.newBuilder(G.VERSES[3], 3, first)
    expect(b.blanks).toHaveLength(3)
    b = G.tryWord(b, 'zzz'); expect(b.wrong).toBe(1)
    while (!G.builderDone(b)) b = G.tryWord(b, G.bare(b.words[b.blanks[b.filled]]))
    expect(b.chips).toHaveLength(0)
  })
  it('never blanks tiny words', () => {
    for (const v of G.VERSES) { const b = G.newBuilder(v, 9); for (const i of b.blanks) expect(['the', 'a', 'and', 'i']).not.toContain(G.bare(b.words[i])) }
  })
})
describe('Where in the World', () => {
  it('scores right taps only', () => {
    let h = G.newHunt(first, 3); h = G.tapPlace(h, 'nowhere'); expect(h.score).toBe(0); expect(h.last?.right).toBe(false)
    h = G.tapPlace(h, h.order[0].id); h = G.skipPlace(h); h = G.tapPlace(h, h.order[2].id)
    expect(h.score).toBe(2); expect(G.huntDone(h)).toBe(true)
  })
  it('places sit on the map', () => { for (const p of G.PLACES) { expect(p.x).toBeGreaterThan(0); expect(p.x).toBeLessThan(100); expect(p.y).toBeLessThan(140) } })
})
describe('Who Am I', () => {
  it('scores more for earlier guesses and rotates teams', () => {
    expect(G.pointsFor(1)).toBe(4); expect(G.pointsFor(4)).toBe(1)
    let w = G.newWhoAmI(2, first); w = G.gotPerson(w); w = G.nextPerson(w)
    w = G.moreClue(G.moreClue(w)); w = G.gotPerson(w)
    expect(w.scores).toEqual([4, 2])
    expect(G.moreClue({ ...w, shown: 4 }).revealed).toBe(true)
  })
  it('has four clues each and some church history figures', () => {
    for (const p of G.PEOPLE) expect(p.clues).toHaveLength(4)
    expect(G.PEOPLE.filter(p => p.church).length).toBeGreaterThanOrEqual(4)
  })
})
describe('Passport', () => {
  it('stamps each place once', () => {
    let p = G.newPassport(); for (const s of [...G.STAMPS, ...G.STAMPS]) p = G.stamp(p, s.id)
    expect(G.stamp(p, 'nope')).toBe(p); expect(G.passportFull(p)).toBe(true); expect(p.stamped).toHaveLength(6)
  })
})
