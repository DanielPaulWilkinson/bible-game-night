<script setup lang="ts">
import { computed, ref } from 'vue'
import { QUIZ, newQuizNight, quizQuestion, showAnswer, award, nextQuestion, quizNightDone, leaders, type QuizNight } from '../games2'
import Back from './Back.vue'
import Names from './Names.vue'
const n = ref<QuizNight | null>(null)
const q = computed(() => n.value && quizQuestion(n.value))
const letters = ['A', 'B', 'C']
</script>
<template>
  <main class="mx-auto max-w-6xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Quiz Night</h1>
    <template v-if="!n">
      <p class="mt-1 text-lg text-[#dfe6f0]">Three rounds of five questions. Put it on the TV or laptop. Teams shout or write their answer, then the host reveals it.</p>
      <Names label="Team" :defaults="['Lions', 'Lambs', 'Doves', 'Fish']" @start="x => (n = newQuizNight(x))" />
    </template>
    <template v-else>
      <ul class="mt-3 grid gap-3" style="grid-template-columns:repeat(var(--c),minmax(0,1fr))" :style="{ '--c': n.teams.names.length }" aria-label="Scoreboard">
        <li v-for="(name, i) in n.teams.names" :key="name" class="rounded-xl bg-[#16294a] p-3 text-center shadow-[0_6px_0_#0f1d33]">
          <span class="block truncate text-xl sm:text-2xl">{{ name }}</span><span class="block text-5xl font-semibold text-saffron sm:text-7xl">{{ n.teams.scores[i] }}</span>
        </li>
      </ul>
      <section v-if="q" class="mt-6 rounded-xl bg-[#16294a] p-6 shadow-[0_6px_0_#0f1d33] sm:p-8">
        <p class="text-lg text-[#dfe6f0]">Round {{ n.round + 1 }}: {{ QUIZ[n.round].title }} · Question {{ n.at + 1 }} of 5</p>
        <p class="mt-2 text-3xl font-semibold sm:text-5xl">{{ q.q }}</p>
        <ol class="mt-4 grid gap-3 sm:grid-cols-3">
          <li v-for="(c, i) in q.choices" :key="c" class="rounded-lg px-4 py-3 text-2xl sm:text-3xl" :class="n.shown && c === q.answer ? 'bg-saffron font-semibold text-ink' : 'bg-lapis'">{{ letters[i] }}. {{ c }}<span v-if="n.shown && c === q.answer" class="sr-only"> (correct)</span></li>
        </ol>
        <p v-if="n.shown" class="mt-3 text-xl" aria-live="polite">{{ q.answer }}. Read it in {{ q.ref }}.</p>
        <div v-if="!n.shown" class="mt-5"><button class="min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold text-ink" @click="n = showAnswer(n)">Show the answer</button></div>
        <div v-else class="mt-5">
          <p class="text-lg">Who got it right? Tap each team.</p>
          <div class="mt-2 flex flex-wrap gap-3">
            <button v-for="(name, i) in n.teams.names" :key="name" :aria-pressed="n.awarded.includes(i)" class="min-h-14 rounded-full px-6 text-lg font-semibold" :class="n.awarded.includes(i) ? 'bg-saffron text-ink' : 'bg-linen text-ink'" @click="n = award(n, i)">{{ n.awarded.includes(i) ? '✓ ' : '' }}{{ name }}</button>
            <button class="min-h-14 rounded-full bg-[#16294a] px-6 text-lg font-semibold ring-2 ring-linen" @click="n = nextQuestion(n)">Next question</button>
          </div>
        </div>
      </section>
      <section v-else-if="quizNightDone(n)" class="mt-6 rounded-xl bg-[#16294a] p-8 text-center">
        <p class="text-4xl font-semibold text-saffron">{{ leaders(n.teams).join(' and ') }} {{ leaders(n.teams).length > 1 ? 'share the top spot' : 'came top' }}!</p>
        <p class="mt-2 text-xl">Thanks for playing, everyone.</p>
        <button class="mt-4 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold text-ink" @click="n = null">New quiz night</button>
      </section>
    </template>
  </main>
</template>
