<script setup lang="ts">
import { ref, computed } from 'vue'
import Shell from './Shell.vue'
import { newNoah, guessed, skipAnimal, noahDone, animalsAboard, NOAH_VERSE } from '../games3'
import { ding } from '../sound'
const s = ref(newNoah()); const shown = ref(false)
const a = computed(() => s.value.deck[s.value.at])
const got = () => { s.value = guessed(s.value); shown.value = false; ding() }
const skip = () => { s.value = skipAnimal(s.value); shown.value = false }
</script>
<template>
  <Shell id="noah" title="Noah’s Animal Noises" intro="The actor peeks at the card, then makes the noise and the walk. Everyone else guesses. Each right guess sends a pair onto the ark.">
    <section class="page">
      <template v-if="!noahDone(s)">
        <p class="text-lg">Animal {{ s.at + 1 }} of {{ s.deck.length }}</p>
        <div v-if="!shown" class="mt-3"><p class="text-2xl">Only the actor looks!</p><button class="btn mt-4" @click="shown = true">Show me the animal</button></div>
        <div v-else class="mt-3">
          <p class="pop text-7xl" aria-hidden="true">{{ a.emoji }}</p>
          <p class="mt-2 text-4xl font-semibold">{{ a.name }}</p>
          <p class="mt-1 text-2xl">{{ a.act }}</p>
          <div class="mt-5 flex flex-wrap gap-3"><button class="btn" @click="got">They guessed it</button><button class="btn2" @click="skip">Skip</button></div>
        </div>
      </template>
      <div v-else class="text-center"><p class="pop text-3xl font-semibold">All aboard! {{ animalsAboard(s) }} animals on the ark.</p><button class="btn mt-4" @click="s = newNoah()">Play again</button></div>
      <div class="mt-6 border-t-2 border-ink pt-3">
        <p class="text-xl" aria-live="polite">On the ark: {{ animalsAboard(s) }} animals</p>
        <p class="mt-2 text-3xl leading-snug"><span v-for="x in s.aboard" :key="x.id" class="mr-2" :title="`Two ${x.name}s`" role="img" :aria-label="`Two ${x.name}s`">{{ x.emoji }}{{ x.emoji }}</span></p>
      </div>
      <p class="src">The animals “came to Noah to enter the ark, two by two.” {{ NOAH_VERSE.ref }}, BSB</p>
    </section>
  </Shell>
</template>
