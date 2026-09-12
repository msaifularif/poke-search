<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Heart } from 'lucide-vue-next';
import TypeBadge from './TypeBadge.vue';
import { useFavoritesStore } from '../stores/favorites';
import { getTypeStyle } from '../api/typeChart';

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
});

const favoritesStore = useFavoritesStore();

const isFav = computed(() => favoritesStore.isFavorite(props.pokemon.id));

const primaryType = computed(() => {
  if (props.pokemon.types && props.pokemon.types.length > 0) {
    const t = props.pokemon.types[0];
    return typeof t === 'string' ? t : t.name;
  }
  return 'normal';
});

const typeStyle = computed(() => getTypeStyle(primaryType.value));

const spriteUrl = computed(() => {
  return (
    props.pokemon.sprites?.artwork ||
    props.pokemon.sprite ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${props.pokemon.id}.png`
  );
});

const toggleFav = (event) => {
  event.preventDefault();
  event.stopPropagation();
  favoritesStore.toggleFavorite(props.pokemon);
};
</script>

<template>
  <RouterLink
    :to="`/pokemon/${pokemon.id}`"
    class="group relative flex flex-col justify-between bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden select-none"
  >
    <!-- Background Type Accent Glow -->
    <div
      class="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10 dark:opacity-15 blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-25"
      :style="{ backgroundColor: typeStyle.hex }"
    ></div>

    <!-- Header: ID & Favorite Button -->
    <div class="flex items-center justify-between z-10">
      <span class="font-mono text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
        {{ pokemon.formattedId || `#${String(pokemon.id).padStart(3, '0')}` }}
      </span>
      <button
        type="button"
        @click="toggleFav"
        class="p-1.5 rounded-full transition-all duration-200 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
        :class="{ 'text-red-500 bg-red-50 dark:bg-red-950/40': isFav }"
        :title="isFav ? 'Remove from favorites' : 'Add to favorites'"
        aria-label="Toggle favorite"
      >
        <Heart
          class="w-4 h-4 transition-transform group-hover/btn:scale-110"
          :class="{ 'fill-red-500 text-red-500': isFav }"
        />
      </button>
    </div>

    <!-- Pokemon Artwork Container -->
    <div class="relative flex items-center justify-center my-3 h-36">
      <!-- Watermark / Silhouette Circle -->
      <div
        class="absolute w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800/60 -z-0 group-hover:scale-110 transition-transform duration-300"
      ></div>
      <img
        :src="spriteUrl"
        :alt="pokemon.displayName || pokemon.name"
        loading="lazy"
        class="relative z-10 w-28 h-28 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
      />
    </div>

    <!-- Footer: Name & Type Badges -->
    <div class="z-10 space-y-2 mt-auto">
      <h3
        class="text-base font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-poke-blue dark:group-hover:text-yellow-400 transition-colors"
      >
        {{ pokemon.displayName || pokemon.name }}
      </h3>

      <div class="flex flex-wrap gap-1.5">
        <template v-if="pokemon.types && pokemon.types.length">
          <TypeBadge
            v-for="t in pokemon.types"
            :key="typeof t === 'string' ? t : t.name"
            :type="typeof t === 'string' ? t : t.name"
            size="sm"
          />
        </template>
        <div v-else class="h-4 w-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
      </div>
    </div>
  </RouterLink>
</template>
