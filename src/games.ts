import type { Figure } from './game'
export type Rng = () => number

export function shuffle<T>(xs: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.min(i, Math.floor(rng() * (i + 1))); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

/* ---------- Pairs ---------- */
export type Symbol = { id: string; label: string; icon: string }
export const SYMBOLS: Symbol[] = [
  { id: 'noah', label: 'Ark', icon: 'ark' }, { id: 'moses', label: 'Stone tablets', icon: 'tablets' },
  { id: 'david', label: 'Sling and stone', icon: 'sling' }, { id: 'jonah', label: 'Big fish', icon: 'fish' },
  { id: 'esther', label: 'Crown', icon: 'crown' }, { id: 'daniel', label: 'Lion', icon: 'lion' },
  { id: 'abraham', label: 'Stars', icon: 'stars' }, { id: 'joseph', label: 'Coat', icon: 'coat' },
  { id: 'zacchaeus', label: 'Tree', icon: 'tree' }, { id: 'ruth', label: 'Wheat', icon: 'wheat' },
  { id: 'peter', label: 'Fishing net', icon: 'net' }, { id: 'paul', label: 'Letter', icon: 'scroll' },
]
export type Card = { key: string; figureId: string; kind: 'figure' | 'symbol' }
export type Pairs = { cards: Card[]; open: string[]; matched: string[]; moves: number }

export function newPairs(count: 6 | 10, rng: Rng = Math.random): Pairs {
  const ids = shuffle(SYMBOLS, rng).slice(0, count).map(s => s.id)
  const cards = ids.flatMap(id => [{ key: id + ':f', figureId: id, kind: 'figure' as const }, { key: id + ':s', figureId: id, kind: 'symbol' as const }])
  return { cards: shuffle(cards, rng), open: [], matched: [], moves: 0 }
}
/** Turn a card over. A third tap after a miss closes the two open cards first. */
export function flipCard(p: Pairs, key: string): Pairs {
  const card = p.cards.find(c => c.key === key)
  if (!card || p.matched.includes(card.figureId)) return p
  const open = p.open.length >= 2 ? [] : [...p.open]
  if (open.includes(key)) return p
  open.push(key)
  if (open.length < 2) return { ...p, open }
  const [a, b] = open.map(k => p.cards.find(c => c.key === k)!)
  const moves = p.moves + 1
  if (a.figureId === b.figureId) return { ...p, open: [], matched: [...p.matched, a.figureId], moves }
  return { ...p, open, moves }
}
export const pairsDone = (p: Pairs) => p.matched.length * 2 === p.cards.length

/* ---------- Who said or wrote it? (BSB, checked in tests) ---------- */
export type Quote = { figureId: string; text: string; ref: string; verse: string }
export const QUOTES: Quote[] = [
  { figureId: 'ruth', text: 'Wherever you go, I will go.', ref: 'Ruth 1:16', verse: 'RUT 1:16' },
  { figureId: 'david', text: 'The LORD is my shepherd; I shall not want.', ref: 'Psalm 23:1', verse: 'PSA 23:1' },
  { figureId: 'mary', text: 'I am the Lord\u2019s servant.', ref: 'Luke 1:38', verse: 'LUK 1:38' },
  { figureId: 'john-baptist', text: 'Look, the Lamb of God!', ref: 'John 1:29', verse: 'JHN 1:29' },
  { figureId: 'peter', text: 'You are the Christ, the Son of the living God.', ref: 'Matthew 16:16', verse: 'MAT 16:16' },
  { figureId: 'thomas', text: 'My Lord and my God!', ref: 'John 20:28', verse: 'JHN 20:28' },
  { figureId: 'zacchaeus', text: 'Half of my possessions I give to the poor.', ref: 'Luke 19:8', verse: 'LUK 19:8' },
  { figureId: 'hannah', text: 'I prayed for this boy.', ref: '1 Samuel 1:27', verse: '1SA 1:27' },
  { figureId: 'esther', text: 'If I perish, I perish!', ref: 'Esther 4:16', verse: 'EST 4:16' },
  { figureId: 'moses', text: 'Let My people go.', ref: 'Exodus 5:1', verse: 'EXO 5:1' },
  { figureId: 'jonah', text: 'In my distress I called to the LORD, and He answered me.', ref: 'Jonah 2:2', verse: 'JON 2:2' },
  { figureId: 'paul', text: 'I can do all things through Christ who gives me strength.', ref: 'Philippians 4:13', verse: 'PHP 4:13' },
  { figureId: 'joseph', text: 'God intended for good.', ref: 'Genesis 50:20', verse: 'GEN 50:20' },
  { figureId: 'martha', text: 'Lord, if You had been here, my brother would not have died.', ref: 'John 11:21', verse: 'JHN 11:21' },
  { figureId: 'daniel', text: 'My God sent His angel and shut the mouths of the lions.', ref: 'Daniel 6:22', verse: 'DAN 6:22' },
  { figureId: 'solomon', text: 'Give Your servant an understanding heart.', ref: '1 Kings 3:9', verse: '1KI 3:9' },
  { figureId: 'deborah', text: 'Has not the LORD gone before you?', ref: 'Judges 4:14', verse: 'JDG 4:14' },
  { figureId: 'miriam', text: 'Sing to the LORD, for He is highly exalted.', ref: 'Exodus 15:21', verse: 'EXO 15:21' },
  { figureId: 'sarah', text: 'God has made me laugh.', ref: 'Genesis 21:6', verse: 'GEN 21:6' },
  { figureId: 'elijah', text: 'Let it be known this day that You are God in Israel.', ref: '1 Kings 18:36', verse: '1KI 18:36' },
]
export type Round = { quote: Quote; choices: string[] }
export type Quiz = { rounds: Round[]; at: number; score: number; answered: string | null }
export function newQuiz(figures: Figure[], rng: Rng = Math.random, n = 10): Quiz {
  const rounds = shuffle(QUOTES, rng).slice(0, n).map(quote => {
    const others = shuffle(figures.filter(f => f.id !== quote.figureId), rng).slice(0, 2).map(f => f.id)
    return { quote, choices: shuffle([quote.figureId, ...others], rng) }
  })
  return { rounds, at: 0, score: 0, answered: null }
}
export function answer(q: Quiz, id: string): Quiz {
  if (q.answered || q.at >= q.rounds.length) return q
  return { ...q, answered: id, score: q.score + (id === q.rounds[q.at].quote.figureId ? 1 : 0) }
}
export const nextRound = (q: Quiz): Quiz => q.answered ? { ...q, at: q.at + 1, answered: null } : q
export const quizDone = (q: Quiz) => q.at >= q.rounds.length

/* ---------- Story order ---------- */
export type Scene = { id: string; caption: string }
export type Story = { id: string; title: string; ref: string; scenes: Scene[] }
export const STORIES: Story[] = [
  { id: 'noah', title: 'Noah and the ark', ref: 'Genesis 6 to 9', scenes: [
    { id: 'noah-1', caption: 'Noah gets the ark ready' }, { id: 'noah-2', caption: 'The animals go in' },
    { id: 'noah-3', caption: 'The great flood' }, { id: 'noah-4', caption: 'The dove flies out' }, { id: 'noah-5', caption: 'God sets a rainbow' }] },
  { id: 'jonah', title: 'Jonah', ref: 'Jonah 1 to 4', scenes: [
    { id: 'jonah-1', caption: 'Jonah runs away on a ship' }, { id: 'jonah-2', caption: 'A great storm' },
    { id: 'jonah-3', caption: 'The fish puts Jonah on dry land' }, { id: 'jonah-4', caption: 'Jonah speaks in Nineveh' }, { id: 'jonah-5', caption: 'Jonah sits outside the city' }] },
  { id: 'joseph', title: 'Joseph', ref: 'Genesis 37 and 41', scenes: [
    { id: 'joseph-1', caption: 'Joseph tells his dreams' }, { id: 'joseph-2', caption: 'The brothers take his coat' },
    { id: 'joseph-3', caption: 'Jacob is very sad' }, { id: 'joseph-4', caption: 'Pharaoh puts Joseph in charge' }] },
]
export type Order = { story: Story; pool: string[]; placed: string[] }
export function newOrder(story: Story, rng: Rng = Math.random): Order {
  let pool = shuffle(story.scenes.map(s => s.id), rng)
  if (pool.every((id, i) => id === story.scenes[i].id)) pool = [...pool.slice(1), pool[0]]
  return { story, pool, placed: [] }
}
/** Tap a card in the pool to put it in the next empty slot; tap a placed card to send it back. */
export function place(o: Order, id: string): Order {
  if (o.pool.includes(id)) return { ...o, pool: o.pool.filter(p => p !== id), placed: [...o.placed, id] }
  if (o.placed.includes(id)) return { ...o, placed: o.placed.filter(p => p !== id), pool: [...o.pool, id] }
  return o
}
/** Drag and drop: move a card to a slot index in the placed row. */
export function moveTo(o: Order, id: string, index: number): Order {
  const placed = o.placed.filter(p => p !== id)
  placed.splice(Math.max(0, Math.min(index, placed.length)), 0, id)
  return { ...o, pool: o.pool.filter(p => p !== id), placed }
}
export const orderComplete = (o: Order) => o.pool.length === 0
export const orderRight = (o: Order) => orderComplete(o) && o.placed.every((id, i) => id === o.story.scenes[i].id)
/** Which placed cards are in the right slot (for kind hints). */
export const rightSlots = (o: Order) => o.placed.map((id, i) => id === o.story.scenes[i].id)

/* ---------- Bingo ---------- */
export function bingoCard(figures: Figure[], rng: Rng = Math.random): string[] {
  if (figures.length < 16) throw new Error('Need 16 figures')
  return shuffle(figures.map(f => f.id), rng).slice(0, 16)
}
export type Caller = { order: string[]; called: number }
export const newCaller = (figures: Figure[], rng: Rng = Math.random): Caller => ({ order: shuffle(figures.map(f => f.id), rng), called: 0 })
export const callNext = (c: Caller): Caller => ({ ...c, called: Math.min(c.order.length, c.called + 1) })
export const calledIds = (c: Caller) => c.order.slice(0, c.called)
/** A line is a full row, column or diagonal of marked squares. */
export function hasLine(card: string[], marked: string[]): boolean {
  const m = (r: number, c: number) => marked.includes(card[r * 4 + c])
  const ix = [0, 1, 2, 3]
  return ix.some(r => ix.every(c => m(r, c))) || ix.some(c => ix.every(r => m(r, c))) || ix.every(i => m(i, i)) || ix.every(i => m(i, 3 - i))
}

/* ---------- Journey map ---------- */
export type Stop = { name: string; lon: number; lat: number; caption: string; ref: string; below?: boolean }
export type Journey = { id: string; title: string; stops: Stop[] }
export const JOURNEYS: Journey[] = [
  { id: 'abraham', title: 'Abraham: from Ur to Canaan', stops: [
    { name: 'Ur', lon: 46.1, lat: 30.96, caption: 'Abraham\u2019s family set out from Ur.', ref: 'Genesis 11:31' },
    { name: 'Haran', lon: 39.03, lat: 36.86, caption: 'They stopped and lived in Haran.', ref: 'Genesis 11:31' },
    { name: 'Shechem', lon: 35.28, lat: 32.21, caption: 'God said, I will give this land to your family.', ref: 'Genesis 12:6-7' },
    { name: 'Bethel', below: true, lon: 35.22, lat: 31.93, caption: 'Abraham built an altar and prayed.', ref: 'Genesis 12:8' },
    { name: 'Hebron', lon: 35.1, lat: 31.53, caption: 'Abraham made his home by the oaks of Mamre.', ref: 'Genesis 13:18' }] },
  { id: 'paul', title: 'Paul\u2019s first journey', stops: [
    { name: 'Antioch', lon: 36.16, lat: 36.2, caption: 'The church sent Paul and Barnabas off.', ref: 'Acts 13:1-3' },
    { name: 'Seleucia', below: true, lon: 35.93, lat: 36.12, caption: 'They went down to the sea and sailed.', ref: 'Acts 13:4' },
    { name: 'Salamis', lon: 33.9, lat: 35.18, caption: 'They told people about God on Cyprus.', ref: 'Acts 13:5' },
    { name: 'Paphos', below: true, lon: 32.4, lat: 34.76, caption: 'The governor believed.', ref: 'Acts 13:12' },
    { name: 'Perga', lon: 30.85, lat: 36.96, caption: 'They sailed across to Perga.', ref: 'Acts 13:13' },
    { name: 'Pisidian Antioch', lon: 31.19, lat: 38.31, caption: 'Paul spoke in the synagogue.', ref: 'Acts 13:14-16' },
    { name: 'Iconium', lon: 32.48, lat: 37.87, caption: 'Many people believed.', ref: 'Acts 14:1' },
    { name: 'Lystra', below: true, lon: 32.36, lat: 37.58, caption: 'A man who could not walk stood up.', ref: 'Acts 14:8-10' },
    { name: 'Derbe', lon: 33.36, lat: 37.35, caption: 'They taught many people.', ref: 'Acts 14:20-21' },
    { name: 'Antioch again', lon: 36.16, lat: 36.2, caption: 'They came home and told what God had done.', ref: 'Acts 14:26-27' }] },
]
/** Simple equirectangular projection onto a 1000 x 700 map of 28E-48E, 28N-40N. */
export const project = (lon: number, lat: number) => ({ x: Math.round((lon - 28) / 20 * 1000), y: Math.round((40 - lat) / 12 * 700) })
export const stepStop = (j: Journey, at: number, d: 1 | -1) => Math.max(0, Math.min(j.stops.length - 1, at + d))
