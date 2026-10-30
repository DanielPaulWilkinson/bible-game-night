<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import GameLogo from './GameLogo.vue'
import { TAGS } from '../tags'
import { MOODS, MOOD, forWho, source, ageBadge, deal, surprise, recent, type Who, type Mood } from '../menu'
import { FILL } from '../phase24-data'
import { games } from '../catalog'
import { startNight } from '../night'
const byId = Object.fromEntries(games.map(g => [g.href.slice(2), g]))
const ids = games.map(g => g.href.slice(2))
const load = (): Who => { try { const v = localStorage.getItem('bgn-who'); return v === 'little' || v === 'grown' ? v : null } catch { return null } }
const who = ref<Who>(load())
const setWho = (w: Who) => { who.value = who.value === w ? null : w }
watch(who, w => { try { w ? localStorage.setItem('bgn-who', w) : localStorage.removeItem('bgn-who') } catch { /* private mode */ } })
const short = ref(false)
const fits = (id: string) => forWho(id, who.value) && (!short.value || TAGS[id].minutes <= 10)
const open = ref<Record<string, boolean>>({})
const rows = computed(() => MOODS.map(([m, title]) => { const all = ids.filter(k => MOOD[k] === m && fits(k)); return { m, title, all, shown: open.value[m] ? all : all.slice(0, 2) } }))
const count = computed(() => ids.filter(fits).length)
const lineup = ref<string[]>(deal(ids, who.value))
watch(who, () => (lineup.value = deal(ids, who.value)))
const again = recent().filter(k => byId[k])
const surpriseMe = () => { location.hash = `#/${surprise(ids.filter(fits), who.value) ?? 'guess'}` }
const day = Math.floor(Date.now() / 864e5)
const votn = FILL[day % FILL.length]
const MOOD_NOTE: Record<Mood, string> = { move: 'Off the sofa', laugh: 'Giggles guaranteed', think: 'Puzzle it out', quiet: 'Calm, no scores' }
</script>
<template>
  <main class="mx-auto max-w-5xl px-4 py-6 font-story text-linen sm:py-10">
    <header>
      <h1 tabindex="-1" class="text-5xl font-semibold leading-none outline-none">Bible Game Night</h1>
      <p class="mt-2 text-xl text-[#dfe6f0]">Bible stories to play on one screen with the people on your sofa.</p>
    </header>

    <section class="tonight mt-6 rounded-2xl border-4 border-ink bg-vellum p-5 text-ink sm:p-7" aria-labelledby="tonight-h">
      <h2 id="tonight-h" class="sr-only">Play now</h2>
      <div role="group" aria-label="Who’s playing?">
        <p class="text-2xl font-semibold">Who’s playing?</p>
        <div class="mt-3 grid grid-cols-2 gap-3">
          <button v-for="[w, label, sub] in ([['little', 'Little ones with us', 'Big pictures, few words'], ['grown', 'Grown-ups and friends', 'More reading, more bluffing']] as const)" :key="w" type="button" :aria-pressed="who === w" class="min-h-20 rounded-xl border-4 px-3 py-2 text-left" :class="who === w ? 'border-ink bg-lapis text-linen' : 'border-ink/40 bg-linen'" @click="setWho(w)"><span class="block text-xl font-semibold leading-tight">{{ label }}</span><span class="mt-1 block text-base">{{ sub }}</span></button>
        </div>
      </div>
      <p class="mt-6 text-2xl font-semibold">Tonight’s games</p>
      <ol class="mt-2" aria-live="polite">
        <li v-for="(id, i) in lineup" :key="id"><a :href="`#/${id}`" class="flex min-h-16 items-center gap-3 border-b-2 border-dotted border-ink/40 py-2"><span class="w-6 text-2xl font-semibold text-pom">{{ i + 1 }}</span><GameLogo :id="byId[id].icon" class="h-14 w-14 shrink-0" /><span><span class="block text-xl font-semibold leading-tight underline-offset-4 hover:underline">{{ byId[id].title }}</span><span class="text-base">{{ ['Move', 'Laugh', 'Calm'][i] }}, {{ TAGS[id].minutes }} min</span></span></a></li>
        <li><a href="#/blessing" class="flex min-h-16 items-center gap-3 py-2"><span class="w-6 text-2xl font-semibold text-pom">{{ lineup.length + 1 }}</span><GameLogo id="blessing" class="h-14 w-14 shrink-0" /><span><span class="block text-xl font-semibold leading-tight underline-offset-4 hover:underline">Blessing Round</span><span class="text-base">Numbers 6:24–26, together</span></span></a></li>
      </ol>
      <div class="mt-4 flex flex-wrap gap-3">
        <a :href="`#/${lineup[0]}`" @click="startNight(lineup)" class="btn">Play now</a>
        <button type="button" class="btn2" @click="lineup = deal(ids, who, Math.random, lineup)">Deal tonight’s games again</button>
        <button type="button" class="btn2" @click="surpriseMe">Surprise me</button>
      </div>
    </section>

    <section v-if="again.length" class="mt-8" aria-labelledby="again-h">
      <h2 id="again-h" class="text-3xl font-semibold">Again!</h2>
      <ul class="mt-3 flex gap-3 overflow-x-auto pb-1">
        <li v-for="id in again" :key="id"><a :href="`#/${id}`" class="flex min-h-14 w-36 flex-col items-center gap-1 rounded-xl border-2 border-[#5a7299] p-3 text-center"><GameLogo :id="byId[id].icon" class="h-14 w-14" /><span class="text-lg leading-tight">{{ byId[id].title }}</span></a></li>
      </ul>
    </section>

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <button type="button" :aria-pressed="short" :class="short ? 'btn' : 'btn2'" @click="short = !short">10 minutes or less</button>
      <p class="text-lg" role="status" aria-live="polite">{{ count }} {{ count === 1 ? 'game' : 'games' }}<template v-if="who"> for {{ who === 'little' ? 'little ones' : 'grown-ups' }}</template></p>
    </div>

    <section v-for="r in rows" :key="r.m" class="mt-8" :aria-labelledby="`row-${r.m}`">
      <h2 :id="`row-${r.m}`" class="text-3xl font-semibold">{{ r.title }}</h2>
      <p :id="`row-${r.m}-note`" class="mt-1 text-lg text-[#dfe6f0]">{{ MOOD_NOTE[r.m] }}</p>
      <p v-if="!r.all.length" class="mt-3 rounded-xl border-2 border-dashed border-[#5a7299] p-4 text-lg">No game fits all of those here. <button type="button" class="min-h-12 underline underline-offset-4" @click="short = false; who = null">Show every game</button></p>
      <ul class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <li v-for="id in r.shown" :key="id">
          <a :href="byId[id].href" class="tile flex h-full flex-col items-center rounded-xl border-2 border-[#5a7299] p-3 text-center" :aria-label="`${byId[id].title}. ${byId[id].blurb} ${ageBadge(id)}, ${TAGS[id].minutes} minutes. ${source(id)}.`">
            <GameLogo :id="byId[id].icon" class="h-20 w-20" />
            <span class="mt-2 text-xl font-semibold leading-tight text-saffron">{{ byId[id].title }}</span>
            <span class="mt-2 flex flex-wrap justify-center gap-1 text-base" aria-hidden="true"><span class="rounded-full bg-linen px-2 text-ink">{{ ageBadge(id) }}</span><span class="rounded-full bg-linen px-2 text-ink">{{ TAGS[id].minutes }} min</span></span>
            <span class="mt-2 text-base italic text-[#dfe6f0]" aria-hidden="true">{{ source(id) }}</span>
          </a>
        </li>
      </ul>
      <button v-if="r.all.length > 2" type="button" class="mt-3 min-h-12 px-1 text-lg underline underline-offset-4" :aria-expanded="!!open[r.m]" @click="open = { ...open, [r.m]: !open[r.m] }">{{ open[r.m] ? 'Show fewer' : `More: ${r.all.length - 2} other ${r.all.length - 2 === 1 ? 'game' : 'games'}` }}</button>
    </section>
    <p v-if="!count" class="sr-only">No game fits all of those.</p>

    <figure class="mt-10 border-l-4 border-saffron pl-4">
      <figcaption class="text-xl font-semibold">Verse of the night</figcaption>
      <blockquote class="mt-2 max-w-[60ch] text-xl leading-snug">{{ votn.text }}</blockquote>
      <p class="mt-1 text-base italic text-[#dfe6f0]">{{ votn.ref }}, Berean Standard Bible</p>
    </figure>
    <p class="mt-8 flex flex-wrap gap-6"><a href="#/gamenight" class="inline-flex min-h-12 items-center underline underline-offset-4">Game Night with scores</a><a href="#/credits" class="inline-flex min-h-12 items-center gap-3 underline underline-offset-4"><GameLogo id="credits" class="h-12 w-12" />Picture and text credits</a></p>
  </main>
</template>
