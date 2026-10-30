import { shuffle, type Rng } from './games'
import type { Checked } from './games2'
import { ENTRIES } from './balderdash-data'
export { ENTRIES }

export type Entry = {
  id: string; term: string; realAnswer: string; reference: string; text: string
  tier: 'K' | 'A'; tag?: 'debated' | 'approx'; kind: 'bluff' | 'truefalse'; needsReview?: boolean
} & Omit<Checked, 'ref'>

/** Bluffs play around the story, never with God's name, prayer, the cross or judgement. */
const OFF_LIMITS = /\b(god|gods|lord|jesus|christ|holy spirit|pray|prayer|praying|cross|crucif\w*|hell|judg(e)?ment|damn\w*)\b/i
export const bluffAllowed = (s: string) => s.trim().length > 0 && !OFF_LIMITS.test(s)

export const deck = (tier: 'K' | 'A', rng: Rng = Math.random) => shuffle(ENTRIES.filter(e => tier === 'A' || e.tier === 'K'), rng)

export type Option = { text: string; author: number | null }
/** Grown-ups round: everyone but the reader types a bluff, then the real answer is mixed in. */
export function options(e: Entry, bluffs: { author: number; text: string }[], rng: Rng = Math.random): Option[] {
  if (e.kind === 'truefalse') return [{ text: 'True', author: null }, { text: 'Made up', author: -1 }]
  const seen = new Set([e.realAnswer.toLowerCase()])
  const ok = bluffs.filter(b => bluffAllowed(b.text) && !seen.has(b.text.trim().toLowerCase()) && (seen.add(b.text.trim().toLowerCase()), true))
  return shuffle([{ text: e.realAnswer, author: null }, ...ok.map(b => ({ text: b.text.trim(), author: b.author }))], rng)
}
/** Kids round: pick the real one from 2 or 3 choices, using other entries' answers as decoys. */
export function kidChoices(e: Entry, n = 3, rng: Rng = Math.random): Option[] {
  if (e.kind === 'truefalse') return options(e, [], rng)
  const decoys = shuffle(ENTRIES.filter(x => x.id !== e.id && x.kind === 'bluff' && x.tier === 'K'), rng).slice(0, Math.max(1, Math.min(2, n - 1)))
  return shuffle([{ text: e.realAnswer, author: null }, ...decoys.map(d => ({ text: d.realAnswer, author: -1 }))], rng)
}
/** Scores: 2 for finding the real answer, 1 to a bluffer for each vote they fool. votes[player] = option index. */
export function score(opts: Option[], votes: Record<number, number>, players: number, mult = 1): number[] {
  const s = Array(players).fill(0)
  for (const [voter, i] of Object.entries(votes)) {
    const o = opts[i]; if (!o) continue
    if (o.author === null) s[+voter] += 2 * mult
    else if (o.author >= 0 && o.author !== +voter) s[o.author] += 1 * mult
  }
  return s
}
