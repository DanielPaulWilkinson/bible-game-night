import { createRequire } from 'module'; const puppeteer = createRequire('/workspace/cp-tools/x.js')('puppeteer-core')
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const p = await b.newPage()
const click = async (text) => { const bs = await p.$$('button'); for (const x of bs) if ((await x.evaluate(e => e.textContent.trim())) === text) return x.click(); throw new Error('no ' + text) }
async function shot(w, h, name, act, full = true) {
  await p.setViewport({ width: w, height: h, deviceScaleFactor: w < 600 ? 2 : 1, isMobile: w < 600, hasTouch: w < 600 })
  await p.goto('http://localhost:4193/', { waitUntil: 'networkidle0' })
  if (act) await act()
  await new Promise(r => setTimeout(r, 400))
  await p.screenshot({ path: 'preview/' + name + '.png', fullPage: full })
}
const flip = async () => { const bs = await p.$$('ul li > button.tile'); for (const i of [1, 4, 8, 13, 19, 22]) await bs[i].click() }
const two = async () => { await click('Play on two devices'); await new Promise(r => setTimeout(r, 300)); await flip() }
await shot(1280, 900, 'start-screen')
await shot(390, 844, 'start-screen-phone')
await shot(1280, 900, 'sweet-desktop', two)
await shot(390, 844, 'sweet-phone', two)
await shot(390, 844, 'pass-screen', async () => {
  const [a, c] = await p.$$('input'); await a.type('Daniel'); await c.type('Jonah')
  await click('Play on one device'); await click("I'm Daniel, show my board"); await flip(); await click('End turn')
}, false)
await b.close()
