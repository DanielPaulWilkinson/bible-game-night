<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import GameLogo from './GameLogo.vue'
import { TAGS } from '../tags'
import { MOODS, MOOD, forWho, source, ageBadge, deal, surprise, recent, type Who, type Mood } from '../menu'
import { FILL } from '../phase24-data'
const games = [
    { href: '#/guess', title: 'Guess Who', blurb: 'Ask yes-or-no questions to find the secret person.', icon: 'guess' },
    { href: '#/pairs', title: 'Pairs', blurb: 'Match each person to their picture card.', icon: 'pairs' },
    { href: '#/quotes', title: 'Who said or wrote it?', blurb: 'Read a Bible verse and pick who said or wrote it.', icon: 'quotes' },
    { href: '#/order', title: 'Story Order', blurb: 'Put the story pictures in the right order.', icon: 'order' },
    { href: '#/bingo', title: 'Bible Bingo', blurb: 'Mark the people as they are called out.', icon: 'bingo' },
    { href: '#/map', title: 'Journey Map', blurb: 'Follow Abraham and Paul stop by stop.', icon: 'map' },
    { href: '#/charades', title: 'Bible Charades', blurb: 'Act out a picture. Your team guesses against the clock.', icon: 'charades' },
    { href: '#/real', title: 'Real or Made Up?', blurb: 'Vote with your hands, then find out the truth.', icon: 'real' },
    { href: '#/draw', title: 'Draw It', blurb: 'Draw the secret word while everyone guesses.', icon: 'draw' },
    { href: '#/balderdash', title: 'Bible Balderdash', blurb: 'Strange Bible words. Bluff a meaning, spot the real one.', icon: 'real' },
    { href: '#/taboo', title: 'Forbidden Words', blurb: 'Describe a Bible word without saying the words underneath.', icon: 'taboo' },
    { href: '#/sketch', title: 'Sketch It', blurb: 'Draw on paper while your team guesses. Verse at the end.', icon: 'sketch' },
    { href: '#/alphabet', title: 'Bible Alphabet', blurb: 'A letter and a category. Name as many as you can in 30 seconds.', icon: 'alphabet' },
    { href: '#/fill', title: 'Fill the Verse', blurb: 'A memory verse with one word missing. First team to say it scores.', icon: 'fill' },
    { href: '#/quiz', title: 'Quiz Night', blurb: 'Three rounds for 2 to 4 teams, with a big scoreboard.', icon: 'quiz' },
    { href: '#/jericho', title: 'Walls of Jericho', blurb: 'March seven times, blow the trumpet, shout!', icon: 'jericho' },
    { href: '#/freeze', title: 'Freeze, Lot’s Wife!', blurb: 'Musical statues with Bible poses.', icon: 'freeze' },
    { href: '#/feed', title: 'Feed the 5,000', blurb: 'Pass the device and share the loaves and fish.', icon: 'feed' },
    { href: '#/noah', title: 'Noah’s Animal Noises', blurb: 'Act the animal, guess it, load the ark in pairs.', icon: 'noah' },
    { href: '#/act', title: 'Act It Out', blurb: 'One reads the verse, everyone acts it together.', icon: 'act' },
    { href: '#/framefreeze', title: 'Freeze Frame', blurb: 'Act a Bible scene, then freeze like a photo on zero.', icon: 'framefreeze' },
    { href: '#/simon', title: 'Simon Peter Says', blurb: 'Bible moves. Only move when Simon Peter says. Nobody is out.', icon: 'simon' },
    { href: '#/sheep', title: 'Hide the Lost Sheep', blurb: 'Hot and cold hunt with a baa that gets louder.', icon: 'sheep' },
    { href: '#/timeline', title: 'The Big Story Timeline', blurb: 'From Creation to New Creation, in order.', icon: 'timeline' },
    { href: '#/verse', title: 'Verse Builder', blurb: 'Tap the missing words back into a memory verse.', icon: 'verse' },
    { href: '#/world', title: 'Where in the World?', blurb: 'Find Bible places on a simple map.', icon: 'world' },
    { href: '#/whoami', title: 'Who Am I? Clue by Clue', blurb: 'Guess early for more points, Bible and church history.', icon: 'whoami' },
    { href: '#/passport', title: 'Church History Passport', blurb: 'Hear six stories, tell them back, collect stamps.', icon: 'passport' },
    { href: '#/catechism', title: 'Catechism Drill', blurb: 'Old questions and answers to learn by heart together.', icon: 'catechism' },
    { href: '#/finish', title: 'Finish the Line', blurb: 'Start of a psalm or old hymn. Say the next line together.', icon: 'finish' },
    { href: '#/thanks', title: 'Thankful Together', blurb: 'A quiet round of thank-yous and prayer. No points.', icon: 'thanks' },
    { href: '#/snakes', title: 'Pilgrim’s Way', blurb: 'Snakes and ladders on the road from The Pilgrim’s Progress.', icon: 'snakes' },
    { href: '#/exodus', title: 'Out of Egypt', blurb: 'Race from Egypt to the promised land with story cards.', icon: 'exodus' },
    { href: '#/ark', title: 'Ark Rescue', blurb: 'Work together to load the animals before the rain.', icon: 'ark' },
    { href: '#/trumps', title: 'Bible Top Trumps', blurb: 'Faith, courage, kindness and wisdom cards.', icon: 'trumps' },
]
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
      <h1 tabindex="-1" class="text-5xl font-semibold leading-none outline-none">Bible Games</h1>
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
        <li><a href="#/blessing" class="flex min-h-16 items-center gap-3 py-2"><span class="w-6 text-2xl font-semibold text-pom">{{ lineup.length + 1 }}</span><GameLogo id="thanks" class="h-14 w-14 shrink-0" /><span><span class="block text-xl font-semibold leading-tight underline-offset-4 hover:underline">Blessing Round</span><span class="text-base">Numbers 6:24–26, together</span></span></a></li>
      </ol>
      <div class="mt-4 flex flex-wrap gap-3">
        <a :href="`#/${lineup[0]}`" class="inline-flex min-h-14 items-center rounded-full bg-saffron px-6 text-xl font-semibold ring-2 ring-ink">Play now</a>
        <button type="button" class="min-h-14 rounded-full bg-linen px-5 text-xl ring-2 ring-ink" @click="lineup = deal(ids, who)">Deal tonight’s games again</button>
        <button type="button" class="min-h-14 px-2 text-xl underline underline-offset-4" @click="surpriseMe">Surprise me</button>
      </div>
    </section>

    <section v-if="again.length" class="mt-8" aria-labelledby="again-h">
      <h2 id="again-h" class="text-3xl font-semibold">Again!</h2>
      <ul class="mt-3 flex gap-3 overflow-x-auto pb-1">
        <li v-for="id in again" :key="id"><a :href="`#/${id}`" class="flex min-h-14 w-36 flex-col items-center gap-1 rounded-xl border-2 border-[#5a7299] p-3 text-center"><GameLogo :id="byId[id].icon" class="h-14 w-14" /><span class="text-lg leading-tight">{{ byId[id].title }}</span></a></li>
      </ul>
    </section>

    <div class="mt-8 flex flex-wrap items-center gap-3">
      <button type="button" :aria-pressed="short" class="min-h-12 rounded-full border-2 px-4 text-lg" :class="short ? 'border-saffron bg-saffron font-semibold text-ink' : 'border-[#5a7299]'" @click="short = !short">10 minutes or less</button>
      <p class="text-lg" role="status" aria-live="polite">{{ count }} {{ count === 1 ? 'game' : 'games' }}<template v-if="who"> for {{ who === 'little' ? 'little ones' : 'grown-ups' }}</template></p>
    </div>

    <section v-for="r in rows" :key="r.m" class="mt-8" :aria-labelledby="`row-${r.m}`">
      <h2 :id="`row-${r.m}`" class="text-3xl font-semibold">{{ r.title }}<span class="block text-lg font-normal text-[#dfe6f0]">{{ MOOD_NOTE[r.m] }}</span></h2>
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
