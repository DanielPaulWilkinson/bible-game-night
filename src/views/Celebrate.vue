<script setup lang="ts">
/** One orchestrated finish: a burst of stars in the app's colours, the winner's name large, a short fanfare.
 *  Reduced motion: no burst, the same card holds still. Worship rounds get a quiet"well done together". */
import { computed, onMounted, ref } from 'vue'
import { finishHeadline, type Finish } from '../phase24'
import { cheer, chime } from '../sound'
import LineupNext from './LineupNext.vue'
import { loadNight, inLineup } from '../night'
const props = defineProps<{ result: Finish; scores?: { name: string; score: number }[]; sound?: boolean; againLabel?: string }>()
const emit = defineEmits<{ again: [] }>()
const h = ref<HTMLElement | null>(null)
const loud = computed(() => props.result.kind === 'win' || props.result.kind === 'tie' || props.result.kind === 'together')
const COLOURS = ['#E3A23B', '#9B2C45', '#5E6B2F', '#FAF3E3', '#7FA7D9']
// Deterministic spread so the burst looks the same each time: 36 stars and diamonds fanning upward.
const bits = Array.from({ length: 36 }, (_, i) => {
  const a = (-90 + ((i * 47) % 160) - 80) * Math.PI / 180, d = 120 + ((i * 53) % 140)
  return { x: Math.cos(a) * d, y: Math.sin(a) * d, c: COLOURS[i % COLOURS.length], star: i % 3 === 0, r: (i * 71) % 360, delay: (i % 6) * 30 }
})
const said = ref('')
const inNight = inLineup(loadNight(), location.hash.replace(/^#\/?/, '').split('/')[0])
onMounted(() => { h.value?.focus(); said.value = finishHeadline(props.result); if (props.sound !== false) (loud.value ? cheer : chime)() })
</script>
<template>
  <section class="celebrate relative mt-6 overflow-hidden rounded-xl border-4 border-ink p-8 text-center text-ink" :class="loud ? 'bg-vellum' : 'bg-linen'" aria-labelledby="cele-h">
    <div v-if="loud" class="burst pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
      <span v-for="(b, i) in bits" :key="i" class="bit" :class="b.star ? 'star' : ''" :style="{ '--x': `${b.x}px`, '--y': `${b.y}px`, '--r': `${b.r}deg`, background: b.c, animationDelay: `${b.delay}ms` }" />
    </div>
    <p v-if="loud" class="relative text-2xl" aria-hidden="true">{{ result.kind === 'together' ? 'All together' : 'And the winner is' }}</p>
    <h2 id="cele-h" ref="h" tabindex="-1" class="name relative mt-1 font-semibold leading-none outline-none" :class="loud ? 'text-6xl sm:text-7xl text-pom' : 'text-4xl'" >{{ finishHeadline(result) }}</h2>
    <p v-if="!loud" class="mx-auto mt-3 max-w-[36ch] text-xl">Thank you for praying and praising together. There are no points in this one.</p>
    <ol v-if="scores?.length && loud && result.kind !== 'together'" class="relative mx-auto mt-6 max-w-xs space-y-1 text-left text-xl">
      <li v-for="s in [...scores].sort((a, b) => b.score - a.score)" :key="s.name" class="flex justify-between border-b border-ink/30 py-1"><span>{{ s.name }}</span><span class="tabular-nums">{{ s.score }}</span></li>
    </ol>
    <p class="sr-only" role="status" aria-live="polite">{{ said }}</p>
    <slot />
    <LineupNext v-if="inNight" flat class="relative text-left" @again="emit('again')" />
    <div v-else class="relative mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <button type="button" class="btn" @click="emit('again')">{{ againLabel ?? 'Play again' }}</button>
      <a href="#/" class="btn2">Choose another game</a>
    </div>
  </section>
</template>
<style scoped>
.bit { position: absolute; width: 12px; height: 12px; transform: rotate(45deg) scale(.2); opacity: 0; animation: fly 1.4s cubic-bezier(.15,.7,.3,1) forwards; }
.star { clip-path: polygon(50% 0, 61% 38%, 100% 50%, 61% 62%, 50% 100%, 39% 62%, 0 50%, 39% 38%); width: 18px; height: 18px; }
@keyframes fly { 15% { opacity: 1 } 70% { opacity: 1 } 100% { opacity: 0; transform: translate(var(--x), calc(var(--y) + 60px)) rotate(var(--r)) scale(1) } }
.name { animation: rise .5s cubic-bezier(.2,1.4,.4,1) both }
@keyframes rise { from { transform: scale(.6); opacity: 0 } }
.name:focus-visible { outline: none }
@media (prefers-reduced-motion: reduce) { .burst { display: none } .name { animation: none } }
</style>
