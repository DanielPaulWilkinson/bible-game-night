export type Figure = {
  id: string; name: string; gender: 'man' | 'woman'; testament: 'old' | 'new'
  roles: string[]; fact: string; ref: string; image: string | null
}
export type Game = { secretId: string; down: string[] }

export function pickSecret(figures: Figure[], rng: () => number = Math.random, avoid?: string): string {
  if (figures.length === 0) throw new Error('No figures to choose from')
  const pool = figures.length > 1 && avoid ? figures.filter(f => f.id !== avoid) : figures
  const i = Math.min(pool.length - 1, Math.floor(rng() * pool.length))
  return pool[i].id
}

/** A fresh game: every card up, a new secret person (never the same one twice in a row). */
export function newGame(figures: Figure[], rng: () => number = Math.random, previous?: Game): Game {
  return { secretId: pickSecret(figures, rng, previous?.secretId), down: [] }
}

export function toggle(game: Game, id: string): Game {
  const down = game.down.includes(id) ? game.down.filter(d => d !== id) : [...game.down, id]
  return { ...game, down }
}

export const isDown = (game: Game, id: string) => game.down.includes(id)
export const stillUp = (game: Game, figures: Figure[]) => figures.filter(f => !game.down.includes(f.id)).length

export function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

/* ---------- Pass the device: two players on one device ---------- */
export type Player = { name: string; game: Game; secretShown: boolean }
export type Match = { players: [Player, Player]; turn: 0 | 1; covered: boolean; winner: 0 | 1 | null; lastGuess: { by: 0 | 1; id: string; right: boolean } | null }

export function newMatch(figures: Figure[], names: [string, string] = ['', ''], rng: () => number = Math.random): Match {
  const clean = (n: string, i: number) => n.trim() || `Player ${i + 1}`
  const p = (i: number): Player => ({ name: clean(names[i], i), game: newGame(figures, rng), secretShown: false })
  return { players: [p(0), p(1)], turn: 0, covered: true, winner: null, lastGuess: null }
}
const other = (i: 0 | 1): 0 | 1 => (i === 0 ? 1 : 0)
function updatePlayer(m: Match, i: 0 | 1, f: (p: Player) => Player): Match {
  const players = [...m.players] as [Player, Player]; players[i] = f(players[i]); return { ...m, players }
}
/** Flip a card on the current player's own board only. */
export const flipFor = (m: Match, id: string): Match => updatePlayer(m, m.turn, p => ({ ...p, game: toggle(p.game, id) }))
export const toggleSecretShown = (m: Match): Match => updatePlayer(m, m.turn, p => ({ ...p, secretShown: !p.secretShown }))
/** End the turn: hide everything and hand over to the other player. */
export function endTurn(m: Match): Match {
  const hidden = updatePlayer(m, m.turn, p => ({ ...p, secretShown: false }))
  return { ...hidden, turn: other(m.turn), covered: true, lastGuess: null }
}
export const reveal = (m: Match): Match => ({ ...m, covered: false })
/** The current player guesses the opponent's secret person. A wrong guess ends their turn. */
export function guess(m: Match, id: string): Match {
  const right = m.players[other(m.turn)].game.secretId === id
  const g = { by: m.turn, id, right }
  if (right) return { ...m, winner: m.turn, lastGuess: g }
  return { ...endTurn(m), lastGuess: g }
}
