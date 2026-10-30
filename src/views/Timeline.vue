<script setup lang="ts">
import { ref, computed } from 'vue'
import Shell from './Shell.vue'
import { newTimeline, placeEvent, timelineDone } from '../games3'
import { ding, buzz } from '../sound'
const t = ref(newTimeline())
const left = computed(() => t.value.cards.filter(c => !t.value.placed.includes(c)))
const pick = (id: string) => { t.value = placeEvent(t.value, id); (t.value.last === 'right' ? ding : buzz)() }
</script>
<template>
  <Shell id="timeline" title="The Big Story Timeline" intro="Put the Bible’s big story in order, from Creation to New Creation. Tap the event that comes next on the road.">
    <section class="page grid gap-6 sm:grid-cols-[1fr_1fr]">
      <ol class="relative" aria-label="The road so far">
        <svg class="absolute inset-0 h-full w-full" viewBox="0 0 300 360" preserveAspectRatio="none" aria-hidden="true">
          <path d="M40 10C260 40 260 100 150 130S30 220 150 250 270 330 150 355" fill="none" stroke="#cdb98c" stroke-width="26" stroke-linecap="round" />
          <path d="M40 10C260 40 260 100 150 130S30 220 150 250 270 330 150 355" fill="none" stroke="#2B2117" stroke-width="2" stroke-dasharray="6 8" />
        </svg>
        <li v-for="(e, i) in t.cards" :key="i" class="relative mb-2 flex min-h-12 items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink text-lg font-semibold" :class="t.placed[i] ? 'bg-saffron' : 'bg-linen'">{{ i + 1 }}</span>
          <span v-if="t.placed[i]" class="rounded bg-linen/90 px-2 text-xl font-semibold">{{ t.placed[i].title }} <span class="text-base italic">{{ t.placed[i].ref }}</span></span>
        </li>
      </ol>
      <div>
        <p class="text-xl" aria-live="polite">{{ t.last === 'wrong' ? 'Not yet! Something else comes first.' : t.last === 'right' ? 'Yes! On the road it goes.' : 'What comes first?' }}</p>
        <div v-if="!timelineDone(t)" class="mt-3 grid gap-2">
          <button v-for="c in left" :key="c.id" class="chip justify-start text-left" @click="pick(c.id)">{{ c.title }}</button>
        </div>
        <div v-else><p class="pop mt-3 text-3xl font-semibold">The whole story, in order!</p><p class="mt-1 text-xl">{{ t.mistakes === 0 ? 'No wrong turns at all.' : `${t.mistakes} wrong turns on the way.` }}</p><button class="btn mt-4" @click="t = newTimeline()">New story road</button></div>
      </div>
    </section>
  </Shell>
</template>
