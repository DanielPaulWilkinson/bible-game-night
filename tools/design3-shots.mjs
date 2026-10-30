import { createRequire } from 'module'; const puppeteer = createRequire('/workspace/cp-tools/x.js')('puppeteer-core')
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const p = await b.newPage(); const errs = []
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()))
const wait = ms => new Promise(r => setTimeout(r, ms))
const click = async (text) => { const bs = await p.$$('button'); for (const x of bs) if ((await x.evaluate(e => e.textContent.trim())).startsWith(text)) return x.click(); throw new Error('no ' + text) }
async function shot(w, h, hash, name, act) {
  await p.setViewport({ width: w, height: h, deviceScaleFactor: w < 600 ? 2 : 1, isMobile: w < 600, hasTouch: w < 600 })
  await p.goto('about:blank'); await p.goto('http://localhost:4193/' + hash, { waitUntil: 'networkidle0' })
  if (act) await act(); await wait(400)
  await p.screenshot({ path: `preview/design3/${name}.png`, fullPage: true })
}
const many = async (t, n) => { for (let i = 0; i < n; i++) { await click(t); await wait(60) } }
const pil = async (n = 9) => { await click('Add pilgrim'); await click('Start'); await click('Set off'); for (let i = 0; i < n; i++) { const b = (await p.$$('aside button'))[0]; await b.click(); await wait(80); const c = await p.$('[role=dialog] button'); if (c) await c.click() } }
await shot(1280, 900, '', 'after-menu')
await shot(390, 844, '', 'after-menu-phone')
await shot(1280, 800, '#/quiz', 'after-quiz-night-tv', async () => { await click('Add team'); await click('Start'); await click('Show the answer'); await click('Lambs'); await click('Doves') })
await shot(1280, 900, '#/charades', 'after-charades', async () => { await click('Start'); await click('Show me'); await wait(200); await click('Got it'); await click('Pass') })
await shot(1280, 900, '#/snakes', 'pilgrim-counter-picker', async () => { await click('Add pilgrim'); await click('Start'); const r = await p.$$('[role=radio]'); await r[7].click() })
await shot(1280, 900, '#/snakes', 'after-pilgrims-way', async () => { await pil(10) })
await shot(390, 844, '#/snakes', 'after-pilgrims-way-phone', async () => { await click('Start'); await click('Set off'); for (let i = 0; i < 4; i++) { await (await p.$$('aside button'))[0].click(); await wait(80); const c = await p.$('[role=dialog] button'); if (c) await c.click() } })
await shot(1280, 900, '#/snakes', 'pilgrim-popup', async () => { await click('Start'); await click('Set off'); for (let i = 0; i < 40; i++) { if (await p.$('[role=dialog]')) break; await (await p.$$('aside button'))[0].click(); await wait(80) } })
await shot(390, 844, '#/snakes', 'pilgrim-popup-phone', async () => { await click('Start'); await click('Set off'); for (let i = 0; i < 40; i++) { if (await p.$('[role=dialog]')) break; await (await p.$$('aside button'))[0].click(); await wait(80) } })
console.log(errs.length ? errs : 'no errors'); await b.close()
