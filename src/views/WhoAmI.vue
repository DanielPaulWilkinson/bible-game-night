<script setup lang="ts">
import { ref, computed } from 'vue'
import Shell from './Shell.vue'
import { newWhoAmI, moreClue, gotPerson, nextPerson, whoDone, pointsFor } from '../games3'
import { ding } from '../sound'
const teams = ref(2); const w = ref(newWhoAmI(2)); const started = ref(false)
const p = computed(() => w.value.deck[w.value.at])
const got = () => { w.value = gotPerson(w.value); ding() }
</script>
<template>
  <Shell id="whoami" title="Who Am I? Clue by Clue" intro="Read the clues out one at a time. Guess early for more points. Some are from the Bible and some from church history.">
    <section v-if="!started" class="page">
      <p class="text-xl">How many teams?</p>
      <div class="mt-3 flex gap-2" role="group" aria-label="Number of teams"><button v-for="n in 4" :key="n" class="chip w-14" :aria-pressed="teams === n" :class="teams === n && '!bg-saffron'" @click="teams = n">{{ n }}</button></div>
      <button class="btn mt-6" @click="w = newWhoAmI(teams); started = true">Start</button>
    </section>
    <section v-else class="page">
      <p class="flex flex-wrap gap-4 text-lg"><span v-for="(s, i) in w.scores" :key="i" :class="i === w.turn && !whoDone(w) && 'font-semibold underline'">Team {{ i + 1 }}: {{ s }}</span></p>
      <template v-if="!whoDone(w)">
        <p class="mt-3 text-lg">Team {{ w.turn + 1 }}, person {{ w.at + 1 }} of {{ w.deck.length }}. Worth {{ pointsFor(w.shown) }} {{ pointsFor(w.shown) === 1 ? 'point' : 'points' }} now.</p>
        <ol class="mt-3 list-decimal space-y-2 pl-8 text-2xl" aria-live="polite"><li v-for="c in p.clues.slice(0, w.shown)" :key="c">{{ c }}</li></ol>
        <div v-if="w.revealed" class="mt-4 border-t-2 border-ink pt-3" aria-live="polite">
          <p class="pop text-4xl font-semibold">{{ p.name }}</p>
          <p class="text-lg italic">{{ p.church ? 'From church history' : `Read about them in ${p.ref}` }}</p>
          <button class="btn mt-4" @click="w = nextPerson(w)">Next person</button>
        </div>
        <div v-else class="mt-5 flex flex-wrap gap-3"><button class="btn" @click="got">Guessed right</button><button class="btn2" @click="w = moreClue(w)">{{ w.shown < 4 ? 'Another clue' : 'Tell us' }}</button></div>
      </template>
      <div v-else class="mt-4"><p class="text-3xl font-semibold">All done! Well played, everyone.</p><button class="btn mt-4" @click="started = false">Play again</button></div>
    </section>
  </Shell>
</template>
