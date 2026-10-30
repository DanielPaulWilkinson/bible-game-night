<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import figuresJson from './figures.json'
import credits from './credits.json'
import Portrait from './Portrait.vue'
import { newGame, toggle, isDown, stillUp, type Figure, type Game } from './game'

const figures = figuresJson as Figure[]
const game = ref<Game>(newGame(figures))
const secretShown = ref(false)
const info = ref<Figure | null>(null)
const view = ref(location.hash === '#credits' ? 'credits' : 'game')
const secret = computed(() => figures.find(f => f.id === game.value.secretId)!)
const up = computed(() => stillUp(game.value, figures))
const C = credits as Record<string, { file: string; source: string; licence: string; artist: string }>
const dialog = ref<HTMLDialogElement>()

function start() {
  if (game.value.down.length && !confirm('Start a new game? Your board will reset.')) return
  game.value = newGame(figures, Math.random, game.value); secretShown.value = false
}
let timer: number | undefined, longPressed = false
function press(f: Figure) { longPressed = false; timer = window.setTimeout(() => { longPressed = true; openInfo(f) }, 550) }
function release() { clearTimeout(timer) }
function tap(f: Figure) { if (longPressed) { longPressed = false; return } game.value = toggle(game.value, f.id) }
function openInfo(f: Figure) { info.value = f; requestAnimationFrame(() => dialog.value?.showModal()) }
function closeInfo() { dialog.value?.close(); info.value = null }
const onHash = () => (view.value = location.hash === '#credits' ? 'credits' : 'game')
onMounted(() => addEventListener('hashchange', onHash)); onUnmounted(() => removeEventListener('hashchange', onHash))
</script>

<template>
  <main v-if="view === 'game'" class="mx-auto max-w-6xl px-3 pb-10 pt-4 font-story sm:px-6">
    <section aria-label="Your secret person" class="flex items-stretch gap-3 sm:gap-5">
      <div class="relative h-36 w-28 shrink-0 overflow-hidden rounded-lg border-4 border-saffron bg-linen shadow-[0_6px_0_#0f1d33] sm:h-44 sm:w-32">
        <template v-if="secretShown"><Portrait :f="secret" eager /></template>
        <div v-else class="flex h-full w-full flex-col items-center justify-center bg-[#16294a] text-center">
          <svg viewBox="0 0 40 40" class="h-14 w-14" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#9B2C45"/><circle cx="20" cy="20" r="12" fill="none" stroke="#E3A23B" stroke-width="2"/><text x="20" y="26" text-anchor="middle" font-size="16" fill="#FAF3E3" font-family="Georgia">?</text></svg>
          <span class="mt-2 px-2 text-sm text-linen">Hidden</span>
        </div>
      </div>
      <div class="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <h1 class="text-2xl font-semibold leading-tight text-linen sm:text-3xl">Bible Guess Who</h1>
          <p class="mt-1 text-base leading-snug text-[#dfe6f0] sm:text-lg" aria-live="polite">
            <template v-if="secretShown">Your secret person is <strong class="text-saffron">{{ secret.name }}</strong>.</template>
            <template v-else>Your secret person is hidden.</template>
          </p>
        </div>
        <div class="mt-2 flex flex-wrap gap-2">
          <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" :aria-pressed="secretShown" @click="secretShown = !secretShown">
            {{ secretShown ? 'Hide my person' : 'Show my person' }}</button>
          <button class="min-h-12 rounded-full bg-saffron px-5 text-base font-semibold text-ink" @click="start">New game</button>
        </div>
      </div>
    </section>

    <p class="mb-3 mt-5 text-base text-[#dfe6f0]" aria-live="polite">{{ up }} of {{ figures.length }} still standing. Tap a face to flip it down; hold it, or press <span aria-hidden="true">ⓘ</span><span class="sr-only">the info button</span>, to read about them.</p>

    <ul class="grid grid-cols-4 gap-2 sm:gap-3 md:grid-cols-6" aria-label="Board">
      <li v-for="f in figures" :key="f.id" class="relative">
        <button class="tile block w-full overflow-hidden rounded-md bg-linen text-left text-ink shadow-[0_4px_0_#0f1d33] select-none"
                :class="{ down: isDown(game, f.id) }" :aria-pressed="isDown(game, f.id)"
                @click="tap(f)" @pointerdown="press(f)" @pointerup="release" @pointerleave="release" @pointercancel="release" @contextmenu.prevent>
          <span class="block aspect-[3/4] w-full"><Portrait :f="f" :eager="true" /></span>
          <span class="flex min-h-10 items-center gap-1 px-1.5 py-1 text-[13px] font-semibold leading-tight sm:text-base">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="f.testament === 'old' ? 'bg-olive' : 'bg-pom'" aria-hidden="true"></span>{{ f.name }}<span class="sr-only">, {{ f.testament === 'old' ? 'Old' : 'New' }} Testament</span></span>
        </button>
        <button class="absolute right-0 top-0 flex h-11 w-11 items-start justify-end p-1" :aria-label="`About ${f.name}`" @click="openInfo(f)">
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-sm font-bold text-linen" aria-hidden="true">i</span>
        </button>
      </li>
    </ul>

    <footer class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-[#dfe6f0]">
      <span class="flex items-center gap-2"><span class="h-3 w-3 rounded-full bg-olive ring-1 ring-linen" aria-hidden="true"></span>Old Testament</span>
      <span class="flex items-center gap-2"><span class="h-3 w-3 rounded-full bg-pom ring-1 ring-linen" aria-hidden="true"></span>New Testament</span>
      <a href="#credits" class="ml-auto underline underline-offset-4">Picture credits</a>
    </footer>

    <dialog ref="dialog" class="w-[min(92vw,26rem)] rounded-xl bg-linen p-0 text-ink backdrop:bg-[#0b162a]/70" aria-labelledby="info-name" @close="info = null">
      <div v-if="info" class="flex gap-4 p-5">
        <div class="h-32 w-24 shrink-0 overflow-hidden rounded"><Portrait :f="info" eager /></div>
        <div>
          <h2 id="info-name" class="text-2xl font-semibold">{{ info.name }}</h2>
          <p class="mt-2 text-lg leading-relaxed">{{ info.fact }}</p>
          <p class="mt-1 text-base text-[#5a4a38]">{{ info.ref }}</p>
          <p class="mt-1 text-sm text-[#5a4a38]">{{ info.testament === 'old' ? 'Old' : 'New' }} Testament · {{ info.gender }}<template v-if="info.roles.length"> · {{ info.roles.join(', ') }}</template></p>
        </div>
      </div>
      <div class="px-5 pb-5"><button class="min-h-12 w-full rounded-full bg-lapis text-base font-semibold text-linen" @click="closeInfo">Close</button></div>
    </dialog>
  </main>

  <main v-else class="mx-auto max-w-3xl px-4 py-8 font-story text-linen">
    <a href="#" class="underline underline-offset-4">Back to the game</a>
    <h1 class="mt-4 text-3xl font-semibold">Picture credits</h1>
    <p class="mt-3 text-lg leading-relaxed">All paintings are by James Tissot (1836–1902), from his Old and New Testament series, and are in the public domain. They come from Wikimedia Commons and were resized for this game. Ruth, Hannah and Miriam use illustrated letters because their only Tissot pictures are faint pencil sketches. Jesus is not a card in the game.</p>
    <ul class="mt-6 space-y-3 text-base">
      <li v-for="f in figures" :key="f.id" class="border-b border-[#3b557d] pb-3">
        <strong>{{ f.name }}:</strong>
        <template v-if="C[f.id]"> {{ C[f.id].file.replace(/^File:/, '').replace(/\.\w+$/, '') }}, {{ C[f.id].artist }}. {{ C[f.id].licence }}. <a :href="C[f.id].source" class="underline underline-offset-2" rel="noopener">Source</a></template>
        <template v-else> illustrated letter, made for this game.</template>
      </li>
    </ul>
  </main>
</template>
