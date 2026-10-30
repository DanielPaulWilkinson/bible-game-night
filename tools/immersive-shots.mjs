import { createRequire } from 'module'; const puppeteer = createRequire('/workspace/cp-tools/x.js')('puppeteer-core')
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const p = await b.newPage(); const errs = []
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()))
const wait = ms => new Promise(r => setTimeout(r, ms))
const click = async (text) => { const bs = await p.$$('button'); for (const x of bs) if ((await x.evaluate(e => e.textContent.trim())).startsWith(text)) return x.click(); throw new Error('no ' + text) }
async function shot(w, h, hash, name, act, full = true) {
  await p.setViewport({ width: w, height: h, deviceScaleFactor: w < 600 ? 2 : 1, isMobile: w < 600, hasTouch: w < 600 })
  await p.goto('about:blank'); await p.goto('http://localhost:4193/' + hash, { waitUntil: 'networkidle0' })
  const clip = act ? await act() : null; await wait(700)
  await p.screenshot({ path: `preview/immersive/${name}.png`, fullPage: full && !clip, ...(clip ? { clip } : {}) })
}
const rolls = async n => { for (let i = 0; i < n; i++) { await (await p.$$('aside button'))[0].click(); await wait(120); const c = await p.$('[role=dialog] button'); if (c) await c.click() } }
const go = async () => { await click('Add pilgrim'); await click('Add pilgrim'); await click('Start'); const r = await p.$$('[role=radio]'); await r[6].click(); await r[12].click(); await r[18].click(); await click('Set off') }
await shot(1280, 900, '', 'menu-logos')
await shot(1100, 700, '', 'logo-sheet', async () => { await p.evaluate(() => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;z-index:99;background:#F3E6C8;display:grid;grid-template-columns:repeat(5,1fr);gap:18px;padding:30px;font:18px Georgia;color:#2B2117;text-align:center'
  const names = ['Guess Who','Pairs','Who said it?','Story Order','Bingo','Journey Map','Charades','Real or Made Up?','Draw It','Quiz Night','Pilgrim’s Way','Out of Egypt','Ark Rescue','Top Trumps','Credits']
  ;[...document.querySelectorAll('main svg[viewBox="0 0 64 64"]')].forEach((s, i) => { const c = document.createElement('div'); const k = s.cloneNode(true); k.removeAttribute('class'); k.style.cssText = 'width:120px;height:120px'; c.append(k, document.createElement('br'), names[i]); d.append(c) }); document.body.append(d) }); return { x: 0, y: 0, width: 1100, height: 700 } })
await shot(1280, 900, '#/snakes', 'board-desktop', async () => { await go(); await rolls(14); return null })
await shot(390, 844, '#/snakes', 'board-phone', async () => { await go(); await rolls(10); return null })
await p.setViewport({ width: 1280, height: 900, deviceScaleFactor: 3 })
await p.goto('about:blank'); await p.goto('http://localhost:4193/#/snakes', { waitUntil: 'networkidle0' }); await go(); await wait(500)
await (await p.$('main svg[viewBox="0 0 600 600"]')).screenshot({ path: '/tmp/board3x.png' })
await p.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 })
await shot(1280, 900, '#/snakes', 'popup-place', async () => { await click('Start'); await click('Set off'); for (let i = 0; i < 60; i++) { if (await p.$('[role=dialog]')) break; await (await p.$$('aside button'))[0].click(); await wait(80) } await wait(800); return null })
await shot(1280, 900, '#/credits', 'credits')
console.log(errs.length ? errs : 'no errors'); await b.close()
