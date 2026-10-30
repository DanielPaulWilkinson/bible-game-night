<script setup lang="ts">
import { computed, ref } from 'vue'
import figuresJson from '../figures.json'
import type { Figure } from '../game'
import { bingoCard, newCaller, callNext, calledIds, hasLine, type Caller } from '../games'
import Portrait from '../Portrait.vue'
import Back from './Back.vue'

const figures = figuresJson as Figure[]
const byId = (id: string) => figures.find(f => f.id === id)!
const tab = ref<'card' | 'caller'>('card')
const card = ref(bingoCard(figures))
const marked = ref<string[]>([])
const bingo = computed(() => hasLine(card.value, marked.value))
const mark = (id: string) => { marked.value = marked.value.includes(id) ? marked.value.filter(m => m !== id) : [...marked.value, id] }
function newCard() { card.value = bingoCard(figures); marked.value = [] }
const printCards = ref<string[][]>([])
function printSet() { printCards.value = [0, 1, 2, 3].map(() => bingoCard(figures)); setTimeout(() => print(), 50) }

const caller = ref<Caller>(newCaller(figures))
const called = computed(() => calledIds(caller.value))
const latest = computed(() => called.value.length ? byId(called.value[called.value.length - 1]) : null)
</script>

<template>
  <main class="mx-auto max-w-4xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <div class="no-print">
      <Back />
      <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Bible Bingo</h1>
      <p class="mt-1 text-lg text-[#dfe6f0]">One grown-up calls out people. Everyone else marks them on their card. Four in a row wins!</p>
      <div class="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Bingo screens">
        <button role="tab" :aria-selected="tab === 'card'" class="min-h-12 rounded-full px-5 text-base font-semibold" :class="tab === 'card' ? 'bg-saffron text-ink' : 'bg-linen text-ink'" @click="tab = 'card'">My card</button>
        <button role="tab" :aria-selected="tab === 'caller'" class="min-h-12 rounded-full px-5 text-base font-semibold" :class="tab === 'caller' ? 'bg-saffron text-ink' : 'bg-linen text-ink'" @click="tab = 'caller'">Caller</button>
      </div>

      <section v-if="tab === 'card'" class="mt-4">
        <p class="min-h-8 text-2xl font-semibold text-saffron" aria-live="polite">{{ bingo ? 'Bingo! Shout it out!' : '' }}</p>
        <ul class="mt-2 grid grid-cols-4 gap-2 sm:gap-3" aria-label="Bingo card">
          <li v-for="id in card" :key="id">
            <button class="tile relative block w-full overflow-hidden rounded-md bg-linen text-ink shadow-[0_4px_0_#0f1d33]" :aria-pressed="marked.includes(id)" @click="mark(id)">
              <span class="block aspect-[3/4] w-full"><Portrait :f="byId(id)" eager /></span>
              <span class="block px-1 py-1 text-[13px] font-semibold leading-tight sm:text-base">{{ byId(id).name }}</span>
              <svg v-if="marked.includes(id)" viewBox="0 0 40 40" class="absolute inset-0 m-auto h-3/5 w-3/5" aria-hidden="true"><circle cx="20" cy="20" r="16" fill="#9B2C45" fill-opacity=".8" stroke="#FAF3E3" stroke-width="3" /><path d="M12 21l5 5 11-12" fill="none" stroke="#FAF3E3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </li>
        </ul>
        <div class="mt-4 flex flex-wrap gap-3">
          <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="newCard">New card</button>
          <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="printSet">Print 4 cards</button>
        </div>
      </section>

      <section v-else class="mt-4">
        <div class="flex flex-wrap items-center gap-5">
          <div class="h-48 w-36 overflow-hidden rounded-lg border-4 border-saffron bg-[#16294a]"><Portrait v-if="latest" :f="latest" eager /></div>
          <div>
            <p class="text-3xl font-semibold" aria-live="assertive">{{ latest ? latest.name : 'Press the button to call the first person.' }}</p>
            <p v-if="latest" class="mt-1 text-lg text-[#dfe6f0]">{{ latest.fact }}</p>
            <p class="mt-1 text-base text-[#dfe6f0]">{{ called.length }} of {{ figures.length }} called</p>
            <div class="mt-3 flex flex-wrap gap-3">
              <button class="min-h-14 rounded-full bg-saffron px-7 text-lg font-semibold text-ink disabled:opacity-60" :disabled="called.length === figures.length" @click="caller = callNext(caller)">Call next person</button>
              <button class="min-h-14 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="caller = newCaller(figures)">Start again</button>
            </div>
          </div>
        </div>
        <h2 class="mt-6 text-xl font-semibold">Called so far</h2>
        <ul class="mt-2 flex flex-wrap gap-2"><li v-for="id in called" :key="id" class="rounded-full bg-[#16294a] px-3 py-1 text-base">{{ byId(id).name }}</li></ul>
      </section>
    </div>

    <div class="hidden print:block" aria-hidden="true">
      <section v-for="(c, n) in printCards" :key="n" class="mb-6 break-inside-avoid text-black">
        <h2 class="text-xl font-semibold">Bible Bingo</h2>
        <div class="mt-1 grid grid-cols-4 border border-black">
          <div v-for="id in c" :key="id" class="flex h-28 flex-col items-center justify-end border border-black p-1 text-center">
            <img :src="byId(id).image!" alt="" class="h-20 object-contain" /><span class="text-sm font-semibold">{{ byId(id).name }}</span>
          </div>
        </div>
      </section>
      <p class="text-xs text-black">Illustrations by Jim Padgett, courtesy of Sweet Publishing, licensed CC BY-SA 3.0 (creativecommons.org/licenses/by-sa/3.0).</p>
    </div>
  </main>
</template>
