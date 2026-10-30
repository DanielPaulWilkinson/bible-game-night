<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useTimer } from '../timer'
import { pitchFrom, tiltStep, type Reveal, type TiltState } from '../turn'
const props = defineProps<{ who: string; seconds: number; reveal?: Reveal[] | null; mult?: number; prompt?: string }>()
const emit = defineEmits<{ correct: []; skip: []; timeup: []; next: [] }>()
const phase = ref<'ready' | 'playing' | 'reveal'>('ready')
const { t, start, stop } = useTimer(props.seconds)
const tilt = ref(false), tiltMsg = ref('')
let ts: TiltState = { armed: true }
const onOrient = (e: DeviceOrientationEvent) => {
  if (phase.value !== 'playing') return
  const angle = (screen.orientation?.angle ?? (window as unknown as { orientation?: number }).orientation ?? 0) as number
  const [s, g] = tiltStep(ts, pitchFrom(e.beta, e.gamma, angle > 180 ? angle - 360 : angle)); ts = s
  if (g === 'correct') emit('correct'); else if (g === 'skip') emit('skip')
}
async function useTilt() {
  const D = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent
  if (!D) { tiltMsg.value = 'This device has no tilt sensor. Use the buttons.'; return }
  if (typeof D.requestPermission === 'function') {
    try { if ((await D.requestPermission()) !== 'granted') { tiltMsg.value = 'Tilt was not allowed. Use the buttons.'; return } } catch { tiltMsg.value = 'Tilt was not allowed. Use the buttons.'; return }
  }
  addEventListener('deviceorientation', onOrient); tilt.value = true; tiltMsg.value = 'Tilt on: hold the phone on your forehead. Tip down for correct, up to skip.'
}
const go = () => { phase.value = 'playing'; ts = { armed: true }; start(props.seconds) }
watch(() => t.value.running, (r, was) => { if (was && !r && phase.value === 'playing') { emit('timeup'); phase.value = props.reveal ? 'reveal' : 'ready' } })
watch(() => props.reveal, r => { if (r && phase.value !== 'playing') phase.value = 'reveal' })
const endEarly = () => { stop(); emit('timeup'); phase.value = props.reveal ? 'reveal' : 'ready' }
const next = () => { phase.value = 'ready'; emit('next') }
onUnmounted(() => removeEventListener('deviceorientation', onOrient))
defineExpose({ phase, go })
</script>
<template>
  <Transition name="turn" mode="out-in">
  <section v-if="phase === 'ready'" class="mt-6 rounded-xl border-4 border-ink bg-vellum p-6 text-center text-ink" aria-labelledby="turn-who">
    <p id="turn-who" class="text-4xl font-semibold">{{ who }}’s turn</p>
    <p v-if="(mult ?? 1) > 1" class="mt-2 text-2xl font-semibold text-pom">Double points!</p>
    <p class="mx-auto mt-3 max-w-[40ch] text-xl">Everyone else, look away. Pass the phone face down to the player, then press start.</p>
    <slot name="ready" />
    <div class="mt-5 flex flex-col items-center gap-3">
      <button class="min-h-14 rounded-full bg-saffron px-10 text-2xl font-semibold text-ink ring-2 ring-ink" @click="go">Start the timer</button>
      <button v-if="!tilt" class="min-h-12 rounded-full px-5 text-lg underline underline-offset-4" @click="useTilt">Use tilt instead of buttons</button>
      <p v-if="tiltMsg" class="text-base" role="status">{{ tiltMsg }}</p>
    </div>
  </section>
  <section v-else-if="phase === 'playing'" class="mt-4 grid gap-4" aria-label="Turn">
    <div class="flex items-baseline justify-between">
      <p class="text-xl">{{ who }}</p>
      <p class="text-6xl font-semibold tabular-nums" :class="t.left <= 10 ? 'text-saffron' : ''" role="timer" aria-live="off" :aria-label="`${t.left} seconds left`">{{ t.left }}</p>
    </div>
    <div class="overflow-hidden rounded-xl border-4 border-ink bg-vellum text-center text-ink">
      <slot name="prompt"><p class="p-6 text-5xl font-semibold leading-tight">{{ prompt }}</p></slot>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <button class="min-h-20 rounded-xl bg-olive text-3xl font-semibold text-linen ring-2 ring-ink" @click="emit('correct')">Correct</button>
      <button class="min-h-20 rounded-xl bg-linen text-3xl font-semibold text-ink ring-2 ring-ink" @click="emit('skip')">Skip</button>
    </div>
    <button class="min-h-12 justify-self-center rounded-full px-5 text-base underline underline-offset-4" @click="endEarly">End turn</button>
  </section>
  <section v-else class="mt-6 rounded-xl border-4 border-ink bg-vellum p-6 text-ink" aria-labelledby="reveal-h">
    <h2 id="reveal-h" class="text-3xl font-semibold">The real story</h2>
    <p class="mt-1 text-lg">Read it aloud together.</p>
    <ul class="mt-4 space-y-4">
      <li v-for="r in reveal ?? []" :key="r.answer + r.ref" class="border-b border-ink/30 pb-3">
        <p class="text-2xl font-semibold">{{ r.answer }}</p>
        <p v-if="r.text" class="mt-1 text-xl leading-snug">{{ r.text }}</p>
        <p v-if="r.ref" class="mt-1 text-base italic">{{ r.ref }}, Berean Standard Bible</p>
      </li>
    </ul>
    <slot name="reveal" />
    <button class="mt-5 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold text-ink ring-2 ring-ink" @click="next">Next</button>
  </section>
  </Transition>
</template>
