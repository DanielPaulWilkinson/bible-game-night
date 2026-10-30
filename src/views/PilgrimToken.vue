<script setup lang="ts">
// Story-item counters, drawn in ink and wash. Coordinates are centred on 0,0 in a 24-unit box.
defineProps<{ id: string; color: string }>()
</script>
<template>
  <g stroke="#2B2117" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <circle r="13" :fill="color" stroke="#F3E6C8" stroke-width="2.5" />
    <g v-if="id === 'burden'"><path d="M-7 -3Q-8 7 0 8Q8 7 7 -3Z" fill="#a07a4c" /><path d="M-4 -3Q0 -9 4 -3" fill="none" /><path d="M-6 1H6" /></g>
    <g v-else-if="id === 'scroll'"><rect x="-6" y="-6" width="12" height="12" rx="1" fill="#F3E6C8" /><circle cx="-6" cy="0" r="2" fill="#d8c294" transform="scale(1 3)" /><path d="M-3 -2H3M-3 1H3M-3 4H1" stroke-width="1" /></g>
    <g v-else-if="id === 'key'"><circle cx="-4" cy="0" r="3.5" fill="#E3A23B" /><path d="M-0.5 0H8M5 0V3M8 0V3" fill="none" /></g>
    <g v-else-if="id === 'shield'"><path d="M0 -8L7 -5V0Q7 6 0 8Q-7 6 -7 0V-5Z" fill="#c9d2df" /><path d="M0 -5V5M-4 -1H4" stroke="#9B2C45" /></g>
    <g v-else><path d="M-3 8L2 -5Q4 -9 7 -7" fill="none" stroke="#7a5a3a" stroke-width="2.6" /></g>
  </g>
</template>
