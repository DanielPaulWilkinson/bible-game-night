<script setup lang="ts">
import GameLogo from './GameLogo.vue'
import Back from './Back.vue'
defineProps<{ id: string; title: string; intro: string }>()
</script>
<template>
  <main class="mx-auto max-w-4xl px-3 pb-10 pt-4 font-story text-linen sm:px-6">
    <Back />
    <h1 class="mt-2 flex items-center gap-3 text-3xl font-semibold sm:text-4xl"><GameLogo :id="id" class="h-14 w-14 shrink-0" />{{ title }}</h1>
    <p class="mt-1 max-w-[60ch] text-lg text-[#dfe6f0]">{{ intro }}</p>
    <slot />
  </main>
</template>
