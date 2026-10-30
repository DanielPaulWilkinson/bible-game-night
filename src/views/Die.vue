<script setup lang="ts">
defineProps<{ n: number | null }>()
const pips: Record<number, [number, number][]> = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] }
</script>
<template>
  <svg viewBox="0 0 40 40" class="h-16 w-16" role="img" :aria-label="n ? `Rolled ${n}` : 'Not rolled yet'">
    <rect x="2" y="2" width="36" height="36" rx="7" fill="#FAF3E3" stroke="#E3A23B" stroke-width="3" />
    <circle v-for="([x, y], i) in (n ? pips[n] : [])" :key="i" :cx="x * 10" :cy="y * 10" r="3.4" fill="#2B2117" />
  </svg>
</template>
