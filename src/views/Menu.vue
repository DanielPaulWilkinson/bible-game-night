<script setup lang="ts">
const games = [
  { href: '#/guess', title: 'Guess Who', blurb: 'Ask yes-or-no questions to find the secret person.', icon: 'guess' },
  { href: '#/pairs', title: 'Pairs', blurb: 'Match each person to their picture card.', icon: 'pairs' },
  { href: '#/quotes', title: 'Who Said It?', blurb: 'Hear a Bible verse and pick who said it.', icon: 'quotes' },
  { href: '#/order', title: 'Story Order', blurb: 'Put the story pictures in the right order.', icon: 'order' },
  { href: '#/bingo', title: 'Bible Bingo', blurb: 'Mark the people as they are called out.', icon: 'bingo' },
  { href: '#/map', title: 'Journey Map', blurb: 'Follow Abraham and Paul stop by stop.', icon: 'map' },
]
</script>
<template>
  <main class="mx-auto max-w-4xl px-4 py-8 font-story text-linen">
    <h1 tabindex="-1" class="text-4xl font-semibold outline-none sm:text-5xl">Bible Games</h1>
    <p class="mt-2 text-lg text-[#dfe6f0]">Six games with 24 people from the Bible. Pick one to play.</p>
    <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="g in games" :key="g.href">
        <a :href="g.href" class="flex h-full min-h-32 items-center gap-4 rounded-xl bg-[#16294a] p-5 shadow-[0_6px_0_#0f1d33] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none">
          <svg viewBox="0 0 48 48" class="h-16 w-16 shrink-0" aria-hidden="true">
            <circle cx="24" cy="24" r="23" fill="#E3A23B" />
            <g fill="none" stroke="#2B2117" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="g.icon === 'guess'"><path d="M18 18a6 6 0 1 1 8 5.6c-1.5.6-2 1.6-2 3.4" /><circle cx="24" cy="34" r="1.2" fill="#2B2117" /></template>
              <template v-else-if="g.icon === 'pairs'"><rect x="10" y="13" width="13" height="18" rx="2" /><rect x="25" y="17" width="13" height="18" rx="2" /></template>
              <template v-else-if="g.icon === 'quotes'"><path d="M11 14h26v15H22l-7 6v-6h-4z" /></template>
              <template v-else-if="g.icon === 'order'"><path d="M12 15h24M12 24h24M12 33h24" /><circle cx="9" cy="15" r="1" /><circle cx="9" cy="24" r="1" /><circle cx="9" cy="33" r="1" /></template>
              <template v-else-if="g.icon === 'bingo'"><rect x="11" y="11" width="26" height="26" rx="2" /><path d="M24 11v26M11 24h26" /><circle cx="17.5" cy="17.5" r="3" fill="#2B2117" /></template>
              <template v-else><path d="M10 34c6-2 6-10 13-10s7-8 15-10" stroke-dasharray="3 4" /><circle cx="10" cy="34" r="2.5" fill="#2B2117" /><circle cx="38" cy="14" r="2.5" fill="#2B2117" /></template>
            </g>
          </svg>
          <span><span class="block text-2xl font-semibold text-saffron">{{ g.title }}</span><span class="mt-1 block text-base text-[#dfe6f0]">{{ g.blurb }}</span></span>
        </a>
      </li>
    </ul>
    <p class="mt-8"><a href="#/credits" class="inline-flex min-h-12 items-center underline underline-offset-4">Picture and text credits</a></p>
  </main>
</template>
