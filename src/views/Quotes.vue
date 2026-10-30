<script setup lang="ts">
import GameLogo from './GameLogo.vue'
import { computed, ref } from 'vue'
import figuresJson from '../figures.json'
import type { Figure } from '../game'
import { newQuiz, answer, nextRound, quizDone, type Quiz } from '../games'
import Portrait from '../Portrait.vue'
import Back from './Back.vue'

const figures = figuresJson as Figure[]
const byId = (id: string) => figures.find(f => f.id === id)!
const q = ref<Quiz>(newQuiz(figures))
const round = computed(() => q.value.rounds[q.value.at])
const right = computed(() => q.value.answered === round.value?.quote.figureId)
const say = () => { const s = window.speechSynthesis; if (!s || !round.value) return; s.cancel(); s.speak(new SpeechSynthesisUtterance(round.value.quote.text)) }
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window
</script>

<template>
  <main class="mx-auto max-w-3xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="flex items-center gap-3 mt-2 text-3xl font-semibold sm:text-4xl"><GameLogo id="quotes" class="h-14 w-14 shrink-0" />Who said or wrote it?</h1>
    <template v-if="!quizDone(q)">
      <p class="mt-1 text-lg text-[#dfe6f0]">Question {{ q.at + 1 }} of {{ q.rounds.length }}. Read the words out loud, then pick who said them.</p>
      <blockquote class="mt-4 rounded-xl bg-linen p-5 text-ink shadow-[0_6px_0_#0f1d33]">
        <p class="text-2xl leading-snug sm:text-3xl">&ldquo;{{ round.quote.text }}&rdquo;</p>
        <footer class="mt-2 text-base text-[#5a4a38]">{{ round.quote.ref }}, Berean Standard Bible</footer>
      </blockquote>
      <button v-if="canSpeak" class="btn2 mt-3" @click="say">Read it to me</button>
      <ul class="mt-4 grid grid-cols-3 gap-3" aria-label="Who said it?">
        <li v-for="id in round.choices" :key="id">
          <button class="tile block w-full overflow-hidden rounded-lg bg-linen text-ink shadow-[0_4px_0_#0f1d33] disabled:cursor-default"
                  :class="q.answered && id === round.quote.figureId ? 'ring-4 ring-olive' : q.answered === id ? 'ring-4 ring-saffron' : ''"
                  :disabled="!!q.answered" @click="q = answer(q, id)">
            <span class="block aspect-[3/4] w-full"><Portrait :f="byId(id)" eager /></span>
            <span class="block px-2 py-2 text-base font-semibold sm:text-lg">{{ byId(id).name }}</span>
          </button>
        </li>
      </ul>
      <div class="mt-4 min-h-24" aria-live="polite">
        <template v-if="q.answered">
          <p class="text-xl font-semibold" :class="right ? 'text-saffron' : 'text-linen'">{{ right ? `Yes! ${byId(round.quote.figureId).name} said it.` : `Good try! It was ${byId(round.quote.figureId).name}.` }}</p>
          <button class="btn mt-3" @click="q = nextRound(q)">{{ q.at + 1 < q.rounds.length ? 'Next question' : 'See how you did' }}</button>
        </template>
      </div>
    </template>
    <section v-else class="mt-6 text-center" aria-live="polite">
      <p class="text-3xl font-semibold text-saffron">You got {{ q.score }} out of {{ q.rounds.length }}!</p>
      <p class="mt-2 text-xl">{{ q.score >= 7 ? 'Brilliant listening!' : q.score >= 4 ? 'Well done!' : 'Good effort! Every go helps you learn.' }}</p>
      <button class="btn mt-6" @click="q = newQuiz(figures)">Play again</button>
    </section>
  </main>
</template>
