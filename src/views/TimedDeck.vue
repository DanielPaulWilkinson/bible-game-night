<script setup lang="ts">
/** Timed team decks on the shared turn screen: Forbidden Words, Sketch It, Bible Alphabet. */
import { computed, ref } from 'vue'
import { shuffle } from '../games'
import { teamNames } from '../charades'
import { newTurns, markCorrect, markSkip, nextPlayer, type Turn, type Reveal } from '../turn'
import { TABOO, SKETCH, alphabetDeck, sessionOver, finish } from '../phase24'
import Shell from './Shell.vue'
import TurnScreen from './TurnScreen.vue'
import Celebrate from './Celebrate.vue'
type Card = { word: string; banned?: readonly string[]; ref?: string; text?: string }
const props = defineProps<{ game: 'taboo' | 'sketch' | 'alphabet' }>()
const INFO = {
  taboo: { title: 'Forbidden Words', intro: 'Describe the word to your team without saying it or any of the words underneath.', secs: 60 },
  sketch: { title: 'Sketch It', intro: 'Draw the word on paper for your team. No letters, no talking.', secs: 60 },
  alphabet: { title: 'Bible Alphabet', intro: 'Your team names as many answers as you can. The table decides if each one counts.', secs: 30 },
}[props.game]
const deckFor = (): Card[] => props.game === 'alphabet' ? alphabetDeck() : shuffle<Card>(props.game === 'taboo' ? TABOO : SKETCH)
const teams = ref(2), rounds = ref(2)
const turn = ref<Turn | null>(null), taken = ref(0), done = ref(false)
const deck = ref<Card[]>([]), at = ref(0), played = ref<Card[]>([])
const reveal = ref<Reveal[] | null>(null)
const card = computed(() => deck.value[at.value % Math.max(1, deck.value.length)])
const begin = () => { deck.value = deckFor(); at.value = 0; taken.value = 0; done.value = false; turn.value = newTurns(teamNames(teams.value)); played.value = [card.value] }
const deal = () => { at.value++; played.value.push(card.value) }
const correct = () => { turn.value = markCorrect(turn.value!, card.value.word); deal() }
const skip = () => { turn.value = markSkip(turn.value!, card.value.word); deal() }
const timeup = () => { const r = played.value.filter(c => c.ref).map(c => ({ answer: c.word, ref: c.ref, text: c.text })); reveal.value = r.length ? r : null; if (!reveal.value) after() }
const after = () => { taken.value++; reveal.value = null; if (sessionOver(taken.value, teams.value, rounds.value)) { done.value = true; return } turn.value = nextPlayer(turn.value!); deal(); played.value = [card.value] }
const result = computed(() => turn.value ? finish(turn.value.players, turn.value.scores, 'compete') : null)
</script>
<template>
  <Shell :id="game" :title="INFO.title" :intro="INFO.intro">
    <form v-if="!turn" class="mt-4 max-w-xl space-y-5 rounded-xl border-4 border-ink bg-vellum p-5 text-ink" @submit.prevent="begin">
      <fieldset><legend class="text-2xl font-semibold">Teams</legend>
        <div class="mt-2 flex flex-wrap gap-2"><label v-for="n in [2, 3, 4]" :key="n" class="chip gap-2"><input v-model="teams" type="radio" :value="n" class="h-6 w-6" />{{ n }}</label></div></fieldset>
      <fieldset><legend class="text-2xl font-semibold">Turns each</legend>
        <div class="mt-2 flex flex-wrap gap-2"><label v-for="n in [1, 2, 3]" :key="n" class="chip gap-2"><input v-model="rounds" type="radio" :value="n" class="h-6 w-6" />{{ n }}</label></div></fieldset>
      <button class="btn">Start</button>
    </form>
    <Celebrate v-else-if="done && result" :result="result" :scores="turn.players.map((name, i) => ({ name, score: turn!.scores[i] }))" @again="begin" />
    <template v-else>
      <ul class="mt-4 flex flex-wrap gap-3" aria-label="Scores">
        <li v-for="(n, i) in turn.players" :key="n" class="rounded-xl px-4 py-2 text-xl transition-colors duration-300" :class="i === turn.player ? 'bg-saffron font-semibold text-ink' : 'bg-[#16294a]'">{{ n }}: {{ turn.scores[i] }}</li>
      </ul>
      <TurnScreen :who="turn.players[turn.player]" :seconds="INFO.secs" :reveal="reveal" @correct="correct" @skip="skip" @timeup="timeup" @next="after">
        <template #prompt>
          <p class="p-5 text-5xl font-semibold leading-tight" aria-live="polite">{{ card?.word }}</p>
          <ul v-if="card?.banned" class="mx-4 mb-5 grid grid-cols-2 gap-2 border-t-2 border-pom pt-3 text-2xl text-pom" aria-label="Do not say"><li class="col-span-2 text-lg text-ink">Don’t say:</li>
            <li v-for="b in card.banned" :key="b" class="font-semibold">{{ b }}</li>
          </ul>
          <p v-if="game === 'alphabet'" class="pb-4 text-lg">Press Correct for each answer the table accepts.</p>
        </template>
      </TurnScreen>
      <p class="mt-3 text-center text-lg">Got {{ turn.correct }}, skipped {{ turn.skipped }}</p>
    </template>
  </Shell>
</template>
