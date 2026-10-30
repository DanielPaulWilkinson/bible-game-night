import { shuffle, type Rng } from './games'
import type { Checked } from './games2'

/* ---------- Walls of Jericho (Joshua 6) ---------- */
export const JERICHO_VERSE: Checked = { ref: 'Joshua 6:20', verse: 'JOS 6:20', evidence: 'the people gave a great shout, and the wall collapsed' }
export const JERICHO_LAPS: Checked = { ref: 'Joshua 6:15', verse: 'JOS 6:15', evidence: 'marched around the city seven times' }
export type Jericho = { laps: number; blown: boolean; fallen: boolean }
export const newJericho = (): Jericho => ({ laps: 0, blown: false, fallen: false })
export const march = (j: Jericho): Jericho => j.laps >= 7 ? j : { ...j, laps: j.laps + 1 }
export const canBlow = (j: Jericho) => j.laps === 7 && !j.blown
export const blow = (j: Jericho): Jericho => canBlow(j) ? { ...j, blown: true } : j
export const shout = (j: Jericho): Jericho => j.blown ? { ...j, fallen: true } : j

/* ---------- Freeze, Lot's Wife! ---------- */
export type Pose = { name: string; how: string } & Checked
export const POSES: Pose[] = [
  { name: 'Peter walking on the water', how: 'One foot forward, arms out to balance.', ref: 'Matthew 14:29', verse: 'MAT 14:29', evidence: 'walked on the water' },
  { name: 'Lot’s wife looking back', how: 'Look over your shoulder and stand still as salt.', ref: 'Genesis 19:26', verse: 'GEN 19:26', evidence: 'pillar of salt' },
  { name: 'David with his sling', how: 'Swing your arm up high, ready to throw.', ref: '1 Samuel 17:50', verse: '1SA 17:50', evidence: 'a sling and a stone' },
  { name: 'Zacchaeus up the tree', how: 'Reach up high as if holding a branch.', ref: 'Luke 19:4', verse: 'LUK 19:4', evidence: 'climbed a sycamore tree' },
  { name: 'Daniel praying', how: 'Kneel down with your hands together.', ref: 'Daniel 6:10', verse: 'DAN 6:10', evidence: 'three times a day' },
  { name: 'Noah building the ark', how: 'Hold up a pretend hammer mid-swing.', ref: 'Genesis 6:14', verse: 'GEN 6:14', evidence: 'Make for yourself an ark' },
  { name: 'Moses with his staff', how: 'Hold a staff out over the sea.', ref: 'Exodus 14:21', verse: 'EXO 14:21', evidence: 'stretched out his hand over the sea' },
  { name: 'Jonah in the big fish', how: 'Curl up small and hug your knees.', ref: 'Jonah 1:17', verse: 'JON 1:17', evidence: 'great fish' },
  { name: 'Joshua’s trumpet', how: 'Blow a pretend ram’s horn to the sky.', ref: 'Joshua 6:20', verse: 'JOS 6:20', evidence: 'rams’ horns sounded' },
  { name: 'Ruth gathering grain', how: 'Bend over and pick up pretend grain.', ref: 'Ruth 2:3', verse: 'RUT 2:3', evidence: 'gleaned after the harvesters' },
]
export const nextPose = (prev: Pose | undefined, rng: Rng = Math.random): Pose => {
  const pool = POSES.filter(p => p !== prev); return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))]
}

/* ---------- Feed the 5,000 ---------- */
export const FEED_VERSE: Checked = { ref: 'Matthew 14:20', verse: 'MAT 14:20', evidence: 'twelve basketfuls of broken pieces that were left over' }
export const PER_TAP = 100, TAPS_PER_TURN = 10, CROWD = 5000
export type Feed = { fed: number; players: number; turn: number; taps: number }
export const newFeed = (players = 2): Feed => ({ fed: 0, players: Math.max(1, players), turn: 0, taps: 0 })
export const feedDone = (f: Feed) => f.fed >= CROWD
export const passNow = (f: Feed) => !feedDone(f) && f.taps >= TAPS_PER_TURN
export function feedTap(f: Feed): Feed {
  if (feedDone(f) || passNow(f)) return f
  return { ...f, fed: Math.min(CROWD, f.fed + PER_TAP), taps: f.taps + 1 }
}
export const passOn = (f: Feed): Feed => ({ ...f, taps: 0, turn: (f.turn + 1) % f.players })
export const BASKETS = 12

/* ---------- Noah's Animal Noises ---------- */
export const NOAH_VERSE: Checked = { ref: 'Genesis 7:9', verse: 'GEN 7:9', evidence: 'two by two' }
export type Animal = { id: string; name: string; act: string; emoji: string }
export const ANIMALS: Animal[] = [
  { id: 'lion', name: 'Lion', act: 'Roar and shake your mane', emoji: '🦁' },
  { id: 'elephant', name: 'Elephant', act: 'Swing your trunk and trumpet', emoji: '🐘' },
  { id: 'monkey', name: 'Monkey', act: 'Ooh-ooh and scratch your head', emoji: '🐒' },
  { id: 'frog', name: 'Frog', act: 'Croak and hop', emoji: '🐸' },
  { id: 'cow', name: 'Cow', act: 'Moo and chew slowly', emoji: '🐄' },
  { id: 'duck', name: 'Duck', act: 'Quack and waddle', emoji: '🦆' },
  { id: 'snake', name: 'Snake', act: 'Hiss and slither', emoji: '🐍' },
  { id: 'horse', name: 'Horse', act: 'Neigh and gallop', emoji: '🐴' },
  { id: 'owl', name: 'Owl', act: 'Twit-twoo and blink', emoji: '🦉' },
  { id: 'pig', name: 'Pig', act: 'Oink and snuffle', emoji: '🐷' },
  { id: 'kangaroo', name: 'Kangaroo', act: 'Bounce with tiny paws', emoji: '🦘' },
  { id: 'bee', name: 'Bee', act: 'Buzz and flap fast', emoji: '🐝' },
]
export type Noah = { deck: Animal[]; at: number; aboard: Animal[]; skipped: number }
export const newNoah = (rng: Rng = Math.random, n = 8): Noah => ({ deck: shuffle(ANIMALS, rng).slice(0, n), at: 0, aboard: [], skipped: 0 })
export const noahDone = (s: Noah) => s.at >= s.deck.length
export const guessed = (s: Noah): Noah => noahDone(s) ? s : { ...s, at: s.at + 1, aboard: [...s.aboard, s.deck[s.at]] }
export const skipAnimal = (s: Noah): Noah => noahDone(s) ? s : { ...s, at: s.at + 1, skipped: s.skipped + 1 }
/** Each guessed animal boards as a pair. */
export const animalsAboard = (s: Noah) => s.aboard.length * 2

/* ---------- Hide the Lost Sheep (Luke 15) ---------- */
export const SHEEP_VERSE: Checked = { ref: 'Luke 15:6', verse: 'LUK 15:6', evidence: 'I have found my lost sheep' }
export type Sheep = { warmth: number; found: boolean }
export const newSheep = (): Sheep => ({ warmth: 2, found: false })
export const closer = (s: Sheep): Sheep => ({ ...s, warmth: Math.min(10, s.warmth + 1) })
export const further = (s: Sheep): Sheep => ({ ...s, warmth: Math.max(0, s.warmth - 1) })
export const found = (s: Sheep): Sheep => ({ ...s, warmth: 10, found: true })
export const baaVolume = (s: Sheep) => 0.05 + 0.95 * (s.warmth / 10)
export const warmthWord = (w: number) => w >= 9 ? 'Boiling hot!' : w >= 7 ? 'Hot' : w >= 5 ? 'Warm' : w >= 3 ? 'Cool' : 'Cold'

/* ---------- The Big Story Timeline ---------- */
export type Event = { id: string; title: string } & Checked
export const STORY: Event[] = [
  { id: 'creation', title: 'God makes the world', ref: 'Genesis 1:1', verse: 'GEN 1:1', evidence: 'God created the heavens and the earth' },
  { id: 'flood', title: 'Noah and the ark', ref: 'Genesis 7:9', verse: 'GEN 7:9', evidence: 'enter the ark' },
  { id: 'abraham', title: 'Abraham sets out', ref: 'Genesis 12:4', verse: 'GEN 12:4', evidence: 'So Abram departed' },
  { id: 'joseph', title: 'Joseph in Egypt', ref: 'Genesis 41:41', verse: 'GEN 41:41', evidence: 'over all the land of Egypt' },
  { id: 'exodus', title: 'Moses crosses the sea', ref: 'Exodus 14:21', verse: 'EXO 14:21', evidence: 'stretched out his hand over the sea' },
  { id: 'jericho', title: 'The walls of Jericho', ref: 'Joshua 6:20', verse: 'JOS 6:20', evidence: 'the wall collapsed' },
  { id: 'david', title: 'David and Goliath', ref: '1 Samuel 17:50', verse: '1SA 17:50', evidence: 'a sling and a stone' },
  { id: 'daniel', title: 'Daniel and the lions', ref: 'Daniel 6:22', verse: 'DAN 6:22', evidence: 'shut the mouths of the lions' },
  { id: 'birth', title: 'Jesus is born', ref: 'Luke 2:7', verse: 'LUK 2:7', evidence: 'laid Him in a manger' },
  { id: 'risen', title: 'Jesus dies and rises again', ref: 'Luke 24:6', verse: 'LUK 24:6', evidence: 'He has risen' },
  { id: 'pentecost', title: 'The Holy Spirit comes', ref: 'Acts 2:4', verse: 'ACT 2:4', evidence: 'filled with the Holy Spirit' },
  { id: 'paul', title: 'Paul’s journeys', ref: 'Acts 13:4', verse: 'ACT 13:4', evidence: 'sailed from there to Cyprus' },
  { id: 'new', title: 'God makes all things new', ref: 'Revelation 21:5', verse: 'REV 21:5', evidence: 'I make all things new' },
]
export type Timeline = { cards: Event[]; placed: Event[]; mistakes: number; last?: 'right' | 'wrong' }
const rank = (e: Event) => STORY.indexOf(e)
export const newTimeline = (rng: Rng = Math.random, n = 6): Timeline => {
  const pick = shuffle(STORY.slice(1, -1), rng).slice(0, n - 2)
  return { cards: shuffle([STORY[0], ...pick, STORY[STORY.length - 1]], rng), placed: [], mistakes: 0 }
}
export const nextInStory = (t: Timeline) => [...t.cards].filter(c => !t.placed.includes(c)).sort((a, b) => rank(a) - rank(b))[0]
export function placeEvent(t: Timeline, id: string): Timeline {
  const want = nextInStory(t); if (!want) return t
  return want.id === id ? { ...t, placed: [...t.placed, want], last: 'right' } : { ...t, mistakes: t.mistakes + 1, last: 'wrong' }
}
export const timelineDone = (t: Timeline) => t.placed.length === t.cards.length

/* ---------- Verse Builder (BSB text) ---------- */
export type MemoryVerse = { ref: string; verse: string; text: string }
export const VERSES: MemoryVerse[] = [
  { ref: 'Genesis 1:1', verse: 'GEN 1:1', text: 'In the beginning God created the heavens and the earth.' },
  { ref: 'Psalm 23:1', verse: 'PSA 23:1', text: 'The LORD is my shepherd; I shall not want.' },
  { ref: 'Psalm 56:3', verse: 'PSA 56:3', text: 'When I am afraid, I put my trust in You.' },
  { ref: 'Psalm 119:105', verse: 'PSA 119:105', text: 'Your word is a lamp to my feet and a light to my path.' },
  { ref: '1 John 4:19', verse: '1JN 4:19', text: 'We love because He first loved us.' },
  { ref: 'Ephesians 4:32', verse: 'EPH 4:32', text: 'Be kind and tenderhearted to one another, forgiving each other just as in Christ God forgave you.' },
  { ref: 'John 3:16', verse: 'JHN 3:16', text: 'For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.' },
]
const SMALL = new Set(['a', 'an', 'the', 'to', 'of', 'in', 'i', 'my', 'and', 'is', 'that', 'he', 'his', 'him', 'you', 'we', 'us', 'so', 'as', 'not', 'at', 'am', 'just', 'one', 'only'])
export const bare = (w: string) => w.toLowerCase().replace(/[^a-z']/g, '')
export type Builder = { v: MemoryVerse; words: string[]; blanks: number[]; filled: number; wrong: number; chips: string[] }
export function newBuilder(v: MemoryVerse, k = 4, rng: Rng = Math.random): Builder {
  const words = v.text.split(' ')
  const cand = words.map((w, i) => i).filter(i => !SMALL.has(bare(words[i])))
  const blanks = shuffle(cand, rng).slice(0, Math.min(k, cand.length)).sort((a, b) => a - b)
  return { v, words, blanks, filled: 0, wrong: 0, chips: shuffle(blanks.map(i => bare(words[i])), rng) }
}
export const builderDone = (b: Builder) => b.filled >= b.blanks.length
export function tryWord(b: Builder, chip: string): Builder {
  if (builderDone(b)) return b
  if (bare(b.words[b.blanks[b.filled]]) !== chip) return { ...b, wrong: b.wrong + 1 }
  const chips = [...b.chips]; chips.splice(chips.indexOf(chip), 1)
  return { ...b, filled: b.filled + 1, chips }
}

/* ---------- Where in the World? ---------- */
/** x,y on a 100x140 stylised map of the land of Israel (north up). */
export type Place = { id: string; name: string; x: number; y: number; hint: string } & Checked
export const PLACES: Place[] = [
  { id: 'nazareth', name: 'Nazareth', x: 50, y: 40, hint: 'Where Jesus grew up.', ref: 'Luke 2:39', verse: 'LUK 2:39', evidence: 'their own town of Nazareth' },
  { id: 'galilee', name: 'Sea of Galilee', x: 66, y: 34, hint: 'Peter fished here.', ref: 'Matthew 4:18', verse: 'MAT 4:18', evidence: 'Sea of Galilee' },
  { id: 'jerusalem', name: 'Jerusalem', x: 52, y: 88, hint: 'The city of the temple.', ref: 'Luke 2:22', verse: 'LUK 2:22', evidence: 'to Jerusalem' },
  { id: 'bethlehem', name: 'Bethlehem', x: 50, y: 97, hint: 'Where Jesus was born.', ref: 'Luke 2:4', verse: 'LUK 2:4', evidence: 'Bethlehem' },
  { id: 'jericho', name: 'Jericho', x: 66, y: 85, hint: 'The walls fell down.', ref: 'Joshua 6:20', verse: 'JOS 6:20', evidence: 'the wall collapsed' },
  { id: 'deadsea', name: 'Dead Sea', x: 68, y: 105, hint: 'The salty sea in the south.', ref: 'Genesis 14:3', verse: 'GEN 14:3', evidence: 'Salt Sea' },
  { id: 'joppa', name: 'Joppa', x: 26, y: 74, hint: 'Jonah got on a ship here.', ref: 'Jonah 1:3', verse: 'JON 1:3', evidence: 'Joppa' },
  { id: 'carmel', name: 'Mount Carmel', x: 34, y: 30, hint: 'Elijah prayed and fire fell.', ref: '1 Kings 18:20', verse: '1KI 18:20', evidence: 'Mount Carmel' },
]
export type Hunt = { order: Place[]; at: number; score: number; last?: { id: string; right: boolean } }
export const newHunt = (rng: Rng = Math.random, n = 6): Hunt => ({ order: shuffle(PLACES, rng).slice(0, n), at: 0, score: 0 })
export const huntDone = (h: Hunt) => h.at >= h.order.length
export function tapPlace(h: Hunt, id: string): Hunt {
  if (huntDone(h)) return h
  const right = h.order[h.at].id === id
  return right ? { ...h, at: h.at + 1, score: h.score + 1, last: { id, right } } : { ...h, last: { id, right } }
}
export const skipPlace = (h: Hunt): Hunt => huntDone(h) ? h : { ...h, at: h.at + 1, last: undefined }

/* ---------- Who Am I? Clue by Clue ---------- */
export type Person = { name: string; clues: string[]; church?: boolean; ref?: string }
export const PEOPLE: Person[] = [
  { name: 'Noah', ref: 'Genesis 6–9', clues: ['I did a lot of building.', 'I needed a very big boat.', 'Animals came to me two by two.', 'I saw a rainbow after the flood.'] },
  { name: 'Moses', ref: 'Exodus 2–14', clues: ['I was once put in a basket.', 'I grew up in a palace.', 'I saw a bush on fire that did not burn up.', 'God parted the sea when I held out my staff.'] },
  { name: 'David', ref: '1 Samuel 16–17', clues: ['I looked after sheep.', 'I played the harp.', 'I was the youngest of my brothers.', 'I beat a giant with a sling.'] },
  { name: 'Daniel', ref: 'Daniel 6', clues: ['I lived far from home in Babylon.', 'I would not stop praying.', 'I spent a night in a den.', 'God shut the lions’ mouths.'] },
  { name: 'Esther', ref: 'Esther 2–8', clues: ['I was an orphan raised by my cousin.', 'I became a queen.', 'I was brave and spoke to the king.', 'I helped save my people.'] },
  { name: 'Jonah', ref: 'Jonah 1–3', clues: ['God asked me to go to a big city.', 'I ran away on a ship.', 'There was a big storm.', 'A great fish swallowed me.'] },
  { name: 'Peter', ref: 'Matthew 4; 14', clues: ['I had a brother called Andrew.', 'I mended nets.', 'Jesus called me to follow Him.', 'I walked on water for a moment.'] },
  { name: 'Paul', ref: 'Acts 9–28', clues: ['I used to be called Saul.', 'I saw a bright light on a road.', 'I wrote many letters.', 'I was shipwrecked on a journey.'] },
  { name: 'Saint Patrick', church: true, clues: ['I lived about 1,600 years ago.', 'I was taken away as a slave when I was young.', 'Later I went back to tell people about Jesus.', 'Ireland remembers me on 17 March.'] },
  { name: 'Bede', church: true, clues: ['I was a monk in the north of England.', 'I lived at Jarrow, near the river Tyne.', 'I loved books and wrote lots of them.', 'I wrote a famous history of the English church.'] },
  { name: 'William Tyndale', church: true, clues: ['I lived about 500 years ago.', 'I wanted a ploughboy to know the Bible.', 'I worked on it in secret, far from home.', 'I translated the New Testament into English.'] },
  { name: 'John Wesley', church: true, clues: ['I lived about 300 years ago.', 'I rode thousands of miles on horseback.', 'I often preached outdoors in fields.', 'My brother Charles wrote many hymns.'] },
]
export const pointsFor = (cluesShown: number) => Math.max(1, 5 - cluesShown)
export type WhoAmI = { deck: Person[]; at: number; shown: number; scores: number[]; turn: number; revealed: boolean }
export const newWhoAmI = (teams = 2, rng: Rng = Math.random, n = 8): WhoAmI =>
  ({ deck: shuffle(PEOPLE, rng).slice(0, n), at: 0, shown: 1, scores: Array(Math.max(1, teams)).fill(0), turn: 0, revealed: false })
export const whoDone = (w: WhoAmI) => w.at >= w.deck.length
export const moreClue = (w: WhoAmI): WhoAmI => w.shown < 4 ? { ...w, shown: w.shown + 1 } : { ...w, revealed: true }
export function gotPerson(w: WhoAmI): WhoAmI {
  const scores = [...w.scores]; scores[w.turn] += pointsFor(w.shown); return { ...w, scores, revealed: true }
}
export const nextPerson = (w: WhoAmI): WhoAmI => ({ ...w, at: w.at + 1, shown: 1, revealed: false, turn: (w.turn + 1) % w.scores.length })

/* ---------- Church History Passport ---------- */
export type Stamp = { id: string; title: string; when: string; where: string; story: string; tell: string; ref?: string }
export const STAMPS: Stamp[] = [
  { id: 'pentecost', title: 'Pentecost', when: 'About AD 30', where: 'Jerusalem', ref: 'Acts 2', story: 'Jesus’ friends were waiting in Jerusalem. The Holy Spirit came with a sound like a rushing wind. Peter stood up and told the crowd about Jesus, and about three thousand people believed.', tell: 'Tell it back: what sound did they hear, and what did Peter do?' },
  { id: 'paul', title: 'Paul’s journeys', when: 'About AD 46 to 60', where: 'Around the Mediterranean Sea', ref: 'Acts 13–28', story: 'Paul travelled by road and by ship to tell people the good news about Jesus. He started churches in many towns and wrote them letters, some of which are in our Bible.', tell: 'Tell it back: how did Paul travel, and what did he write?' },
  { id: 'patrick', title: 'Patrick', when: 'About AD 450', where: 'Ireland', story: 'As a boy, Patrick was captured and taken to Ireland, where he looked after animals. He escaped home, but later chose to go back to Ireland to tell the people about Jesus.', tell: 'Tell it back: why was it brave of Patrick to go back?' },
  { id: 'bede', title: 'Bede', when: 'About AD 731', where: 'Jarrow, north-east England', story: 'Bede lived in a monastery from when he was seven. He studied, prayed and wrote. His history tells how the good news came to the English people.', tell: 'Tell it back: what did Bede love to do?' },
  { id: 'tyndale', title: 'William Tyndale', when: 'About 1526', where: 'England and Germany', story: 'Few people in England could read the Bible in their own language. William Tyndale translated the New Testament into English and had it printed so that even a ploughboy could read it.', tell: 'Tell it back: what did Tyndale want everyone to be able to read?' },
  { id: 'wesley', title: 'John Wesley', when: 'About 1740', where: 'All over Britain', story: 'John Wesley rode on horseback across the country. He preached in fields and market places so that working people could hear about God’s love. His brother Charles wrote hymns we still sing.', tell: 'Tell it back: where did Wesley preach, and what did Charles write?' },
]
export type Passport = { stamped: string[] }
export const newPassport = (): Passport => ({ stamped: [] })
export const stamp = (p: Passport, id: string): Passport => p.stamped.includes(id) || !STAMPS.some(s => s.id === id) ? p : { stamped: [...p.stamped, id] }
export const passportFull = (p: Passport) => p.stamped.length === STAMPS.length
