<script setup lang="ts">
import { ref, computed } from 'vue'
import Shell from './Shell.vue'
import { PLACES, newHunt, tapPlace, skipPlace, huntDone, type Place } from '../games3'
import { ding, buzz } from '../sound'
const h = ref(newHunt())
const want = computed(() => h.value.order[h.value.at])
const done = (p: Place) => huntDone(h.value) || h.value.order.slice(0, h.value.at).includes(p)
const tap = (id: string) => { h.value = tapPlace(h.value, id); (h.value.last?.right ? ding : buzz)() }
</script>
<template>
  <Shell id="world" title="Where in the World?" intro="A simple map of the land of the Bible. Find the place and tap it.">
    <section class="page grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <svg viewBox="0 0 100 140" class="mx-auto w-full max-w-sm" role="group" aria-label="Map of the land of Israel">
        <rect width="100" height="140" fill="#b9cfe0" />
        <path d="M30 0H100V140H52C46 120 40 108 34 96 26 82 22 70 24 58 26 44 30 36 32 26 33 16 30 8 30 0z" fill="#F3E6C8" stroke="#2B2117" stroke-width="1.2" />
        <path d="M70 0C68 10 66 24 66 30" fill="none" stroke="#6f9cc0" stroke-width="1.6" />
        <ellipse cx="66" cy="34" rx="4" ry="6" fill="#8fb5d3" stroke="#2B2117" stroke-width=".8" />
        <path d="M66 40C68 52 64 64 67 76S68 90 68 96" fill="none" stroke="#6f9cc0" stroke-width="1.6" />
        <path d="M66 96C63 104 64 112 67 120 70 114 72 104 70 96z" fill="#8fb5d3" stroke="#2B2117" stroke-width=".8" />
        <text x="8" y="60" font-size="5" fill="#2B2117" font-style="italic" transform="rotate(-70 8 60)">Great Sea</text>
        <text x="72" y="70" font-size="4" fill="#2B2117" font-style="italic">Jordan</text>
        <g v-for="p in PLACES" :key="p.id">
          <circle :cx="p.x" :cy="p.y" r="7" fill="transparent" class="cursor-pointer" role="button" tabindex="0" :aria-label="done(p) ? p.name : 'A place on the map'" @click="tap(p.id)" @keydown.enter.prevent="tap(p.id)" @keydown.space.prevent="tap(p.id)" />
          <circle :cx="p.x" :cy="p.y" r="2.6" pointer-events="none" stroke="#2B2117" stroke-width=".8" :fill="done(p) ? '#5E6B2F' : h.last?.id === p.id && !h.last.right ? '#9B2C45' : '#E3A23B'" />
          <text v-if="done(p)" :x="p.x + 4" :y="p.y + 1.5" font-size="4.2" fill="#2B2117" pointer-events="none">{{ p.name }}</text>
        </g>
      </svg>
      <div aria-live="polite">
        <template v-if="!huntDone(h)">
          <p class="text-lg">{{ h.at + 1 }} of {{ h.order.length }}. Score {{ h.score }}</p>
          <p class="mt-1 text-4xl font-semibold">Find {{ want.name }}</p>
          <p class="mt-2 text-xl">{{ want.hint }} <span class="italic">({{ want.ref }})</span></p>
          <p v-if="h.last && !h.last.right" class="mt-3 text-xl text-pom">Not there. Try another dot.</p>
          <button class="btn2 mt-4" @click="h = skipPlace(h)">Show me and move on</button>
        </template>
        <template v-else><p class="pop text-3xl font-semibold">You found {{ h.score }} of {{ h.order.length }}!</p><button class="btn mt-4" @click="h = newHunt()">Play again</button></template>
        <p class="src">The map is simplified and not to scale.</p>
      </div>
    </section>
  </Shell>
</template>
