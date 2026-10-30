<script setup lang="ts">
import { ref } from 'vue'
import Shell from './Shell.vue'
import { newJericho, march, canBlow, blow, shout, JERICHO_VERSE } from '../games3'
import { step, trumpet, crash } from '../sound'
const j = ref(newJericho())
const doMarch = () => { j.value = march(j.value); step() }
const doBlow = () => { j.value = blow(j.value); trumpet() }
const doShout = () => { j.value = shout(j.value); crash() }
</script>
<template>
  <Shell id="jericho" title="Walls of Jericho" intro="Everyone march round the room once for each tap. After seven laps, blow the trumpet, then everyone shouts!">
    <section class="page">
      <svg viewBox="0 0 320 170" class="w-full" role="img" :aria-label="j.fallen ? 'The walls of Jericho have fallen down' : `The walls of Jericho, ${j.laps} of 7 laps marched`">
        <g :class="{ fall: j.fallen }" style="transform-origin: 160px 150px">
          <path d="M60 150V70h30v-12h20v12h100v-12h20v12h30v80z" fill="#d9a86b" stroke="#2B2117" stroke-width="3" stroke-linejoin="round" />
          <path d="M60 95h200M60 120h200M100 70v80M150 70v80M200 70v80M240 70v80" stroke="#2B2117" stroke-width="1.2" opacity=".5" />
          <path d="M145 150v-28a15 15 0 0 1 30 0v28z" fill="#2B2117" />
        </g>
        <ellipse cx="160" cy="156" rx="150" ry="8" fill="#cdb98c" stroke="#2B2117" stroke-width="2" />
        <g v-for="n in 7" :key="n">
          <circle :cx="28 + n * 38" cy="22" r="11" :fill="n <= j.laps ? '#E3A23B' : '#F3E6C8'" stroke="#2B2117" stroke-width="2" />
          <text :x="28 + n * 38" y="27" text-anchor="middle" font-size="13" fill="#2B2117">{{ n }}</text>
        </g>
      </svg>
      <p class="mt-3 text-2xl font-semibold" aria-live="polite">
        <template v-if="j.fallen">Crash! The wall fell down flat!</template>
        <template v-else-if="j.blown">Now everyone, give a great shout!</template>
        <template v-else-if="canBlow(j)">Seven laps! Blow the trumpet.</template>
        <template v-else>Lap {{ j.laps }} of 7. Keep marching quietly.</template>
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <button v-if="j.laps < 7" class="btn" @click="doMarch">We marched a lap</button>
        <button v-else-if="!j.blown" class="btn" @click="doBlow">Blow the trumpet</button>
        <button v-else-if="!j.fallen" class="btn" @click="doShout">Shout!</button>
        <button v-else class="btn" @click="j = newJericho()">March again</button>
      </div>
      <p class="src">“The people gave a great shout, and the wall collapsed.” {{ JERICHO_VERSE.ref }}, BSB</p>
    </section>
  </Shell>
</template>
