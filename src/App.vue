<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import GuessWho from './views/GuessWho.vue'
import Pairs from './views/Pairs.vue'
import Quotes from './views/Quotes.vue'
import StoryOrder from './views/StoryOrder.vue'
import Bingo from './views/Bingo.vue'
import JourneyMap from './views/JourneyMap.vue'
import Credits from './views/Credits.vue'
import Menu from './views/Menu.vue'

const routes: Record<string, unknown> = { guess: GuessWho, pairs: Pairs, quotes: Quotes, order: StoryOrder, bingo: Bingo, map: JourneyMap, credits: Credits }
const titles: Record<string, string> = { guess: 'Guess Who', pairs: 'Pairs', quotes: 'Who Said It?', order: 'Story Order', bingo: 'Bible Bingo', map: 'Journey Map', credits: 'Credits' }
const read = () => { const k = location.hash.replace(/^#\/?/, '').split('/')[0]; return k in routes ? k : '' }
const route = ref(read())
const onHash = () => (route.value = read())
watch(route, async r => {
  document.title = r ? `${titles[r]} · Bible Games` : 'Bible Games'
  await nextTick(); scrollTo(0, 0); const h = document.querySelector('main h1') as HTMLElement | null; if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }) }
}, { immediate: true })
onMounted(() => addEventListener('hashchange', onHash)); onUnmounted(() => removeEventListener('hashchange', onHash))
</script>

<template>
  <component :is="route ? routes[route] : Menu" :key="route" />
</template>
