<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import figuresJson from './figures.json'
import credits from './credits.json'
import Portrait from './Portrait.vue'
import { newGame, toggle, isDown, stillUp, newMatch, flipFor, toggleSecretShown, endTurn, reveal, guess, type Figure, type Game, type Match } from './game'

const figures = figuresJson as Figure[]
type Mode = 'setup' | 'two' | 'pass'
const mode = ref<Mode>('setup')
const names = ref<[string, string]>(['', ''])
const solo = ref<Game>(newGame(figures))
const soloShown = ref(false)
const match = ref<Match | null>(null)
const picked = ref<string | null>(null)
const info = ref<Figure | null>(null)
const view = ref(location.hash === '#credits' ? 'credits' : 'game')
const C = credits as Record<string, { file: string; source: string; licence: string; licenceUrl: string; artist: string; attribution: string }>
const dialog = ref<HTMLDialogElement>()

const me = computed(() => match.value ? match.value.players[match.value.turn] : null)
const nextName = computed(() => match.value ? match.value.players[match.value.turn].name : '')
const game = computed<Game>(() => me.value ? me.value.game : solo.value)
const secretShown = computed(() => me.value ? me.value.secretShown : soloShown.value)
const secret = computed(() => figures.find(f => f.id === game.value.secretId)!)
const up = computed(() => stillUp(game.value, figures))
const byId = (id: string) => figures.find(f => f.id === id)!
const lastGuessText = computed(() => {
  const g = match.value?.lastGuess; if (!g || g.right) return ''
  return `${match.value!.players[g.by].name} guessed ${byId(g.id).name}, but that wasn't it. Good try!`
})

function choose(m: 'two' | 'pass') {
  mode.value = m; picked.value = null
  if (m === 'two') { solo.value = newGame(figures); soloShown.value = false } else match.value = newMatch(figures, names.value)
}
function toggleShown() { if (match.value) match.value = toggleSecretShown(match.value); else soloShown.value = !soloShown.value }
function start() {
  if (game.value.down.length && !confirm('Start a new game? The board will reset.')) return
  if (mode.value === 'pass') { match.value = newMatch(figures, match.value!.players.map(p => p.name) as [string, string]); picked.value = null }
  else { solo.value = newGame(figures, Math.random, solo.value); soloShown.value = false }
}
function backToStart() { mode.value = 'setup'; match.value = null }
function flip(id: string) {
  if (match.value) { if (picked.value !== null) { picked.value = picked.value === id ? null : id; return } match.value = flipFor(match.value, id) }
  else solo.value = toggle(solo.value, id)
}
const guessing = ref(false)
function startGuess() { guessing.value = true; picked.value = null }
function cancelGuess() { guessing.value = false; picked.value = null }
function tile(id: string) { if (guessing.value) picked.value = picked.value === id ? null : id; else flip(id) }
function confirmGuess() { if (!match.value || !picked.value) return; match.value = guess(match.value, picked.value); guessing.value = false; picked.value = null }
function finishTurn() { if (match.value) { match.value = endTurn(match.value); guessing.value = false; picked.value = null } }
function showBoard() { if (match.value) match.value = reveal(match.value) }

let timer: number | undefined, longPressed = false
function press(f: Figure) { longPressed = false; timer = window.setTimeout(() => { longPressed = true; openInfo(f) }, 550) }
function release() { clearTimeout(timer) }
function tap(f: Figure) { if (longPressed) { longPressed = false; return } tile(f.id) }
function openInfo(f: Figure) { info.value = f; requestAnimationFrame(() => dialog.value?.showModal()) }
function closeInfo() { dialog.value?.close(); info.value = null }
const onHash = () => (view.value = location.hash === '#credits' ? 'credits' : 'game')
onMounted(() => addEventListener('hashchange', onHash)); onUnmounted(() => removeEventListener('hashchange', onHash))
</script>

<template>
  <main v-if="view === 'game' && mode === 'setup'" class="mx-auto max-w-3xl px-4 py-8 font-story text-linen">
    <h1 class="text-3xl font-semibold sm:text-4xl">Bible Guess Who</h1>
    <p class="mt-2 text-lg text-[#dfe6f0]">24 people from the Bible. Ask yes-or-no questions to find the other player's secret person.</p>
    <h2 class="mt-6 text-2xl font-semibold">How are you playing?</h2>
    <div class="mt-3 grid gap-4 sm:grid-cols-2">
      <section class="rounded-xl bg-[#16294a] p-5 shadow-[0_6px_0_#0f1d33]">
        <h3 class="text-xl font-semibold text-saffron">Two devices</h3>
        <p class="mt-2 text-base text-[#dfe6f0]">Each player has their own phone or tablet, and you ask questions across the table.</p>
        <button class="mt-4 min-h-12 w-full rounded-full bg-saffron px-5 text-base font-semibold text-ink" @click="choose('two')">Play on two devices</button>
      </section>
      <section class="rounded-xl bg-[#16294a] p-5 shadow-[0_6px_0_#0f1d33]">
        <h3 class="text-xl font-semibold text-saffron">Pass the device</h3>
        <p class="mt-2 text-base text-[#dfe6f0]">Two players share one device and hand it over after each turn.</p>
        <label class="mt-3 block text-base">Player 1 name<input v-model="names[0]" maxlength="20" placeholder="Player 1" class="mt-1 block min-h-12 w-full rounded-lg bg-linen px-3 text-ink placeholder:text-[#6b5b48]" /></label>
        <label class="mt-3 block text-base">Player 2 name<input v-model="names[1]" maxlength="20" placeholder="Player 2" class="mt-1 block min-h-12 w-full rounded-lg bg-linen px-3 text-ink placeholder:text-[#6b5b48]" /></label>
        <button class="mt-4 min-h-12 w-full rounded-full bg-saffron px-5 text-base font-semibold text-ink" @click="choose('pass')">Play on one device</button>
      </section>
    </div>
    <p class="mt-6"><a href="#credits" class="underline underline-offset-4">Picture credits</a></p>
  </main>

  <main v-else-if="view === 'game' && match && match.winner !== null" class="fixed inset-0 flex flex-col items-center justify-center bg-lapis px-6 text-center font-story text-linen">
    <h1 class="text-3xl font-semibold sm:text-4xl" aria-live="polite">Well done, {{ match.players[match.winner].name }}!</h1>
    <p class="mt-3 text-xl">You found {{ byId(match.lastGuess!.id).name }}. Thank you for a lovely game, {{ match.players[match.winner === 0 ? 1 : 0].name }}!</p>
    <div class="mt-5 h-40 w-32 overflow-hidden rounded-lg border-4 border-saffron"><Portrait :f="byId(match.lastGuess!.id)" eager /></div>
    <div class="mt-6 flex flex-wrap justify-center gap-3">
      <button class="min-h-12 rounded-full bg-saffron px-6 text-base font-semibold text-ink" @click="choose('pass')">Play again</button>
      <button class="min-h-12 rounded-full bg-linen px-6 text-base font-semibold text-ink" @click="backToStart">Start screen</button>
    </div>
  </main>

  <main v-else-if="view === 'game' && match && match.covered" class="fixed inset-0 flex flex-col items-center justify-center bg-[#0b162a] px-6 text-center font-story text-linen">
    <p v-if="lastGuessText" class="mb-6 max-w-md text-lg text-[#dfe6f0]" aria-live="polite">{{ lastGuessText }}</p>
    <h1 class="text-4xl font-semibold sm:text-5xl">Pass to {{ nextName }}</h1>
    <p class="mt-3 text-lg text-[#dfe6f0]">No peeking! Both boards are hidden.</p>
    <button class="mt-8 min-h-14 rounded-full bg-saffron px-8 text-lg font-semibold text-ink" @click="showBoard">I'm {{ nextName }}, show my board</button>
  </main>

  <main v-else-if="view === 'game'" class="mx-auto max-w-6xl px-3 pb-10 pt-4 font-story sm:px-6">
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
          <h1 class="text-2xl font-semibold leading-tight text-linen sm:text-3xl">{{ me ? `${me.name}'s board` : 'Bible Guess Who' }}</h1>
          <p class="mt-1 text-base leading-snug text-[#dfe6f0] sm:text-lg" aria-live="polite">
            <template v-if="secretShown">Your secret person is <strong class="text-saffron">{{ secret.name }}</strong>.</template>
            <template v-else>Your secret person is hidden.</template>
          </p>
        </div>
        <div class="mt-2 flex flex-wrap gap-2">
          <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" :aria-pressed="secretShown" @click="toggleShown">
            {{ secretShown ? 'Hide my person' : 'Show my person' }}</button>
          <template v-if="match">
            <button v-if="!guessing" class="min-h-12 rounded-full bg-saffron px-5 text-base font-semibold text-ink" @click="finishTurn">End turn</button>
            <button v-if="!guessing" class="min-h-12 rounded-full bg-[#9B2C45] px-5 text-base font-semibold text-linen" @click="startGuess">Make a guess</button>
            <template v-else>
              <button class="min-h-12 rounded-full bg-saffron px-5 text-base font-semibold text-ink disabled:opacity-60" :disabled="!picked" @click="confirmGuess">Is it this person?</button>
              <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="cancelGuess">Cancel</button>
            </template>
          </template>
          <button v-else class="min-h-12 rounded-full bg-saffron px-5 text-base font-semibold text-ink" @click="start">New game</button>
          <button class="min-h-12 rounded-full px-3 text-base text-linen underline underline-offset-4" @click="backToStart">Start screen</button>
        </div>
      </div>
    </section>

    <p v-if="guessing" class="mb-3 mt-5 text-lg font-semibold text-saffron" aria-live="polite">{{ picked ? `You picked ${byId(picked).name}. Press "Is it this person?"` : 'Tap the person you think it is.' }}</p>
    <p v-else class="mb-3 mt-5 text-base text-[#dfe6f0]" aria-live="polite">{{ up }} of {{ figures.length }} still standing. Tap a face to flip it down; hold it, or press <span aria-hidden="true">ⓘ</span><span class="sr-only">the info button</span>, to read about them.</p>

    <ul class="grid grid-cols-4 gap-2 sm:gap-3 md:grid-cols-6" aria-label="Board">
      <li v-for="f in figures" :key="f.id" class="relative">
        <button class="tile block w-full overflow-hidden rounded-md bg-linen text-left text-ink shadow-[0_4px_0_#0f1d33] select-none"
                :class="{ down: isDown(game, f.id), 'ring-4 ring-saffron': picked === f.id }" :aria-pressed="isDown(game, f.id)"
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
    <p class="mt-3 text-lg leading-relaxed">Illustrations by Jim Padgett, courtesy of Sweet Publishing, licensed <a href="https://creativecommons.org/licenses/by-sa/3.0/" class="underline underline-offset-2" rel="noopener">CC BY-SA 3.0</a>. The originals come from Wikimedia Commons. For this game each picture was cropped to a portrait and resized; these cropped versions are shared under the same CC BY-SA 3.0 licence. Jesus is not a card in the game.</p>
    <ul class="mt-6 space-y-3 text-base">
      <li v-for="f in figures" :key="f.id" class="border-b border-[#3b557d] pb-3">
        <strong>{{ f.name }}:</strong>
        <template v-if="C[f.id]"> {{ C[f.id].file.replace(/^File:/, '').replace(/\.\w+$/, '') }}. {{ C[f.id].attribution }} (<a :href="C[f.id].licenceUrl" class="underline underline-offset-2" rel="noopener">licence</a>). Cropped and resized. <a :href="C[f.id].source" class="underline underline-offset-2" rel="noopener">Source</a></template>
        <template v-else> illustrated letter, made for this game.</template>
      </li>
    </ul>
  </main>
</template>
