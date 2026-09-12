<script setup>
import { ref, watch } from 'vue';
import { Search, X } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search by Pokémon name or Pokédex number (e.g., Pikachu or #025)...',
  },
  debounceMs: {
    type: Number,
    default: 300,
  },
});

const emit = defineEmits(['update:modelValue', 'search', 'clear']);

const localQuery = ref(props.modelValue);
let timer = null;

watch(
  () => props.modelValue,
  (val) => {
    if (val !== localQuery.value) {
      localQuery.value = val;
    }
  }
);

const onInput = (e) => {
  const val = e.target.value;
  localQuery.value = val;
  clearTimeout(timer);
  timer = setTimeout(() => {
    emit('update:modelValue', val);
    emit('search', val);
  }, props.debounceMs);
};

const clearInput = () => {
  localQuery.value = '';
  clearTimeout(timer);
  emit('update:modelValue', '');
  emit('clear');
};
</script>

<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
      <Search class="w-5 h-5" />
    </div>

    <input
      type="text"
      :value="localQuery"
      @input="onInput"
      @keydown.esc="clearInput"
      :placeholder="placeholder"
      class="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-poke-blue dark:focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
    />

    <button
      v-if="localQuery"
      type="button"
      @click="clearInput"
      class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      aria-label="Clear search"
    >
      <X class="w-5 h-5" />
    </button>
  </div>
</template>
