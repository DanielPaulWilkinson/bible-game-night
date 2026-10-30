<script setup lang="ts">
import GameLogo from './GameLogo.vue'
import figuresJson from '../figures.json'
import credits from '../credits.json'
import scenes from '../scenecredits.json'
import type { Figure } from '../game'
const figures = figuresJson as Figure[]
const C = credits as Record<string, { file: string; source: string; licenceUrl: string; attribution: string }>
const S = scenes as Record<string, { file: string; source: string }>
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-8 font-story text-linen">
    <a href="#/" class="inline-flex min-h-12 items-center underline underline-offset-4">Back to all games</a>
    <h1 tabindex="-1" class="flex items-center gap-3 mt-4 outline-none text-3xl font-semibold"><GameLogo id="credits" class="h-14 w-14 shrink-0" />Picture credits</h1>
    <p class="mt-3 text-lg leading-relaxed">Illustrations by Jim Padgett, courtesy of Sweet Publishing, licensed <a href="https://creativecommons.org/licenses/by-sa/3.0/" class="underline underline-offset-2" rel="noopener">CC BY-SA 3.0</a>. The originals come from Wikimedia Commons. For this game each picture was cropped to a portrait and resized; these cropped versions are shared under the same CC BY-SA 3.0 licence. Jesus is not a card in the games.</p>
    <ul class="mt-6 space-y-3 text-base">
      <li v-for="f in figures" :key="f.id" class="border-b border-[#3b557d] pb-3">
        <strong>{{ f.name }}:</strong>
        <template v-if="C[f.id]"> {{ C[f.id].file.replace(/^File:/, '').replace(/\.\w+$/, '') }}. {{ C[f.id].attribution }} (<a :href="C[f.id].licenceUrl" class="underline underline-offset-2" rel="noopener">licence</a>). Cropped and resized. <a :href="C[f.id].source" class="underline underline-offset-2" rel="noopener">Source</a></template>
        <template v-else> illustrated letter, made for this game.</template>
      </li>
    </ul>
      <h2 class="mt-8 text-2xl font-semibold">Story Order scenes</h2>
    <p class="mt-2 text-base">These pictures are resized only, and shared under the same CC BY-SA 3.0 licence.</p>
    <ul class="mt-3 space-y-3 text-base">
      <li v-for="(s, id) in S" :key="id" class="border-b border-[#3b557d] pb-3">
        <strong>{{ id }}:</strong> {{ s.file.replace(/^File:/, '').replace(/\.\w+$/, '') }}. Illustration by Jim Padgett, courtesy of Sweet Publishing, CC BY-SA 3.0 (<a href="https://creativecommons.org/licenses/by-sa/3.0/" class="underline underline-offset-2" rel="noopener">licence</a>). Resized. <a :href="s.source" class="underline underline-offset-2" rel="noopener">Source</a>
      </li>
    </ul>
    <h2 class="mt-8 text-2xl font-semibold">Bible text and maps</h2>
    <p class="mt-2 text-base leading-relaxed">All Bible quotes and references in these games are from the Berean Standard Bible (BSB), which is in the public domain. Every quote, fact, quiz answer and verse on the boards is checked against the BSB text in the tests. Story cards and captions are short retellings with their references. Real or Made Up? includes silly made-up statements on purpose; each one is followed by the real answer. Top Trumps numbers are just for fun, not a judgement of anyone. The Out of Egypt board and Journey Map are simplified. Map captions are short retellings with their references. The Journey Map is simplified: places are shown roughly where they were, and the routes between them are not exact. The pictures on the object cards in Pairs were drawn for this game.</p>
    <p class="mt-2 text-base leading-relaxed">Pilgrim’s Way follows The Pilgrim’s Progress by John Bunyan (1678), which is in the public domain. Its help and danger captions are short retellings for young children, not quotes from the book and not Scripture. The map, counters and game logos were drawn for this game. The fourteen place pictures on the map and on the help and danger cards are AI-generated illustrations, made for this game in a pen-and-wash style.</p>
  </main>
</template>
