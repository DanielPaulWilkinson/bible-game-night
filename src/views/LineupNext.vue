<script setup lang="ts">
/** Wires NightNext to the menu's dealt lineup in sessionStorage. */
import NightNext from './NightNext.vue'
import { loadNight, saveNight, advance, stops, type Lineup } from '../night'
import { stopOf } from '../catalog'
const emit = defineEmits<{ again: [] }>()
const l = loadNight() as Lineup
const go = (n: number) => { const x = advance(l, n); saveNight(x); location.hash = `#/${stops(x)[x.at]}` }
const end = () => { saveNight(null); location.hash = '#/' }
</script>
<template>
  <NightNext :stops="stops(l).map(stopOf)" :at="l.at" :done="stopOf(stops(l)[l.at]).title" @next="go(1)" @skip="go(2)" @again="emit('again')" @end="end"><slot /></NightNext>
</template>
