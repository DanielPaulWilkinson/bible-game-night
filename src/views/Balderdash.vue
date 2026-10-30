<script setup lang="ts">
import { computed, ref } from 'vue'
import { deck, options, kidChoices, score, bluffAllowed, type Entry, type Option } from '../balderdash'
import Shell from './Shell.vue'
import Names from './Names.vue'

const tier = ref<'A' | 'K'>('A')
const names = ref<string[]>([]), totals = ref<number[]>([])
const cards = ref<Entry[]>([]), at = ref(0), reader = ref(0)
type Step = 'term' | 'bluff' | 'vote' | 'reveal'
const step = ref<Step>('term')
const bluffs = ref<{ author: number; text: string }[]>([]), writer = ref(0), draft = ref(''), hidden = ref(true), warn = ref('')
const opts = ref<Option[]>([]), votes = ref<Record<number, number>>({}), gained = ref<number[]>([])
const e = computed(() => cards.value[at.value % cards.value.length])
const writers = computed(() => names.value.map((_, i) => i).filter(i => i !== reader.value))
const voters = computed(() => e.value?.kind === 'bluff' && tier.value === 'A' ? writers.value : names.value.map((_, i) => i))
const start = (n: string[]) => { names.value = n; totals.value = n.map(() => 0); cards.value = deck(tier.value); at.value = 0; reader.value = 0; step.value = 'term' }
const toBluffs = () => {
  if (tier.value === 'K' || e.value.kind === 'truefalse') { opts.value = tier.value === 'K' ? kidChoices(e.value) : options(e.value, []); votes.value = {}; step.value = 'vote'; return }
  bluffs.value = []; writer.value = 0; draft.value = ''; hidden.value = true; step.value = 'bluff'
}
const saveBluff = () => {
  if (!bluffAllowed(draft.value)) { warn.value = draft.value.trim() ? 'Keep God’s name, prayer, the cross and judgement out of bluffs. Try another.' : 'Type a made-up meaning first.'; return }
  warn.value = ''; bluffs.value.push({ author: writers.value[writer.value], text: draft.value }); draft.value = ''; hidden.value = true; writer.value++
  if (writer.value >= writers.value.length) { opts.value = options(e.value, bluffs.value); votes.value = {}; step.value = 'vote' }
}
const reveal = () => { gained.value = score(opts.value, votes.value, names.value.length); totals.value = totals.value.map((t, i) => t + gained.value[i]); step.value = 'reveal' }
const next = () => { at.value++; reader.value = (reader.value + 1) % names.value.length; step.value = 'term' }
const allVoted = computed(() => voters.value.every(v => votes.value[v] !== undefined))
</script>
<template>
  <Shell id="real" title="Bible Balderdash" intro="Strange Bible words. Make up a meaning, then try to spot the real one.">
    <template v-if="!names.length">
      <fieldset class="mt-4 max-w-md">
        <legend class="text-xl font-semibold">Which game?</legend>
        <div class="mt-2 grid gap-2">
          <label class="flex min-h-14 items-center gap-3 rounded-lg border-2 border-linen px-3 text-xl"><input v-model="tier" type="radio" value="A" class="h-6 w-6" />Grown-ups: write a bluff</label>
          <label class="flex min-h-14 items-center gap-3 rounded-lg border-2 border-linen px-3 text-xl"><input v-model="tier" type="radio" value="K" class="h-6 w-6" />Kids: guess the real one</label>
        </div>
      </fieldset>
      <Names label="Player" :defaults="['Dad', 'Mum', 'Jonah', 'Elijah', 'Guest', 'Guest 2']" :min="tier === 'A' ? 3 : 2" :max="6" @start="start" />
    </template>
    <template v-else>
      <ul class="mt-4 flex flex-wrap gap-2" aria-label="Scores"><li v-for="(n, i) in names" :key="i" class="rounded-xl bg-[#16294a] px-3 py-1 text-lg">{{ n }}: {{ totals[i] }}</li></ul>
      <section class="mt-4 rounded-xl border-4 border-ink bg-vellum p-5 text-ink">
        <p class="text-lg">{{ e.kind === 'truefalse' ? 'True or made up?' : 'What does it mean?' }}</p>
        <p class="mt-1 text-4xl font-semibold leading-tight">{{ e.term }}</p>
        <template v-if="step === 'term'">
          <p class="mt-3 text-xl">{{ names[reader] }} reads it out. {{ tier === 'A' && e.kind === 'bluff' ? 'Everyone else writes a made-up meaning in secret.' : 'Then everyone picks.' }}</p>
          <button class="mt-4 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold ring-2 ring-ink" @click="toBluffs">{{ tier === 'A' && e.kind === 'bluff' ? 'Start writing' : 'Show the choices' }}</button>
        </template>
        <template v-else-if="step === 'bluff'">
          <div v-if="hidden" class="mt-4">
            <p class="text-xl">Pass the phone face down to <b>{{ names[writers[writer]] }}</b>.</p>
            <button class="mt-3 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold ring-2 ring-ink" @click="hidden = false">I’m {{ names[writers[writer]] }}</button>
          </div>
          <form v-else class="mt-4" @submit.prevent="saveBluff">
            <label for="bluff" class="block text-xl">Your made-up meaning</label>
            <input id="bluff" v-model="draft" maxlength="80" autocomplete="off" class="mt-2 min-h-14 w-full rounded-lg border-2 border-ink bg-linen px-3 text-xl" />
            <p v-if="warn" class="mt-2 text-lg text-pom" role="alert">{{ warn }}</p>
            <button class="mt-3 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold ring-2 ring-ink">Hide it and pass on</button>
          </form>
        </template>
        <template v-else>
          <ol class="mt-4 space-y-2">
            <li v-for="(o, i) in opts" :key="i" class="rounded-lg border-2 px-3 py-2 text-xl" :class="step === 'reveal' && o.author === null ? 'border-olive bg-olive text-linen' : 'border-ink'">
              <span class="font-semibold">{{ String.fromCharCode(65 + i) }}.</span> {{ o.text }}
              <span v-if="step === 'reveal' && o.author !== null && o.author >= 0" class="text-base italic"> (bluff by {{ names[o.author] }})</span>
            </li>
          </ol>
          <fieldset v-if="step === 'vote'" class="mt-4">
            <legend class="text-xl font-semibold">Votes</legend>
            <div v-for="v in voters" :key="v" class="mt-2 flex flex-wrap items-center gap-2" role="radiogroup" :aria-label="`${names[v]}’s vote`">
              <span class="w-24 text-lg">{{ names[v] }}</span>
              <button v-for="(o, i) in opts" :key="i" type="button" role="radio" :aria-checked="votes[v] === i" class="min-h-12 min-w-12 rounded-full border-2 border-ink text-lg font-semibold" :class="votes[v] === i ? 'bg-saffron' : 'bg-linen'" :disabled="o.author === v" @click="votes = { ...votes, [v]: i }">{{ String.fromCharCode(65 + i) }}</button>
            </div>
            <button class="mt-4 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold ring-2 ring-ink disabled:opacity-50" :disabled="!allVoted" @click="reveal">Reveal</button>
          </fieldset>
          <div v-else class="mt-5 border-t-2 border-ink pt-4">
            <h2 class="text-2xl font-semibold">The real answer: {{ e.realAnswer }}</h2>
            <p class="mt-2 text-lg">Read it aloud:</p>
            <p class="mt-1 text-xl leading-snug">{{ e.text }}</p>
            <p class="mt-1 text-base italic">{{ e.reference }}, Berean Standard Bible<span v-if="e.tag === 'debated'">. Scholars still debate this one.</span><span v-if="e.tag === 'approx'">. The number is approximate.</span></p>
            <p class="mt-3 text-lg">{{ names.map((n, i) => gained[i] ? `${n} +${gained[i]}` : '').filter(Boolean).join(', ') || 'Nobody scored this time.' }}</p>
            <button class="mt-4 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold ring-2 ring-ink" @click="next">Next word</button>
          </div>
        </template>
      </section>
    </template>
  </Shell>
</template>
