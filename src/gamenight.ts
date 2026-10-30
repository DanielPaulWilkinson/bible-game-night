import type { Checked } from './games2'
/** Game Night: three short rounds in 15 minutes, the last worth double, then a blessing. */
export type Round = { id: 'little' | 'real' | 'story'; title: string; how: string; minutes: number; mult: number }
export const GAME_NIGHT: Round[] = [
  { id: 'little', title: 'Picture Charades', how: 'Act the picture. No talking.', minutes: 5, mult: 1 },
  { id: 'real', title: 'Which one is real?', how: 'Read the word, then everyone points at the answer they think is real.', minutes: 5, mult: 1 },
  { id: 'story', title: 'Story Charades', how: 'Act a whole Bible moment. Double points!', minutes: 5, mult: 2 },
]
export const totalMinutes = (r: Round[] = GAME_NIGHT) => r.reduce((n, x) => n + x.minutes, 0)
export type Night = { at: number; scores: number[]; names: string[] }
export const newNight = (names: string[]): Night => ({ at: 0, scores: names.map(() => 0), names })
export const addPoints = (n: Night, who: number, pts: number): Night => { const s = [...n.scores]; s[who] += pts * GAME_NIGHT[Math.min(n.at, GAME_NIGHT.length - 1)].mult; return { ...n, scores: s } }
export const nextRound = (n: Night): Night => ({ ...n, at: n.at + 1 })
export const nightOver = (n: Night) => n.at >= GAME_NIGHT.length
export const BLESSING: (Checked & { text: string })[] = [
  { ref: 'Numbers 6:24', verse: 'NUM 6:24', evidence: 'bless you and keep you', text: '‘May the LORD bless you and keep you;' },
  { ref: 'Numbers 6:25', verse: 'NUM 6:25', evidence: 'cause His face to shine upon you', text: 'may the LORD cause His face to shine upon you and be gracious to you;' },
  { ref: 'Numbers 6:26', verse: 'NUM 6:26', evidence: 'give you peace', text: 'may the LORD lift up His countenance toward you and give you peace.’' },
]
