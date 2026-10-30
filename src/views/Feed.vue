<script setup lang="ts">
import { ref, computed } from 'vue'
import Shell from './Shell.vue'
import { newFeed, feedTap, feedDone, passNow, passOn, CROWD, BASKETS, TAPS_PER_TURN, FEED_VERSE } from '../games3'
import { step, party } from '../sound'
const players = ref(2); const f = ref(newFeed(2)); const started = ref(false)
const tap = () => { f.value = feedTap(f.value); step(); if (feedDone(f.value)) party() }
const groups = computed(() => Array.from({ length: 50 }, (_, i) => i < f.value.fed / 100))
</script>
<template>
  <Shell id="feed" title="Feed the 5,000" intro="Five loaves and two fish. Work together: tap to share food with the crowd, ten taps each, then pass the device on.">
    <section v-if="!started" class="page">
      <label class="text-xl" for="fp">How many players?</label>
      <div class="mt-3 flex flex-wrap gap-2" id="fp" role="group" aria-label="Number of players">
        <button v-for="n in 6" :key="n" class="chip w-14" :aria-pressed="players === n" :class="players === n && '!bg-saffron'" @click="players = n">{{ n }}</button>
      </div>
      <button class="btn mt-6" @click="f = newFeed(players); started = true">Start sharing</button>
    </section>
    <section v-else class="page">
      <p class="text-2xl font-semibold" aria-live="polite">{{ f.fed.toLocaleString('en-GB') }} of {{ CROWD.toLocaleString('en-GB') }} fed</p>
      <div class="mt-3 grid grid-cols-10 gap-1" aria-hidden="true">
        <span v-for="(g, i) in groups" :key="i" class="flex aspect-square items-center justify-center rounded-full border-2 border-ink text-lg" :class="g ? 'bg-[#cfd8a8]' : 'bg-[#e8dcc0]'">{{ g ? '😊' : '' }}</span>
      </div>
      <div v-if="feedDone(f)" class="mt-5 text-center" aria-live="polite">
        <p class="pop text-3xl font-semibold">Everyone ate and was satisfied!</p>
        <p class="mt-2 text-xl">And look: twelve baskets left over.</p>
        <p class="mt-3 text-4xl" role="img" :aria-label="`${BASKETS} baskets`"><span v-for="b in BASKETS" :key="b">🧺</span></p>
        <p class="src">“The disciples picked up twelve basketfuls of broken pieces that were left over.” {{ FEED_VERSE.ref }}, BSB</p>
        <button class="btn mt-4" @click="started = false">Play again</button>
      </div>
      <div v-else-if="passNow(f)" class="mt-5 text-center">
        <p class="text-2xl">Well shared! Pass to player {{ (f.turn + 1) % f.players + 1 }}.</p>
        <button class="btn mt-3" @click="f = passOn(f)">I’m player {{ (f.turn + 1) % f.players + 1 }}</button>
      </div>
      <div v-else class="mt-5 text-center">
        <p class="text-xl">Player {{ f.turn + 1 }}: {{ TAPS_PER_TURN - f.taps }} taps left</p>
        <button class="mt-3 inline-flex h-32 w-32 items-center justify-center rounded-full border-4 border-ink bg-saffron text-6xl" aria-label="Share bread and fish" @click="tap">🍞🐟</button>
      </div>
    </section>
  </Shell>
</template>
