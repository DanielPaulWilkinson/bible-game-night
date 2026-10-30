import { createRequire } from 'module'; const puppeteer = createRequire('/workspace/cp-tools/x.js')('puppeteer-core')
import { mkdirSync } from 'fs'; mkdirSync('preview/phase1', { recursive: true })
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const p = await b.newPage(); const errs = []
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()))
const wait = ms => new Promise(r => setTimeout(r, ms))
const click = async (text) => { const bs = await p.$$('button, a, label'); for (const x of bs) if ((await x.evaluate(e => e.textContent.trim())).startsWith(text)) { await x.click(); await wait(200); return } throw new Error('no ' + text + ' in ' + JSON.stringify(await p.$$eval('button, a, label', es => es.map(e => e.textContent.trim())))) }
async function shot(w, h, hash, name, act, full = true) {
  await p.setViewport({ width: w, height: h, deviceScaleFactor: w < 600 ? 2 : 1, isMobile: w < 600, hasTouch: w < 600 })
  await p.goto('about:blank'); await p.goto('http://localhost:4193/' + hash, { waitUntil: 'networkidle0' })
  if (act) await act(); await wait(400)
  await p.screenshot({ path: `preview/phase1/${name}.png`, fullPage: full })
}
await shot(390, 844, '', 'menu-filters-phone', async () => { await click('Little ones'); await click('Get moving') }, false)
await shot(390, 844, '', 'menu-phone-top', null, false)
await shot(1280, 900, '', 'menu-filters', async () => { await click('Hosting') })
await shot(390, 844, '#/charades', 'charades-setup-phone')
await shot(390, 844, '#/charades', 'turn-screen-ready-phone', async () => { await click('Start') })
await shot(390, 844, '#/charades', 'charades-little-phone', async () => { await click('Start'); await click('Start the timer'); await click('Correct') })
await shot(390, 844, '#/charades', 'charades-grownups-phone', async () => { await click('Grown-ups'); await click('Start'); await click('Start the timer') })
await shot(390, 844, '#/charades', 'turn-screen-reveal-phone', async () => { await click('Grown-ups'); await click('Start'); await click('Start the timer'); await click('Correct'); await click('Skip'); await click('End turn') })
await shot(1280, 900, '#/charades', 'charades-teams-desktop', async () => { await click('Grown-ups'); await click('4'); await click('Hosting'); await click('Start'); await click('Start the timer') })
await shot(390, 844, '#/gamenight', 'game-night-phone', async () => { await click('Start Game Night'); })
await shot(390, 844, '#/gamenight', 'game-night-round2-phone', async () => { await click('Start Game Night'); await click('Next round'); const bs = await p.$$('section button'); await bs[0].click() })
await shot(390, 844, '#/gamenight', 'game-night-blessing-phone', async () => { await click('Start Game Night'); await click('Next round'); await click('Next round'); await click('Finish') })
const bal = async () => {
  await click('Start')
  const vote = async () => { for (const g of await p.$$('[role=radiogroup]')) { const r = await g.$$('button:not([disabled])'); await r[0].click() } await wait(100) }
  for (let i = 0; i < 20; i++) { try { await click('Start writing'); break } catch { await click('Show the choices'); await vote(); await click('Reveal'); await click('Next word') } }
  for (const t of ['A big stone hat', 'Small donkey', 'A kind of cake']) { if (await p.$('[role=radiogroup]')) break; const bs = await p.$$('section button'); await bs[0].click(); await wait(200); await p.type('#bluff', t); await click('Hide it') }
  for (const g of await p.$$('[role=radiogroup]')) { const r = await g.$$('button:not([disabled])'); await r[0].click() }
  await click('Reveal')
}
await shot(390, 844, '#/balderdash', 'balderdash-bluff-phone', async () => { await click('Start'); for (let i = 0; i < 20; i++) { try { await click('Start writing'); break } catch { await click('Show the choices'); for (const g of await p.$$('[role=radiogroup]')) { const r = await g.$$('button'); await r[0].click() } await click('Reveal'); await click('Next word') } } const bs = await p.$$('section button'); await bs[0].click(); await wait(200); await p.type('#bluff', 'A stone for sitting on') })
await shot(390, 844, '#/balderdash', 'balderdash-reveal-phone', async () => { try { await bal() } catch (e) { errs.push('flow: ' + e.message) } })
await shot(1280, 900, '#/balderdash', 'balderdash-reveal-desktop', async () => { try { await bal() } catch (e) { errs.push('flow: ' + e.message) } })
await shot(390, 844, '#/balderdash', 'balderdash-kids-phone', async () => { await click('Kids'); await click('Start'); await click('Show the choices') })
console.log(errs.length ? errs : 'no errors'); await b.close()
