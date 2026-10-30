<script setup lang="ts">
import GameLogo from './GameLogo.vue'
import { ref } from 'vue'
import { ANIMALS, RAIN_MAX, newArk, arkRoll, rollDie, type Ark } from '../games2'
import Back from './Back.vue'
import Names from './Names.vue'
import Die from './Die.vue'
const a = ref<Ark | null>(null)
const msg = (x: Ark) => x.last === null ? 'Roll to start loading.' : x.last === 1 ? 'A rain cloud! The rain meter goes up.' : x.last === 6 ? 'A six! Two pairs walk in.' : `${ANIMALS[x.loaded - 1]} walk in, two by two.`
</script>
<template>
  <main class="mx-auto max-w-4xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="flex items-center gap-3 mt-2 text-3xl font-semibold sm:text-4xl"><GameLogo id="ark" class="h-14 w-14 shrink-0" />Ark Rescue</h1>
    <p class="mt-1 text-lg text-[#dfe6f0]">Work together! Take turns to roll and help the animals onto the ark before the rain meter fills. Roll 2 to 5 for one pair, 6 for two pairs. A 1 brings a rain cloud.</p>
    <Names v-if="!a" label="Helper" :min="1" :defaults="['Shem', 'Ham', 'Japheth', 'Noah']" start="Start loading" @start="x => (a = newArk(x))" />
    <template v-else>
      <svg viewBox="0 0 600 260" class="mt-4 w-full rounded-xl bg-[#cfe0ee] shadow-[0_6px_0_#0f1d33]" role="img" :aria-label="`${a.loaded} of ${ANIMALS.length} pairs aboard. Rain ${a.rain} of ${RAIN_MAX}.`">
        <g v-for="k in RAIN_MAX" :key="k" :opacity="k <= a.rain ? 1 : 0.15"><ellipse :cx="50 + (k - 1) * 100" cy="34" rx="44" ry="20" fill="#6d7f93" /></g>
        <path d="M0 230c50-12 100 12 150 0s100 12 150 0 100 12 150 0 100 12 150 0V260H0z" fill="#1E3557" />
        <path d="M110 170h380l-40 60H150z" fill="#9a6a3a" stroke="#2B2117" stroke-width="3" /><rect x="190" y="110" width="220" height="60" fill="#c48a4c" stroke="#2B2117" stroke-width="3" /><path d="M175 110l125-40 125 40z" fill="#7a4f2a" stroke="#2B2117" stroke-width="3" />
        <g v-for="(n, i) in ANIMALS" :key="n"><rect :x="200 + (i % 4) * 52" :y="118 + Math.floor(i / 4) * 26" width="46" height="20" rx="4" :fill="i < a.loaded ? '#E3A23B' : '#7a4f2a'" stroke="#2B2117" /><text v-if="i < a.loaded" :x="223 + (i % 4) * 52" :y="133 + Math.floor(i / 4) * 26" text-anchor="middle" font-size="11" fill="#2B2117">{{ n }}</text></g>
      </svg>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <p class="text-xl">Pairs aboard: <strong class="text-saffron">{{ a.loaded }} of {{ ANIMALS.length }}</strong></p>
        <p class="text-xl">Rain meter: <strong class="text-saffron">{{ a.rain }} of {{ RAIN_MAX }}</strong></p>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-4"><Die :n="a.last" />
        <button v-if="a.result === 'playing'" class="min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="a = arkRoll(a, rollDie())">{{ a.players[a.turn] }}: roll</button>
        <button v-else class="min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="a = newArk(a.players)">{{ a.result === 'won' ? 'Play again' : 'Try again together' }}</button>
      </div>
      <p class="mt-3 text-2xl" aria-live="polite">{{ a.result === 'won' ? 'Everyone is safe on the ark! You did it together.' : a.result === 'again' ? 'The rain came first this time. Shall we try again?' : msg(a) }}</p>
      <p class="mt-4 text-base text-[#dfe6f0]">“…came to Noah to enter the ark, two by two.” Genesis 7:9 (BSB)</p>
    </template>
  </main>
</template>
