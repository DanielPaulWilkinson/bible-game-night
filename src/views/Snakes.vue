<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { LADDERS, SNAKES, LANDMARKS, TOKENS, newRace, snakesMove, squareXY, rollDie, type Race, type Jump } from '../games2'
import Back from './Back.vue'
import Names from './Names.vue'
import Die from './Die.vue'
import PilgrimToken from './PilgrimToken.vue'
const r = ref<Race | null>(null)
const names = ref<string[] | null>(null)
const picks = ref<string[]>([])
const card = ref<{ j: Jump; who: string } | null>(null)
const carryOn = ref<HTMLButtonElement | null>(null)
const C = 60, colors = ['#9B2C45', '#1E3557', '#5E6B2F', '#E3A23B']
const centre = (n: number) => { const p = squareXY(n); return [p.col * C + C / 2, p.row * C + C / 2] }
const tok = (i: number, n: number) => { const [x, y] = centre(n); return [x + (i % 2 ? 14 : -14), y + (i < 2 ? -4 : 16)] }
const isMark = (n: number) => LANDMARKS.find(l => l.square === n)
// A help is a row of stepping stones up the hill.
const steps = (a: number, b: number) => { const [x1, y1] = centre(a), [x2, y2] = centre(b), m = Math.max(3, Math.round(Math.hypot(x2 - x1, y2 - y1) / 26))
  return Array.from({ length: m + 1 }, (_, k) => { const t = k / m; return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t] }) }
// A danger is a winding muddy slide.
const slide = (a: number, b: number) => { const [x1, y1] = centre(a), [x2, y2] = centre(b), mx = (x1 + x2) / 2, my = (y1 + y2) / 2; return `M${x1} ${y1}Q${(x1 + mx) / 2 + 34} ${(y1 + my) / 2} ${mx} ${my}T${x2} ${y2}` }
const tokenName = (id: string) => TOKENS.find(t => t.id === id)!.name
const start = (x: string[]) => { names.value = x; picks.value = x.map((_, i) => TOKENS[i].id) }
const begin = () => { r.value = newRace(names.value!) }
const roll = async () => {
  const who = r.value!.players[r.value!.turn].name, next = snakesMove(r.value!, rollDie())
  r.value = next
  if (next.jump) { card.value = { j: next.jump, who }; await nextTick(); carryOn.value?.focus() }
}
const reset = () => { r.value = null; names.value = null }
</script>
<template>
  <main class="mx-auto max-w-5xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Pilgrim’s Way</h1>
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
      <svg viewBox="0 0 600 600" class="w-full rounded-sm border-4 border-[#2B2117]" role="img" :aria-label="`Map of the pilgrim's way. ${r.players.map((p, i) => `${p.name} (${tokenName(picks[i])}) on ${p.pos}`).join(', ')}`">
        <defs>
          <filter id="wash"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="7" /><feColorMatrix values="0 0 0 0 .72  0 0 0 0 .58  0 0 0 0 .36  0 0 0 .35 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
        </defs>
        <rect width="600" height="600" fill="#F3E6C8" /><rect width="600" height="600" fill="#F3E6C8" filter="url(#wash)" />
        <rect v-for="n in 100" :key="'r' + n" :x="squareXY(n).col * C" :y="squareXY(n).row * C" :width="C" :height="C" :fill="isMark(n) ? '#e6d2a4' : 'none'" stroke="#2B2117" stroke-opacity=".18" />
        <g v-for="s in SNAKES" :key="'s' + s.from" aria-hidden="true">
          <path :d="slide(s.from, s.to)" stroke="#7a5a3a" stroke-width="11" stroke-linecap="round" fill="none" opacity=".55" />
          <path :d="slide(s.from, s.to)" stroke="#2B2117" stroke-width="1.5" stroke-dasharray="2 6" fill="none" opacity=".6" />
          <circle :cx="centre(s.to)[0]" :cy="centre(s.to)[1]" r="7" fill="#7a5a3a" opacity=".7" />
        </g>
        <g v-for="l in LADDERS" :key="'l' + l.from" aria-hidden="true">
          <ellipse v-for="(p, k) in steps(l.from, l.to)" :key="k" :cx="p[0]" :cy="p[1]" rx="8" ry="5" fill="#cfd8a8" stroke="#5E6B2F" stroke-width="2" />
          <circle :cx="centre(l.to)[0]" :cy="centre(l.to)[1]" r="6" fill="#E3A23B" stroke="#2B2117" stroke-width="1.5" />
        </g>
        <g v-for="n in 100" :key="n" paint-order="stroke">
          <text stroke="#F3E6C8" stroke-width="3" paint-order="stroke" :x="squareXY(n).col * C + 5" :y="squareXY(n).row * C + 16" font-size="14" fill="#5b4a36">{{ n }}</text>
          <text stroke="#F3E6C8" stroke-width="3" paint-order="stroke" v-if="isMark(n)" :x="squareXY(n).col * C + C / 2" :y="squareXY(n).row * C + 32" font-size="9.5" font-style="italic" fill="#2B2117" text-anchor="middle">
            <tspan v-for="(w, k) in isMark(n)!.name.split(' ').reduce((a: string[], w) => { const l = a.length - 1; if (l >= 0 && (a[l] + ' ' + w).length <= 11) a[l] += ' ' + w; else a.push(w); return a }, [])" :key="k" :x="squareXY(n).col * C + C / 2" :dy="k ? 10 : 0">{{ w }}</tspan>
          </text>
        </g>
        <g v-for="(p, i) in r.players" :key="p.name" :transform="`translate(${tok(i, p.pos)[0]} ${tok(i, p.pos)[1]})`"><PilgrimToken :id="picks[i]" :color="colors[i]" /></g>
      </svg>
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
      <div role="dialog" aria-modal="true" aria-labelledby="jt" class="w-full max-w-md border-4 border-[#2B2117] bg-[#F3E6C8] p-6 text-ink">
        <p class="text-lg" :class="card.j.to > card.j.from ? 'text-olive' : 'text-pom'">{{ card.j.to > card.j.from ? `A help! ${card.who} goes up to ${card.j.to}.` : `A danger! ${card.who} goes back to ${card.j.to}.` }}</p>
        <h2 id="jt" class="mt-1 text-3xl font-semibold">{{ card.j.name }}</h2>
        <p class="mt-4 text-sm italic text-[#5b4a36]">From The Pilgrim’s Progress</p>
        <p class="text-xl leading-snug">{{ card.j.story }}</p>
        <p class="mt-4 text-sm italic text-[#5b4a36]">Bible verse</p>
        <p class="text-xl leading-snug">“{{ card.j.text }}” <span class="whitespace-nowrap">({{ card.j.ref }}, BSB)</span></p>
        <button ref="carryOn" class="mt-6 min-h-14 w-full rounded-lg bg-lapis text-xl font-semibold text-linen" @click="card = null">Carry on</button>
      </div>
    </div>
  </main>
</template>
