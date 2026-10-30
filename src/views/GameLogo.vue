<script setup lang="ts">
// One emblem family: lapis roundel, ink rim, saffron inner ring, vellum glyph with ink line (stroke 2.5).
defineProps<{ id: string }>()
</script>

<template>
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <circle cx="32" cy="33" r="29" fill="#2B2117" opacity=".25" />
    <circle cx="32" cy="32" r="29" fill="#1E3557" stroke="#2B2117" stroke-width="2.5" />
    <circle cx="32" cy="32" r="25" fill="none" stroke="#E3A23B" stroke-width="1.5" />
    <g stroke="#2B2117" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" fill="#F3E6C8">
      <template v-if="id === 'guess'">
        <path d="M18 48c1-8 7-11 14-11s13 3 14 11z" />
        <circle cx="32" cy="27" r="9" />
        <path d="M29 24.5a3 3 0 1 1 4 2.8c-1 .5-1 1.2-1 2.2" fill="none" stroke="#9B2C45" />
        <circle cx="32" cy="32.2" r=".6" fill="#9B2C45" stroke="#9B2C45" />
      </template>
      <template v-else-if="id === 'pairs'">
        <rect x="15" y="18" width="18" height="25" rx="3" transform="rotate(-12 24 30)" />
        <rect x="31" y="20" width="18" height="25" rx="3" transform="rotate(10 40 32)" />
        <path d="M24 26l1.6 3.4 3.6.4-2.7 2.4.8 3.6-3.3-1.9-3.2 1.9.8-3.6-2.7-2.4 3.6-.4z" fill="#E3A23B" stroke-width="1.2" transform="rotate(-12 24 30)" />
        <path d="M40 28l1.6 3.4 3.6.4-2.7 2.4.8 3.6-3.3-1.9-3.2 1.9.8-3.6-2.7-2.4 3.6-.4z" fill="#E3A23B" stroke-width="1.2" transform="rotate(10 40 32)" />
      </template>
      <template v-else-if="id === 'quotes'">
        <path d="M14 20h36v18c0 4-3 6-6 6H26l-8 6v-6c-2-1-4-3-4-6z" />
        <path d="M24 27c-3 1-4 3-4 6h4v-4M34 27c-3 1-4 3-4 6h4v-4" fill="#9B2C45" stroke-width="2" />
        <path d="M38 31h6M38 35h4" fill="none" stroke-width="2" />
      </template>
      <template v-else-if="id === 'order'">
        <rect x="12" y="34" width="12" height="12" rx="2" />
        <rect x="26" y="26" width="12" height="20" rx="2" />
        <rect x="40" y="17" width="12" height="29" rx="2" fill="#E3A23B" />
        <circle cx="18" cy="40" r="1.6" fill="#2B2117" />
        <circle cx="30" cy="36" r="1.6" fill="#2B2117" /><circle cx="34" cy="36" r="1.6" fill="#2B2117" />
        <circle cx="46" cy="28" r="1.6" fill="#2B2117" /><circle cx="43" cy="33" r="1.6" fill="#2B2117" /><circle cx="49" cy="33" r="1.6" fill="#2B2117" />
      </template>
      <template v-else-if="id === 'bingo'">
        <rect x="16" y="16" width="32" height="32" rx="3" />
        <path d="M27 16v32M37 16v32M16 27h32M16 37h32" fill="none" stroke-width="1.8" />
        <circle cx="21.5" cy="21.5" r="3.5" fill="#9B2C45" stroke-width="1.5" />
        <circle cx="32" cy="32" r="3.5" fill="#9B2C45" stroke-width="1.5" />
        <circle cx="42.5" cy="42.5" r="3.5" fill="#9B2C45" stroke-width="1.5" />
      </template>
      <template v-else-if="id === 'map'">
        <path d="M32 12l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" />
        <path d="M32 12l5 15-5 5zM52 32l-15 5-5-5zM32 52l-5-15 5-5zM12 32l15-5 5 5z" fill="#E3A23B" stroke-width="1.5" />
        <circle cx="32" cy="32" r="2.5" fill="#9B2C45" stroke-width="1.5" />
      </template>
      <template v-else-if="id === 'charades'">
        <path d="M16 18c10-3 22-3 32 0 0 14-5 26-16 28-11-2-16-14-16-28z" />
        <path d="M22 28c2-2 5-2 7 0M35 28c2-2 5-2 7 0" fill="none" />
        <path d="M23 35c5 6 13 6 18 0" fill="#9B2C45" />
      </template>
      <template v-else-if="id === 'real'">
        <path d="M32 14v32M22 48h20M18 22h28" fill="none" />
        <path d="M18 22l-6 12h12zM46 22l-6 12h12z" fill="none" stroke-width="2" />
        <path d="M11 34a7 4 0 0 0 14 0z" fill="#E3A23B" />
        <path d="M39 34a7 4 0 0 0 14 0z" />
        <circle cx="32" cy="14" r="2.5" fill="#E3A23B" />
      </template>
      <template v-else-if="id === 'draw'">
        <path d="M46 13c-12 4-21 14-26 28l4 3c10-9 19-19 22-31z" />
        <path d="M20 41l-4 9 8-6" fill="#2B2117" />
        <path d="M24 38c5-7 11-13 18-19" fill="none" stroke-width="1.5" />
        <path d="M14 51c6-1 9 1 14-1" fill="none" stroke="#E3A23B" />
      </template>
      <template v-else-if="id === 'quiz'">
        <path d="M22 15h20v8c0 7-4 12-10 12s-10-5-10-12z" fill="#E3A23B" />
        <path d="M22 18h-5c0 6 3 9 6 9M42 18h5c0 6-3 9-6 9" fill="none" />
        <path d="M29 35h6v6h-6zM23 41h18v6H23z" />
        <path d="M32 19l1.4 2.9 3.2.4-2.3 2.2.6 3.1-2.9-1.5-2.9 1.5.6-3.1-2.3-2.2 3.2-.4z" fill="#F3E6C8" stroke-width="1.2" />
      </template>
      <template v-else-if="id === 'snakes'">
        <path d="M12 50c10-2 8-8 16-10s14 0 16-6" fill="none" stroke="#E3A23B" stroke-width="5" />
        <path d="M12 50c10-2 8-8 16-10s14 0 16-6" fill="none" stroke-width="1.2" stroke-dasharray="2 4" />
        <path d="M38 26v-7l3-3 3 3 3-3 3 3v7z" fill="#E3A23B" />
        <path d="M20 46V17c0-4 6-4 6 0" fill="none" stroke-width="3" />
      </template>
      <template v-else-if="id === 'exodus'">
        <path d="M10 46c4-12 8-24 12-28 2 10 5 20 6 28zM54 46c-4-12-8-24-12-28-2 10-5 20-6 28z" fill="#F3E6C8" />
        <path d="M14 38c3-1 5 1 8 0M50 38c-3-1-5 1-8 0M16 30c2-1 4 1 6 0M48 30c-2-1-4 1-6 0" fill="none" stroke-width="1.5" />
        <path d="M28 46h8l-2-28h-4z" fill="#E3A23B" stroke-width="1.5" />
      </template>
      <template v-else-if="id === 'ark'">
        <path d="M16 26a16 16 0 0 1 32 0" fill="none" stroke="#9B2C45" stroke-width="3" />
        <path d="M20 26a12 12 0 0 1 24 0" fill="none" stroke="#E3A23B" stroke-width="3" />
        <path d="M14 36h36l-5 8H19z" />
        <path d="M22 36v-6h20v6z" fill="#E3A23B" />
        <path d="M12 48c4 2 6-2 10 0s6-2 10 0 6-2 10 0 6-2 10 0" fill="none" stroke-width="2" />
      </template>
      <template v-else-if="id === 'trumps'">
        <rect x="14" y="22" width="16" height="23" rx="2.5" transform="rotate(-18 22 33)" />
        <rect x="34" y="22" width="16" height="23" rx="2.5" transform="rotate(18 42 33)" />
        <rect x="24" y="19" width="16" height="25" rx="2.5" fill="#F3E6C8" />
        <path d="M27 30l2-6 3 4 3-4 2 6z" fill="#E3A23B" stroke-width="1.5" />
        <path d="M28 36h8M28 39h6" fill="none" stroke-width="1.5" />
      </template>
      <template v-else>
        <path d="M12 20c7-2 14-1 20 3 6-4 13-5 20-3v25c-7-2-14-1-20 3-6-4-13-5-20-3z" />
        <path d="M32 23v25" fill="none" />
        <path d="M38 22v14l3-3 3 3V21" fill="#9B2C45" stroke-width="1.5" />
        <path d="M17 28h10M17 33h10M17 38h8" fill="none" stroke-width="1.5" />
      </template>
    </g>
  </svg>
</template>
