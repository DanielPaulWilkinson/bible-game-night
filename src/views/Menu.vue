<script setup lang="ts">
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
  { title: 'Board games', games: [
    { href: '#/snakes', title: 'Pilgrim’s Way', blurb: 'Snakes and ladders with good and bad habits.', icon: 'snakes' },
    { href: '#/exodus', title: 'Out of Egypt', blurb: 'Race from Egypt to the promised land with story cards.', icon: 'exodus' },
    { href: '#/ark', title: 'Ark Rescue', blurb: 'Work together to load the animals before the rain.', icon: 'ark' },
    { href: '#/trumps', title: 'Bible Top Trumps', blurb: 'Faith, courage, kindness and wisdom cards.', icon: 'trumps' },
  ] },
]
</script>
<template>
  <main class="mx-auto max-w-4xl px-4 py-8 font-story text-linen">
    <h1 tabindex="-1" class="text-4xl font-semibold outline-none sm:text-5xl">Bible Games</h1>
    <p class="mt-2 text-lg text-[#dfe6f0]">Fourteen games with people and stories from the Bible. Play on one screen together.</p>
    <section v-for="sec in sections" :key="sec.title" class="mt-8">
    <h2 class="text-2xl font-semibold">{{ sec.title }}</h2>
    <ul class="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="g in sec.games" :key="g.href">
        <a :href="g.href" class="flex h-full min-h-32 items-center gap-4 rounded-xl bg-[#16294a] p-5 shadow-[0_6px_0_#0f1d33] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
          <svg viewBox="0 0 48 48" class="h-16 w-16 shrink-0" aria-hidden="true">
            <circle cx="24" cy="24" r="23" fill="#E3A23B" />
            <g fill="none" stroke="#2B2117" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="g.icon === 'guess'"><path d="M18 18a6 6 0 1 1 8 5.6c-1.5.6-2 1.6-2 3.4" /><circle cx="24" cy="34" r="1.2" fill="#2B2117" /></template>
              <template v-else-if="g.icon === 'pairs'"><rect x="10" y="13" width="13" height="18" rx="2" /><rect x="25" y="17" width="13" height="18" rx="2" /></template>
              <template v-else-if="g.icon === 'quotes'"><path d="M11 14h26v15H22l-7 6v-6h-4z" /></template>
              <template v-else-if="g.icon === 'order'"><path d="M12 15h24M12 24h24M12 33h24" /><circle cx="9" cy="15" r="1" /><circle cx="9" cy="24" r="1" /><circle cx="9" cy="33" r="1" /></template>
              <template v-else-if="g.icon === 'bingo'"><rect x="11" y="11" width="26" height="26" rx="2" /><path d="M24 11v26M11 24h26" /><circle cx="17.5" cy="17.5" r="3" fill="#2B2117" /></template>
              <template v-else-if="g.icon === 'charades'"><circle cx="24" cy="12" r="4" /><path d="M24 16v12M24 28l-6 10M24 28l6 10M14 18l10 4 10-8" /></template>
              <template v-else-if="g.icon === 'real'"><path d="M10 26l5 5 9-11" /><path d="M28 18l10 12M38 18L28 30" /></template>
              <template v-else-if="g.icon === 'draw'"><path d="M12 36l4-1 19-19-3-3-19 19z" /><path d="M29 16l3 3" /></template>
              <template v-else-if="g.icon === 'quiz'"><path d="M16 36h16M24 36v-8M14 12h20v6a10 10 0 0 1-20 0z" /></template>
              <template v-else-if="g.icon === 'snakes'"><path d="M14 38V12M22 38V12M14 18h8M14 26h8M14 34h8" /><path d="M36 12c-6 4 4 8-2 13s4 8-2 13" /></template>
              <template v-else-if="g.icon === 'exodus'"><circle cx="12" cy="34" r="3" /><circle cx="22" cy="28" r="3" /><circle cx="30" cy="20" r="3" /><path d="M36 9l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" /></template>
              <template v-else-if="g.icon === 'ark'"><path d="M9 28h30l-4 8H13z" /><path d="M16 28v-6h16v6M14 22l10-6 10 6" /></template>
              <template v-else-if="g.icon === 'trumps'"><rect x="13" y="10" width="18" height="26" rx="2" /><path d="M18 32h8M18 28h8" /><rect x="19" y="14" width="18" height="26" rx="2" fill="#E3A23B" /></template>
              <template v-else><path d="M10 34c6-2 6-10 13-10s7-8 15-10" stroke-dasharray="3 4" /><circle cx="10" cy="34" r="2.5" fill="#2B2117" /><circle cx="38" cy="14" r="2.5" fill="#2B2117" /></template>
            </g>
          </svg>
          <span><span class="block text-2xl font-semibold text-saffron">{{ g.title }}</span><span class="mt-1 block text-base text-[#dfe6f0]">{{ g.blurb }}</span></span>
        </a>
      </li>
    </ul>
    </section>
    <p class="mt-8"><a href="#/credits" class="inline-flex min-h-12 items-center underline underline-offset-4">Picture and text credits</a></p>
  </main>
</template>
