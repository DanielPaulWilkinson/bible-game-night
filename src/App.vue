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
import Charades from './views/Charades.vue'
import RealOrFake from './views/RealOrFake.vue'
import DrawIt from './views/DrawIt.vue'
import QuizNight from './views/QuizNight.vue'
import Snakes from './views/Snakes.vue'
import Exodus from './views/Exodus.vue'
import ArkRescue from './views/ArkRescue.vue'
import TopTrumps from './views/TopTrumps.vue'
import Jericho from './views/Jericho.vue'
import Freeze from './views/Freeze.vue'
import Feed from './views/Feed.vue'
import Noah from './views/Noah.vue'
import Sheep from './views/Sheep.vue'
import Timeline from './views/Timeline.vue'
import Verse from './views/Verse.vue'
import WorldMap from './views/WorldMap.vue'
import WhoAmI from './views/WhoAmI.vue'
import Passport from './views/Passport.vue'

const routes: Record<string, unknown> = { guess: GuessWho, pairs: Pairs, quotes: Quotes, order: StoryOrder, bingo: Bingo, map: JourneyMap, charades: Charades, real: RealOrFake, draw: DrawIt, quiz: QuizNight, snakes: Snakes, exodus: Exodus, ark: ArkRescue, trumps: TopTrumps, jericho: Jericho, freeze: Freeze, feed: Feed, noah: Noah, sheep: Sheep, timeline: Timeline, verse: Verse, world: WorldMap, whoami: WhoAmI, passport: Passport, credits: Credits }
const titles: Record<string, string> = { guess: 'Guess Who', pairs: 'Pairs', quotes: 'Who said or wrote it?', order: 'Story Order', bingo: 'Bible Bingo', map: 'Journey Map', charades: 'Bible Charades', real: 'Real or Made Up?', draw: 'Draw It', quiz: 'Quiz Night', snakes: 'Pilgrim’s Way', exodus: 'Out of Egypt', ark: 'Ark Rescue', trumps: 'Bible Top Trumps', jericho: 'Walls of Jericho', freeze: 'Freeze, Lot’s Wife!', feed: 'Feed the 5,000', noah: 'Noah’s Animal Noises', sheep: 'Hide the Lost Sheep', timeline: 'The Big Story Timeline', verse: 'Verse Builder', world: 'Where in the World?', whoami: 'Who Am I? Clue by Clue', passport: 'Church History Passport', credits: 'Credits' }
const read = () => { const k = location.hash.replace(/^#\/?/, '').split('/')[0]; return k in routes ? k : '' }
const route = ref(read())
const onHash = () => (route.value = read())
watch(route, async r => {
  document.title = r ? `${titles[r]}: Bible Games` : 'Bible Games'
  await nextTick(); scrollTo(0, 0); const h = document.querySelector('main h1') as HTMLElement | null; if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }) }
}, { immediate: true })
onMounted(() => addEventListener('hashchange', onHash)); onUnmounted(() => removeEventListener('hashchange', onHash))
</script>

<template>
  <component :is="route ? routes[route] : Menu" :key="route" />
</template>
