<script setup lang="ts">
import GameLogo from './GameLogo.vue'
import { computed, ref } from 'vue'
import { newVote, revealFact, nextFact, voteDone } from '../games2'
import Back from './Back.vue'
const v = ref(newVote())
const f = computed(() => v.value.deck[v.value.at])
</script>
<template>
  <main class="mx-auto max-w-4xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="flex items-center gap-3 mt-2 text-3xl font-semibold sm:text-4xl"><GameLogo id="real" class="h-14 w-14 shrink-0" />Real or Made Up?</h1>
    <p class="mt-1 text-lg text-[#dfe6f0]">Read it out. Hands up for <strong>real</strong>, arms folded for <strong>made up</strong>. Then reveal.</p>
    <section v-if="!voteDone(v)" class="mt-6 rounded-xl bg-[#16294a] p-6 shadow-[0_6px_0_#0f1d33] sm:p-10">
      <p class="text-base text-[#dfe6f0]">{{ v.at + 1 }} of {{ v.deck.length }}</p>
      <p class="mt-2 text-3xl font-semibold leading-snug sm:text-4xl">{{ f.text }}</p>
      <div aria-live="polite">
        <div v-if="v.revealed" class="mt-6 rounded-lg p-4 text-ink" :class="f.real ? 'bg-saffron' : 'bg-linen'">
          <p class="text-2xl font-semibold">{{ f.truth }}</p>
          <p class="mt-1 text-lg">Read it in {{ f.ref }}</p>
        </div>
      </div>
      <button v-if="!v.revealed" class="btn mt-6" @click="v = revealFact(v)">Reveal the answer</button>
      <button v-else class="btn2 mt-6" @click="v = nextFact(v)">Next one</button>
    </section>
    <section v-else class="mt-6 rounded-xl bg-[#16294a] p-6 text-center">
      <p class="text-3xl font-semibold">All done! Well played.</p>
      <button class="btn mt-4" @click="v = newVote()">Play again</button>
    </section>
    <p class="mt-4 text-base text-[#dfe6f0]">Bible references are from the Berean Standard Bible.</p>
  </main>
</template>
