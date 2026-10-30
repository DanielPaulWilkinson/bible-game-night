<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import Shell from './Shell.vue'
import { nextPose, type Pose } from '../games3'
import { playTune } from '../sound'
const pose = ref<Pose>(); const playing = ref(false); let stop: (() => void) | undefined; let id: ReturnType<typeof setTimeout> | undefined
const start = () => { playing.value = true; pose.value = undefined; stop?.(); stop = playTune(); clearTimeout(id); id = setTimeout(freeze, 5000 + Math.random() * 7000) }
const freeze = () => { stop?.(); clearTimeout(id); playing.value = false; pose.value = nextPose(pose.value) }
onUnmounted(() => { stop?.(); clearTimeout(id) })
</script>
<template>
  <Shell id="freeze" title="Freeze, Lot’s Wife!" intro="Dance while the music plays. When it stops, freeze in the Bible pose on the screen. Anyone who wobbles sits out a round.">
    <section class="page text-center" aria-live="polite">
      <template v-if="playing"><p class="text-4xl font-semibold">Dance!</p><p class="mt-2 text-xl">The music will stop any moment…</p></template>
      <template v-else-if="pose">
        <p class="text-xl">Freeze like</p>
        <p class="pop mt-1 text-4xl font-semibold sm:text-5xl">{{ pose.name }}</p>
        <p class="mt-3 text-2xl">{{ pose.how }}</p>
        <p class="src">Read it in {{ pose.ref }}</p>
      </template>
      <p v-else class="text-2xl">Find some space, then press start.</p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button v-if="!playing" class="btn" @click="start">{{ pose ? 'Music again' : 'Start the music' }}</button>
        <button v-else class="btn2" @click="freeze">Stop now</button>
      </div>
    </section>
  </Shell>
</template>
