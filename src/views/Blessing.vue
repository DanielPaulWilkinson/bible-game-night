<script setup lang="ts">
import { ref } from 'vue'
import Shell from './Shell.vue'
import NightPath from './NightPath.vue'
import { BLESSING } from '../gamenight'
import { loadNight, saveNight, stops } from '../night'
import { stopOf } from '../catalog'
const night = loadNight()
const path = night ? stops(night).map(stopOf) : []
const complete = ref(false), h = ref<HTMLElement | null>(null)
const finishNight = async () => { complete.value = true; saveNight(null); setTimeout(() => h.value?.focus(), 0) }
</script>
<template>
  <Shell id="blessing" title="Blessing Round" intro="Stand together and say it over each other. No points.">
    <section v-if="!complete" class="mt-6 rounded-xl border-4 border-ink bg-vellum p-8 text-center text-ink" aria-label="The blessing">
      <blockquote class="mx-auto max-w-[34ch] space-y-2 text-2xl leading-snug"><p v-for="b in BLESSING" :key="b.verse">{{ b.text }}</p></blockquote>
      <p class="mt-4 text-base italic">Numbers 6:24–26, Berean Standard Bible</p>
      <button v-if="night" type="button" class="btn mt-6" @click="finishNight">Amen. Finish the night</button>
      <a v-else href="#/" class="btn mt-6">Back to all games</a>
    </section>
    <section v-else class="mt-6 rounded-xl border-4 border-ink bg-vellum p-8 text-center text-ink" aria-labelledby="done-h">
      <h2 id="done-h" ref="h" tabindex="-1" class="text-4xl font-semibold outline-none">Night complete</h2>
      <p class="mt-2 text-xl">Every stop played. Goodnight, and God bless.</p>
      <p class="sr-only" role="status" aria-live="polite">Night complete.</p>
      <NightPath :stops="path" :at="path.length" class="mt-4" />
      <a href="#/" class="btn mt-6">Back to all games</a>
    </section>
  </Shell>
</template>
