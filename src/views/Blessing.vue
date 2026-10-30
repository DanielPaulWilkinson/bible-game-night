<script setup lang="ts">
import Shell from './Shell.vue'
import { BLESSING } from '../gamenight'
</script>
<template>
  <Shell id="thanks" title="Blessing Round" intro="The end of tonight's games. Stand together and say it over each other. No points.">
    <section class="mt-6 rounded-xl border-4 border-ink bg-vellum p-8 text-center text-ink" aria-label="The blessing">
      <blockquote class="mx-auto max-w-[34ch] space-y-2 text-2xl leading-snug"><p v-for="b in BLESSING" :key="b.verse">{{ b.text }}</p></blockquote>
      <p class="mt-4 text-base italic">Numbers 6:24–26, Berean Standard Bible</p>
      <a href="#/" class="mt-6 inline-flex min-h-14 items-center rounded-full bg-saffron px-8 text-xl font-semibold ring-2 ring-ink">Back to all games</a>
    </section>
  </Shell>
</template>
