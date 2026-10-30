export type Tags = {
  age: 'little' | 'all' | 'adults'; players: ('family' | 'hosting' | 'couples')[]
  energy: 'active' | 'table' | 'quiet'; style: 'coop' | 'teams' | 'competitive'; minutes: number; needs: ('phone' | 'props' | 'printable')[]
}
const t = (age: Tags['age'], players: Tags['players'], energy: Tags['energy'], style: Tags['style'], minutes: number, needs: Tags['needs'] = ['phone']): Tags => ({ age, players, energy, style, minutes, needs })
export const TAGS: Record<string, Tags> = {
  guess: t('all', ['family', 'couples'], 'table', 'competitive', 10),
  pairs: t('little', ['family'], 'quiet', 'competitive', 10),
  quotes: t('all', ['family', 'hosting', 'couples'], 'table', 'competitive', 10),
  order: t('little', ['family'], 'quiet', 'coop', 5),
  bingo: t('all', ['family', 'hosting'], 'table', 'competitive', 15, ['phone', 'printable']),
  map: t('all', ['family'], 'quiet', 'coop', 10),
  charades: t('all', ['family', 'hosting'], 'active', 'teams', 10),
  real: t('all', ['family', 'hosting'], 'table', 'competitive', 10),
  draw: t('all', ['family', 'hosting'], 'table', 'teams', 15, ['phone', 'props']),
  quiz: t('all', ['family', 'hosting'], 'table', 'teams', 25),
  balderdash: t('all', ['family', 'hosting', 'couples'], 'table', 'competitive', 20),
  jericho: t('little', ['family'], 'active', 'coop', 5),
  freeze: t('little', ['family', 'hosting'], 'active', 'competitive', 5),
  feed: t('little', ['family'], 'active', 'coop', 5),
  noah: t('little', ['family', 'hosting'], 'active', 'teams', 10),
  sheep: t('little', ['family'], 'active', 'coop', 10, ['phone', 'props']),
  timeline: t('all', ['family'], 'quiet', 'coop', 10),
  verse: t('all', ['family', 'couples'], 'quiet', 'coop', 5),
  world: t('all', ['family', 'couples'], 'quiet', 'competitive', 10),
  whoami: t('all', ['family', 'hosting', 'couples'], 'table', 'competitive', 15),
  passport: t('all', ['family'], 'quiet', 'coop', 20),
  snakes: t('all', ['family'], 'table', 'competitive', 20),
  exodus: t('all', ['family'], 'table', 'competitive', 20),
  ark: t('little', ['family'], 'table', 'coop', 15),
  trumps: t('all', ['family', 'couples'], 'table', 'competitive', 15),
}
export type Filter = { age?: Tags['age']; players?: Tags['players'][number]; energy?: Tags['energy']; style?: Tags['style']; short?: boolean }
const ageOk = (a: Tags['age'], want?: Tags['age']) => !want || (want === 'little' ? a !== 'adults' : want === 'adults' ? a !== 'little' : a === 'all')
export const matches = (tg: Tags, f: Filter) => ageOk(tg.age, f.age)
  && (!f.players || tg.players.includes(f.players)) && (!f.energy || tg.energy === f.energy) && (!f.style || tg.style === f.style) && (!f.short || tg.minutes <= 10)
export const FILTERS = {
  age: [['little', 'Little ones'], ['all', 'All ages'], ['adults', 'Grown-ups']],
  players: [['family', 'Just us'], ['hosting', 'Hosting'], ['couples', 'Couples']],
  energy: [['active', 'Get moving'], ['table', 'At the table'], ['quiet', 'Quiet']],
  style: [['coop', 'Together'], ['teams', 'Teams'], ['competitive', 'Head to head']],
} as const
