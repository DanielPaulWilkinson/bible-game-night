<script setup lang="ts">
import { computed, ref } from 'vue'
import figuresJson from '../figures.json'
import type { Figure } from '../game'
import { charadesDeck, draw, teamNames, type Card, type Deck, type Tier } from '../charades'
import { newTurns, markCorrect, markSkip, nextPlayer, type Turn, type Reveal } from '../turn'
import Portrait from '../Portrait.vue'
import SymbolIcon from './SymbolIcon.vue'
import Shell from './Shell.vue'
import TurnScreen from './TurnScreen.vue'

const props = defineProps<{ tier?: Tier; embedded?: boolean; mult?: number; names?: string[] }>()
const emit = defineEmits<{ points: [who: number, n: number] }>()
const figures = figuresJson as Figure[]
const tier = ref<Tier>(props.tier ?? 'little')
const teams = ref(2), hosting = ref(false), shared = ref(false)
const turn = ref<Turn | null>(null)
const deck = ref<Deck>({ cards: [], at: 0 })
const card = ref<Card | null>(null)
const acted = ref<Card[]>([])
const reveal = ref<Reveal[] | null>(null)
const fig = computed(() => card.value?.little?.figureId ? figures.find(f => f.id === card.value!.little!.figureId)! : null)
const begin = (names?: string[]) => {
  deck.value = { cards: charadesDeck(tier.value), at: 0 }
  turn.value = newTurns(names ?? teamNames(teams.value, hosting.value), shared.value, props.mult ?? 1); deal()
}
const deal = () => { const [c, d] = draw(deck.value); card.value = c; deck.value = d; acted.value.push(c) }
const correct = () => { turn.value = markCorrect(turn.value!, card.value!.word); emit('points', turn.value.player, 1); deal() }
const skip = () => { turn.value = markSkip(turn.value!, card.value!.word); deal() }
const timeup = () => {
  reveal.value = tier.value === 'grown' ? acted.value.filter(c => c.story).map(c => ({ answer: c.word, ref: c.story!.ref, text: c.story!.text })) : null
  if (!reveal.value?.length) { reveal.value = null; after() }
}
const after = () => { turn.value = nextPlayer(turn.value!); acted.value = []; reveal.value = null; deal() }
if (props.embedded) begin(props.names ?? ['Family'])
</script>
<template>
  <component :is="embedded ? 'div' : Shell" id="charades" title="Bible Charades" intro="Act it out with no talking. Your team guesses before the time runs out.">
    <form v-if="!turn" class="mt-4 max-w-xl space-y-5 rounded-xl border-4 border-ink bg-vellum p-5 text-ink" @submit.prevent="begin()">
      <fieldset>
        <legend class="text-2xl font-semibold">Who is acting?</legend>
        <div class="mt-2 grid gap-2 sm:grid-cols-2">
          <label class="flex min-h-14 items-center gap-3 rounded-lg border-2 border-ink px-3 text-xl"><input v-model="tier" type="radio" value="little" class="h-6 w-6" />Little ones: pictures</label>
          <label class="flex min-h-14 items-center gap-3 rounded-lg border-2 border-ink px-3 text-xl"><input v-model="tier" type="radio" value="grown" class="h-6 w-6" />Grown-ups: story moments</label>
        </div>
      </fieldset>
      <fieldset>
        <legend class="text-2xl font-semibold">Teams</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          <label v-for="n in [2, 3, 4]" :key="n" class="flex min-h-12 items-center gap-2 rounded-lg border-2 border-ink px-4 text-xl"><input v-model="teams" type="radio" :value="n" class="h-6 w-6" />{{ n }}</label>
        </div>
        <label class="mt-3 flex min-h-12 items-center gap-3 text-lg"><input v-model="hosting" type="checkbox" class="h-6 w-6" />Hosting: each family is a team</label>
        <label class="flex min-h-12 items-center gap-3 text-lg"><input v-model="shared" type="checkbox" class="h-6 w-6" />One family score: everyone plays together</label>
      </fieldset>
      <button class="btn">Start</button>
    </form>
    <template v-else>
      <ul v-if="!embedded" class="mt-4 flex flex-wrap gap-3" aria-label="Scores">
        <li v-for="(n, i) in turn.players" :key="n" class="rounded-xl px-4 py-2 text-xl" :class="i === turn.player ? 'bg-saffron font-semibold text-ink' : 'bg-[#16294a]'">{{ n }}: {{ turn.scores[i] }}</li>
      </ul>
      <TurnScreen :who="turn.players[turn.player]" :seconds="60" :mult="mult" :reveal="reveal" @correct="correct" @skip="skip" @timeup="timeup" @next="after">
        <template #prompt>
          <div v-if="card?.little" class="mx-auto aspect-[4/3] max-h-72 w-full">
            <Portrait v-if="fig" :f="fig" eager />
            <img v-else-if="card.little.scene" :src="`scenes/${card.little.scene}.webp`" alt="" width="480" height="353" class="h-full w-full object-cover" />
            <div v-else class="mx-auto h-full w-2/3 p-6"><SymbolIcon :icon="card.little.icon!" /></div>
          </div>
          <p class="p-5 text-5xl font-semibold leading-tight" aria-live="polite">{{ card?.word }}</p>
          <p v-if="card?.story" class="pb-4 text-lg italic">{{ card.story.ref }}</p>
        </template>
      </TurnScreen>
      <p class="mt-3 text-center text-lg">Got {{ turn.correct }}, skipped {{ turn.skipped }}</p>
    </template>
  </component>
</template>
