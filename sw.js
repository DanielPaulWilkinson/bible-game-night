// Bible Game Night offline cache b75ab579472a
const CACHE = 'bgn-b75ab579472a'
const BUILT = ["assets/index-D1UxB4t_.css","assets/index-ZOSXihXZ.js","figures/abraham.webp","figures/daniel.webp","figures/david.webp","figures/deborah.webp","figures/elijah.webp","figures/esther.webp","figures/hannah.webp","figures/john-baptist.webp","figures/jonah.webp","figures/joseph.webp","figures/martha.webp","figures/mary-magdalene.webp","figures/mary.webp","figures/matthew.webp","figures/miriam.webp","figures/moses.webp","figures/noah.webp","figures/paul.webp","figures/peter.webp","figures/ruth.webp","figures/sarah.webp","figures/solomon.webp","figures/thomas.webp","figures/zacchaeus.webp","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-192.png","icons/maskable-512.png","index.html","manifest.webmanifest","places/celestial-city-sm.webp","places/celestial-city.webp","places/city-of-destruction-sm.webp","places/city-of-destruction.webp","places/delectable-mountains-sm.webp","places/delectable-mountains.webp","places/doubting-castle-sm.webp","places/doubting-castle.webp","places/enchanted-ground-sm.webp","places/enchanted-ground.webp","places/hill-difficulty-sm.webp","places/hill-difficulty.webp","places/interpreters-house-sm.webp","places/interpreters-house.webp","places/palace-beautiful-sm.webp","places/palace-beautiful.webp","places/slough-of-despond-sm.webp","places/slough-of-despond.webp","places/the-cross-sm.webp","places/the-cross.webp","places/the-river-sm.webp","places/the-river.webp","places/valley-of-humiliation-sm.webp","places/valley-of-humiliation.webp","places/vanity-fair-sm.webp","places/vanity-fair.webp","places/wicket-gate-sm.webp","places/wicket-gate.webp","robots.txt","scenes/jonah-1.webp","scenes/jonah-2.webp","scenes/jonah-3.webp","scenes/jonah-4.webp","scenes/jonah-5.webp","scenes/joseph-1.webp","scenes/joseph-2.webp","scenes/joseph-3.webp","scenes/joseph-4.webp","scenes/noah-1.webp","scenes/noah-2.webp","scenes/noah-3.webp","scenes/noah-4.webp","scenes/noah-5.webp"]
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', ...BUILT.filter(f => f !== 'index.html')])).then(() => self.skipWaiting()))
})
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('bgn-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', e => {
  const r = e.request
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return
  if (r.mode === 'navigate') {
    // Network first for the page, so a new deploy shows on the next load; cached copy when offline.
    e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return res }).catch(() => caches.match('./')))
    return
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)) } return res })))
})
