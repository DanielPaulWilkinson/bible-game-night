import { shuffle, type Rng } from './games'
import { PROMPTS, type Prompt } from './games2'
import { STORY_PROMPTS, type StoryPrompt } from './charades-data'
export { STORY_PROMPTS }
export type Tier = 'little' | 'grown'
export type Card = { word: string; little?: Prompt; story?: StoryPrompt }
/** Little ones act a picture (Sweet Publishing figures and scenes; no pictures of Jesus). Grown-ups act a story moment. */
export const charadesDeck = (tier: Tier, rng: Rng = Math.random): Card[] =>
  tier === 'little' ? shuffle(PROMPTS, rng).map(p => ({ word: p.word, little: p })) : shuffle(STORY_PROMPTS, rng).map(s => ({ word: s.word, story: s }))
export type Deck = { cards: Card[]; at: number }
export const draw = (d: Deck): [Card, Deck] => [d.cards[d.at % d.cards.length], { ...d, at: d.at + 1 }]
/** Team names for 2 to 4 teams; when hosting, each family is a team. */
export const teamNames = (n: number, hosting = false) =>
  Array.from({ length: Math.max(2, Math.min(4, n)) }, (_, i) => hosting ? `Family ${i + 1}` : ['Team Sun', 'Team Star', 'Team Sea', 'Team Hill'][i])
