<script setup lang="ts">
import { computed, ref } from 'vue'
import figuresJson from '../figures.json'
import type { Figure } from '../game'
import { newPairs, flipCard, pairsDone, SYMBOLS, type Pairs } from '../games'
import Portrait from '../Portrait.vue'
import SymbolIcon from './SymbolIcon.vue'
import Back from './Back.vue'

const byId = (id: string) => (figuresJson as Figure[]).find(f => f.id === id)!
const sym = (id: string) => SYMBOLS.find(s => s.id === id)!
const size = ref<6 | 10>(6)
const p = ref<Pairs>(newPairs(6))
const done = computed(() => pairsDone(p.value))
const isUp = (key: string, figureId: string) => p.value.open.includes(key) || p.value.matched.includes(figureId)
const status = ref('')
function start(n: 6 | 10) { size.value = n; p.value = newPairs(n); status.value = '' }
function tap(key: string) {
  const before = p.value.matched.length
  p.value = flipCard(p.value, key)
  if (p.value.matched.length > before) { const id = p.value.matched[p.value.matched.length - 1]; status.value = `A match! ${byId(id).name} and the ${sym(id).label.toLowerCase()}.` }
  else if (p.value.open.length === 2) status.value = 'Not a pair this time. Tap another card to try again.'
  else status.value = ''
}
const label = (c: { key: string; figureId: string; kind: string }) => !isUp(c.key, c.figureId) ? 'Face-down card' : c.kind === 'figure' ? byId(c.figureId).name : sym(c.figureId).label
</script>

<template>
  <main class="mx-auto max-w-5xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Pairs</h1>
    <p class="mt-1 text-lg text-[#dfe6f0]">Turn over two cards. Find each person and the thing from their story.</p>
    <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="How many pairs">
      <button class="min-h-12 rounded-full px-5 text-base font-semibold" :class="size === 6 ? 'bg-saffron text-ink' : 'bg-linen text-ink'" :aria-pressed="size === 6" @click="start(6)">Easy: 6 pairs</button>
      <button class="min-h-12 rounded-full px-5 text-base font-semibold" :class="size === 10 ? 'bg-saffron text-ink' : 'bg-linen text-ink'" :aria-pressed="size === 10" @click="start(10)">Normal: 10 pairs</button>
    </div>
    <p class="mt-3 min-h-7 text-lg font-semibold text-saffron" aria-live="polite">{{ done ? `Well done! You found all ${size} pairs in ${p.moves} goes.` : status }}</p>
    <ul class="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3" :class="size === 10 ? 'md:grid-cols-5' : 'max-w-2xl md:grid-cols-4'">
      <li v-for="c in p.cards" :key="c.key">
        <button class="tile block w-full overflow-hidden rounded-lg text-ink shadow-[0_4px_0_#0f1d33]"
                :class="[isUp(c.key, c.figureId) ? 'bg-linen' : 'bg-[#9B2C45]', p.matched.includes(c.figureId) ? 'ring-4 ring-olive' : '']"
                :aria-label="label(c)" :aria-disabled="p.matched.includes(c.figureId)" @click="tap(c.key)">
          <span class="block aspect-[3/4] w-full">
            <template v-if="!isUp(c.key, c.figureId)">
              <svg viewBox="0 0 40 40" class="h-full w-full p-6" aria-hidden="true"><circle cx="20" cy="20" r="14" fill="none" stroke="#E3A23B" stroke-width="2.5" /><circle cx="20" cy="20" r="6" fill="#E3A23B" /></svg>
            </template>
            <Portrait v-else-if="c.kind === 'figure'" :f="byId(c.figureId)" eager />
            <span v-else class="flex h-full flex-col items-center justify-center gap-2 p-3"><span class="block h-3/5 w-4/5"><SymbolIcon :icon="sym(c.figureId).icon" /></span><span class="text-center text-base font-semibold leading-tight sm:text-lg">{{ sym(c.figureId).label }}</span></span>
          </span>
          <span class="block min-h-8 px-1.5 py-1 text-sm font-semibold sm:text-base">{{ isUp(c.key, c.figureId) && c.kind === 'figure' ? byId(c.figureId).name : '' }}</span>
        </button>
      </li>
    </ul>
    <button v-if="done" class="mt-6 min-h-12 rounded-full bg-saffron px-6 text-base font-semibold text-ink" @click="start(size)">Play again</button>
  </main>
</template>
