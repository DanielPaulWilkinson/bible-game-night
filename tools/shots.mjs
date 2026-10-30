import { createRequire } from 'module'; const puppeteer = createRequire('/workspace/cp-tools/x.js')('puppeteer-core')
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const p = await b.newPage()
async function shot(w, h, name, act) {
  await p.setViewport({ width: w, height: h, deviceScaleFactor: w < 600 ? 2 : 1, isMobile: w < 600, hasTouch: w < 600 })
  await p.goto('http://localhost:4193/', { waitUntil: 'networkidle0' })
  if (act) await act()
  await new Promise(r => setTimeout(r, 300))
  await p.screenshot({ path: 'preview/' + name + '.png', fullPage: true })
}
const flip = async () => { const bs = await p.$$('ul li > button.tile'); for (const i of [1, 4, 8, 13, 19, 22]) await bs[i].click() }
await shot(1280, 900, 'desktop', flip)
await shot(390, 844, 'phone', flip)
await shot(390, 844, 'secret-person', async () => { await flip(); const [btn] = await p.$$('button[aria-pressed="false"].rounded-full'); await btn.click() })
await shot(1280, 900, 'info', async () => { await (await p.$$('button[aria-label^="About"]'))[14].click() })
await b.close()
