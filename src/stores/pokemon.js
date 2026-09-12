import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getAllPokemonSummary, getPokemonDetail, getPokemonByType } from '../api/pokeapi';
import { GENERATIONS } from '../api/typeChart';
import baseStatsData from '../data/baseStats.json';

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const allSummary = ref([]);
  const loadingSummary = ref(false);
  const summaryError = ref(null);
  const baseStatsMap = ref(baseStatsData);

  const searchQuery = ref('');
  const selectedType = ref('all');
  const selectedGeneration = ref('all');
  const sortBy = ref('id-asc');

  const currentPage = ref(1);
  const itemsPerPage = ref(24);

  // Cache of type -> Set of Pokemon IDs
  const typePokemonMap = ref({});
  const loadingType = ref(false);

  // Store detailed card data for currently visible page
  const pageDetails = ref([]);
  const loadingPageDetails = ref(false);

  // Actions
  const initSummary = async () => {
    if (allSummary.value.length > 0) return;
    loadingSummary.value = true;
    summaryError.value = null;
    try {
      allSummary.value = await getAllPokemonSummary();
    } catch (err) {
      summaryError.value = err.message || 'Failed to fetch Pokémon list';
    } finally {
      loadingSummary.value = false;
    }
  };

  const setTypeFilter = async (type) => {
    selectedType.value = type;
    currentPage.value = 1;

    if (type !== 'all' && !typePokemonMap.value[type]) {
      loadingType.value = true;
      try {
        const list = await getPokemonByType(type);
        typePokemonMap.value[type] = new Set(list.map((p) => p.id));
      } catch (err) {
        console.error('Failed to load type data:', err);
      } finally {
        loadingType.value = false;
      }
    }
  };

  const setGenerationFilter = (genId) => {
    selectedGeneration.value = genId;
    currentPage.value = 1;
  };

  const setSearchQuery = (query) => {
    searchQuery.value = query.trim().toLowerCase();
    currentPage.value = 1;
  };

  const setSortBy = (sortOption) => {
    sortBy.value = sortOption;
    currentPage.value = 1;
  };

  const resetFilters = () => {
    searchQuery.value = '';
    selectedType.value = 'all';
    selectedGeneration.value = 'all';
    sortBy.value = 'id-asc';
    currentPage.value = 1;
  };

  const getBaseStatTotal = (id) => {
    return baseStatsMap.value[id] || 0;
  };

  // Filtered Pokémon list
  const filteredPokemon = computed(() => {
    if (!allSummary.value.length) return [];

    let result = [...allSummary.value];

    // 1. Generation Filter
    if (selectedGeneration.value !== 'all') {
      const genObj = GENERATIONS.find((g) => g.id === selectedGeneration.value);
      if (genObj && genObj.range) {
        const [minId, maxId] = genObj.range;
        result = result.filter((p) => p.id >= minId && p.id <= maxId);
      }
    }

    // 2. Type Filter
    if (selectedType.value !== 'all') {
      const typeSet = typePokemonMap.value[selectedType.value];
      if (typeSet) {
        result = result.filter((p) => typeSet.has(p.id));
      } else {
        // If type set is still loading, keep as is or empty
        return [];
      }
    }

    // 3. Search Query Filter (name or ID)
    if (searchQuery.value) {
      const q = searchQuery.value;
      const numericId = parseInt(q.replace('#', ''), 10);
      result = result.filter((p) => {
        if (!isNaN(numericId) && p.id === numericId) return true;
        return p.name.includes(q) || p.formattedId.toLowerCase().includes(q);
      });
    }

    // 4. Sorting (FR-15)
    result.sort((a, b) => {
      if (sortBy.value === 'id-desc') return b.id - a.id;
      if (sortBy.value === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy.value === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy.value === 'stat-desc') {
        const statDiff = (baseStatsMap.value[b.id] || 0) - (baseStatsMap.value[a.id] || 0);
        return statDiff !== 0 ? statDiff : a.id - b.id;
      }
      if (sortBy.value === 'stat-asc') {
        const statDiff = (baseStatsMap.value[a.id] || 0) - (baseStatsMap.value[b.id] || 0);
        return statDiff !== 0 ? statDiff : a.id - b.id;
      }
      return a.id - b.id; // default: id-asc
    });

    return result;
  });


  const totalResults = computed(() => filteredPokemon.value.length);
  const totalPages = computed(() => Math.max(1, Math.ceil(totalResults.value / itemsPerPage.value)));

  const paginatedPokemon = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredPokemon.value.slice(start, end);
  });

  // Fetch full details (types, official artwork) for visible page items
  const loadPageDetails = async () => {
    const items = paginatedPokemon.value;
    if (!items.length) {
      pageDetails.value = [];
      return;
    }

    loadingPageDetails.value = true;
    try {
      const details = await Promise.all(
        items.map(async (item) => {
          try {
            return await getPokemonDetail(item.id);
          } catch (err) {
            // Fallback to basic summary if detail fails
            return {
              id: item.id,
              name: item.name,
              displayName: item.displayName,
              formattedId: item.formattedId,
              sprites: { artwork: item.sprite },
              types: [],
            };
          }
        })
      );
      pageDetails.value = details;
    } catch (e) {
      console.error('Failed to load page details:', e);
    } finally {
      loadingPageDetails.value = false;
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      loadPageDetails();
    }
  };

  return {
    allSummary,
    loadingSummary,
    summaryError,
    searchQuery,
    selectedType,
    selectedGeneration,
    sortBy,
    currentPage,
    itemsPerPage,
    loadingType,
    loadingPageDetails,
    pageDetails,
    filteredPokemon,
    totalResults,
    totalPages,
    paginatedPokemon,
    initSummary,
    setTypeFilter,
    setGenerationFilter,
    setSearchQuery,
    setSortBy,
    resetFilters,
    loadPageDetails,
    goToPage,
  };
});
