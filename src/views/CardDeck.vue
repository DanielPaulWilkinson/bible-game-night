<script setup lang="ts">
/** Card-by-card decks with a reveal: Fill the Verse, Act It Out, Freeze Frame, Simon Peter Says,
 *  Catechism Drill, Finish the Line, Thankful Together. */
import { computed, onUnmounted, ref } from 'vue'
import { shuffle } from '../games'
import { teamNames } from '../charades'
import { FILL, SCENES, CATECHISM, THANKS_PROMPTS, THANKS_VERSES, simonDeck, finishDeck, blankOut, finish } from '../phase24'
import Shell from './Shell.vue'
import Celebrate from './Celebrate.vue'
type G = 'fill' | 'act' | 'framefreeze' | 'simon' | 'catechism' | 'finish' | 'thanks'
type Card = { front: string; back?: string; read?: string; source?: string }
const props = defineProps<{ game: G }>()
const INFO: Record<G, { title: string; intro: string; mode: 'compete' | 'coop' | 'worship'; n: number; show?: string; tiers?: boolean }> = {
  fill: { title: 'Fill the Verse', intro: 'Read the verse with a word missing. First team to say the word gets the point.', mode: 'compete', n: 10, show: 'Show the verse' },
  act: { title: 'Act It Out', intro: 'One person reads the verse aloud. Everyone else acts it out together.', mode: 'coop', n: 8, tiers: true },
  framefreeze: { title: 'Freeze Frame', intro: 'Hear the scene, act it, and freeze like a photo when the count reaches zero.', mode: 'coop', n: 8 },
  simon: { title: 'Simon Peter Says', intro: 'Only move when you hear “Simon Peter says”. Nobody is out: just laugh and keep going.', mode: 'coop', n: 12 },
  catechism: { title: 'Catechism Drill', intro: 'An old question and answer to learn by heart. Say it together, then check.', mode: 'coop', n: 9, show: 'Show the answer' },
  finish: { title: 'Finish the Line', intro: 'Read the start of a psalm or old hymn. Can you say the next line together?', mode: 'worship', n: 10, show: 'Show the line' },
  thanks: { title: 'Thankful Together', intro: 'A quiet round. Take turns to answer, then pray together if you like. No points.', mode: 'worship', n: 6 },
}
const info = INFO[props.game]
const tier = ref<'little' | 'grown'>('little'), teams = ref(2)
const cards = ref<Card[]>([]), at = ref(0), shown = ref(false), started = ref(false), done = ref(false)
const scores = ref<number[]>([]), names = ref<string[]>([])
const count = ref<number | null>(null); let timer: ReturnType<typeof setInterval> | undefined
function build(): Card[] {
  switch (props.game) {
    case 'fill': return shuffle(FILL).map(v => ({ front: blankOut(v.text, v.blank), back: v.text, source: `${v.ref}, Berean Standard Bible` }))
    case 'act': return shuffle(SCENES.filter(s => s.tier === tier.value)).map(s => ({ front: s.word, read: s.text, source: `${s.ref}, Berean Standard Bible` }))
    case 'framefreeze': return shuffle(SCENES.filter(s => s.tier === 'little')).map(s => ({ front: s.word, back: s.text, source: `${s.ref}, Berean Standard Bible` }))
    case 'simon': return simonDeck().map(c => ({ front: c.text, back: c.says ? 'Everyone moves!' : 'Trick! Simon Peter didn’t say. Shake it off and carry on.' }))
    case 'catechism': return CATECHISM.map(c => ({ front: c.q, back: c.a, source: c.source }))
    case 'finish': return finishDeck().map(l => ({ front: l.start, back: l.end, source: l.source }))
    case 'thanks': return shuffle(THANKS_PROMPTS).map(p => ({ front: p }))
  }
}
const card = computed(() => cards.value[at.value])
const begin = () => { cards.value = build().slice(0, info.n); at.value = 0; shown.value = false; done.value = false; started.value = true; names.value = info.mode === 'compete' ? teamNames(teams.value) : ['Family']; scores.value = names.value.map(() => 0) }
const next = (pointTo?: number) => {
  if (pointTo !== undefined) scores.value[pointTo]++
  shown.value = false; count.value = null; clearInterval(timer)
  if (at.value + 1 >= cards.value.length) done.value = true; else at.value++
}
const freeze = () => { count.value = 3; clearInterval(timer); timer = setInterval(() => { count.value!--; if (count.value! <= 0) { clearInterval(timer); shown.value = true } }, 1000) }
onUnmounted(() => clearInterval(timer))
const result = computed(() => finish(names.value, scores.value, info.mode))
const closing = THANKS_VERSES[0]
</script>
<template>
  <Shell :id="game" :title="info.title" :intro="info.intro">
    <form v-if="!started" class="mt-4 max-w-xl space-y-5 rounded-xl border-4 border-ink bg-vellum p-5 text-ink" @submit.prevent="begin">
      <fieldset v-if="info.tiers"><legend class="text-2xl font-semibold">Who is acting?</legend>
        <div class="mt-2 grid gap-2 sm:grid-cols-2">
          <label class="chip gap-3"><input v-model="tier" type="radio" value="little" class="h-6 w-6" />Little ones: quick actions</label>
          <label class="chip gap-3"><input v-model="tier" type="radio" value="grown" class="h-6 w-6" />Everyone: whole scenes</label>
        </div></fieldset>
      <fieldset v-if="info.mode === 'compete'"><legend class="text-2xl font-semibold">Teams</legend>
        <div class="mt-2 flex flex-wrap gap-2"><label v-for="n in [2, 3, 4]" :key="n" class="chip gap-2"><input v-model="teams" type="radio" :value="n" class="h-6 w-6" />{{ n }}</label></div></fieldset>
      <p class="text-xl">{{ info.n }} cards. About {{ Math.max(5, Math.round(info.n / 2)) }} minutes.</p>
      <button class="btn">Start</button>
    </form>
    <Celebrate v-else-if="done" :result="result" :scores="names.map((name, i) => ({ name, score: scores[i] }))" @again="begin">
      <blockquote v-if="game === 'thanks'" class="mx-auto mt-5 max-w-[34ch] text-xl leading-snug">{{ closing.text }}<footer class="mt-1 text-base italic">{{ closing.ref }}, Berean Standard Bible</footer></blockquote>
    </Celebrate>
    <Transition v-else name="turn" mode="out-in">
      <section :key="at" class="mt-6 rounded-xl border-4 border-ink bg-vellum p-6 text-center text-ink" aria-live="polite">
        <p class="text-lg">Card {{ at + 1 }} of {{ cards.length }}</p>
        <p class="mx-auto mt-3 max-w-[30ch] font-semibold leading-tight" :class="card.front.length > 90 ? 'text-2xl' : 'text-4xl'">{{ card.front }}</p>
        <blockquote v-if="card.read" class="mx-auto mt-5 max-w-[40ch] border-l-4 border-saffron pl-4 text-left text-xl leading-snug">{{ card.read }}<footer class="mt-1 text-base italic">{{ card.source }}</footer></blockquote>
        <p v-if="count !== null && !shown" class="mt-5 text-8xl font-semibold tabular-nums text-pom" role="timer">{{ count }}</p>
        <div v-if="shown && card.back" class="mx-auto mt-5 max-w-[40ch] rounded-lg bg-linen p-4 text-xl leading-snug">
          <p v-if="game === 'framefreeze'" class="mb-2 text-3xl font-semibold text-pom">Freeze!</p>
          <p>{{ card.back }}</p><p v-if="card.source" class="mt-1 text-base italic">{{ card.source }}</p>
        </div>
        <div class="mt-6 flex flex-wrap justify-center gap-3">
          <button v-if="game === 'framefreeze' && !shown && count === null" class="btn" @click="freeze">Count down to freeze</button>
          <button v-else-if="card.back && !shown && game !== 'framefreeze'" class="btn" @click="shown = true">{{ info.show ?? 'Show' }}</button>
          <template v-else-if="info.mode === 'compete'">
            <button v-for="(n, i) in names" :key="n" class="btn" @click="next(i)">Point to {{ n }}</button>
            <button class="btn2" @click="next()">Nobody got it</button>
          </template>
          <button v-else-if="shown || !card.back" class="btn" @click="next()">{{ at + 1 >= cards.length ? 'Finish' : 'Next card' }}</button>
        </div>
      </section>
    </Transition>
  </Shell>
</template>
