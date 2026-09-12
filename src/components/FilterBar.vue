<script setup>
import { Filter, ArrowUpDown, Sparkles, X } from 'lucide-vue-next';
import { ALL_TYPES, GENERATIONS, getTypeStyle } from '../api/typeChart';
import { usePokemonStore } from '../stores/pokemon';

const pokemonStore = usePokemonStore();

const onTypeChange = (e) => {
  pokemonStore.setTypeFilter(e.target.value);
};

const onGenChange = (e) => {
  pokemonStore.setGenerationFilter(e.target.value);
};

const onSortChange = (e) => {
  pokemonStore.setSortBy(e.target.value);
};
</script>

<template>
  <div class="space-y-4">
    <!-- Filter Controls Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-sm">
      <!-- Left side: Filters -->
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Type Filter Select -->
        <div class="relative flex items-center">
          <select
            :value="pokemonStore.selectedType"
            @change="onTypeChange"
            aria-label="Filter by Type"
            class="appearance-none pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-poke-blue dark:focus:ring-yellow-400 focus:outline-none capitalize transition-colors"
          >
            <option value="all">All Types</option>
            <option v-for="t in ALL_TYPES" :key="t" :value="t">
              {{ t.toUpperCase() }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-2.5 text-slate-400">
            ▼
          </div>
        </div>

        <!-- Generation Filter Select -->
        <div class="relative flex items-center">
          <select
            :value="pokemonStore.selectedGeneration"
            @change="onGenChange"
            aria-label="Filter by Generation"
            class="appearance-none pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-poke-blue dark:focus:ring-yellow-400 focus:outline-none transition-colors"
          >
            <option v-for="gen in GENERATIONS" :key="gen.id" :value="gen.id">
              {{ gen.name }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-2.5 text-slate-400">
            ▼
          </div>
        </div>

        <!-- Sort Select -->
        <div class="relative flex items-center">
          <select
            :value="pokemonStore.sortBy"
            @change="onSortChange"
            aria-label="Sort Order"
            class="appearance-none pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-poke-blue dark:focus:ring-yellow-400 focus:outline-none transition-colors"
          >
            <option value="id-asc">Number: Low to High</option>
            <option value="id-desc">Number: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="stat-desc">Base Stats: Highest First</option>
            <option value="stat-asc">Base Stats: Lowest First</option>
          </select>
          <div class="pointer-events-none absolute right-2.5 text-slate-400">
            ▼
          </div>
        </div>

      </div>

      <!-- Right side: Count & Reset -->
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <span class="text-slate-900 dark:text-slate-100 font-bold font-mono">{{ pokemonStore.totalResults }}</span> Pokémon
        </span>

        <button
          v-if="pokemonStore.selectedType !== 'all' || pokemonStore.selectedGeneration !== 'all' || pokemonStore.searchQuery || pokemonStore.sortBy !== 'id-asc'"
          type="button"
          @click="pokemonStore.resetFilters"
          class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          title="Reset all filters"
        >
          <X class="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>

    <!-- Active Type Quick Pills (Scrollable or wrapped for rapid switching) -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
      <button
        type="button"
        @click="pokemonStore.setTypeFilter('all')"
        class="px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap"
        :class="pokemonStore.selectedType === 'all'
          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'"
      >
        All
      </button>
      <button
        v-for="t in ALL_TYPES"
        :key="t"
        type="button"
        @click="pokemonStore.setTypeFilter(t)"
        class="px-3 py-1 rounded-full font-semibold transition-all whitespace-nowrap capitalize"
        :class="pokemonStore.selectedType === t
          ? `${getTypeStyle(t).bg} text-white shadow ring-2 ring-offset-2 dark:ring-offset-slate-900 ring-slate-400`
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'"
      >
        {{ t }}
      </button>
    </div>
  </div>
</template>
