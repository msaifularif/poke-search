import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'poke_favorites';

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref([]);

  // Load from localStorage on initialization
  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        favorites.value = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load favorites from localStorage:', e);
      favorites.value = [];
    }
  };

  const saveFavorites = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }
  };

  const isFavorite = (id) => {
    const numId = Number(id);
    return favorites.value.some((p) => Number(p.id) === numId);
  };

  const toggleFavorite = (pokemon) => {
    const numId = Number(pokemon.id);
    const index = favorites.value.findIndex((p) => Number(p.id) === numId);

    if (index >= 0) {
      favorites.value.splice(index, 1);
    } else {
      favorites.value.push({
        id: pokemon.id,
        name: pokemon.name,
        displayName: pokemon.displayName || pokemon.name,
        formattedId: pokemon.formattedId || `#${String(pokemon.id).padStart(3, '0')}`,
        sprite: pokemon.sprites?.artwork || pokemon.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
        types: pokemon.types ? pokemon.types.map((t) => (typeof t === 'string' ? { name: t } : t)) : [],
      });
    }

    saveFavorites();
  };

  const removeFavorite = (id) => {
    const numId = Number(id);
    favorites.value = favorites.value.filter((p) => Number(p.id) !== numId);
    saveFavorites();
  };

  const clearFavorites = () => {
    favorites.value = [];
    saveFavorites();
  };

  const count = computed(() => favorites.value.length);

  loadFavorites();

  return {
    favorites,
    count,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  };
});
