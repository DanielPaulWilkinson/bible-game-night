<script setup lang="ts">
import { ref, computed } from 'vue'
import Shell from './Shell.vue'
import { STAMPS, newPassport, stamp, passportFull } from '../games3'
import { ding } from '../sound'
const KEY = 'bible-games-passport'
const p = ref(newPassport()); try { p.value = { stamped: JSON.parse(localStorage.getItem(KEY) || '[]') } } catch { /* fresh */ }
const open = ref<string>(); const told = ref(false)
const s = computed(() => STAMPS.find(x => x.id === open.value))
const reset = () => { p.value = newPassport(); localStorage.removeItem(KEY) }
const give = () => { p.value = stamp(p.value, open.value!); localStorage.setItem(KEY, JSON.stringify(p.value.stamped)); ding(); open.value = undefined; told.value = false }
</script>
<template>
  <Shell id="passport" title="Church History Passport" intro="Visit six moments in the story of the church. Listen, tell it back in your own words, and earn a stamp.">
    <section v-if="s" class="page">
      <p class="text-lg italic">{{ s.when }}. {{ s.where }}</p>
      <h2 class="mt-1 text-4xl font-semibold">{{ s.title }}</h2>
      <p class="mt-3 max-w-[60ch] text-2xl leading-snug">{{ s.story }}</p>
      <p v-if="s.ref" class="src">Read it in {{ s.ref }}</p>
      <p class="mt-5 border-l-4 border-saffron pl-4 text-2xl font-semibold">{{ s.tell }}</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <button v-if="!told" class="btn2" @click="told = true">I told it back</button>
        <button v-else class="btn" @click="give">Stamp my passport</button>
        <button class="btn2" @click="open = undefined; told = false">Back to passport</button>
      </div>
    </section>
    <section v-else class="page">
      <p class="text-xl" aria-live="polite">{{ p.stamped.length }} of {{ STAMPS.length }} stamps{{ passportFull(p) ? '. Your passport is full!' : '' }}</p>
      <ul class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <li v-for="x in STAMPS" :key="x.id">
          <button class="flex min-h-36 w-full flex-col items-center justify-center rounded border-2 border-dashed border-ink p-3 text-center" :class="p.stamped.includes(x.id) ? 'bg-[#f0d9a6]' : 'bg-linen'" @click="open = x.id" :aria-label="`${x.title}, ${p.stamped.includes(x.id) ? 'stamped' : 'not stamped yet'}`">
            <span v-if="p.stamped.includes(x.id)" class="flex h-16 w-16 -rotate-12 items-center justify-center rounded-full border-4 border-pom text-sm font-semibold text-pom">{{ x.when.replace('About ', '') }}</span>
            <span v-else class="text-4xl" aria-hidden="true">?</span>
            <span class="mt-2 text-xl font-semibold">{{ x.title }}</span>
          </button>
        </li>
      </ul>
      <button v-if="p.stamped.length" class="btn2 mt-5" @click="reset">Start a new passport</button>
    </section>
  </Shell>
</template>
