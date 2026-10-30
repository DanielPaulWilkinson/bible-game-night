<script setup lang="ts">
/** For games without their own finish screen: a bottom bar while a lineup is on, opening the in-between screen. */
import { ref } from 'vue'
import LineupNext from './LineupNext.vue'
import { loadNight, type Lineup } from '../night'
import { stopOf } from '../catalog'
const l = loadNight() as Lineup
const open = ref(false)
</script>
<template>
  <div v-if="!open" class="fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t-4 border-ink bg-vellum px-4 py-2 font-story text-ink">
    <p class="text-lg">Game {{ l.at + 1 }} of {{ l.ids.length }} tonight</p>
    <button type="button" class="btn" @click="open = true">Finished? What’s next</button>
  </div>
  <main v-else class="fixed inset-0 z-20 overflow-y-auto bg-lapis px-4 pb-6 font-story text-linen" aria-label="Between games">
    <div class="mx-auto max-w-2xl"><LineupNext @again="open = false" /></div>
  </main>
  <div class="h-20" aria-hidden="true" />
</template>
