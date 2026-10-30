<script setup lang="ts">
import { ref } from 'vue'
import { JOURNEY_CARDS, ROUTE_LENGTH, newRace, journeyMove, rollDie, type Card, type Race } from '../games2'
import Back from './Back.vue'
import Names from './Names.vue'
import Die from './Die.vue'
const r = ref<Race | null>(null), card = ref<Card | null>(null)
const colors = ['#9B2C45', '#1E3557', '#5E6B2F', '#E3A23B']
// six spaces per row, winding back and forth, starting bottom left
const xy = (n: number) => { const row = Math.floor((n - 1) / 6), col = (n - 1) % 6; return [80 + (row % 2 ? 5 - col : col) * 140, 470 - row * 105] }
const path = Array.from({ length: ROUTE_LENGTH }, (_, i) => xy(i + 1)).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')
const cardAt = (n: number) => JOURNEY_CARDS.find(c => c.space === n)
const roll = () => { const res = journeyMove(r.value!, rollDie()); card.value = res.card; r.value = res }
</script>
<template>
  <main class="mx-auto max-w-5xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Out of Egypt</h1>
    <p class="mt-1 text-lg text-[#dfe6f0]">Travel with Moses and the people of Israel from Egypt to the promised land. Land on a star to read a story card.</p>
    <Names v-if="!r" label="Player" :defaults="['Red', 'Blue', 'Green', 'Gold']" @start="x => { r = newRace(x); card = null }" />
    <div v-else class="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <svg viewBox="0 0 860 545" class="w-full rounded-xl bg-[#e9d9b5] shadow-[0_6px_0_#0f1d33]" role="img" :aria-label="`Route board. ${r.players.map(p => `${p.name} on space ${p.pos}`).join(', ')}`">
        <path :d="path" stroke="#c9a66b" stroke-width="34" fill="none" stroke-linejoin="round" />
        <g v-for="n in ROUTE_LENGTH" :key="n">
          <circle :cx="xy(n)[0]" :cy="xy(n)[1]" r="30" :fill="cardAt(n) ? '#E3A23B' : '#FAF3E3'" stroke="#2B2117" stroke-width="2" />
          <text :x="xy(n)[0]" :y="xy(n)[1] + 6" text-anchor="middle" font-size="18" fill="#2B2117" font-weight="600">{{ n }}</text>
          <text v-if="cardAt(n) && n !== ROUTE_LENGTH" :x="xy(n)[0]" :y="xy(n)[1] - 36" text-anchor="middle" font-size="15" fill="#2B2117">★ {{ cardAt(n)!.title }}</text>
        </g>
        <text :x="xy(1)[0]" :y="xy(1)[1] + 52" text-anchor="middle" font-size="17" fill="#2B2117" font-weight="600">Egypt</text>
        <text :x="xy(ROUTE_LENGTH)[0]" :y="xy(ROUTE_LENGTH)[1] - 38" text-anchor="middle" font-size="17" fill="#2B2117" font-weight="600">★ Promised land</text>
        <circle v-for="(p, i) in r.players" :key="p.name" :cx="xy(p.pos)[0] + (i % 2 ? 14 : -14)" :cy="xy(p.pos)[1] + (i < 2 ? -14 : 14)" r="10" :fill="colors[i]" stroke="#FAF3E3" stroke-width="3" />
      </svg>
      <aside>
        <ul class="space-y-2">
          <li v-for="(p, i) in r.players" :key="p.name" class="flex items-center gap-3 rounded-lg px-3 py-2 text-lg" :class="i === r.turn && r.winner === null ? 'bg-[#16294a] ring-2 ring-saffron' : ''"><span class="h-5 w-5 rounded-full border-2 border-linen" :style="{ background: colors[i] }" />{{ p.name }}: space {{ p.pos }}</li>
        </ul>
        <div class="mt-4 flex items-center gap-4"><Die :n="r.last" />
          <button v-if="r.winner === null" class="min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="roll">{{ r.players[r.turn].name }}: roll</button>
          <button v-else class="min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="r = null">Play again</button>
        </div>
        <div aria-live="polite" class="mt-4">
          <p v-if="r.winner !== null" class="text-2xl font-semibold text-saffron">{{ r.players[r.winner].name }} reached the promised land!</p>
          <div v-if="card" class="mt-2 rounded-xl bg-linen p-4 text-ink shadow-[0_4px_0_#0f1d33]">
            <p class="text-xl font-semibold">★ {{ card.title }}</p><p class="mt-1 text-lg">{{ card.text }}</p><p class="mt-1 text-base">{{ card.ref }}</p>
          </div>
        </div>
      </aside>
    </div>
    <p class="mt-4 text-base text-[#dfe6f0]">The route is simplified for play. Story cards retell the Bible in short; references are from the Berean Standard Bible.</p>
  </main>
</template>
