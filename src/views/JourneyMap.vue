<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { JOURNEYS, project, stepStop } from '../games'
import Back from './Back.vue'

const which = ref(0)
const at = ref(0)
const j = computed(() => JOURNEYS[which.value])
const pts = computed(() => j.value.stops.map(s => ({ ...s, ...project(s.lon, s.lat) })))
const stop = computed(() => pts.value[at.value])
const path = (ll: [number, number][], close = true) => ll.map(([a, b], i) => { const p = project(a, b); return `${i ? 'L' : 'M'}${p.x} ${p.y}` }).join(' ') + (close ? 'Z' : '')
const sea = path([[28, 40], [28, 36.8], [29.5, 36.2], [30.6, 36.8], [31.5, 36.6], [32.8, 36.0], [34.0, 36.3], [34.9, 36.8], [36.2, 36.6], [35.9, 35.4], [35.8, 34.4], [35.5, 33.6], [35.0, 32.8], [34.5, 31.6], [34.2, 31.3], [33.0, 31.1], [32.3, 31.3], [31.0, 31.6], [29.9, 31.2], [28, 30.9]].slice(1) as [number, number][])
const cyprus = path([[32.3, 35.0], [32.9, 35.4], [34.0, 35.4], [34.6, 35.7], [34.0, 35.0], [33.0, 34.6], [32.4, 34.7]])
const gulf = path([[48, 30.0], [47.6, 30.05], [47.9, 29.6], [48, 29.4]])
const euphrates = path([[38.5, 37.6], [38.0, 36.0], [40.0, 35.0], [42.0, 34.2], [44.3, 32.6], [46.1, 31.0], [47.6, 30.05]], false)
const tigris = path([[40.5, 37.9], [42.2, 37.0], [43.1, 36.3], [44.4, 33.3], [46.0, 32.0], [47.6, 30.05]], false)
const dead = project(35.5, 31.5), galilee = project(35.6, 32.8)
const label = (lon: number, lat: number) => project(lon, lat)
/** Zoom to the stops of this journey, keeping the 10:7 shape. */
const vb = computed(() => {
  const xs = pts.value.map(p => p.x), ys = pts.value.map(p => p.y)
  let x0 = Math.min(...xs) - 70, x1 = Math.max(...xs) + 70, y0 = Math.min(...ys) - 60, y1 = Math.max(...ys) + 60
  let w = x1 - x0, h = y1 - y0
  if (w / h < 10 / 7) { const nw = h * 10 / 7; x0 -= (nw - w) / 2; w = nw } else { const nh = w * 7 / 10; y0 -= (nh - h) / 2; h = nh }
  return { x: x0, y: y0, w, h, k: w / 1000 }
})
const routeD = computed(() => pts.value.slice(0, at.value + 1).map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' '))
function choose(i: number) { which.value = i; at.value = 0 }
const step = (d: 1 | -1) => (at.value = stepStop(j.value, at.value, d))
const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') step(1); else if (e.key === 'ArrowLeft') step(-1) }
onMounted(() => addEventListener('keydown', onKey)); onUnmounted(() => removeEventListener('keydown', onKey))
</script>

<template>
  <main class="mx-auto max-w-5xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Journey Map</h1>
    <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose a journey">
      <button v-for="(jj, i) in JOURNEYS" :key="jj.id" class="min-h-12 rounded-full px-5 text-base font-semibold" :class="which === i ? 'bg-saffron text-ink' : 'bg-linen text-ink'" :aria-pressed="which === i" @click="choose(i)">{{ jj.title }}</button>
    </div>
    <figure class="mt-4 overflow-hidden rounded-xl border-4 border-[#c9a76a] shadow-[0_6px_0_#0f1d33]">
      <svg :viewBox="`${vb.x} ${vb.y} ${vb.w} ${vb.h}`" class="block h-auto w-full bg-[#ead8ae]" role="img" :aria-label="`Simplified map of ${j.title}. Stop ${at + 1} of ${j.stops.length}: ${stop.name}.`">
        <path :d="sea" fill="#7fa7c9" />
        <path :d="cyprus" fill="#ead8ae" stroke="#6b8fb0" :stroke-width="2 * vb.k" />
        <path :d="gulf" fill="#7fa7c9" />
        <path :d="euphrates" fill="none" stroke="#6b97c2" :stroke-width="5 * vb.k" stroke-linecap="round" />
        <path :d="tigris" fill="none" stroke="#6b97c2" :stroke-width="4 * vb.k" stroke-linecap="round" />
        <ellipse :cx="dead.x" :cy="dead.y" :rx="5" :ry="11" fill="#7fa7c9" />
        <ellipse :cx="galilee.x" :cy="galilee.y" :rx="4" :ry="6" fill="#7fa7c9" />
        <g :font-size="22 * vb.k" fill="#4a5f78" font-style="italic" font-family="Georgia, serif" text-anchor="middle">
          <text :x="label(31, 33.6).x" :y="label(31, 33.6).y">Great Sea</text>
          <text :x="label(42.6, 35.1).x" :y="label(42.6, 35.1).y" fill="#4a7aa8">Euphrates</text>
        </g>
        <g :font-size="20 * vb.k" fill="#7a5a32" font-family="Georgia, serif" text-anchor="middle" letter-spacing="2">
          <text :x="label(30.5, 30.1).x" :y="label(30.5, 30.1).y">EGYPT</text>
          <text :x="label(36.4, 31.0).x" :y="label(36.4, 31.0).y">CANAAN</text>
          <text :x="label(33.2, 39.2).x" :y="label(33.2, 39.2).y">GALATIA</text>
          <text :x="label(33.6, 35.2).x" :y="label(33.6, 35.2).y" :font-size="14 * vb.k">CYPRUS</text>
        </g>
        <path :d="routeD" fill="none" stroke="#9B2C45" :stroke-width="5 * vb.k" stroke-dasharray="10 7" stroke-linecap="round" class="route" />
        <g v-for="(p, i) in pts" :key="p.name + i">
          <circle :cx="p.x" :cy="p.y" :r="(i === at ? 11 : 7) * vb.k" :fill="i <= at ? '#9B2C45' : '#FAF3E3'" stroke="#2B2117" :stroke-width="2 * vb.k" />
          <text v-if="i <= at && !(i === pts.length - 1 && p.lon === pts[0].lon && at !== i)" :x="p.x + 14 * vb.k" :y="p.below ? p.y + 30 * vb.k : p.y - 12 * vb.k" :font-size="(i === at ? 30 : 22) * vb.k" fill="#2B2117" font-family="Georgia, serif" :font-weight="i === at ? 700 : 400" paint-order="stroke" stroke="#ead8ae" :stroke-width="5 * vb.k">{{ p.name }}</text>
        </g>
      </svg>
      <figcaption class="bg-[#16294a] px-3 py-1 text-sm text-[#dfe6f0]">Simplified map. Places are roughly where they were; the lines between them are not the exact roads.</figcaption>
    </figure>
    <section class="mt-4 rounded-xl bg-linen p-5 text-ink shadow-[0_6px_0_#0f1d33]" aria-live="polite">
      <p class="text-base text-[#5a4a38]">Stop {{ at + 1 }} of {{ j.stops.length }}</p>
      <h2 class="text-2xl font-semibold">{{ stop.name }}</h2>
      <p class="mt-1 text-xl">{{ stop.caption }}</p>
      <p class="mt-1 text-base text-[#5a4a38]">{{ stop.ref }}</p>
    </section>
    <div class="mt-4 flex gap-3">
      <button class="min-h-14 flex-1 rounded-full bg-linen px-5 text-lg font-semibold text-ink disabled:opacity-50" :disabled="at === 0" @click="step(-1)">Back a stop</button>
      <button class="min-h-14 flex-1 rounded-full bg-saffron px-5 text-lg font-semibold text-ink disabled:opacity-50" :disabled="at === j.stops.length - 1" @click="step(1)">Next stop</button>
    </div>
  </main>
</template>
