<script setup>
import { onMounted } from 'vue';
import SearchBar from '../components/SearchBar.vue';
import FilterBar from '../components/FilterBar.vue';
import PokemonList from '../components/PokemonList.vue';
import { usePokemonStore } from '../stores/pokemon';

const pokemonStore = usePokemonStore();

onMounted(async () => {
  document.title = 'Poke-Search — Pokémon Search & Pokédex';
  await pokemonStore.initSummary();
  await pokemonStore.loadPageDetails();
});

const onSearchInput = (query) => {
  pokemonStore.setSearchQuery(query);
  pokemonStore.loadPageDetails();
};
</script>

<template>
  <div class="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero / Title Section -->
    <div class="text-center max-w-2xl mx-auto space-y-3 pt-2">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        Find Your Favorite <span class="text-poke-blue dark:text-yellow-400">Pokémon</span>
      </h1>
      <p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
        Search through all generations of Pokémon, check base stats, abilities, evolution chains, and type advantages.
      </p>

      <!-- Main Search Bar -->
      <div class="pt-3">
        <SearchBar
          :model-value="pokemonStore.searchQuery"
          @update:model-value="onSearchInput"
          @clear="onSearchInput('')"
        />
      </div>
    </div>

    <!-- Filters & Sorting Bar -->
    <FilterBar />

    <!-- Error Alert if API failed -->
    <div
      v-if="pokemonStore.summaryError"
      class="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-center justify-between"
    >
      <span>{{ pokemonStore.summaryError }}</span>
      <button
        type="button"
        @click="pokemonStore.initSummary"
        class="font-semibold underline hover:no-underline ml-4"
      >
        Retry
      </button>
    </div>

    <!-- Pokemon Grid & Pagination -->
    <PokemonList />
  </div>
</template>