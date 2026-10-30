import { readFileSync, existsSync } from 'node:fs'
export const BSB = new Map(readFileSync('tests/bsb-fixture.txt', 'utf8').trim().split('\n').map((l: string) => l.split('\t') as [string, string]))
export const norm = (s: string) => s.toLowerCase().replace(/[\u2018\u2019']/g, "'").replace(/[\u201c\u201d".,;:?!]/g, '').replace(/\s+/g, ' ').trim()
export const inVerse = (code: string, phrase: string) => { const v = BSB.get(code); return !!v && norm(v).includes(norm(phrase)) }
/** Compare the fixture with the full BSB text from bible-companion, when that folder is present. */
export function checkFixtureAgainstFull(): number {
  const dir = '../bible-companion/public/data/tr/BSB'
  if (!existsSync(dir)) return 0
  let n = 0
  for (const [code, text] of BSB) {
    const [bk, cv] = code.split(' '), [c, v] = cv.split(':').map(Number)
    const book = JSON.parse(readFileSync(`${dir}/${bk}.json`, 'utf8'))
    if (book[c - 1][v - 1] !== text) throw new Error(`${code} differs`)
    n++
  }
  return n
}
