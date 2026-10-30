<script setup lang="ts">
import { computed, ref } from 'vue'
import figuresJson from '../figures.json'
import type { Figure } from '../game'
import { newCharades, currentPrompt, gotIt, pass, nextTeam, type Charades } from '../games2'
import { useTimer } from '../timer'
import Portrait from '../Portrait.vue'
import SymbolIcon from './SymbolIcon.vue'
import Back from './Back.vue'
import Names from './Names.vue'

const figures = figuresJson as Figure[]
const c = ref<Charades | null>(null)
const showing = ref(false)
const { t, start } = useTimer(60)
const p = computed(() => c.value && currentPrompt(c.value))
const fig = computed(() => p.value?.figureId ? figures.find(f => f.id === p.value!.figureId)! : null)
const go = () => { showing.value = true; start() }
const endTurn = () => { c.value = nextTeam(c.value!); showing.value = false; t.value = { left: 60, running: false } }
</script>
<template>
  <main class="mx-auto max-w-4xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Bible Charades</h1>
    <p class="mt-1 text-lg text-[#dfe6f0]">Act it out with no talking. Your team guesses before the time runs out.</p>
    <Names v-if="!c" label="Team" :defaults="['Team Sun', 'Team Star', 'Team Sea', 'Team Hill']" @start="n => (c = newCharades(n))" />
    <template v-else>
      <ul class="mt-4 flex flex-wrap gap-3" aria-label="Scores">
        <li v-for="(n, i) in c.teams.names" :key="n" class="rounded-xl px-4 py-2 text-xl" :class="i === c.teams.turn ? 'bg-saffron text-ink font-semibold' : 'bg-[#16294a]'">{{ n }}: {{ c.teams.scores[i] }}</li>
      </ul>
      <section v-if="!showing" class="mt-6 rounded-xl bg-[#16294a] p-6 text-center shadow-[0_6px_0_#0f1d33]">
        <p class="text-2xl">{{ c.teams.names[c.teams.turn] }}, choose an actor. Only the actor looks at the screen.</p>
        <button class="mt-4 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold text-ink" @click="go">Show me and start the timer</button>
      </section>
      <section v-else class="mt-6 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <div class="overflow-hidden rounded-xl bg-linen text-center text-ink shadow-[0_6px_0_#0f1d33]">
          <div class="mx-auto aspect-[4/3] max-h-80 w-full">
            <Portrait v-if="fig" :f="fig" eager />
            <img v-else-if="p!.scene" :src="`scenes/${p!.scene}.webp`" alt="" width="480" height="353" class="h-full w-full object-cover" />
            <div v-else class="mx-auto h-full w-2/3 p-6"><SymbolIcon :icon="p!.icon!" /></div>
          </div>
          <p class="p-4 text-5xl font-semibold" aria-live="polite">{{ p!.word }}</p>
        </div>
        <div class="text-center">
          <p class="text-6xl font-semibold tabular-nums" :class="t.left <= 10 ? 'text-saffron' : ''" role="timer" aria-live="off">{{ t.left }}</p>
          <p class="text-base text-[#dfe6f0]">seconds left</p>
          <p class="mt-2 text-lg">Got {{ c.got }} · Passed {{ c.passed }}</p>
          <div class="mt-4 flex flex-col gap-3">
            <button class="min-h-14 rounded-full bg-saffron text-xl font-semibold text-ink disabled:opacity-60" :disabled="!t.running" @click="c = gotIt(c)">Got it!</button>
            <button class="min-h-14 rounded-full bg-linen text-xl font-semibold text-ink disabled:opacity-60" :disabled="!t.running" @click="c = pass(c)">Pass</button>
            <button class="min-h-12 rounded-full bg-[#16294a] text-base font-semibold ring-2 ring-linen" @click="endTurn">{{ t.running ? 'End turn' : 'Time up! Next team' }}</button>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>
