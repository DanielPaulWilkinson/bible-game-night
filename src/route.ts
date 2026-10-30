/** Hash routing: '' is the menu, known ids are games, old links are redirected, anything else is missing. */
export const ALIASES: Record<string, string> = { scores: 'gamenight', score: 'gamenight', home: '', menu: '' }
export type Resolved = { kind: 'menu' } | { kind: 'game'; id: string } | { kind: 'redirect'; to: string } | { kind: 'missing'; id: string }
export const resolve = (hash: string, known: (id: string) => boolean): Resolved => {
  const k = decodeURIComponent(hash.replace(/^#\/?/, '').split(/[/?]/)[0] ?? '').trim()
  if (!k) return { kind: 'menu' }
  if (known(k)) return { kind: 'game', id: k }
  if (k.toLowerCase() in ALIASES) return { kind: 'redirect', to: ALIASES[k.toLowerCase()] }
  return { kind: 'missing', id: k }
}
