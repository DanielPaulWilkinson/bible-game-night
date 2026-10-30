<script setup lang="ts">
/** The night's road: every stop including the Blessing, finished ones ticked, the current one ringed in saffron.
 *  The lamp slides along the road to the current stop (it jumps under reduced motion). */
import GameLogo from './GameLogo.vue'
const props = defineProps<{ stops: { id: string; title: string; icon: string }[]; at: number }>()
const n = () => props.stops.length
const pct = () => n() > 1 ? (Math.min(props.at, n() - 1) / (n() - 1)) * 100 : 0
const inset = () => `${50 / n()}%`
</script>
<template>
  <div class="road relative mx-auto mt-2 max-w-md">
    <div :style="{ left: inset(), right: inset() }" class="absolute top-8 border-t-4 border-dashed border-saffron" aria-hidden="true" />
    <div v-if="at < stops.length" :style="{ left: inset(), right: inset() }" class="absolute top-0 h-0" aria-hidden="true"><span class="lamp absolute -top-1 block h-4 w-4 -translate-x-1/2 bg-saffron" :style="{ left: `${pct()}%` }" /></div>
    <ol class="relative flex justify-between" aria-label="Tonight’s games">
      <li v-for="(s, i) in stops" :key="s.id + i" class="flex min-w-0 flex-1 flex-col px-0.5 items-center text-center" :aria-current="i === at ? 'step' : undefined">
        <span class="relative rounded-full" :class="i === at ? 'ring-4 ring-saffron ring-offset-2 ring-offset-vellum' : i < at ? 'opacity-60' : ''">
          <GameLogo :id="s.icon" class="h-14 w-14" />
          <span v-if="i < at" class="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-olive text-base font-semibold text-linen" aria-hidden="true">✓</span>
        </span>
        <span class="mt-2 text-[15px] leading-tight" :class="i === at ? 'font-semibold' : ''">{{ s.title }}<span class="sr-only">{{ i < at ? ', done' : i === at ? ', now' : '' }}</span></span>
      </li>
    </ol>
  </div>
</template>
<style scoped>
.lamp { clip-path: polygon(50% 0, 61% 38%, 100% 50%, 61% 62%, 50% 100%, 39% 62%, 0 50%, 39% 38%); transition: left .9s cubic-bezier(.3,1.2,.4,1); }
@media (prefers-reduced-motion: reduce) { .lamp { transition: none } }
</style>
