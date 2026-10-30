<script setup lang="ts">
import { computed, ref } from 'vue'
import Celebrate from './Celebrate.vue'
import { finish } from '../phase24'
import { GAME_NIGHT, BLESSING, newNight, addPoints, nextRound, nightOver, totalMinutes, type Night } from '../gamenight'
import { deck, kidChoices, type Option } from '../balderdash'
import { useTimer } from '../timer'
import Shell from './Shell.vue'
import Names from './Names.vue'
import Charades from './Charades.vue'

const night = ref<Night | null>(null)
const round = computed(() => night.value && GAME_NIGHT[night.value.at])
const { t, start } = useTimer(300)
const begin = (n: string[]) => { night.value = newNight(n); start(round.value!.minutes * 60) }
const points = (who: number, n: number) => (night.value = addPoints(night.value!, who, n))
const celebrated = ref(false)
const advance = () => { night.value = nextRound(night.value!); if (!nightOver(night.value)) start(round.value!.minutes * 60) }
// Which one is real?
const words = deck('K'); const wi = ref(0), picked = ref<number | null>(null), turn = ref(0)
const w = computed(() => words[wi.value % words.length])
const choices = ref<Option[]>(kidChoices(words[0]))
const pick = (i: number) => { if (picked.value !== null) return; picked.value = i; if (choices.value[i].author === null) points(turn.value, 1) }
const nextWord = () => { wi.value++; picked.value = null; turn.value = (turn.value + 1) % night.value!.names.length; choices.value = kidChoices(w.value) }
const mm = computed(() => `${Math.floor(t.value.left / 60)}:${String(t.value.left % 60).padStart(2, '0')}`)
</script>
<template>
  <Shell id="quiz" title="Game Night" :intro="`Three short games in ${totalMinutes()} minutes. The last one is worth double. We finish with a blessing.`">
    <Names v-if="!night" label="Team" :defaults="['Family', 'Grown-ups', 'Boys', 'Guests']" :min="1" :max="4" start="Start Game Night" @start="begin" />
    <template v-else-if="!nightOver(night)">
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-2xl font-semibold">Round {{ night.at + 1 }} of 3: {{ round!.title }}<span v-if="round!.mult > 1" class="ml-2 rounded-full bg-pom px-3 py-1 text-lg text-linen">Double points</span></p>
        <p class="text-3xl tabular-nums" role="timer" aria-live="off" :class="t.left <= 30 ? 'text-saffron' : ''">{{ mm }}</p>
      </div>
      <p class="mt-1 text-lg text-[#dfe6f0]">{{ round!.how }}</p>
      <ul class="mt-3 flex flex-wrap gap-2" aria-label="Scores"><li v-for="(n, i) in night.names" :key="i" class="rounded-xl bg-[#16294a] px-3 py-1 text-lg">{{ n }}: {{ night.scores[i] }}</li></ul>
      <Charades v-if="round!.id === 'little'" :key="'l'" embedded tier="little" :names="night.names" @points="points" />
      <Charades v-else-if="round!.id === 'story'" :key="'s'" embedded tier="grown" :mult="2" :names="night.names" @points="points" />
      <section v-else class="mt-4 rounded-xl border-4 border-ink bg-vellum p-5 text-ink">
        <p class="text-lg">{{ night.names[turn] }}: what does it mean?</p>
        <p class="text-4xl font-semibold">{{ w.term }}</p>
        <div class="mt-3 grid gap-2">
          <button v-for="(o, i) in choices" :key="i" class="min-h-14 rounded-lg border-2 border-ink px-3 text-left text-xl" :class="picked !== null && o.author === null ? 'bg-olive text-linen' : picked === i ? 'bg-pom text-linen' : 'bg-linen'" @click="pick(i)">{{ o.text }}</button>
        </div>
        <div v-if="picked !== null" class="mt-3">
          <p class="text-xl">{{ w.text }} <span class="text-base italic">{{ w.reference }}</span></p>
          <button class="mt-3 min-h-14 rounded-full bg-saffron px-8 text-xl font-semibold ring-2 ring-ink" @click="nextWord">Next word</button>
        </div>
      </section>
      <button class="mt-6 min-h-14 rounded-full px-6 text-xl font-semibold ring-2 ring-linen" :class="t.running ? '' : 'bg-saffron text-ink'" @click="advance">{{ night.at === 2 ? 'Finish and bless' : 'Next round' }}</button>
    </template>
    <template v-else>
    <Celebrate v-if="!celebrated" :result="finish(night.names, night.scores, night.names.length > 1 ? 'compete' : 'coop')" :scores="night.names.map((name, i) => ({ name, score: night!.scores[i] }))" again-label="Go on to the blessing" @again="celebrated = true" />
    <section v-else class="mt-6 rounded-xl border-4 border-ink bg-vellum p-8 text-center text-ink" aria-labelledby="bless">
      <h2 id="bless" class="text-4xl font-semibold">The blessing</h2>
      <p class="mt-2 text-lg">Say it over each other.</p>
      <blockquote class="mx-auto mt-5 max-w-[34ch] space-y-2 text-2xl leading-snug"><p v-for="b in BLESSING" :key="b.verse">{{ b.text }}</p></blockquote>
      <p class="mt-4 text-base italic">Numbers 6:24–26, Berean Standard Bible</p>
      <p class="mt-6 text-xl">{{ night.names.map((n, i) => `${n} ${night!.scores[i]}`).join(', ') }}</p>
      <a href="#/" class="mt-6 inline-flex min-h-14 items-center rounded-full bg-saffron px-8 text-xl font-semibold ring-2 ring-ink">Back to all games</a>
    </section>
    </template>
  </Shell>
</template>
