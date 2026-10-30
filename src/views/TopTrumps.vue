<script setup lang="ts">
import GameLogo from './GameLogo.vue'
import { computed, ref } from 'vue'
import figuresJson from '../figures.json'
import type { Figure } from '../game'
import { STATS, TRAITS, newTrumps, playTrait, computerTrait, trumpsWinner, type Trait, type Trumps } from '../games2'
import Portrait from '../Portrait.vue'
import Back from './Back.vue'
const figures = figuresJson as Figure[]
const byId = (id: string) => figures.find(f => f.id === id)!
const mode = ref<'cpu' | 'pass' | null>(null)
const t = ref<Trumps | null>(null), hidden = ref(false)
const names = computed(() => mode.value === 'cpu' ? ['You', 'Computer'] : ['Player 1', 'Player 2'])
const win = computed(() => t.value && trumpsWinner(t.value))
const label = (k: Trait) => k[0].toUpperCase() + k.slice(1)
function start(m: 'cpu' | 'pass') { mode.value = m; t.value = newTrumps(figures); hidden.value = m === 'pass' }
function pick(k: Trait) { t.value = playTrait(t.value!, k); hidden.value = mode.value === 'pass' }
const cpuGo = () => pick(computerTrait(t.value!.hands[1][0]))
const top = computed(() => t.value && t.value.hands[mode.value === 'cpu' ? 0 : t.value.turn][0])
</script>
<template>
  <main class="mx-auto max-w-4xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="flex items-center gap-3 mt-2 text-3xl font-semibold sm:text-4xl"><GameLogo id="trumps" class="h-14 w-14 shrink-0" />Bible Top Trumps</h1>
    <p class="mt-1 max-w-2xl rounded-lg bg-[#16294a] p-3 text-base">These are stories we love, not a score of who was holiest. The numbers are just for fun. Every person here was loved by God, and the Bible is honest about their good days and bad ones.</p>
    <div v-if="!t" class="mt-4 flex flex-wrap gap-3">
      <button class="min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="start('cpu')">Play the computer</button>
      <button class="min-h-14 rounded-full bg-linen px-6 text-xl font-semibold text-ink" @click="start('pass')">Two players, one device</button>
    </div>
    <template v-else>
      <p class="mt-3 text-lg">{{ names[0] }}: {{ t.hands[0].length }} cards, {{ names[1] }}: {{ t.hands[1].length }} cards<span v-if="t.pot.length">, {{ t.pot.length }} in the middle</span>. Round {{ t.rounds + 1 }} of 12</p>
      <div v-if="t.last" class="mt-3 rounded-lg bg-[#16294a] p-3 text-lg" aria-live="polite">
        {{ label(t.last.trait) }}: {{ byId(t.last.a).name }} {{ STATS[t.last.a][t.last.trait] }}, {{ byId(t.last.b).name }} {{ STATS[t.last.b][t.last.trait] }}.
        {{ t.last.winner === null ? 'A tie! Both cards wait in the middle.' : `${names[t.last.winner]} ${t.last.winner === 0 && mode === 'cpu' ? 'win' : 'wins'} the cards.` }}
      </div>
      <section v-if="win !== null" class="mt-5 rounded-xl bg-[#16294a] p-6 text-center">
        <p class="text-3xl font-semibold text-saffron">{{ win === 'draw' ? 'It’s a draw!' : `${names[win]} ${win === 0 && mode === 'cpu' ? 'have' : 'has'} the most cards!` }}</p>
        <button class="mt-4 min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="t = null">Play again</button>
      </section>
      <section v-else-if="hidden" class="mt-5 rounded-xl bg-[#16294a] p-6 text-center">
        <p class="text-2xl">Pass to {{ names[t.turn] }}. No peeking, {{ names[1 - t.turn] }}!</p>
        <button class="mt-4 min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="hidden = false">I’m {{ names[t.turn] }}: show my card</button>
      </section>
      <section v-else-if="top" class="mt-5 flex flex-wrap items-start gap-5">
        <article class="w-64 overflow-hidden rounded-xl bg-linen text-ink shadow-[0_6px_0_#0f1d33]">
          <div class="aspect-[3/4] w-full"><Portrait :f="byId(top)" eager /></div>
          <h2 class="px-4 pt-3 text-2xl font-semibold">{{ byId(top).name }}</h2>
          <p class="px-4 text-base">{{ byId(top).fact }}</p>
          <dl class="grid grid-cols-2 gap-1 p-4 text-lg"><template v-for="k in TRAITS" :key="k"><dt>{{ label(k) }}</dt><dd class="text-right font-semibold">{{ STATS[top][k] }}</dd></template></dl>
        </article>
        <div>
          <template v-if="mode === 'cpu' && t.turn === 1">
            <p class="text-xl">The computer won the last round, so it chooses next using its own hidden card.</p>
            <button class="mt-3 min-h-14 rounded-full bg-saffron px-6 text-xl font-semibold text-ink" @click="cpuGo">Let the computer choose</button>
          </template>
          <template v-else>
            <p class="text-xl">{{ names[t.turn] }}, pick a trait:</p>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <button v-for="k in TRAITS" :key="k" class="min-h-14 rounded-full bg-saffron px-5 text-lg font-semibold text-ink" @click="pick(k)">{{ label(k) }}</button>
            </div>
          </template>
        </div>
      </section>
    </template>
  </main>
</template>
