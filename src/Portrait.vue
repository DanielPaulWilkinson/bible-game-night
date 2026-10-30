<script setup lang="ts">
import type { Figure } from './game'
import { initial } from './game'
defineProps<{ f: Figure; eager?: boolean }>()
const base = import.meta.env.BASE_URL
</script>
<template>
  <img v-if="f.image" :src="base + f.image" :alt="`${f.name}, painted by James Tissot`" :loading="eager ? 'eager' : 'lazy'"
       decoding="async" width="240" height="320" class="h-full w-full object-cover object-top" />
  <div v-else class="initial-card flex h-full w-full items-center justify-center" role="img" :aria-label="`${f.name}: illustrated letter ${initial(f.name)}`">
    <span class="font-story text-5xl font-semibold text-pom sm:text-6xl" aria-hidden="true">{{ initial(f.name) }}</span>
  </div>
</template>
