import type { Figure } from './game'
import { shuffle, type Rng } from './games'

/** Every Bible claim carries a BSB verse code and a phrase that must appear in that verse (checked in tests). */
export type Checked = { ref: string; verse: string; evidence: string }

export const rollDie = (rng: Rng = Math.random) => 1 + Math.min(5, Math.floor(rng() * 6))

/* ---------- Charades ---------- */
export type Prompt = { word: string; figureId?: string; scene?: string; icon?: string }
export const PROMPTS: Prompt[] = [
  { word: 'Build', figureId: 'noah' }, { word: 'Swim', figureId: 'jonah' }, { word: 'Sling', figureId: 'david' },
  { word: 'Climb', figureId: 'zacchaeus' }, { word: 'Pray', figureId: 'daniel' }, { word: 'Fish', figureId: 'peter' },
  { word: 'Crown', figureId: 'esther' }, { word: 'Sing', figureId: 'miriam' }, { word: 'Cook', figureId: 'martha' },
  { word: 'Walk far', figureId: 'abraham' }, { word: 'Rock baby', figureId: 'hannah' }, { word: 'Pick wheat', figureId: 'ruth' },
  { word: 'Storm', scene: 'jonah-2' }, { word: 'Animals', scene: 'noah-2' }, { word: 'Dove', scene: 'noah-4' },
  { word: 'Rainbow', scene: 'noah-5' }, { word: 'Dream', scene: 'joseph-1' }, { word: 'Boat', scene: 'jonah-1' },
  { word: 'Lion', icon: 'lion' }, { word: 'Big fish', icon: 'fish' },
]
export type Teams = { names: string[]; scores: number[]; turn: number }
export type Charades = { deck: Prompt[]; at: number; teams: Teams; got: number; passed: number }
export const newCharades = (names: string[], rng: Rng = Math.random): Charades =>
  ({ deck: shuffle(PROMPTS, rng), at: 0, teams: { names, scores: names.map(() => 0), turn: 0 }, got: 0, passed: 0 })
export const currentPrompt = (c: Charades) => c.deck[c.at % c.deck.length]
export function gotIt(c: Charades): Charades {
  const scores = [...c.teams.scores]; scores[c.teams.turn]++
  return { ...c, at: c.at + 1, got: c.got + 1, teams: { ...c.teams, scores } }
}
export const pass = (c: Charades): Charades => ({ ...c, at: c.at + 1, passed: c.passed + 1 })
export const nextTeam = (c: Charades): Charades => ({ ...c, got: 0, passed: 0, teams: { ...c.teams, turn: (c.teams.turn + 1) % c.teams.names.length } })

/** A countdown that the views tick once a second. */
export type Timer = { left: number; running: boolean }
export const startTimer = (secs: number): Timer => ({ left: secs, running: true })
export const tick = (t: Timer): Timer => !t.running ? t : t.left <= 1 ? { left: 0, running: false } : { ...t, left: t.left - 1 }

/* ---------- Real or made up? ---------- */
export type Fact = { text: string; real: boolean; truth: string } & Checked
export const FACTS: Fact[] = [
  { real: true, text: 'Jonah was inside a great fish for three days and three nights.', truth: 'Yes! God sent a great fish.', ref: 'Jonah 1:17', verse: 'JON 1:17', evidence: 'three days and three nights' },
  { real: true, text: 'A dove brought Noah an olive leaf.', truth: 'Yes! Then Noah knew the water was going down.', ref: 'Genesis 8:11', verse: 'GEN 8:11', evidence: 'olive leaf' },
  { real: true, text: 'Zacchaeus climbed a sycamore tree to see Jesus.', truth: 'Yes! He was too short to see over the crowd.', ref: 'Luke 19:4', verse: 'LUK 19:4', evidence: 'climbed a sycamore tree' },
  { real: true, text: 'Daniel prayed three times a day.', truth: 'Yes! He kept praying even when it was against the rules.', ref: 'Daniel 6:10', verse: 'DAN 6:10', evidence: 'three times a day' },
  { real: true, text: 'Ravens brought Elijah bread and meat.', truth: 'Yes! Morning and evening.', ref: '1 Kings 17:6', verse: '1KI 17:6', evidence: 'ravens would bring him bread and meat' },
  { real: true, text: 'Methuselah lived for 969 years.', truth: 'Yes! That is the oldest age in the Bible.', ref: 'Genesis 5:27', verse: 'GEN 5:27', evidence: '969 years' },
  { real: true, text: 'Baby Moses was put in a basket by the river.', truth: 'Yes! Among the reeds by the Nile.', ref: 'Exodus 2:3', verse: 'EXO 2:3', evidence: 'placed the child in the basket' },
  { real: true, text: 'Peter walked on the water.', truth: 'Yes! He got out of the boat and walked towards Jesus.', ref: 'Matthew 14:29', verse: 'MAT 14:29', evidence: 'walked on the water' },
  { real: true, text: 'Moses threw his staff down and it became a snake.', truth: 'Yes! And Moses ran from it.', ref: 'Exodus 4:3', verse: 'EXO 4:3', evidence: 'it became a snake' },
  { real: true, text: 'Goliath came from a town called Gath.', truth: 'Yes! Goliath of Gath.', ref: '1 Samuel 17:4', verse: '1SA 17:4', evidence: 'from Gath' },
  { real: false, text: 'Jonah was swallowed by a giant octopus.', truth: 'Made up! It was a great fish.', ref: 'Jonah 1:17', verse: 'JON 1:17', evidence: 'great fish' },
  { real: false, text: 'The dove came back to Noah carrying a banana.', truth: 'Made up! It was an olive leaf.', ref: 'Genesis 8:11', verse: 'GEN 8:11', evidence: 'olive leaf' },
  { real: false, text: 'Zacchaeus stood on a ladder to see Jesus.', truth: 'Made up! He climbed a tree.', ref: 'Luke 19:4', verse: 'LUK 19:4', evidence: 'sycamore tree' },
  { real: false, text: 'Elijah was fed by penguins.', truth: 'Made up! Ravens fed him.', ref: '1 Kings 17:6', verse: '1KI 17:6', evidence: 'ravens' },
  { real: false, text: 'Ruth worked picking apples in an orchard.', truth: 'Made up! She gathered grain in a field.', ref: 'Ruth 2:3', verse: 'RUT 2:3', evidence: 'gleaned after the harvesters' },
  { real: false, text: 'Peter was a baker before he followed Jesus.', truth: 'Made up! Peter was a fisherman.', ref: 'Matthew 4:18', verse: 'MAT 4:18', evidence: 'they were fishermen' },
  { real: false, text: 'David beat Goliath in a running race.', truth: 'Made up! David used a sling and a stone.', ref: '1 Samuel 17:50', verse: '1SA 17:50', evidence: 'a sling and a stone' },
  { real: false, text: 'Baby Jesus slept in a big golden bed.', truth: 'Made up! He was laid in a manger.', ref: 'Luke 2:7', verse: 'LUK 2:7', evidence: 'laid Him in a manger' },
]
export type Vote = { deck: Fact[]; at: number; revealed: boolean }
export const newVote = (rng: Rng = Math.random, n = 10): Vote => {
  const real = shuffle(FACTS.filter(f => f.real), rng).slice(0, Math.ceil(n / 2)), fake = shuffle(FACTS.filter(f => !f.real), rng).slice(0, Math.floor(n / 2))
  return { deck: shuffle([...real, ...fake], rng), at: 0, revealed: false }
}
export const revealFact = (v: Vote): Vote => ({ ...v, revealed: true })
export const nextFact = (v: Vote): Vote => v.revealed ? { ...v, at: v.at + 1, revealed: false } : v
export const voteDone = (v: Vote) => v.at >= v.deck.length

/* ---------- Draw it ---------- */
export const DRAW_WORDS: { word: string; icon: string }[] = [
  { word: 'Ark', icon: 'ark' }, { word: 'Fish', icon: 'fish' }, { word: 'Crown', icon: 'crown' }, { word: 'Lion', icon: 'lion' },
  { word: 'Stars', icon: 'stars' }, { word: 'Tree', icon: 'tree' }, { word: 'Coat', icon: 'coat' }, { word: 'Wheat', icon: 'wheat' },
  { word: 'Net', icon: 'net' }, { word: 'Scroll', icon: 'scroll' }, { word: 'Sling', icon: 'sling' }, { word: 'Stone tablets', icon: 'tablets' },
]
export type Stroke = { color: string; points: [number, number][] }
export const addPoint = (strokes: Stroke[], x: number, y: number): Stroke[] => {
  if (!strokes.length) return strokes
  const last = strokes[strokes.length - 1]
  return [...strokes.slice(0, -1), { ...last, points: [...last.points, [x, y]] }]
}
export const startStroke = (strokes: Stroke[], color: string, x: number, y: number): Stroke[] => [...strokes, { color, points: [[x, y]] }]
export const undo = (strokes: Stroke[]) => strokes.slice(0, -1)

/* ---------- Quiz night ---------- */
export type Question = { q: string; choices: string[]; answer: string } & Checked
export const QUIZ: { title: string; questions: Question[] }[] = [
  { title: 'Old Testament', questions: [
    { q: 'What did God put in the clouds after the flood?', choices: ['A rainbow', 'A moon', 'A kite'], answer: 'A rainbow', ref: 'Genesis 9:13', verse: 'GEN 9:13', evidence: 'rainbow in the clouds' },
    { q: 'Who was thrown into a den of lions?', choices: ['Daniel', 'Noah', 'Jonah'], answer: 'Daniel', ref: 'Daniel 6:16', verse: 'DAN 6:16', evidence: 'threw him into the den of lions' },
    { q: 'What did David use to beat Goliath?', choices: ['A sword', 'A sling and a stone', 'A bow'], answer: 'A sling and a stone', ref: '1 Samuel 17:50', verse: '1SA 17:50', evidence: 'sling and a stone' },
    { q: 'On which day did God rest?', choices: ['The first day', 'The third day', 'The seventh day'], answer: 'The seventh day', ref: 'Genesis 2:2', verse: 'GEN 2:2', evidence: 'seventh day' },
    { q: 'What did Moses stretch his hand over so the waters divided?', choices: ['The sea', 'A well', 'A bath'], answer: 'The sea', ref: 'Exodus 14:21', verse: 'EXO 14:21', evidence: 'stretched out his hand over the sea' },
  ] },
  { title: 'New Testament', questions: [
    { q: 'Where was baby Jesus laid?', choices: ['A manger', 'A boat', 'A tent'], answer: 'A manger', ref: 'Luke 2:7', verse: 'LUK 2:7', evidence: 'laid Him in a manger' },
    { q: 'What job did Peter and Andrew do?', choices: ['Shepherds', 'Fishermen', 'Builders'], answer: 'Fishermen', ref: 'Matthew 4:18', verse: 'MAT 4:18', evidence: 'they were fishermen' },
    { q: 'How many disciples did Jesus call to Him?', choices: ['Five', 'Twelve', 'Twenty'], answer: 'Twelve', ref: 'Matthew 10:1', verse: 'MAT 10:1', evidence: 'twelve disciples' },
    { q: 'At the wedding, Jesus turned water into what?', choices: ['Milk', 'Juice', 'Wine'], answer: 'Wine', ref: 'John 2:9', verse: 'JHN 2:9', evidence: 'turned into wine' },
    { q: 'How many loaves did the disciples have before Jesus fed the crowd?', choices: ['Two', 'Five', 'Ten'], answer: 'Five', ref: 'Matthew 14:17', verse: 'MAT 14:17', evidence: 'five loaves' },
  ] },
  { title: 'Bible people', questions: [
    { q: 'Who built an ark?', choices: ['Moses', 'Noah', 'Paul'], answer: 'Noah', ref: 'Genesis 6:14', verse: 'GEN 6:14', evidence: 'ark of gopher wood' },
    { q: 'Who was made queen?', choices: ['Esther', 'Ruth', 'Martha'], answer: 'Esther', ref: 'Esther 2:17', verse: 'EST 2:17', evidence: 'made her queen' },
    { q: 'Who was given a robe of many colours?', choices: ['David', 'Joseph', 'Peter'], answer: 'Joseph', ref: 'Genesis 37:3', verse: 'GEN 37:3', evidence: 'robe of many colors' },
    { q: 'Who spent three days inside a great fish?', choices: ['Jonah', 'Elijah', 'Thomas'], answer: 'Jonah', ref: 'Jonah 1:17', verse: 'JON 1:17', evidence: 'belly of the fish' },
    { q: 'Which king was famous for his wisdom?', choices: ['Solomon', 'Pharaoh', 'Herod'], answer: 'Solomon', ref: '1 Kings 4:30', verse: '1KI 4:30', evidence: 'Solomon’s wisdom was greater' },
  ] },
]
export type QuizNight = { teams: Teams; round: number; at: number; shown: boolean; awarded: number[] }
export const newQuizNight = (names: string[]): QuizNight => {
  if (names.length < 2 || names.length > 4) throw new Error('2 to 4 teams')
  return { teams: { names, scores: names.map(() => 0), turn: 0 }, round: 0, at: 0, shown: false, awarded: [] }
}
export const quizQuestion = (n: QuizNight) => QUIZ[n.round]?.questions[n.at]
export const showAnswer = (n: QuizNight): QuizNight => ({ ...n, shown: true })
/** Toggle a point for a team on the current question (any number of teams can get it). */
export function award(n: QuizNight, team: number): QuizNight {
  const has = n.awarded.includes(team), scores = [...n.teams.scores]; scores[team] += has ? -1 : 1
  return { ...n, awarded: has ? n.awarded.filter(t => t !== team) : [...n.awarded, team], teams: { ...n.teams, scores } }
}
export function nextQuestion(n: QuizNight): QuizNight {
  const last = n.at + 1 >= QUIZ[n.round].questions.length
  return { ...n, round: last ? n.round + 1 : n.round, at: last ? 0 : n.at + 1, shown: false, awarded: [] }
}
export const quizNightDone = (n: QuizNight) => n.round >= QUIZ.length
export const leaders = (t: Teams) => { const top = Math.max(...t.scores); return t.names.filter((_, i) => t.scores[i] === top) }

/* ---------- Shared race-board players ---------- */
export type Racer = { name: string; pos: number }
export type Race = { players: Racer[]; turn: number; last: number | null; note: string; winner: number | null }
export const newRace = (names: string[], start = 1): Race => {
  if (names.length < 2 || names.length > 4) throw new Error('2 to 4 players')
  return { players: names.map(name => ({ name, pos: start })), turn: 0, last: null, note: '', winner: null }
}

/* ---------- Pilgrim's Way: snakes and ladders after The Pilgrim's Progress (Bunyan, 1678) ---------- */
/** `story` is a short retelling from The Pilgrim's Progress (not Scripture). `text` is a BSB quote, checked in tests. */
export type Jump = { from: number; to: number; name: string; story: string; text: string } & Checked
export const LANDMARKS: { square: number; name: string }[] = [
  { square: 1, name: 'City of Destruction' }, { square: 8, name: 'Slough of Despond' }, { square: 14, name: 'Wicket Gate' },
  { square: 27, name: 'Interpreter\u2019s House' }, { square: 30, name: 'The Cross' }, { square: 38, name: 'Hill Difficulty' },
  { square: 46, name: 'Palace Beautiful' }, { square: 52, name: 'Valley of Humiliation' }, { square: 60, name: 'Vanity Fair' },
  { square: 68, name: 'Doubting Castle' }, { square: 80, name: 'Delectable Mountains' }, { square: 88, name: 'Enchanted Ground' },
  { square: 96, name: 'The River' }, { square: 100, name: 'Celestial City' },
]
export const LADDERS: Jump[] = [
  { from: 9, to: 15, name: 'Help', story: 'A man called Help reaches out his hand and pulls Christian out of the bog.', text: 'He lifted me up from the pit of despair, out of the miry clay', ref: 'Psalm 40:2', verse: 'PSA 40:2', evidence: 'out of the miry clay' },
  { from: 14, to: 27, name: 'Goodwill opens the gate', story: 'Christian knocks at the Wicket Gate and Goodwill opens it and pulls him in.', text: 'Knock, and the door will be opened to you', ref: 'Matthew 7:7', verse: 'MAT 7:7', evidence: 'knock, and the door will be opened to you' },
  { from: 28, to: 33, name: 'The Interpreter\u2019s House', story: 'The Interpreter lights a candle and shows Christian pictures that help him on the way.', text: 'Your word is a lamp to my feet', ref: 'Psalm 119:105', verse: 'PSA 119:105', evidence: 'Your word is a lamp to my feet' },
  { from: 30, to: 50, name: 'The burden falls', story: 'At the Cross, Christian\u2019s heavy burden rolls off his back and is gone. He gets a scroll to keep.', text: 'Come to Me, all you who are weary and burdened, and I will give you rest', ref: 'Matthew 11:28', verse: 'MAT 11:28', evidence: 'weary and burdened, and I will give you rest' },
  { from: 69, to: 72, name: 'The Key of Promise', story: 'In Doubting Castle, Christian remembers a key called Promise. It opens every door, and out they go!', text: 'Never will I leave you, never will I forsake you', ref: 'Hebrews 13:5', verse: 'HEB 13:5', evidence: 'Never will I leave you, never will I forsake you' },
  { from: 80, to: 99, name: 'The Shepherds', story: 'Kind shepherds on the Delectable Mountains show the pilgrims the gate of the Celestial City far away.', text: 'The LORD is my shepherd; I shall not want', ref: 'Psalm 23:1', verse: 'PSA 23:1', evidence: 'The LORD is my shepherd' },
]
export const SNAKES: Jump[] = [
  { from: 12, to: 8, name: 'The Slough of Despond', story: 'Christian slips into a muddy bog and his burden makes him sink. Squelch!', text: 'I have sunk into the miry depths', ref: 'Psalm 69:2', verse: 'PSA 69:2', evidence: 'I have sunk into the miry depths' },
  { from: 19, to: 4, name: 'Mr Worldly Wiseman\u2019s shortcut', story: 'Mr Worldly Wiseman sends Christian the wrong way, round the steep side of Mount Sinai.', text: 'Lean not on your own understanding', ref: 'Proverbs 3:5', verse: 'PRO 3:5', evidence: 'lean not on your own understanding' },
  { from: 43, to: 38, name: 'Asleep in the arbour', story: 'Halfway up the Hill Difficulty, Christian naps in a shady arbour and drops his scroll. Back he goes to find it.', text: 'A little sleep, a little slumber', ref: 'Proverbs 6:10', verse: 'PRO 6:10', evidence: 'A little sleep, a little slumber' },
  { from: 53, to: 41, name: 'Apollyon', story: 'A big shadowy winged shape blocks the Valley path. Christian holds up his shield and stands firm.', text: 'Take up the shield of faith', ref: 'Ephesians 6:16', verse: 'EPH 6:16', evidence: 'take up the shield of faith' },
  { from: 66, to: 47, name: 'Vanity Fair', story: 'A noisy fair where everyone shouts \u201cBuy, buy!\u201d The pilgrims will not stop to buy, and the crowd is cross.', text: 'Do not love the world or anything in the world', ref: '1 John 2:15', verse: '1JN 2:15', evidence: 'Do not love the world or anything in the world' },
  { from: 75, to: 68, name: 'Giant Despair', story: 'A grumpy giant locks the pilgrims in Doubting Castle because they wandered off the path.', text: 'Put your hope in God', ref: 'Psalm 42:5', verse: 'PSA 42:5', evidence: 'Put your hope in God' },
  { from: 88, to: 73, name: 'The Enchanted Ground', story: 'The air here makes the pilgrims very sleepy. They keep each other awake by talking.', text: 'Let us not sleep as the others do', ref: '1 Thessalonians 5:6', verse: '1TH 5:6', evidence: 'let us not sleep as the others do' },
]
/** Counters: things Christian carries in the story. */
export const TOKENS = [
  { id: 'burden', name: 'Burden' }, { id: 'scroll', name: 'Scroll' }, { id: 'key', name: 'Key of Promise' },
  { id: 'shield', name: 'Shield of faith' }, { id: 'staff', name: 'Pilgrim\u2019s staff' },
] as const
/** Move the current player. You need the exact number to land on 100; too high and you stay put. */
export function snakesMove(r: Race, roll: number): Race & { jump?: Jump | null } {
  if (r.winner !== null) return r
  let jump: Jump | null = null
  const players = r.players.map(p => ({ ...p })), me = players[r.turn]
  let note = ''
  if (me.pos + roll > 100) note = `${me.name} needs exactly ${100 - me.pos} to reach the end.`
  else {
    me.pos += roll
    const j = [...LADDERS, ...SNAKES].find(x => x.from === me.pos)
    if (j) { jump = j; const up = j.to > j.from; me.pos = j.to; note = `${up ? 'Help' : 'Danger'}: ${j.name}` }
  }
  const winner = me.pos === 100 ? r.turn : null
  return { players, turn: winner !== null || roll === 6 ? r.turn : (r.turn + 1) % players.length, last: roll, note, winner, jump }
}
/** Square number to grid position on a boustrophedon 10x10 board (1 at bottom left). */
export function squareXY(n: number) {
  const row = Math.floor((n - 1) / 10), col = (n - 1) % 10
  return { col: row % 2 === 0 ? col : 9 - col, row: 9 - row }
}

/* ---------- Journey board: out of Egypt ---------- */
export type Card = { space: number; title: string; text: string; move: number } & Checked
export const ROUTE_LENGTH = 30
export const JOURNEY_CARDS: Card[] = [
  { space: 3, title: 'Leaving Egypt', text: 'Pharaoh said, \u201cGet up, leave my people!\u201d Move on 2.', move: 2, ref: 'Exodus 12:31', verse: 'EXO 12:31', evidence: 'Get up, leave my people' },
  { space: 7, title: 'Through the sea', text: 'God made a dry path through the sea. Move on 2.', move: 2, ref: 'Exodus 14:21', verse: 'EXO 14:21', evidence: 'turned it into dry land' },
  { space: 10, title: 'Bitter water', text: 'God showed Moses how to make the water sweet. Move on 1.', move: 1, ref: 'Exodus 15:25', verse: 'EXO 15:25', evidence: 'they were sweetened' },
  { space: 13, title: 'Elim', text: 'Twelve springs and seventy palm trees. Have a rest here.', move: 0, ref: 'Exodus 15:27', verse: 'EXO 15:27', evidence: 'twelve springs of water and seventy palm trees' },
  { space: 16, title: 'Bread from heaven', text: '\u201cWhat is it?\u201d It was bread from God. Move on 2.', move: 2, ref: 'Exodus 16:15', verse: 'EXO 16:15', evidence: 'It is the bread that the LORD has given you' },
  { space: 19, title: 'Water from the rock', text: 'Moses struck the rock and water came out. Move on 1.', move: 1, ref: 'Exodus 17:6', verse: 'EXO 17:6', evidence: 'water will come out of it' },
  { space: 22, title: 'Mount Sinai', text: 'God called Moses up the mountain. Move on 1.', move: 1, ref: 'Exodus 19:20', verse: 'EXO 19:20', evidence: 'top of Mount Sinai' },
  { space: 24, title: 'Grumbling', text: 'The people complained. Go back 2.', move: -2, ref: 'Numbers 11:1', verse: 'NUM 11:1', evidence: 'began to complain' },
  { space: 27, title: 'Giant grapes', text: 'The spies carried grapes on a pole between two men. Move on 1.', move: 1, ref: 'Numbers 13:23', verse: 'NUM 13:23', evidence: 'carried on a pole between two men' },
  { space: 30, title: 'Across the Jordan', text: 'Everyone crossed on dry ground into the promised land!', move: 0, ref: 'Joshua 3:17', verse: 'JOS 3:17', evidence: 'crossed over the dry ground' },
]
export function journeyMove(r: Race, roll: number): Race & { card: Card | null } {
  if (r.winner !== null) return { ...r, card: null }
  const players = r.players.map(p => ({ ...p })), me = players[r.turn]
  me.pos = Math.min(ROUTE_LENGTH, me.pos + roll)
  let card = JOURNEY_CARDS.find(c => c.space === me.pos) ?? null
  if (card && card.move) { me.pos = Math.max(1, Math.min(ROUTE_LENGTH, me.pos + card.move)) }
  const winner = me.pos === ROUTE_LENGTH ? r.turn : null
  if (winner !== null && !card) card = JOURNEY_CARDS[JOURNEY_CARDS.length - 1]
  return { players, turn: winner !== null ? r.turn : (r.turn + 1) % players.length, last: roll, note: card ? `${card.title}: ${card.text} (${card.ref})` : '', winner, card }
}

/* ---------- Ark rescue (cooperative) ---------- */
export const ANIMALS = ['Lions', 'Elephants', 'Giraffes', 'Sheep', 'Camels', 'Rabbits', 'Bears', 'Zebras']
export const RAIN_MAX = 6
export const ARK_VERSE: Checked = { ref: 'Genesis 7:9', verse: 'GEN 7:9', evidence: 'came to Noah to enter the ark, two by two' }
export type Ark = { players: string[]; turn: number; loaded: number; rain: number; last: number | null; result: 'playing' | 'won' | 'again' }
export const newArk = (players: string[]): Ark => ({ players, turn: 0, loaded: 0, rain: 0, last: null, result: 'playing' })
/** 1 = a rain cloud. 2-5 = one pair goes in. 6 = two pairs go in. */
export function arkRoll(a: Ark, roll: number): Ark {
  if (a.result !== 'playing') return a
  const loaded = Math.min(ANIMALS.length, a.loaded + (roll === 1 ? 0 : roll === 6 ? 2 : 1))
  const rain = a.rain + (roll === 1 ? 1 : 0)
  const result = loaded === ANIMALS.length ? 'won' : rain >= RAIN_MAX ? 'again' : 'playing'
  return { ...a, loaded, rain, last: roll, result, turn: (a.turn + 1) % a.players.length }
}

/* ---------- Top Trumps: stories we love ---------- */
export const TRAITS = ['faith', 'courage', 'kindness', 'wisdom'] as const
export type Trait = typeof TRAITS[number]
export type Scores = Record<Trait, number>
export const STATS: Record<string, Scores> = {
  noah: { faith: 9, courage: 7, kindness: 6, wisdom: 7 }, abraham: { faith: 10, courage: 7, kindness: 7, wisdom: 7 },
  sarah: { faith: 7, courage: 6, kindness: 6, wisdom: 6 }, joseph: { faith: 8, courage: 7, kindness: 9, wisdom: 9 },
  moses: { faith: 9, courage: 9, kindness: 7, wisdom: 8 }, miriam: { faith: 7, courage: 8, kindness: 7, wisdom: 6 },
  deborah: { faith: 8, courage: 9, kindness: 6, wisdom: 9 }, ruth: { faith: 8, courage: 7, kindness: 10, wisdom: 6 },
  hannah: { faith: 10, courage: 6, kindness: 8, wisdom: 6 }, david: { faith: 9, courage: 10, kindness: 7, wisdom: 7 },
  solomon: { faith: 6, courage: 5, kindness: 6, wisdom: 10 }, elijah: { faith: 10, courage: 9, kindness: 6, wisdom: 7 },
  esther: { faith: 8, courage: 10, kindness: 8, wisdom: 8 }, daniel: { faith: 10, courage: 9, kindness: 7, wisdom: 9 },
  jonah: { faith: 5, courage: 5, kindness: 4, wisdom: 5 }, mary: { faith: 10, courage: 8, kindness: 9, wisdom: 8 },
  'john-baptist': { faith: 9, courage: 9, kindness: 7, wisdom: 7 }, peter: { faith: 7, courage: 8, kindness: 7, wisdom: 6 },
  matthew: { faith: 7, courage: 6, kindness: 7, wisdom: 7 }, zacchaeus: { faith: 6, courage: 6, kindness: 9, wisdom: 6 },
  martha: { faith: 8, courage: 5, kindness: 9, wisdom: 6 }, 'mary-magdalene': { faith: 9, courage: 8, kindness: 8, wisdom: 6 },
  paul: { faith: 10, courage: 10, kindness: 7, wisdom: 9 }, thomas: { faith: 6, courage: 7, kindness: 6, wisdom: 6 },
}
export type Trumps = { hands: [string[], string[]]; turn: 0 | 1; pot: string[]; last: { trait: Trait; a: string; b: string; winner: 0 | 1 | null } | null; rounds: number }
export function newTrumps(figures: Figure[], rng: Rng = Math.random): Trumps {
  const d = shuffle(figures.map(f => f.id), rng)
  return { hands: [d.filter((_, i) => i % 2 === 0), d.filter((_, i) => i % 2 === 1)], turn: 0, pot: [], last: null, rounds: 0 }
}
/** Both top cards are compared on the chosen trait; the higher one takes both (plus any tied cards waiting in the middle). */
export function playTrait(t: Trumps, trait: Trait): Trumps {
  const [h0, h1] = t.hands
  if (!h0.length || !h1.length) return t
  const a = h0[0], b = h1[0], sa = STATS[a][trait], sb = STATS[b][trait]
  const winner: 0 | 1 | null = sa > sb ? 0 : sb > sa ? 1 : null
  const rest: [string[], string[]] = [h0.slice(1), h1.slice(1)]
  let pot = [...t.pot, a, b]
  if (winner !== null) { rest[winner] = [...rest[winner], ...pot]; pot = [] }
  return { hands: rest, turn: winner ?? t.turn, pot, last: { trait, a, b, winner }, rounds: t.rounds + 1 }
}
export const computerTrait = (id: string): Trait => TRAITS.reduce((best, k) => STATS[id][k] > STATS[id][best] ? k : best, TRAITS[0])
export const trumpsWinner = (t: Trumps, maxRounds = 12): 0 | 1 | 'draw' | null => {
  if (!t.hands[1].length) return 0; if (!t.hands[0].length) return 1
  if (t.rounds < maxRounds) return null
  return t.hands[0].length > t.hands[1].length ? 0 : t.hands[1].length > t.hands[0].length ? 1 : 'draw'
}
