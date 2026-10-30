<script setup lang="ts">
import { ref } from 'vue'
import Shell from './Shell.vue'
import { newSheep, closer, further, found, baaVolume, warmthWord, SHEEP_VERSE } from '../games3'
import { baa, party } from '../sound'
const s = ref(newSheep())
const go = (f: typeof closer) => { s.value = f(s.value); baa(baaVolume(s.value)) }
const win = () => { s.value = found(s.value); party() }
</script>
<template>
  <Shell id="sheep" title="Hide the Lost Sheep" intro="A grown-up hides a toy sheep in the room. The seeker searches while the grown-up taps closer or further. The baa gets louder as they get near.">
    <section class="page text-center">
      <template v-if="!s.found">
        <p class="text-lg">For the grown-up</p>
        <div class="mx-auto mt-3 h-6 max-w-md overflow-hidden rounded-full border-2 border-ink bg-[#c9d7e8]" role="meter" aria-label="How close" aria-valuemin="0" aria-valuemax="10" :aria-valuenow="s.warmth">
          <div class="h-full bg-pom transition-all" :style="{ width: `${s.warmth * 10}%` }" />
        </div>
        <p class="mt-2 text-3xl font-semibold" aria-live="polite">{{ warmthWord(s.warmth) }}</p>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <button class="btn" @click="go(closer)">Closer (louder baa)</button>
          <button class="btn2" @click="go(further)">Further away</button>
        </div>
        <button class="btn mt-4 !bg-olive !text-linen" @click="win">Found it!</button>
      </template>
      <div v-else aria-live="polite">
        <p class="pop text-7xl" aria-hidden="true">🐑🎉</p>
        <p class="mt-3 text-3xl font-semibold">“Rejoice with me, for I have found my lost sheep!”</p>
        <p class="src">{{ SHEEP_VERSE.ref }}, BSB</p>
        <button class="btn mt-4" @click="s = newSheep()">Hide it again</button>
      </div>
    </section>
  </Shell>
</template>
