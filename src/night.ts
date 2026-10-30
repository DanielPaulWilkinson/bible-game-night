/** Tonight's lineup from the menu's "Play now". Kept in sessionStorage so it survives route changes. */
export type Lineup = { ids: string[]; at: number }
const KEY = 'bgn-lineup'
export const BLESS = 'blessing'
export const stops = (l: Lineup) => [...l.ids, BLESS]
export const current = (l: Lineup) => stops(l)[l.at] ?? null
export const following = (l: Lineup, n = 1) => stops(l)[l.at + n] ?? null
export const advance = (l: Lineup, n = 1): Lineup => ({ ...l, at: Math.min(l.at + n, l.ids.length) })
export const inLineup = (l: Lineup | null, route: string) => !!l && current(l) === route
export const atBlessing = (l: Lineup) => l.at >= l.ids.length
export const loadNight = (): Lineup | null => { try { const v = JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); return v && Array.isArray(v.ids) && typeof v.at === 'number' ? v : null } catch { return null } }
export const saveNight = (l: Lineup | null) => { try { l ? sessionStorage.setItem(KEY, JSON.stringify(l)) : sessionStorage.removeItem(KEY) } catch { /* private mode */ } }
export const startNight = (ids: string[]) => { const l = { ids, at: 0 }; saveNight(l); return l }
