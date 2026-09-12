<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import PokemonCard from './PokemonCard.vue';
import LoadingSkeleton from './LoadingSkeleton.vue';
import EmptyState from './EmptyState.vue';
import { usePokemonStore } from '../stores/pokemon';

const pokemonStore = usePokemonStore();

// Smart pagination display range (e.g., 1 ... 4 5 6 ... 43)
const paginationRange = computed(() => {
  const current = pokemonStore.currentPage;
  const total = pokemonStore.totalPages;
  const delta = 2;
  const range = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  if (current - delta > 2) {
    range.unshift('...');
  }
  if (current + delta < total - 1) {
    range.push('...');
  }

  range.unshift(1);
  if (total > 1) {
    range.push(total);
  }

  return range;
});

const onPageChange = (p) => {
  if (typeof p === 'number') {
    pokemonStore.goToPage(p);
  }
};

const onItemsPerPageChange = (e) => {
  pokemonStore.itemsPerPage = Number(e.target.value);
  pokemonStore.currentPage = 1;
  pokemonStore.loadPageDetails();
};
</script>

<template>
  <div class="space-y-6">
    <!-- Loading initial summary -->
    <div v-if="pokemonStore.loadingSummary" class="py-8">
      <LoadingSkeleton :count="pokemonStore.itemsPerPage" type="card" />
    </div>

    <!-- Empty State -->
    <div v-else-if="pokemonStore.filteredPokemon.length === 0" class="py-8">
      <EmptyState
        title="No Pokémon Matched"
        message="No Pokémon in the Pokédex match your search criteria. Try a different search term or reset filters."
        @reset="pokemonStore.resetFilters"
      />
    </div>

    <!-- Pokemon Cards Grid -->
    <div v-else>
      <div
        v-if="pokemonStore.loadingPageDetails"
        class="relative min-h-[400px]"
      >
        <LoadingSkeleton :count="pokemonStore.itemsPerPage" type="card" />
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4"
      >
        <PokemonCard
          v-for="p in pokemonStore.pageDetails"
          :key="p.id"
          :pokemon="p"
        />
      </div>

      <!-- Pagination & Page Size Toolbar -->
      <div
        v-if="pokemonStore.totalPages > 1"
        class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-slate-200 dark:border-slate-800 text-sm"
      >
        <!-- Page size selector -->
        <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span>Items per page:</span>
          <select
            :value="pokemonStore.itemsPerPage"
            @change="onItemsPerPageChange"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-poke-blue dark:focus:ring-yellow-400 focus:outline-none"
          >
            <option :value="12">12</option>
            <option :value="24">24</option>
            <option :value="48">48</option>
            <option :value="96">96</option>
          </select>
        </div>

        <!-- Pagination Controls -->
        <nav aria-label="Pagination" class="flex items-center gap-1">
          <!-- Previous Button -->
          <button
            type="button"
            @click="onPageChange(pokemonStore.currentPage - 1)"
            :disabled="pokemonStore.currentPage <= 1"
            class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>

          <!-- Page Numbers -->
          <template v-for="(p, idx) in paginationRange" :key="idx">
            <span
              v-if="p === '...'"
              class="px-2 py-1 text-slate-400 select-none"
            >
              …
            </span>
            <button
              v-else
              type="button"
              @click="onPageChange(p)"
              class="w-9 h-9 rounded-xl font-medium text-xs md:text-sm transition-all"
              :class="pokemonStore.currentPage === p
                ? 'bg-poke-blue text-white dark:bg-yellow-400 dark:text-slate-950 font-bold shadow-sm'
                : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
            >
              {{ p }}
            </button>
          </template>

          <!-- Next Button -->
          <button
            type="button"
            @click="onPageChange(pokemonStore.currentPage + 1)"
            :disabled="pokemonStore.currentPage >= pokemonStore.totalPages"
            class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
