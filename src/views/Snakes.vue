<script setup lang="ts">
import GameLogo from './GameLogo.vue'
import { ref, nextTick } from 'vue'
import { LADDERS, SNAKES, LANDMARKS, TOKENS, newRace, snakesMove, squareXY, rollDie, type Race, type Jump } from '../games2'
import Back from './Back.vue'
import Names from './Names.vue'
import Die from './Die.vue'
import PilgrimToken from './PilgrimToken.vue'
import PilgrimDefs from './PilgrimDefs.vue'
const r = ref<Race | null>(null)
const names = ref<string[] | null>(null)
const picks = ref<string[]>([])
const card = ref<{ j: Jump; who: string } | null>(null)
const carryOn = ref<HTMLButtonElement | null>(null)
const C = 60, colors = ['#9B2C45', '#1E3557', '#5E6B2F', '#E3A23B']
const centre = (n: number) => { const p = squareXY(n); return [p.col * C + C / 2, p.row * C + C / 2] }
const tok = (i: number, n: number) => { const [x, y] = centre(n); return [x + (i % 2 ? 14 : -14), y + (i < 2 ? -6 : 12)] }
const isMark = (n: number) => LANDMARKS.find(l => l.square === n)
// A help is a row of stepping stones up the hill.
// Stones grow a little as the path rises, like steps coming towards you.
const steps = (a: number, b: number) => { const [x1, y1] = centre(a), [x2, y2] = centre(b), m = Math.max(3, Math.round(Math.hypot(x2 - x1, y2 - y1) / 26))
  return Array.from({ length: m + 1 }, (_, k) => { const t = k / m; return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, .8 + .35 * t] }) }
// An irregular rock outline, the same each time for a given seed.
const rock = (seed: number) => Array.from({ length: 8 }, (_, k) => { const a = k / 8 * Math.PI * 2, j = .78 + ((Math.sin(seed * 12.9 + k * 78.2) * 43758.5) % 1 + 1) % 1 * .32
  return `${k ? 'L' : 'M'}${(Math.cos(a) * 10 * j).toFixed(1)} ${(Math.sin(a) * 6.5 * j - 1).toFixed(1)}` }).join('') + 'Z'
// Medallion sits in the upper right of a landmark square, clear of the number and label.
const medal = (n: number) => { const p = squareXY(n); return [p.col * C + 38, p.row * C + 21] }
// A danger is a winding muddy slide.
const slide = (a: number, b: number) => { const [x1, y1] = centre(a), [x2, y2] = centre(b), mx = (x1 + x2) / 2, my = (y1 + y2) / 2; return `M${x1} ${y1}Q${(x1 + mx) / 2 + 34} ${(y1 + my) / 2} ${mx} ${my}T${x2} ${y2}` }
const placeName = (id: string) => LANDMARKS.find(l => l.id === id)!.name
const tokenName = (id: string) => TOKENS.find(t => t.id === id)!.name
const start = (x: string[]) => { names.value = x; picks.value = x.map((_, i) => TOKENS[i].id) }
const begin = async () => { r.value = newRace(names.value!); focus.value = tok(0, 1); await nextTick(); look(0) }
const box = ref<HTMLDivElement | null>(null)
const focus = ref([centre(1)[0], centre(1)[1]])
// After a roll, light the mover's square and, on a phone where the board is wider than the screen, pan to it.
const look = (i: number) => { const [x, y] = tok(i, r.value!.players[i].pos); focus.value = [x, y]
  const b = box.value; if (!b || b.scrollWidth <= b.clientWidth + 1) return
  const k = b.scrollWidth / 600, still = matchMedia('(prefers-reduced-motion: reduce)').matches
  b.scrollTo({ left: x * k - b.clientWidth / 2, top: y * k - b.clientHeight / 2, behavior: still ? 'auto' : 'smooth' }) }
const roll = async () => {
  const mover = r.value!.turn, who = r.value!.players[mover].name, next = snakesMove(r.value!, rollDie())
  r.value = next
  await nextTick(); look(mover)
  if (next.jump) { card.value = { j: next.jump, who }; await nextTick(); carryOn.value?.focus() }
}
const reset = () => { r.value = null; names.value = null }
</script>
<template>
  <main class="mx-auto max-w-5xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <PilgrimDefs />
    <Back />
    <h1 class="flex items-center gap-3 mt-2 text-3xl font-semibold sm:text-4xl"><GameLogo id="snakes" class="h-14 w-14 shrink-0" />Pilgrim’s Way</h1>
    <p class="mt-1 max-w-[70ch] text-lg text-[#dfe6f0]">Walk with Christian from the City of Destruction to the Celestial City. Helps carry you forward. Dangers send you back. Roll a six for another go, and land exactly on 100 to finish.</p>
    <Names v-if="!names" label="Pilgrim" :defaults="['Red', 'Blue', 'Green', 'Gold']" @start="start" />
    <section v-else-if="!r" class="mt-5 max-w-2xl" aria-labelledby="pick">
      <h2 id="pick" class="text-2xl font-semibold">Choose what each pilgrim carries</h2>
      <div v-for="(n, i) in names" :key="n" class="mt-4">
        <p class="text-lg">{{ n }}</p>
        <div class="mt-1 flex flex-wrap gap-2" role="radiogroup" :aria-label="`${n} carries`">
          <button v-for="t in TOKENS" :key="t.id" role="radio" :aria-checked="picks[i] === t.id"
            class="flex min-h-14 items-center gap-2 rounded-lg border-2 px-3 text-base"
            :class="picks[i] === t.id ? 'border-saffron bg-[#16294a]' : 'border-transparent bg-[#16294a]/60'" @click="picks[i] = t.id">
            <svg viewBox="-15 -15 30 30" class="h-9 w-9" aria-hidden="true"><PilgrimToken :id="t.id" :color="colors[i]" /></svg>{{ t.name }}
          </button>
        </div>
      </div>
      <button class="mt-6 min-h-14 rounded-lg bg-saffron px-6 text-xl font-semibold text-ink" @click="begin">Set off</button>
    </section>
    <div v-else class="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div ref="box" class="relative overflow-auto rounded-sm border-4 border-[#2B2117] shadow-[0_14px_34px_rgba(8,16,30,.55)] max-h-[80vh] sm:max-h-none sm:overflow-visible">
      <svg viewBox="0 0 600 600" class="block w-[175%] max-w-none sm:w-full" role="img" :aria-label="`Map of the pilgrim's way. ${r.players.map((p, i) => `${p.name} (${tokenName(picks[i])}) on ${p.pos}`).join(', ')}`">
        <rect width="600" height="600" fill="#F3E6C8" /><rect width="600" height="600" fill="#F3E6C8" filter="url(#pt-wash)" />
        <rect v-for="n in 100" :key="'r' + n" :x="squareXY(n).col * C" :y="squareXY(n).row * C" :width="C" :height="C" :fill="isMark(n) ? '#e6d2a4' : 'none'" stroke="#2B2117" stroke-opacity=".18" />
        <g class="spot" :style="`transform: translate(${focus[0]}px, ${focus[1]}px)`" aria-hidden="true"><circle r="48" fill="url(#pt-glow)" /><circle r="34" fill="none" stroke="#E3A23B" stroke-width="2" stroke-dasharray="4 5" opacity=".8" /></g>
        <g v-for="s in SNAKES" :key="'s' + s.from" aria-hidden="true" stroke-linecap="round" fill="none">
          <path :d="slide(s.from, s.to)" stroke="#fff4d6" stroke-width="22" opacity=".7" />
          <path :d="slide(s.from, s.to)" stroke="#4a321d" stroke-width="17" />
          <path :d="slide(s.from, s.to)" stroke="url(#pt-mud)" stroke-width="12" transform="translate(0 1.5)" />
          <path :d="slide(s.from, s.to)" stroke="#000" stroke-width="12" filter="url(#pt-grit)" opacity=".5" />
          <path :d="slide(s.from, s.to)" stroke="#c49a66" stroke-width="1.6" stroke-dasharray="7 9" transform="translate(-2 -2)" opacity=".8" />
          <ellipse :cx="centre(s.from)[0]" :cy="centre(s.from)[1]" rx="10" ry="6" fill="#2B2117" opacity=".55" />
          <ellipse :cx="centre(s.to)[0]" :cy="centre(s.to)[1] + 2" rx="13" ry="7" fill="#5a3f26" stroke="#2B2117" stroke-width="1.2" />
          <ellipse :cx="centre(s.to)[0] - 3" :cy="centre(s.to)[1]" rx="5" ry="1.6" fill="#c49a66" opacity=".7" />
        </g>
        <g v-for="l in LADDERS" :key="'l' + l.from" aria-hidden="true">
          <g v-for="(p, k) in steps(l.from, l.to)" :key="k" :transform="`translate(${p[0]} ${p[1]}) scale(${p[2]})`">
            <ellipse cx="2.5" cy="4" rx="10" ry="5.5" fill="#2B2117" opacity=".3" />
            <path :d="rock(l.from * 7 + k)" fill="url(#pt-stone)" stroke="#2B2117" stroke-width="1" stroke-linejoin="round" />
            <path :d="rock(l.from * 7 + k)" fill="#5E6B2F" opacity=".15" transform="translate(0 2) scale(1 .5)" />
            <ellipse cx="-2.5" cy="-3" rx="4" ry="1.6" fill="#fffaf0" opacity=".65" />
          </g>
          <circle :cx="centre(l.to)[0]" :cy="centre(l.to)[1]" r="6" fill="#E3A23B" stroke="#2B2117" stroke-width="1.5" />
        </g>
        <g v-for="l in LANDMARKS" :key="'m' + l.id">
          <circle :cx="medal(l.square)[0] + 1" :cy="medal(l.square)[1] + 2" r="17" fill="#2B2117" opacity=".3" />
          <image :href="`places/${l.id}-sm.webp`" :x="medal(l.square)[0] - 16" :y="medal(l.square)[1] - 16" width="32" height="32" clip-path="url(#pt-medal)" preserveAspectRatio="xMidYMid slice" />
          <circle :cx="medal(l.square)[0]" :cy="medal(l.square)[1]" r="16" fill="none" stroke="#2B2117" stroke-width="2" />
          <circle :cx="medal(l.square)[0]" :cy="medal(l.square)[1]" r="13.5" fill="none" stroke="#E3A23B" stroke-width="1" opacity=".9" />
        </g>
        <g v-for="n in 100" :key="n">
          <text stroke="#F3E6C8" stroke-width="3" paint-order="stroke" :x="squareXY(n).col * C + 5" :y="squareXY(n).row * C + 16" font-size="14" fill="#5b4a36">{{ n }}</text>
          <text stroke="#F3E6C8" stroke-width="3" paint-order="stroke" v-if="isMark(n)" :x="squareXY(n).col * C + C / 2" :y="squareXY(n).row * C + 47" font-size="9" font-style="italic" fill="#2B2117" text-anchor="middle">
            <tspan v-for="(w, k) in isMark(n)!.name.split(' ').reduce((a: string[], w) => { const l = a.length - 1; if (l >= 0 && (a[l] + ' ' + w).length <= 12) a[l] += ' ' + w; else a.push(w); return a }, [])" :key="k" :x="squareXY(n).col * C + C / 2" :dy="k ? 9 : 0">{{ w }}</tspan>
          </text>
        </g>
        <rect width="600" height="600" fill="url(#pt-vignette)" pointer-events="none" />
        <rect x="3" y="3" width="594" height="594" fill="none" stroke="#7a5a3a" stroke-width="6" opacity=".25" />
        <g v-for="(p, i) in r.players" :key="p.name" class="mover" :style="`transform: translate(${tok(i, p.pos)[0]}px, ${tok(i, p.pos)[1]}px) scale(1.2)`"><PilgrimToken :id="picks[i]" :color="colors[i]" /></g>
      </svg>
      </div>
      <aside>
        <ul class="space-y-2">
          <li v-for="(p, i) in r.players" :key="p.name" class="flex items-center gap-3 rounded-lg px-3 py-2 text-lg" :class="i === r.turn && r.winner === null ? 'bg-[#16294a] ring-2 ring-saffron' : ''">
            <svg viewBox="-15 -15 30 30" class="h-8 w-8" aria-hidden="true"><PilgrimToken :id="picks[i]" :color="colors[i]" /></svg>{{ p.name }}, square {{ p.pos }}</li>
        </ul>
        <div class="mt-4 flex items-center gap-4"><Die :n="r.last" />
          <button v-if="r.winner === null" class="min-h-14 rounded-lg bg-saffron px-6 text-xl font-semibold text-ink" @click="roll">{{ r.players[r.turn].name }}, roll</button>
          <button v-else class="min-h-14 rounded-lg bg-saffron px-6 text-xl font-semibold text-ink" @click="reset">Play again</button>
        </div>
        <p class="mt-3 min-h-16 text-lg" aria-live="polite">{{ r.winner !== null ? `${r.players[r.winner].name} reached the Celestial City! Well done.` : r.note }}</p>
        <details class="mt-2 text-base"><summary class="min-h-12 cursor-pointer py-3">All helps and dangers</summary>
          <ul class="space-y-2"><li v-for="j in [...LADDERS, ...SNAKES]" :key="j.from">{{ j.from }} to {{ j.to }}, <strong>{{ j.name }}</strong>. {{ j.story }} <em>{{ j.ref }}</em></li></ul>
        </details>
      </aside>
    </div>
    <div v-if="card" class="fixed inset-0 z-20 flex items-center justify-center bg-[#0f1d33]/70 p-4" @click.self="card = null" @keydown.esc="card = null">
      <div role="dialog" aria-modal="true" aria-labelledby="jt" class="max-h-[92vh] overflow-auto w-full max-w-md border-4 border-[#2B2117] bg-[#F3E6C8] p-6 text-ink">
        <p class="text-lg" :class="card.j.to > card.j.from ? 'text-olive' : 'text-pom'">{{ card.j.to > card.j.from ? `A help! ${card.who} goes up to ${card.j.to}.` : `A danger! ${card.who} goes back to ${card.j.to}.` }}</p>
        <h2 id="jt" class="mt-1 text-3xl font-semibold">{{ card.j.name }}</h2>
        <img :src="`places/${card.j.place}.webp`" width="240" height="240" loading="lazy" :alt="`Picture of ${placeName(card.j.place)}`" class="mt-3 aspect-[2/1] w-full border-2 border-[#2B2117] object-cover" />
        <p class="mt-4 text-sm italic text-[#5b4a36]">From The Pilgrim’s Progress</p>
        <p class="text-xl leading-snug">{{ card.j.story }}</p>
        <p class="mt-4 text-sm italic text-[#5b4a36]">Bible verse</p>
        <p class="text-xl leading-snug">“{{ card.j.text }}” <span class="whitespace-nowrap">({{ card.j.ref }}, BSB)</span></p>
        <button ref="carryOn" class="mt-6 min-h-14 w-full rounded-lg bg-lapis text-xl font-semibold text-linen" @click="card = null">Carry on</button>
      </div>
    </div>
  </main>
</template>
<style scoped>
.mover, .spot { transition: transform .45s ease; }
@media (prefers-reduced-motion: reduce) { .mover, .spot { transition: none; } }
</style>
