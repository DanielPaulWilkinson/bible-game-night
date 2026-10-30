import { TAGS } from './tags'
export type Who = 'little' | 'grown' | null
export type Mood = 'move' | 'laugh' | 'think' | 'quiet'
export const MOODS: [Mood, string][] = [['move', 'Get up and move'], ['laugh', 'Make us laugh'], ['think', 'Think together'], ['quiet', 'Quiet and worship']]
export const MOOD: Record<string, Mood> = Object.fromEntries([
  ...['jericho', 'simon', 'act', 'freeze', 'noah', 'framefreeze', 'feed', 'sheep', 'charades'].map(k => [k, 'move']),
  ...['taboo', 'balderdash', 'real', 'sketch', 'draw', 'alphabet', 'guess', 'quiz', 'trumps', 'whoami', 'snakes', 'exodus', 'bingo', 'quotes'].map(k => [k, 'laugh']),
  ...['fill', 'timeline', 'verse', 'world', 'map', 'order', 'pairs', 'passport', 'ark'].map(k => [k, 'think']),
  ...['thanks', 'finish', 'catechism'].map(k => [k, 'quiet']),
])
// Where each game's content comes from (Scholar's "From the Book of" badge).
export const SOURCE: Record<string, string> = {
  jericho: 'From Joshua', freeze: 'From Genesis', noah: 'From Genesis', ark: 'From Genesis', feed: 'From the Gospels', sheep: 'From Luke',
  exodus: 'From Exodus', map: 'From Genesis and Acts', thanks: 'From 1 Thessalonians', finish: 'From Psalms and old hymns',
  catechism: 'From the Westminster Catechism', passport: 'From church history', whoami: 'From the Bible and church history', snakes: 'From The Pilgrim’s Progress',
}
export const source = (id: string) => SOURCE[id] ?? 'From all the Bible'
const READING = ['balderdash', 'whoami', 'quiz', 'passport', 'catechism', 'alphabet', 'taboo', 'quotes', 'trumps']
export const forWho = (id: string, who: Who) => {
  const t = TAGS[id]
  if (who === 'little') return t.age === 'little' || (t.age === 'all' && t.minutes <= 15 && !READING.includes(id))
  if (who === 'grown') return t.age !== 'little'
  return true
}
export const ageBadge = (id: string) => ({ little: 'Age 3+', all: 'Age 6+', adults: 'Age 12+' })[TAGS[id].age]
const pick = <T>(a: T[], r: () => number) => a[Math.floor(r() * a.length)]
/** Tonight's lineup: one to move, one to laugh, one calm. The Blessing Round always follows. */
export const deal = (ids: string[], who: Who, r = Math.random) => {
  const ok = (m: Mood[]) => ids.filter(k => m.includes(MOOD[k]) && forWho(k, who) && TAGS[k].minutes <= 15 && TAGS[k].needs.length === 1)
  return [pick(ok(['move']), r), pick(ok(['laugh']), r), pick(ok(['quiet']).length ? ok(['quiet']) : ok(['think']), r)].filter(Boolean)
}
export const surprise = (ids: string[], who: Who, r = Math.random) => pick(ids.filter(k => forWho(k, who)), r)
const KEY = 'bgn-recent'
export const recent = (): string[] => { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]').filter((k: string) => k in TAGS).slice(0, 3) } catch { return [] } }
export const remember = (id: string) => { if (!(id in TAGS)) return; try { localStorage.setItem(KEY, JSON.stringify([id, ...recent().filter(k => k !== id)].slice(0, 3))) } catch { /* private mode */ } }
