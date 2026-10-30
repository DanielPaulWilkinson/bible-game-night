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
      <template v-else-if="id === 'taboo'"><path d="M16 22h32v18H30l-8 7v-7h-6z" /><path d="M22 27l20 8M42 27l-20 8" fill="none" stroke="#9B2C45" /></template>
      <template v-else-if="id === 'sketch'"><rect x="15" y="17" width="34" height="30" rx="2" /><path d="M21 39c4-8 8-8 10-3s6 4 11-6" fill="none" stroke="#9B2C45" /></template>
      <template v-else-if="id === 'alphabet'"><rect x="14" y="20" width="16" height="22" rx="3" /><rect x="34" y="20" width="16" height="22" rx="3" /><path d="M18 37l4-12 4 12M19.5 33h5M38 25h5a3 3 0 0 1 0 6h-5zm0 6h6a3 3 0 0 1 0 6h-6z" fill="none" /></template>
      <template v-else-if="id === 'fill'"><path d="M14 20h36v26H14z" /><path d="M19 27h26M19 33h8M37 33h8M19 39h20" fill="none" /><path d="M29 33h6" fill="none" stroke="#E3A23B" stroke-width="3.5" /></template>
      <template v-else-if="id === 'act'"><circle cx="25" cy="21" r="5" /><circle cx="40" cy="23" r="5" /><path d="M25 26v12l-5 9M25 31l-7-5M25 31l8-5M25 38l5 9M40 28v11l-4 8M40 39l4 8M40 32l7 3" fill="none" /></template>
      <template v-else-if="id === 'framefreeze'"><rect x="14" y="16" width="36" height="32" rx="2" /><circle cx="32" cy="25" r="4" /><path d="M32 29v10M24 27l8 4 8-4M32 39l-5 6M32 39l5 6" fill="none" /></template>
      <template v-else-if="id === 'simon'"><circle cx="32" cy="19" r="5" /><path d="M32 24v13M32 28l-10-8M32 28l10-8M32 37l-7 10M32 37l7 10" fill="none" /></template>
      <template v-else-if="id === 'catechism'"><path d="M14 18h16v26H14zM34 18h16v26H34z" /><path d="M20 26a2 2 0 1 1 3 2v2M40 26h6M40 31h6M40 36h4" fill="none" /></template>
      <template v-else-if="id === 'finish'"><path d="M26 44V20l18-4v24" fill="none" /><ellipse cx="22" cy="44" rx="5" ry="3.5" /><ellipse cx="40" cy="40" rx="5" ry="3.5" /></template>
      <template v-else-if="id === 'thanks'"><path d="M20 46c0-8 2-16 6-22 2-3 5-3 6 0 1-3 4-3 6 0 4 6 6 14 6 22z" /><path d="M32 24v22" fill="none" /></template>
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
      <template v-else-if="id === 'jericho'">
        <path d="M14 46V26h7v-5h5v5h12v-5h5v5h7v20z" />
        <path d="M14 34h36M24 26v20M34 34v12M44 26v20" fill="none" stroke-width="1.5" />
        <path d="M28 46v-6a4 4 0 0 1 8 0v6z" fill="#2B2117" />
        <path d="M44 14c3 0 6 2 8 5l-3 2c-1-2-3-3-5-3z" fill="#E3A23B" stroke-width="1.5" />
      </template>
      <template v-else-if="id === 'freeze'">
        <circle cx="32" cy="17" r="5" />
        <path d="M32 22v14M32 26l-10-6M32 26l10 4M32 36l-7 12M32 36l7 12" fill="none" />
        <path d="M14 46h36" fill="none" stroke="#E3A23B" />
        <path d="M48 14v8l4-1v-7z" fill="#9B2C45" stroke-width="1.5" />
      </template>
      <template v-else-if="id === 'feed'">
        <path d="M14 36c0-7 6-11 12-11s12 4 12 11z" fill="#E3A23B" />
        <path d="M18 31l3-3M24 30l3-3M30 31l3-3" fill="none" stroke-width="1.5" />
        <path d="M30 42c6-6 14-6 18 0-4 6-12 6-18 0zM30 42l-5-4v8z" />
        <circle cx="43" cy="41" r="1.2" fill="#2B2117" />
      </template>
      <template v-else-if="id === 'noah'">
        <path d="M12 38h40l-6 9H18z" />
        <path d="M20 38V29h22v9" />
        <path d="M27 29l4-5 4 5" fill="#E3A23B" stroke-width="1.5" />
        <path d="M22 18c2-3 5-3 7 0M35 15c2-3 5-3 7 0" fill="none" stroke-width="2" />
      </template>
      <template v-else-if="id === 'sheep'">
        <path d="M18 32c-3-4 1-8 5-6 1-4 7-4 8 0 3-3 8-1 7 3 4 0 5 6 1 7 1 4-4 6-6 3-2 3-7 3-8 0-4 2-8-2-7-7z" />
        <ellipse cx="17" cy="30" rx="4" ry="3" fill="#2B2117" />
        <path d="M24 40v7M36 40v7" fill="none" />
        <path d="M44 18c3 2 3 6 0 8M48 15c5 4 5 10 0 14" fill="none" stroke="#E3A23B" />
      </template>
      <template v-else-if="id === 'timeline'">
        <path d="M14 48c10-2 4-12 14-14s16-6 12-14" fill="none" stroke-width="5" stroke="#E3A23B" />
        <path d="M14 48c10-2 4-12 14-14s16-6 12-14" fill="none" stroke-width="1" stroke-dasharray="2 3" />
        <circle cx="14" cy="48" r="3.5" /><circle cx="28" cy="34" r="3.5" /><circle cx="40" cy="20" r="3.5" fill="#9B2C45" />
        <path d="M44 14l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z" fill="#E3A23B" stroke-width="1.2" />
      </template>
      <template v-else-if="id === 'verse'">
        <rect x="14" y="16" width="36" height="32" rx="2" />
        <path d="M19 24h26M19 30h8M19 36h20M19 42h12" fill="none" stroke-width="2" />
        <rect x="30" y="27" width="14" height="6" rx="1" fill="#E3A23B" stroke-width="1.5" stroke-dasharray="2 2" />
      </template>
      <template v-else-if="id === 'world'">
        <path d="M22 12h18c-2 6 2 10 0 16s4 12 2 22H24c2-8-4-12-2-20s-4-10 0-18z" />
        <path d="M38 14c0 8 2 14 0 22" fill="none" stroke="#6f9cc0" stroke-width="2" />
        <circle cx="30" cy="34" r="4" fill="#9B2C45" stroke-width="1.5" />
        <path d="M30 38v6" fill="none" stroke="#9B2C45" />
      </template>
      <template v-else-if="id === 'whoami'">
        <circle cx="28" cy="28" r="11" />
        <path d="M36 36l12 12" fill="none" stroke-width="4" />
        <path d="M25 25a3 3 0 1 1 4 2.8c-1 .5-1 1.2-1 2.2" fill="none" stroke="#9B2C45" />
        <circle cx="28" cy="33" r=".7" fill="#9B2C45" stroke="#9B2C45" />
      </template>
      <template v-else-if="id === 'passport'">
        <rect x="17" y="13" width="30" height="38" rx="3" fill="#9B2C45" />
        <rect x="21" y="17" width="22" height="30" rx="1" />
        <circle cx="32" cy="30" r="7" fill="none" stroke="#9B2C45" stroke-width="2" />
        <path d="M32 24v12M26 30h12" fill="none" stroke="#9B2C45" stroke-width="2" />
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
