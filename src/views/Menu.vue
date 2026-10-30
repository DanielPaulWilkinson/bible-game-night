<script setup lang="ts">
import { computed, ref } from 'vue'
import GameLogo from './GameLogo.vue'
import { TAGS, FILTERS, matches, type Filter } from '../tags'
const sections = [
  { title: 'Play together', games: [
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
  ] },
  { title: 'Get up and move', games: [
    { href: '#/jericho', title: 'Walls of Jericho', blurb: 'March seven times, blow the trumpet, shout!', icon: 'jericho' },
    { href: '#/freeze', title: 'Freeze, Lot’s Wife!', blurb: 'Musical statues with Bible poses.', icon: 'freeze' },
    { href: '#/feed', title: 'Feed the 5,000', blurb: 'Pass the device and share the loaves and fish.', icon: 'feed' },
    { href: '#/noah', title: 'Noah’s Animal Noises', blurb: 'Act the animal, guess it, load the ark in pairs.', icon: 'noah' },
    { href: '#/act', title: 'Act It Out', blurb: 'One reads the verse, everyone acts it together.', icon: 'act' },
    { href: '#/framefreeze', title: 'Freeze Frame', blurb: 'Act a Bible scene, then freeze like a photo on zero.', icon: 'framefreeze' },
    { href: '#/simon', title: 'Simon Peter Says', blurb: 'Bible moves. Only move when Simon Peter says. Nobody is out.', icon: 'simon' },
    { href: '#/sheep', title: 'Hide the Lost Sheep', blurb: 'Hot and cold hunt with a baa that gets louder.', icon: 'sheep' },
  ] },
  { title: 'Learn and remember', games: [
    { href: '#/timeline', title: 'The Big Story Timeline', blurb: 'From Creation to New Creation, in order.', icon: 'timeline' },
    { href: '#/verse', title: 'Verse Builder', blurb: 'Tap the missing words back into a memory verse.', icon: 'verse' },
    { href: '#/world', title: 'Where in the World?', blurb: 'Find Bible places on a simple map.', icon: 'world' },
    { href: '#/whoami', title: 'Who Am I? Clue by Clue', blurb: 'Guess early for more points, Bible and church history.', icon: 'whoami' },
    { href: '#/passport', title: 'Church History Passport', blurb: 'Hear six stories, tell them back, collect stamps.', icon: 'passport' },
  ] },
  { title: 'Worship and wonder', games: [
    { href: '#/catechism', title: 'Catechism Drill', blurb: 'Old questions and answers to learn by heart together.', icon: 'catechism' },
    { href: '#/finish', title: 'Finish the Line', blurb: 'Start of a psalm or old hymn. Say the next line together.', icon: 'finish' },
    { href: '#/thanks', title: 'Thankful Together', blurb: 'A quiet round of thank-yous and prayer. No points.', icon: 'thanks' },
  ] },
  { title: 'Board games', games: [
    { href: '#/snakes', title: 'Pilgrim’s Way', blurb: 'Snakes and ladders on the road from The Pilgrim’s Progress.', icon: 'snakes' },
    { href: '#/exodus', title: 'Out of Egypt', blurb: 'Race from Egypt to the promised land with story cards.', icon: 'exodus' },
    { href: '#/ark', title: 'Ark Rescue', blurb: 'Work together to load the animals before the rain.', icon: 'ark' },
    { href: '#/trumps', title: 'Bible Top Trumps', blurb: 'Faith, courage, kindness and wisdom cards.', icon: 'trumps' },
  ] },
]
const f = ref<Filter>({})
const toggle = <K extends keyof Filter>(k: K, v: Filter[K]) => (f.value = { ...f.value, [k]: f.value[k] === v ? undefined : v })
const shown = computed(() => sections.map(s => ({ ...s, games: s.games.filter(g => matches(TAGS[g.href.slice(2)], f.value)) })).filter(s => s.games.length))
const count = computed(() => shown.value.reduce((n, s) => n + s.games.length, 0))
const groups = [['age', 'Age'], ['players', 'Who'], ['energy', 'Energy'], ['style', 'Play']] as const
const meta = (id: string) => { const t = TAGS[id]; return `${t.minutes} min` }
</script>
<template>
  <main class="mx-auto max-w-5xl px-4 py-6 font-story text-linen sm:py-10">
    <header class="grid overflow-hidden border-4 border-ink bg-[#F3E6C8] text-ink sm:grid-cols-[1.1fr_1fr]">
      <img :src="`scenes/noah-5.webp`" width="480" height="352" alt="Noah and his family under a rainbow beside the ark" class="h-full w-full border-b-4 border-ink object-cover sm:border-b-0 sm:border-r-4" />
      <div class="flex flex-col justify-center p-6 sm:p-8">
        <h1 tabindex="-1" class="text-5xl font-semibold leading-none outline-none sm:text-6xl">Bible Games</h1>
        <p class="mt-4 max-w-[34ch] text-xl leading-snug">Thirty-five games with people and stories from the Bible, for one screen and a sofa full of family.</p>
      </div>
    </header>
    <a href="#/gamenight" class="mt-6 flex min-h-16 items-center justify-between gap-4 rounded-xl border-4 border-ink bg-saffron px-5 py-3 text-ink">
      <span><span class="block text-3xl font-semibold">Game Night</span><span class="block text-lg">Three short games in 15 minutes, then a blessing.</span></span>
      <span aria-hidden="true" class="text-4xl">→</span>
    </a>
    <section class="mt-8" aria-labelledby="find-h">
      <h2 id="find-h" class="text-2xl font-semibold">Find a game</h2>
      <div v-for="[k, label] in groups" :key="k" class="mt-3" role="group" :aria-label="label">
        <span class="mr-2 text-base text-[#dfe6f0]">{{ label }}</span>
        <ul class="mt-1 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap">
          <li v-for="[v, text] in FILTERS[k]" :key="v"><button type="button" :aria-pressed="f[k] === v" class="min-h-12 whitespace-nowrap rounded-full border-2 px-4 text-lg" :class="f[k] === v ? 'border-saffron bg-saffron text-ink font-semibold' : 'border-[#5a7299] text-linen'" @click="toggle(k, v as never)">{{ text }}</button></li>
        </ul>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" :aria-pressed="!!f.short" class="min-h-12 rounded-full border-2 px-4 text-lg" :class="f.short ? 'border-saffron bg-saffron text-ink font-semibold' : 'border-[#5a7299]'" @click="toggle('short', f.short ? undefined : true)">10 minutes or less</button>
        <button v-if="Object.values(f).some(Boolean)" type="button" class="min-h-12 px-2 text-lg underline underline-offset-4" @click="f = {}">Clear filters</button>
        <p class="text-lg" role="status" aria-live="polite">{{ count }} {{ count === 1 ? 'game' : 'games' }}</p>
      </div>
    </section>
    <p v-if="!count" class="mt-10 rounded-xl border-2 border-dashed border-[#5a7299] p-6 text-xl">No game fits all of those. <button type="button" class="min-h-12 underline underline-offset-4" @click="f = {}">Clear filters</button> or turn one off.</p>
    <section v-for="sec in shown" :key="sec.title" class="mt-10">
    <h2 class="border-b-2 border-saffron pb-2 text-2xl font-semibold">{{ sec.title }}</h2>
    <ul class="grid sm:grid-cols-2 sm:gap-x-8">
      <li v-for="g in sec.games" :key="g.href" class="border-b border-[#3a5277]">
        <a :href="g.href" class="group flex min-h-24 items-center gap-4 py-3">
          <GameLogo :id="g.icon" class="h-16 w-16 shrink-0" />
          <span><span class="block text-2xl font-semibold text-saffron group-hover:underline group-hover:underline-offset-4">{{ g.title }}</span><span class="mt-1 block text-base text-[#dfe6f0]">{{ g.blurb }} {{ meta(g.href.slice(2)) }}.</span></span>
        </a>
      </li>
    </ul>
    </section>
    <p class="mt-8"><a href="#/credits" class="inline-flex min-h-12 items-center gap-3 underline underline-offset-4"><GameLogo id="credits" class="h-12 w-12" />Picture and text credits</a></p>
  </main>
</template>
