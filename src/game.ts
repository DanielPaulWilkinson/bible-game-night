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
