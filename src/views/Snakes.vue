<script setup lang="ts">
import { ref } from 'vue'
import { LADDERS, SNAKES, newRace, snakesMove, squareXY, rollDie, type Race } from '../games2'
import Back from './Back.vue'
import Names from './Names.vue'
import Die from './Die.vue'
const r = ref<Race | null>(null)
const C = 60, colors = ['#9B2C45', '#1E3557', '#5E6B2F', '#E3A23B']
const centre = (n: number) => { const p = squareXY(n); return [p.col * C + C / 2, p.row * C + C / 2] }
const tok = (i: number, n: number) => { const [x, y] = centre(n); return [x + (i % 2 ? 12 : -12), y + (i < 2 ? -12 : 12)] }
const ladder = (a: number, b: number) => { const [x1, y1] = centre(a), [x2, y2] = centre(b), dx = y2 - y1, dy = x1 - x2, l = Math.hypot(dx, dy) || 1, ox = (dx / l) * 9, oy = (dy / l) * 9
  const m = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 22))
  const rungs = Array.from({ length: m }, (_, k) => { const t = (k + 1) / (m + 1), x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t; return `M${x - ox} ${y - oy}L${x + ox} ${y + oy}` }).join('')
  return `M${x1 - ox} ${y1 - oy}L${x2 - ox} ${y2 - oy}M${x1 + ox} ${y1 + oy}L${x2 + ox} ${y2 + oy}${rungs}` }
const snake = (a: number, b: number) => { const [x1, y1] = centre(a), [x2, y2] = centre(b), mx = (x1 + x2) / 2, my = (y1 + y2) / 2; return `M${x1} ${y1}Q${(x1 + mx) / 2 + 30} ${(y1 + my) / 2} ${mx} ${my}T${x2} ${y2}` }
const roll = () => { r.value = snakesMove(r.value!, rollDie()) }
</script>
<template>
  <main class="mx-auto max-w-5xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Pilgrim’s Way</h1>
    <p class="mt-1 text-lg text-[#dfe6f0]">Snakes and ladders. Ladders are good habits that lift you up. Snakes are bad habits that slide you down. Roll a six for another go. Land exactly on 100 to finish.</p>
    <Names v-if="!r" label="Player" :defaults="['Red', 'Blue', 'Green', 'Gold']" @start="x => (r = newRace(x))" />
    <div v-else class="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <svg viewBox="0 0 600 600" class="w-full rounded-xl shadow-[0_6px_0_#0f1d33]" role="img" :aria-label="`Board. ${r.players.map(p => `${p.name} on ${p.pos}`).join(', ')}`">
        <g v-for="n in 100" :key="n">
          <rect :x="squareXY(n).col * C" :y="squareXY(n).row * C" :width="C" :height="C" :fill="(squareXY(n).col + squareXY(n).row) % 2 ? '#f0e3c4' : '#FAF3E3'" />
          <text :x="squareXY(n).col * C + 5" :y="squareXY(n).row * C + 17" font-size="15" fill="#5b4a36">{{ n }}</text>
        </g>
        <g v-for="l in LADDERS" :key="'l' + l.from"><path :d="ladder(l.from, l.to)" stroke="#5E6B2F" stroke-width="5" stroke-linecap="round" fill="none" /></g>
        <g v-for="s in SNAKES" :key="'s' + s.from"><path :d="snake(s.from, s.to)" stroke="#9B2C45" stroke-width="10" stroke-linecap="round" fill="none" opacity=".85" /><circle :cx="centre(s.from)[0]" :cy="centre(s.from)[1]" r="9" fill="#9B2C45" /><circle :cx="centre(s.from)[0] - 3" :cy="centre(s.from)[1] - 2" r="2" fill="#FAF3E3" /><circle :cx="centre(s.from)[0] + 3" :cy="centre(s.from)[1] - 2" r="2" fill="#FAF3E3" /></g>
        <g v-for="(p, i) in r.players" :key="p.name"><circle :cx="tok(i, p.pos)[0]" :cy="tok(i, p.pos)[1]" r="11" :fill="colors[i]" stroke="#FAF3E3" stroke-width="3" /></g>
      </svg>
      <aside>
        <ul class="space-y-2">
          <li v-for="(p, i) in r.players" :key="p.name" class="flex items-center gap-3 rounded-lg px-3 py-2 text-lg" :class="i === r.turn && r.winner === null ? 'bg-[#16294a] ring-2 ring-saffron' : ''"><span class="h-5 w-5 rounded-full border-2 border-linen" :style="{ background: colors[i] }" />{{ p.name }}: square {{ p.pos }}</li>
        </ul>
        <div class="mt-4 flex items-center gap-4"><Die :n="r.last" />
          <button v-if="r.winner === null" class="min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="roll">{{ r.players[r.turn].name }}: roll</button>
          <button v-else class="min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="r = null">Play again</button>
        </div>
        <p class="mt-3 min-h-16 text-lg" aria-live="polite">{{ r.winner !== null ? `${r.players[r.winner].name} reached the end! Well done.` : r.note }}</p>
        <details class="mt-2 text-base"><summary class="min-h-12 cursor-pointer py-3">All ladders and snakes</summary>
          <ul class="space-y-1"><li v-for="j in [...LADDERS, ...SNAKES]" :key="j.from">{{ j.from }} → {{ j.to }} <strong>{{ j.name }}</strong>: “{{ j.text }}” ({{ j.ref }})</li></ul>
        </details>
      </aside>
    </div>
  </main>
</template>
