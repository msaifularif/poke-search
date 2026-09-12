<script setup>
import { SearchX, RefreshCw } from 'lucide-vue-next';

defineProps({
  title: {
    type: String,
    default: 'No Pokémon found',
  },
  message: {
    type: String,
    default: "We couldn't find any Pokémon matching your search criteria. Try a different name, number, or reset filters.",
  },
  showReset: {
    type: Boolean,
    default: true,
  },
  buttonText: {
    type: String,
    default: 'Reset Filters',
  },
});

defineEmits(['reset']);
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div
      class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 ring-8 ring-slate-50 dark:ring-slate-900"
    >
      <slot name="icon">
        <SearchX class="w-10 h-10" />
      </slot>
    </div>
    <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
      {{ title }}
    </h3>
    <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
      {{ message }}
    </p>
    <button
      v-if="showReset"
      type="button"
      @click="$emit('reset')"
      class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-poke-blue text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
    >
      <RefreshCw class="w-4 h-4" />
      {{ buttonText }}
    </button>
  </div>
</template>
