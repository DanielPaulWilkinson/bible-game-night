<script setup lang="ts">
defineProps<{ icon: string }>()
</script>
<template>
  <svg viewBox="0 0 64 64" class="h-full w-full" aria-hidden="true" fill="none" stroke="#2B2117" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
    <g v-if="icon === 'ark'"><path d="M6 38h52l-7 12H13z" fill="#9a6a3a" /><rect x="18" y="26" width="28" height="12" fill="#c48a4c" /><path d="M16 26l16-9 16 9z" fill="#7a4f2a" /><path d="M4 54c5-3 9 3 14 0s9 3 14 0 9 3 14 0 9 3 14 0" stroke="#1E3557" /></g>
    <g v-else-if="icon === 'tablets'"><path d="M10 54V20a10 10 0 0 1 20 0v34z" fill="#d9d2c2" /><path d="M34 54V20a10 10 0 0 1 20 0v34z" fill="#d9d2c2" /><path d="M15 28h10M15 35h10M15 42h10M39 28h10M39 35h10M39 42h10" /></g>
    <g v-else-if="icon === 'sling'"><path d="M8 10c10 14 14 22 18 30M56 10C46 24 42 32 38 40" stroke="#7a4f2a" stroke-width="3" /><path d="M26 40c2 8 10 8 12 0z" fill="#9a6a3a" /><circle cx="46" cy="54" r="6" fill="#8b8b8b" /></g>
    <g v-else-if="icon === 'fish'"><path d="M6 32c10-16 34-16 44 0-10 16-34 16-44 0z" fill="#4f86b8" /><path d="M50 32l10-10v20z" fill="#3b6c99" /><circle cx="18" cy="29" r="2.5" fill="#2B2117" /><path d="M10 36c4 2 8 2 12 0" /></g>
    <g v-else-if="icon === 'crown'"><path d="M8 46l-2-26 14 12 12-18 12 18 14-12-2 26z" fill="#E3A23B" /><rect x="8" y="46" width="48" height="8" fill="#c98a24" /><circle cx="32" cy="38" r="3" fill="#9B2C45" /></g>
    <g v-else-if="icon === 'lion'"><circle cx="32" cy="32" r="24" fill="#b8742a" /><circle cx="32" cy="34" r="15" fill="#e3b35a" /><circle cx="26" cy="31" r="2" fill="#2B2117" /><circle cx="38" cy="31" r="2" fill="#2B2117" /><path d="M29 38h6l-3 3zM32 41v3M27 45c3 2 7 2 10 0" /></g>
    <g v-else-if="icon === 'stars'" fill="#E3A23B"><path d="M20 8l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" /><path d="M46 26l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" /><path d="M22 42l2 5 5 .5-4 4 1 5-4-2.5-4 2.5 1-5-4-4 5-.5z" /></g>
    <g v-else-if="icon === 'coat'"><path d="M22 8h20l14 12-6 8-6-4v32H20V24l-6 4-6-8z" fill="#9B2C45" /><path d="M20 30h24" stroke="#E3A23B" stroke-width="4" /><path d="M20 40h24" stroke="#5E6B2F" stroke-width="4" /><path d="M20 50h24" stroke="#4f86b8" stroke-width="4" /></g>
    <g v-else-if="icon === 'tree'"><rect x="28" y="36" width="8" height="22" fill="#7a4f2a" /><circle cx="32" cy="24" r="18" fill="#5E6B2F" /><circle cx="22" cy="30" r="10" fill="#6f7d38" /><circle cx="42" cy="30" r="10" fill="#6f7d38" /></g>
    <g v-else-if="icon === 'wheat'" stroke="#9a6a3a"><path d="M32 58V14M20 58l8-30M44 58l-8-30" /><g fill="#E3A23B"><ellipse cx="32" cy="12" rx="4" ry="7" /><ellipse cx="26" cy="22" rx="3.5" ry="6" transform="rotate(-30 26 22)" /><ellipse cx="38" cy="22" rx="3.5" ry="6" transform="rotate(30 38 22)" /><ellipse cx="27" cy="32" rx="3.5" ry="6" transform="rotate(-30 27 32)" /><ellipse cx="37" cy="32" rx="3.5" ry="6" transform="rotate(30 37 32)" /></g></g>
    <g v-else-if="icon === 'net'"><path d="M8 12h48L46 54H18z" fill="#e8dcc0" /><path d="M14 22h36M16 32h32M17 42h30M20 12l6 42M32 12v42M44 12l-6 42" /><circle cx="8" cy="12" r="3" fill="#E3A23B" /><circle cx="56" cy="12" r="3" fill="#E3A23B" /></g>
    <g v-else-if="icon === 'scroll'"><rect x="14" y="12" width="36" height="40" fill="#f3e6c8" /><rect x="10" y="8" width="44" height="8" rx="4" fill="#c48a4c" /><rect x="10" y="48" width="44" height="8" rx="4" fill="#c48a4c" /><path d="M20 24h24M20 31h24M20 38h18" /></g>
  </svg>
</template>
