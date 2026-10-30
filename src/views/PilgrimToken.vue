<script setup lang="ts">
// Story-item counters drawn as small upright objects: a coloured plinth (the player), a cast shadow,
// then the item with shading and a highlight. Centred on 0,0 in a 30-unit box. Gradients live in PilgrimDefs.
defineProps<{ id: string; color: string }>()
</script>
<template>
  <g stroke="#2B2117" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">
    <ellipse cx="2" cy="12.2" rx="12" ry="3" fill="#2B2117" opacity=".3" stroke="none" />
    <path d="M-11 9.5v1.8a11 3.4 0 0 0 22 0V9.5" :fill="color" />
    <path d="M-11 9.5v1.8a11 3.4 0 0 0 22 0V9.5z" fill="#000" opacity=".25" stroke="none" />
    <ellipse cx="0" cy="9.5" rx="11" ry="3.4" :fill="color" />
    <ellipse cx="-3" cy="8.7" rx="5" ry="1.1" fill="#fff" opacity=".3" stroke="none" />
    <template v-if="id === 'burden'">
      <ellipse cx="3" cy="9" rx="8" ry="2" fill="#2B2117" opacity=".35" stroke="none" />
      <path d="M-8 8c-2-6 0-13 5-15h6c5 2 7 9 5 15z" fill="url(#pt-sack)" />
      <path d="M-3-7l-2-4h10l-2 4z" fill="#8a6036" />
      <path d="M-3.5-7h7" stroke-width="1.6" stroke="#5a3f26" />
      <path d="M-6 0c3 1.5 9 1.5 12 0" fill="none" stroke="#5a3f26" stroke-width=".9" />
      <ellipse cx="-4" cy="-1" rx="1.6" ry="4" fill="#fff" opacity=".3" stroke="none" />
    </template>
    <template v-else-if="id === 'scroll'">
      <ellipse cx="3" cy="9" rx="7" ry="1.6" fill="#2B2117" opacity=".35" stroke="none" />
      <rect x="-6" y="-9" width="12" height="16" fill="url(#pt-parch)" />
      <path d="M-3.5-5h7M-3.5-2h7M-3.5 1h5" stroke="#8a6a44" stroke-width=".8" />
      <rect x="-8" y="-12" width="16" height="4" rx="2" fill="url(#pt-roll)" />
      <rect x="-8" y="6" width="16" height="4" rx="2" fill="url(#pt-roll)" />
      <path d="M1 8v4l1.3-1 1.3 1V8" fill="#9B2C45" stroke-width=".8" />
      <ellipse cx="-4.5" cy="-11" rx="2.2" ry=".7" fill="#fff" opacity=".5" stroke="none" />
    </template>
    <template v-else-if="id === 'key'">
      <ellipse cx="3" cy="9" rx="5" ry="1.4" fill="#2B2117" opacity=".35" stroke="none" />
      <g transform="skewX(-6)">
        <path d="M-1.6-4h3.2V8.5h-3.2z" fill="url(#pt-gold)" />
        <path d="M1.6 3h4v2.2h-4zM1.6 6.5h3v2h-3z" fill="url(#pt-gold)" />
        <circle cx="0" cy="-8.5" r="5.6" fill="url(#pt-gold)" />
        <circle cx="0" cy="-8.5" r="2.4" fill="#5a3f26" />
        <path d="M-3.8-10.5a4.6 4.6 0 0 1 3-2.6" stroke="#fff" stroke-width="1.2" opacity=".7" fill="none" />
      </g>
    </template>
    <template v-else-if="id === 'shield'">
      <ellipse cx="3" cy="9" rx="7" ry="1.6" fill="#2B2117" opacity=".35" stroke="none" />
      <path d="M-8-11c5-2 11-2 16 0 0 9-2 15-8 20-6-5-8-11-8-20z" fill="url(#pt-steel)" />
      <path d="M-1.4-8.5h2.8v4h4.6v2.8H1.4V6h-2.8V-1.7H-6v-2.8h4.6z" fill="#9B2C45" stroke-width=".8" />
      <path d="M-6-9.5c2-.7 4-.9 6-.9" stroke="#fff" stroke-width="1.2" opacity=".7" fill="none" />
    </template>
    <template v-else>
      <ellipse cx="3" cy="9.3" rx="4" ry="1.2" fill="#2B2117" opacity=".4" stroke="none" />
      <path d="M-1.4 9V-8c0-5 7.6-5 7.6 0v1.6H3.6V-8c0-2-2.4-2-2.4 0V9z" fill="url(#pt-wood)" />
      <path d="M-.6 7V-8" stroke="#e6c79a" stroke-width=".7" opacity=".8" />
      <path d="M-1.4 1h2.6" stroke="#5E6B2F" stroke-width="1.8" />
    </template>
  </g>
</template>
