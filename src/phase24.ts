/** Phases 2 to 4: table and word games, active prompt decks, worship and catechism rounds. */
import { shuffle, type Rng } from './games'
import { TABOO, FILL, SKETCH, SCENES, PSALMS, THANKS_VERSES } from './phase24-data'
export { TABOO, FILL, SKETCH, SCENES, PSALMS, THANKS_VERSES }

/* ---------- Bible Alphabet: a letter and a category; the table judges ---------- */
export const ALPHA_CATEGORIES = ['A person in the Bible', 'A place in the Bible', 'An animal in a Bible story', 'Something you could eat in the Bible', 'A book of the Bible', 'Something Jesus made or mended']
export const ALPHA_LETTERS = 'ABCDEGHJLMNPRSTZ'.split('')   // letters with plenty of Bible answers
export const alphabetDeck = (rng: Rng = Math.random) =>
  shuffle(ALPHA_LETTERS, rng).map((l, i) => ({ word: `${ALPHA_CATEGORIES[i % ALPHA_CATEGORIES.length]} beginning with ${l}`, letter: l }))

/* ---------- Simon Peter Says ---------- */
export const MOVES = ['march round the walls of Jericho', 'row the disciples’ boat', 'flap like a raven', 'stand as tall as Goliath', 'crouch as small as Zacchaeus', 'wave palm branches', 'tiptoe like a sneaky fox', 'hop like a frog in Egypt', 'stretch your arms like a rainbow', 'baa like a lost sheep', 'swim like Jonah’s great fish', 'roar like a lion, then freeze']
export type Call = { text: string; says: boolean }
/** Roughly one in four calls is a trick without "Simon Peter says". Little ones play with no one out. */
export const simonDeck = (rng: Rng = Math.random): Call[] =>
  shuffle(MOVES, rng).map(m => { const says = rng() >= 0.25; return { text: (says ? 'Simon Peter says: ' : '') + m[0].toUpperCase() + m.slice(1), says } })

/* ---------- Catechism drill (Westminster Shorter Catechism, 1647, public domain) ---------- */
export type QA = { q: string; a: string; source: string; needsReview: true }
const wsc = (n: number, q: string, a: string): QA => ({ q, a, source: `Westminster Shorter Catechism, question ${n} (1647)`, needsReview: true })
export const CATECHISM: QA[] = [
  wsc(1, 'What is the chief end of man?', 'Man’s chief end is to glorify God, and to enjoy him for ever.'),
  wsc(2, 'What rule hath God given to direct us how we may glorify and enjoy him?', 'The Word of God, which is contained in the scriptures of the Old and New Testaments, is the only rule to direct us how we may glorify and enjoy him.'),
  wsc(3, 'What do the scriptures principally teach?', 'The scriptures principally teach what man is to believe concerning God, and what duty God requires of man.'),
  wsc(4, 'What is God?', 'God is a Spirit, infinite, eternal, and unchangeable, in his being, wisdom, power, holiness, justice, goodness, and truth.'),
  wsc(5, 'Are there more Gods than one?', 'There is but one only, the living and true God.'),
  wsc(6, 'How many persons are there in the Godhead?', 'There are three persons in the Godhead; the Father, the Son, and the Holy Ghost; and these three are one God, the same in substance, equal in power and glory.'),
  wsc(14, 'What is sin?', 'Sin is any want of conformity unto, or transgression of, the law of God.'),
  wsc(86, 'What is faith in Jesus Christ?', 'Faith in Jesus Christ is a saving grace, whereby we receive and rest upon him alone for salvation, as he is offered to us in the gospel.'),
  wsc(98, 'What is prayer?', 'Prayer is an offering up of our desires unto God, for things agreeable to his will, in the name of Christ, with confession of our sins, and thankful acknowledgment of his mercies.'),
]

/* ---------- Finish the line: BSB psalms plus hymns long in the public domain ---------- */
export type Line = { start: string; end: string; source: string; needsReview?: boolean }
const hymn = (start: string, end: string, source: string): Line => ({ start, end, source, needsReview: true })
export const HYMNS: Line[] = [
  hymn('Amazing grace! (how sweet the sound)', 'That saved a wretch like me!', 'John Newton, 1779'),
  hymn('I once was lost, but now am found,', 'Was blind, but now I see.', 'John Newton, 1779'),
  hymn('Praise God, from whom all blessings flow;', 'Praise him, all creatures here below;', 'Thomas Ken, 1674'),
  hymn('All things bright and beautiful,', 'All creatures great and small,', 'Cecil Frances Alexander, 1848'),
  hymn('All things wise and wonderful,', 'The Lord God made them all.', 'Cecil Frances Alexander, 1848'),
  hymn('Joy to the world! the Lord is come;', 'Let earth receive her King', 'Isaac Watts, 1719'),
  hymn('Holy, holy, holy! Lord God Almighty!', 'Early in the morning our song shall rise to thee', 'Reginald Heber, 1826'),
  hymn('Rock of Ages, cleft for me,', 'Let me hide myself in thee', 'Augustus Toplady, 1776'),
  hymn('When I survey the wondrous cross', 'On which the Prince of glory died', 'Isaac Watts, 1707'),
]
export const finishDeck = (rng: Rng = Math.random): Line[] =>
  shuffle([...PSALMS.map(p => ({ start: p.start, end: p.text.slice(p.start.length).trim(), source: `${p.ref}, Berean Standard Bible`, needsReview: true })), ...HYMNS], rng)

/* ---------- Thankful Together: quiet, cooperative, never scored ---------- */
export const THANKS_PROMPTS = [
  'Say one thing from today you are thankful for.', 'Thank God for someone sitting next to you, and say why.', 'Name something in creation that made you smile this week.',
  'Who would you like us to pray for this week?', 'Is there something worrying you that we can pray about together?', 'Say thank you for a meal, a home, or a friend.',
  'Name someone who helped you this week. Let’s thank God for them.', 'Is there anyone who is ill or sad that we can pray for?',
]

/* ---------- Shared round logic ---------- */
/** A fixed-length session: each team gets `rounds` turns, then the game ends. */
export const sessionOver = (turnsTaken: number, teams: number, rounds: number) => turnsTaken >= teams * rounds
/** Fill the verse: replace the first whole-word match with a blank. */
export function blankOut(text: string, word: string): string {
  const re = new RegExp(`(^|[^\\p{L}])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'u')
  return text.replace(re, (_m, pre) => `${pre}_____`)
}
/** The celebration: who won, or a shared finish. Prayer and worship rounds never name a winner. */
export type Finish = { kind: 'win' | 'tie' | 'together' | 'gentle'; names: string[] }
export function finish(players: string[], scores: number[], mode: 'compete' | 'coop' | 'worship'): Finish {
  if (mode === 'worship') return { kind: 'gentle', names: [] }
  if (mode === 'coop' || players.length < 2) return { kind: 'together', names: [] }
  const top = Math.max(...scores), names = players.filter((_, i) => scores[i] === top)
  return { kind: names.length > 1 ? 'tie' : 'win', names }
}
export const finishHeadline = (f: Finish) =>
  f.kind === 'win' ? `${f.names[0]} wins!` : f.kind === 'tie' ? `${f.names.join(' and ')} share the win!` : f.kind === 'together' ? 'You did it together!' : 'Well done together'
