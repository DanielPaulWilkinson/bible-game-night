<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ label: string; defaults: string[]; min?: number; max?: number; start?: string }>()
const emit = defineEmits<{ start: [names: string[]] }>()
const names = ref([...props.defaults.slice(0, props.min ?? 2)])
const add = () => names.value.length < (props.max ?? 4) && names.value.push(props.defaults[names.value.length] ?? `${props.label} ${names.value.length + 1}`)
const go = () => emit('start', names.value.map((n, i) => n.trim() || `${props.label} ${i + 1}`))
</script>
<template>
  <form class="mt-4 max-w-md rounded-xl bg-[#16294a] p-5 shadow-[0_6px_0_#0f1d33]" @submit.prevent="go">
    <ul class="space-y-3">
      <li v-for="(_, i) in names" :key="i" class="flex items-center gap-2">
        <label :for="`name-${i}`" class="w-24 text-base">{{ label }} {{ i + 1 }}</label>
        <input :id="`name-${i}`" v-model="names[i]" maxlength="16" class="min-h-12 flex-1 rounded-lg bg-linen px-3 text-lg text-ink" />
        <button v-if="names.length > (min ?? 2)" type="button" class="min-h-12 min-w-12 rounded-full bg-linen text-ink" :aria-label="`Remove ${names[i]}`" @click="names.splice(i, 1)">✕</button>
      </li>
    </ul>
    <div class="mt-4 flex flex-wrap gap-3">
      <button v-if="names.length < (max ?? 4)" type="button" class="min-h-12 rounded-full bg-linen px-5 text-base font-semibold text-ink" @click="add">Add {{ label.toLowerCase() }}</button>
      <button class="min-h-12 rounded-full bg-saffron px-5 text-base font-semibold text-ink">{{ start ?? 'Start' }}</button>
    </div>
  </form>
</template>
