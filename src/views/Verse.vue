<script setup lang="ts">
import { ref } from 'vue'
import Shell from './Shell.vue'
import { VERSES, newBuilder, tryWord, builderDone, type Builder } from '../games3'
import { ding, buzz } from '../sound'
const vi = ref(0); const level = ref(3)
const b = ref<Builder>(newBuilder(VERSES[0], level.value))
const load = () => { b.value = newBuilder(VERSES[vi.value], level.value) }
const tap = (w: string) => { const before = b.value.filled; b.value = tryWord(b.value, w); (b.value.filled > before ? ding : buzz)() }
const shown = (i: number) => { const k = b.value.blanks.indexOf(i); return k < 0 || k < b.value.filled }
</script>
<template>
  <Shell id="verse" title="Verse Builder" intro="Read the verse together, then tap the missing words back in, in order. Say it out loud when it’s done.">
    <section class="page">
      <div class="flex flex-wrap items-center gap-3">
        <label for="vs" class="text-lg">Verse</label>
        <select id="vs" v-model.number="vi" class="min-h-12 rounded border-2 border-ink bg-linen px-2 text-lg" @change="load"><option v-for="(v, i) in VERSES" :key="v.ref" :value="i">{{ v.ref }}</option></select>
        <span class="text-lg">Gaps</span>
        <button v-for="n in [2, 3, 5]" :key="n" class="chip w-14" :aria-pressed="level === n" :class="level === n && '!bg-saffron'" @click="level = n; load()">{{ n }}</button>
      </div>
      <p class="mt-6 text-3xl leading-relaxed sm:text-4xl">
        <template v-for="(w, i) in b.words" :key="i"><span v-if="shown(i)">{{ w }}</span><span v-else class="inline-block min-w-20 border-b-4 border-dashed border-pom" :aria-label="'gap'">&nbsp;</span>{{ ' ' }}</template>
      </p>
      <p class="mt-2 text-lg italic">{{ b.v.ref }}, Berean Standard Bible</p>
      <div v-if="!builderDone(b)" class="mt-5 flex flex-wrap gap-2" aria-label="Words to put back">
        <button v-for="(w, i) in b.chips" :key="w + i" class="chip" @click="tap(w)">{{ w }}</button>
      </div>
      <div v-else aria-live="polite"><p class="pop mt-5 text-3xl font-semibold">Built! Now say it together.</p><button class="btn mt-4" @click="vi = (vi + 1) % VERSES.length; load()">Next verse</button></div>
      <p class="sr-only" aria-live="polite">{{ b.filled }} of {{ b.blanks.length }} gaps filled</p>
    </section>
  </Shell>
</template>
