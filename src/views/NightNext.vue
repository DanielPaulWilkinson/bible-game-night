<script setup lang="ts">
/** In-between screen for a night of games: where we are, then next / again / skip / end, then a pass-the-phone cue. */
import { onMounted, ref } from 'vue'
import NightPath from './NightPath.vue'
type Stop = { id: string; title: string; icon: string }
const props = defineProps<{ stops: Stop[]; at: number; scores?: { name: string; score: number }[]; done?: string; flat?: boolean }>()
const emit = defineEmits<{ next: []; again: []; skip: []; end: [] }>()
const cue = ref(false)
const h = ref<HTMLElement | null>(null), c = ref<HTMLElement | null>(null)
const next = props.stops[props.at + 1], after = props.stops[props.at + 2]
const label = next?.id === 'blessing' ? 'Go to the Blessing Round' : `Next game: ${next?.title}`
const said = ref('')
onMounted(() => { h.value?.focus(); said.value = `${props.done ?? 'Game'} finished. ${label}.` })
const go = async () => { if (next?.id === 'blessing') return emit('next'); cue.value = true; said.value = `Hand the phone to the next host. ${next?.title} is next.`; await Promise.resolve(); setTimeout(() => c.value?.focus(), 0) }
</script>
<template>
  <section :class="flat ? 'mt-6 border-t-4 border-ink pt-5 pb-20 sm:pb-0' : 'mt-6 rounded-xl border-4 border-ink bg-vellum p-5 pb-24 sm:pb-6'" class="text-ink" aria-labelledby="nn-h">
    <p class="sr-only" role="status" aria-live="polite">{{ said }}</p>
    <template v-if="!cue">
      <h2 id="nn-h" ref="h" tabindex="-1" class="text-3xl font-semibold outline-none">{{ done ? `${done} is done` : 'Game done' }}</h2>
      <slot />
      <ol v-if="scores?.length" class="mt-3 max-w-xs space-y-1 text-xl" aria-label="Family scores so far">
        <li v-for="s in [...scores].sort((a, b) => b.score - a.score)" :key="s.name" class="flex justify-between border-b border-ink/30 py-1"><span>{{ s.name }}</span><span class="tabular-nums">{{ s.score }}</span></li>
      </ol>
      <p class="mt-5 text-xl font-semibold">Tonight so far</p>
      <NightPath :stops="stops" :at="at" />
      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" class="btn2" @click="emit('again')">Play this again</button>
        <button v-if="after" type="button" class="btn2" @click="emit('skip')">Skip to {{ after.title }}</button>
        <button type="button" class="btn3 sm:col-span-2" @click="emit('end')">End game night</button>
      </div>
      <div class="next-bar fixed inset-x-0 bottom-0 z-10 border-t-4 border-ink bg-vellum p-3 sm:static sm:mt-5 sm:border-0 sm:bg-transparent sm:p-0">
        <button type="button" class="btn w-full text-2xl sm:w-auto" @click="go">{{ label }}</button>
      </div>
    </template>
    <div v-else class="py-6 text-center">
      <h2 ref="c" tabindex="-1" class="text-4xl font-semibold outline-none">Hand the phone to the next host</h2>
      <p class="mt-3 text-xl">Up next: {{ next?.title }}</p>
      <NightPath :stops="stops" :at="at + 1" />
      <div class="next-bar fixed inset-x-0 bottom-0 z-10 border-t-4 border-ink bg-vellum p-3 sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0">
        <button type="button" class="btn w-full text-2xl sm:w-auto" @click="emit('next')">I’ve got it. Start {{ next?.title }}</button>
      </div>
    </div>
  </section>
</template>
