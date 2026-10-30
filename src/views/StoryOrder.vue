<script setup lang="ts">
import { computed, ref } from 'vue'
import { STORIES, newOrder, place, moveTo, orderComplete, orderRight, rightSlots, type Order } from '../games'
import Back from './Back.vue'

const o = ref<Order | null>(null)
const cap = (id: string) => o.value!.story.scenes.find(s => s.id === id)!.caption
const done = computed(() => !!o.value && orderComplete(o.value))
const good = computed(() => !!o.value && orderRight(o.value))
const hints = computed(() => o.value ? rightSlots(o.value) : [])
const checked = ref(false)
function pick(i: number) { o.value = newOrder(STORIES[i]); checked.value = false }
function tap(id: string) { o.value = place(o.value!, id); checked.value = false }
let dragId = ''
function drop(index: number) { if (dragId) { o.value = moveTo(o.value!, dragId, index); dragId = ''; checked.value = false } }
function dropBack() { if (dragId && o.value!.placed.includes(dragId)) o.value = place(o.value!, dragId); dragId = '' }
</script>

<template>
  <main class="mx-auto max-w-5xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl">Story Order</h1>
    <template v-if="!o">
      <p class="mt-1 text-lg text-[#dfe6f0]">Pick a story. Then tap the pictures in the order they happened.</p>
      <ul class="mt-4 grid gap-4 sm:grid-cols-3">
        <li v-for="(s, i) in STORIES" :key="s.id">
          <button class="block w-full overflow-hidden rounded-xl bg-[#16294a] text-left shadow-[0_6px_0_#0f1d33]" @click="pick(i)">
            <img :src="`scenes/${s.scenes[0].id}.webp`" :alt="''" width="480" height="353" class="aspect-[4/3] w-full object-cover" />
            <span class="block p-4"><span class="block text-2xl font-semibold text-saffron">{{ s.title }}</span><span class="text-base text-[#dfe6f0]">{{ s.scenes.length }} pictures, from {{ s.ref }}</span></span>
          </button>
        </li>
      </ul>
    </template>
    <template v-else>
      <p class="mt-1 text-lg text-[#dfe6f0]">{{ o.story.title }} ({{ o.story.ref }}). Tap a picture to put it in the next space. Tap it again to take it back. You can drag them too.</p>
      <h2 class="mt-4 text-xl font-semibold">Your story</h2>
      <ol class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5" aria-label="Your story">
        <li v-for="(_, i) in o.story.scenes" :key="i" class="relative min-h-28 rounded-lg border-2 border-dashed border-[#3b557d]" @dragover.prevent @drop="drop(i)">
          <span class="absolute left-1 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-saffron text-lg font-bold text-ink" aria-hidden="true">{{ i + 1 }}</span>
          <button v-if="o.placed[i]" draggable="true" class="block w-full overflow-hidden rounded-lg bg-linen text-ink"
                  :class="checked ? (hints[i] ? 'ring-4 ring-olive' : 'ring-4 ring-saffron') : ''"
                  :aria-label="`Step ${i + 1}: ${cap(o.placed[i])}. Tap to take it back.`" @click="tap(o.placed[i])" @dragstart="dragId = o.placed[i]">
            <img :src="`scenes/${o.placed[i]}.webp`" alt="" width="480" height="353" class="aspect-[4/3] w-full object-cover" />
            <span class="block px-2 py-1 text-base font-semibold leading-tight">{{ cap(o.placed[i]) }}</span>
            <span v-if="checked" class="block px-2 pb-1 text-sm font-semibold" :class="hints[i] ? 'text-olive' : 'text-[#8a4b0f]'">{{ hints[i] ? 'Right place' : 'Try moving me' }}</span>
          </button>
        </li>
      </ol>
      <div class="mt-4 min-h-12" aria-live="polite">
        <p v-if="done && good" class="text-2xl font-semibold text-saffron">That is the right order. Well done!</p>
        <template v-else-if="done">
          <button v-if="!checked" class="min-h-12 rounded-full bg-saffron px-6 text-base font-semibold text-ink" @click="checked = true">Check my story</button>
          <p v-else class="text-xl">Nearly! The ones marked "Right place" are correct. Tap the others to move them.</p>
        </template>
      </div>
      <template v-if="o.pool.length">
        <h2 class="mt-4 text-xl font-semibold">Pictures to place</h2>
        <ul class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5" @dragover.prevent @drop="dropBack">
          <li v-for="id in o.pool" :key="id">
            <button draggable="true" class="tile block w-full overflow-hidden rounded-lg bg-linen text-ink shadow-[0_4px_0_#0f1d33]" :aria-label="`${cap(id)}. Tap to put it next.`" @click="tap(id)" @dragstart="dragId = id">
              <img :src="`scenes/${id}.webp`" alt="" width="480" height="353" class="aspect-[4/3] w-full object-cover" />
              <span class="block px-2 py-1 text-base font-semibold leading-tight">{{ cap(id) }}</span>
            </button>
          </li>
        </ul>
      </template>
      <div class="mt-6 flex flex-wrap gap-3">
        <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="o = newOrder(o.story); checked = false">Start this story again</button>
        <button class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="o = null">Pick another story</button>
      </div>
      <p class="mt-6 text-sm text-[#dfe6f0]">Illustrations by Jim Padgett, courtesy of Sweet Publishing, licensed <a href="https://creativecommons.org/licenses/by-sa/3.0/" class="underline" rel="noopener">CC BY-SA 3.0</a>. <a href="#/credits" class="underline">Credits</a></p>
    </template>
  </main>
</template>
