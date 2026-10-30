<script setup lang="ts">
import GameLogo from './GameLogo.vue'
import { ref, onMounted, watch } from 'vue'
import { DRAW_WORDS, startStroke, addPoint, undo, type Stroke } from '../games2'
import { shuffle } from '../games'
import { useTimer } from '../timer'
import SymbolIcon from './SymbolIcon.vue'
import Back from './Back.vue'

const deck = ref(shuffle(DRAW_WORDS)), at = ref(0), secret = ref(false)
const strokes = ref<Stroke[]>([]), color = ref('#2B2117'), drawing = ref(false)
const colors = [['#2B2117', 'Black'], ['#1E3557', 'Blue'], ['#9B2C45', 'Red'], ['#5E6B2F', 'Green'], ['#E3A23B', 'Yellow']]
const cv = ref<HTMLCanvasElement>()
const { t, start } = useTimer(90)
const W = 800, H = 500
function paint() {
  const g = cv.value?.getContext('2d'); if (!g) return
  g.fillStyle = '#FAF3E3'; g.fillRect(0, 0, W, H); g.lineWidth = 8; g.lineCap = g.lineJoin = 'round'
  for (const s of strokes.value) { g.strokeStyle = s.color; g.beginPath(); s.points.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (s.points.length === 1) g.lineTo(s.points[0][0] + 0.1, s.points[0][1]); g.stroke() }
}
const pos = (e: PointerEvent) => { const r = cv.value!.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H] as const }
const down = (e: PointerEvent) => { cv.value!.setPointerCapture(e.pointerId); drawing.value = true; strokes.value = startStroke(strokes.value, color.value, ...pos(e)) }
const move = (e: PointerEvent) => { if (drawing.value) strokes.value = addPoint(strokes.value, ...pos(e)) }
watch(strokes, paint); onMounted(paint)
const next = () => { at.value = (at.value + 1) % deck.value.length; secret.value = false; strokes.value = []; t.value = { left: 90, running: false } }
</script>
<template>
  <main class="mx-auto max-w-4xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="flex items-center gap-3 mt-2 text-3xl font-semibold sm:text-4xl"><GameLogo id="draw" class="h-14 w-14 shrink-0" />Draw It</h1>
    <p class="mt-1 text-lg text-[#dfe6f0]">The drawer peeks at the secret word, then draws it. Everyone else guesses. No letters allowed!</p>
    <div class="mt-4 flex flex-wrap items-center gap-3">
      <button class="min-h-12 rounded-full bg-saffron px-5 text-base font-semibold text-ink" :aria-pressed="secret" @click="secret = !secret">{{ secret ? 'Hide the word' : 'Drawer: tap to see the word' }}</button>
      <span v-if="secret" class="flex items-center gap-2 rounded-full bg-linen px-4 py-1 text-2xl font-semibold text-ink" aria-live="polite"><span class="h-10 w-10"><SymbolIcon :icon="deck[at].icon" /></span>{{ deck[at].word }}</span>
      <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="start()">{{ t.running ? 'Restart timer' : 'Start timer' }}</button>
      <span class="text-3xl font-semibold tabular-nums" role="timer" :class="t.left <= 10 ? 'text-saffron' : ''">{{ t.left }}s</span>
    </div>
    <canvas ref="cv" :width="W" :height="H" class="mt-4 w-full touch-none rounded-xl shadow-[0_6px_0_#0f1d33]" role="img" aria-label="Drawing area" @pointerdown="down" @pointermove="move" @pointerup="drawing = false" @pointercancel="drawing = false" />
    <div class="mt-3 flex flex-wrap items-center gap-3">
      <div role="radiogroup" aria-label="Pen colour" class="flex gap-2">
        <button v-for="[c, n] in colors" :key="c" role="radio" :aria-checked="color === c" :aria-label="n" class="h-12 w-12 rounded-full ring-offset-2 ring-offset-lapis" :class="color === c ? 'ring-4 ring-linen' : ''" :style="{ background: c }" @click="color = c" />
      </div>
      <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="strokes = undo(strokes)">Undo</button>
      <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="strokes = []">Clear</button>
      <button class="min-h-12 rounded-full bg-saffron px-5 text-base font-semibold text-ink" @click="next">Next word</button>
    </div>
  </main>
</template>
