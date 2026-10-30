<script setup lang="ts">
import GameLogo from './GameLogo.vue'
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
    { href: '#/quiz', title: 'Quiz Night', blurb: 'Three rounds for 2 to 4 teams, with a big scoreboard.', icon: 'quiz' },
  ] },
  { title: 'Get up and move', games: [
    { href: '#/jericho', title: 'Walls of Jericho', blurb: 'March seven times, blow the trumpet, shout!', icon: 'jericho' },
    { href: '#/freeze', title: 'Freeze, Lot’s Wife!', blurb: 'Musical statues with Bible poses.', icon: 'freeze' },
    { href: '#/feed', title: 'Feed the 5,000', blurb: 'Pass the device and share the loaves and fish.', icon: 'feed' },
    { href: '#/noah', title: 'Noah’s Animal Noises', blurb: 'Act the animal, guess it, load the ark in pairs.', icon: 'noah' },
    { href: '#/sheep', title: 'Hide the Lost Sheep', blurb: 'Hot and cold hunt with a baa that gets louder.', icon: 'sheep' },
  ] },
  { title: 'Learn and remember', games: [
    { href: '#/timeline', title: 'The Big Story Timeline', blurb: 'From Creation to New Creation, in order.', icon: 'timeline' },
    { href: '#/verse', title: 'Verse Builder', blurb: 'Tap the missing words back into a memory verse.', icon: 'verse' },
    { href: '#/world', title: 'Where in the World?', blurb: 'Find Bible places on a simple map.', icon: 'world' },
    { href: '#/whoami', title: 'Who Am I? Clue by Clue', blurb: 'Guess early for more points, Bible and church history.', icon: 'whoami' },
    { href: '#/passport', title: 'Church History Passport', blurb: 'Hear six stories, tell them back, collect stamps.', icon: 'passport' },
  ] },
  { title: 'Board games', games: [
    { href: '#/snakes', title: 'Pilgrim’s Way', blurb: 'Snakes and ladders on the road from The Pilgrim’s Progress.', icon: 'snakes' },
    { href: '#/exodus', title: 'Out of Egypt', blurb: 'Race from Egypt to the promised land with story cards.', icon: 'exodus' },
    { href: '#/ark', title: 'Ark Rescue', blurb: 'Work together to load the animals before the rain.', icon: 'ark' },
    { href: '#/trumps', title: 'Bible Top Trumps', blurb: 'Faith, courage, kindness and wisdom cards.', icon: 'trumps' },
  ] },
]
</script>
<template>
  <main class="mx-auto max-w-5xl px-4 py-6 font-story text-linen sm:py-10">
    <header class="grid overflow-hidden border-4 border-ink bg-[#F3E6C8] text-ink sm:grid-cols-[1.1fr_1fr]">
      <img :src="`scenes/noah-5.webp`" width="480" height="352" alt="Noah and his family under a rainbow beside the ark" class="h-full w-full border-b-4 border-ink object-cover sm:border-b-0 sm:border-r-4" />
      <div class="flex flex-col justify-center p-6 sm:p-8">
        <h1 tabindex="-1" class="text-5xl font-semibold leading-none outline-none sm:text-6xl">Bible Games</h1>
        <p class="mt-4 max-w-[34ch] text-xl leading-snug">Twenty-four games with people and stories from the Bible, for one screen and a sofa full of family.</p>
      </div>
    </header>
    <section v-for="sec in sections" :key="sec.title" class="mt-10">
    <h2 class="border-b-2 border-saffron pb-2 text-2xl font-semibold">{{ sec.title }}</h2>
    <ul class="grid sm:grid-cols-2 sm:gap-x-8">
      <li v-for="g in sec.games" :key="g.href" class="border-b border-[#3a5277]">
        <a :href="g.href" class="group flex min-h-24 items-center gap-4 py-3">
          <GameLogo :id="g.icon" class="h-16 w-16 shrink-0" />
          <span><span class="block text-2xl font-semibold text-saffron group-hover:underline group-hover:underline-offset-4">{{ g.title }}</span><span class="mt-1 block text-base text-[#dfe6f0]">{{ g.blurb }}</span></span>
        </a>
      </li>
    </ul>
    </section>
    <p class="mt-8"><a href="#/credits" class="inline-flex min-h-12 items-center gap-3 underline underline-offset-4"><GameLogo id="credits" class="h-12 w-12" />Picture and text credits</a></p>
  </main>
</template>
