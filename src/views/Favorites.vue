<script setup>
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { Heart, Trash2, Search, Users, Plus, Check } from 'lucide-vue-next';
import PokemonCard from '../components/PokemonCard.vue';
import TeamSection from '../components/TeamSection.vue';
import EmptyState from '../components/EmptyState.vue';
import { useFavoritesStore } from '../stores/favorites';
import { useTeamStore } from '../stores/team';

const favoritesStore = useFavoritesStore();
const teamStore = useTeamStore();
const searchQuery = ref('');

onMounted(() => {
  document.title = 'My Favorites & Battle Team — Poke-Search';
});

const filteredFavorites = computed(() => {
  if (!searchQuery.value) return favoritesStore.favorites;
  const q = searchQuery.value.toLowerCase().trim();
  return favoritesStore.favorites.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.displayName.toLowerCase().includes(q) ||
      String(p.id) === q ||
      p.formattedId.toLowerCase().includes(q)
    );
  });
});

const confirmClear = () => {
  if (window.confirm('Are you sure you want to remove all Pokémon from your favorites?')) {
    favoritesStore.clearFavorites();
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
    <!-- Battle Team Section (FR-17) -->
    <TeamSection />

    <!-- Favorites Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Heart class="w-6 h-6 fill-red-500 text-red-500" />
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Saved Favorites
          </h1>
          <span class="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
            {{ favoritesStore.count }}
          </span>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Click "+ Team" on any favorite Pokémon to add them to your 6-member squad above.
        </p>
      </div>

      <div class="flex items-center gap-3" v-if="favoritesStore.count > 0">
        <!-- Search within favorites -->
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Filter favorites..."
            class="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-poke-blue dark:focus:ring-yellow-400"
          />
          <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <!-- Clear All Button -->
        <button
          type="button"
          @click="confirmClear"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition-colors"
        >
          <Trash2 class="w-3.5 h-3.5" />
          Clear Favorites
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="favoritesStore.count === 0" class="py-12">
      <EmptyState
        title="No Favorites Yet"
        message="You haven't added any Pokémon to your favorites yet. Browse the Pokédex and tap the heart icon on any Pokémon to save them here!"
        :show-reset="false"
      >
        <template #icon>
          <Heart class="w-10 h-10 text-slate-400" />
        </template>
      </EmptyState>
      <div class="text-center">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-poke-blue text-white hover:bg-blue-700 transition-all shadow-md active:scale-95"
        >
          Explore Pokédex
        </RouterLink>
      </div>
    </div>

    <!-- No match in filter -->
    <div v-else-if="filteredFavorites.length === 0" class="py-8">
      <EmptyState
        title="No Matching Favorites"
        message="None of your favorited Pokémon match your current search query."
        button-text="Clear Search"
        @reset="searchQuery = ''"
      />
    </div>

    <!-- Favorites Grid with Team Quick-Action -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <div
        v-for="p in filteredFavorites"
        :key="p.id"
        class="flex flex-col space-y-2"
      >
        <PokemonCard :pokemon="p" />

        <!-- Quick Team Toggle Button -->
        <button
          type="button"
          @click="teamStore.toggleTeamMember(p)"
          class="w-full py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
          :class="teamStore.isInTeam(p.id)
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'"
        >
          <Check v-if="teamStore.isInTeam(p.id)" class="w-3.5 h-3.5" />
          <Plus v-else class="w-3.5 h-3.5" />
          <span>{{ teamStore.isInTeam(p.id) ? 'In Team' : 'Add to Team' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

