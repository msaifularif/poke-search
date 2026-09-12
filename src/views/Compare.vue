<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeftRight, Trophy, Sparkles, Scale, Search } from 'lucide-vue-next';
import TypeBadge from '../components/TypeBadge.vue';
import StatBar from '../components/StatBar.vue';
import { getPokemonDetail, getAllPokemonSummary } from '../api/pokeapi';
import { usePokemonStore } from '../stores/pokemon';

const route = useRoute();
const router = useRouter();
const pokemonStore = usePokemonStore();

const pokemon1Id = ref(route.query.p1 ? Number(route.query.p1) : 6); // Charizard default
const pokemon2Id = ref(route.query.p2 ? Number(route.query.p2) : 9); // Blastoise default

const p1 = ref(null);
const p2 = ref(null);
const loading = ref(true);

const searchP1 = ref('');
const searchP2 = ref('');
const showP1Dropdown = ref(false);
const showP2Dropdown = ref(false);

onMounted(async () => {
  document.title = 'Compare Pokémon Side-by-Side — Poke-Search';
  await pokemonStore.initSummary();
  await loadBoth();
});

const loadBoth = async () => {
  loading.value = true;
  try {
    const [d1, d2] = await Promise.all([
      getPokemonDetail(pokemon1Id.value),
      getPokemonDetail(pokemon2Id.value),
    ]);
    p1.value = d1;
    p2.value = d2;
  } catch (err) {
    console.error('Failed to load comparison data:', err);
  } finally {
    loading.value = false;
  }
};

const swapPokemon = () => {
  const temp = pokemon1Id.value;
  pokemon1Id.value = pokemon2Id.value;
  pokemon2Id.value = temp;
  loadBoth();
};

const selectP1 = (pokemon) => {
  pokemon1Id.value = pokemon.id;
  searchP1.value = '';
  showP1Dropdown.value = false;
  loadBoth();
};

const selectP2 = (pokemon) => {
  pokemon2Id.value = pokemon.id;
  searchP2.value = '';
  showP2Dropdown.value = false;
  loadBoth();
};

const p1Suggestions = computed(() => {
  if (!searchP1.value) return [];
  const q = searchP1.value.toLowerCase().trim();
  return pokemonStore.allSummary
    .filter((item) => item.name.includes(q) || String(item.id) === q)
    .slice(0, 6);
});

const p2Suggestions = computed(() => {
  if (!searchP2.value) return [];
  const q = searchP2.value.toLowerCase().trim();
  return pokemonStore.allSummary
    .filter((item) => item.name.includes(q) || String(item.id) === q)
    .slice(0, 6);
});

// Compare individual stats
const getStatWinner = (index) => {
  if (!p1.value || !p2.value) return 0;
  const s1 = p1.value.stats[index]?.base_stat || 0;
  const s2 = p2.value.stats[index]?.base_stat || 0;
  if (s1 > s2) return 1;
  if (s2 > s1) return 2;
  return 0; // Tie
};

const totalWinner = computed(() => {
  if (!p1.value || !p2.value) return 0;
  if (p1.value.totalStats > p2.value.totalStats) return 1;
  if (p2.value.totalStats > p1.value.totalStats) return 2;
  return 0;
});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header -->
    <div class="text-center max-w-xl mx-auto space-y-2">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-poke-blue/10 dark:bg-yellow-400/10 text-poke-blue dark:text-yellow-400 text-xs font-bold uppercase tracking-wider">
        <Scale class="w-3.5 h-3.5" />
        Battle Comparison
      </div>
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
        Compare Pokémon Side-by-Side
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Analyze base stats, stat advantages, physical measurements, and abilities.
      </p>
    </div>

    <!-- Selectors Bar -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <!-- P1 Selector (5 cols) -->
      <div class="md:col-span-5 relative">
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Pokémon 1
        </label>
        <div class="relative">
          <input
            type="text"
            v-model="searchP1"
            @focus="showP1Dropdown = true"
            :placeholder="p1 ? `${p1.displayName} (${p1.formattedId})` : 'Search Pokémon 1...'"
            class="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-poke-blue dark:focus:ring-yellow-400"
          />
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <!-- Autocomplete Suggestions -->
        <div
          v-if="showP1Dropdown && p1Suggestions.length > 0"
          class="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800"
        >
          <button
            v-for="item in p1Suggestions"
            :key="item.id"
            type="button"
            @click="selectP1(item)"
            class="w-full flex items-center gap-3 px-4 py-2 text-left text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <img :src="item.sprite" class="w-7 h-7 object-contain" />
            <span class="font-mono text-slate-400">{{ item.formattedId }}</span>
            <span class="text-slate-800 dark:text-slate-200 capitalize">{{ item.name }}</span>
          </button>
        </div>
      </div>

      <!-- Swap Button (2 cols) -->
      <div class="md:col-span-2 flex justify-center">
        <button
          type="button"
          @click="swapPokemon"
          class="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm"
          title="Swap Pokémon"
          aria-label="Swap Pokémon"
        >
          <ArrowLeftRight class="w-5 h-5" />
        </button>
      </div>

      <!-- P2 Selector (5 cols) -->
      <div class="md:col-span-5 relative">
        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Pokémon 2
        </label>
        <div class="relative">
          <input
            type="text"
            v-model="searchP2"
            @focus="showP2Dropdown = true"
            :placeholder="p2 ? `${p2.displayName} (${p2.formattedId})` : 'Search Pokémon 2...'"
            class="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-poke-blue dark:focus:ring-yellow-400"
          />
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <!-- Autocomplete Suggestions -->
        <div
          v-if="showP2Dropdown && p2Suggestions.length > 0"
          class="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800"
        >
          <button
            v-for="item in p2Suggestions"
            :key="item.id"
            type="button"
            @click="selectP2(item)"
            class="w-full flex items-center gap-3 px-4 py-2 text-left text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <img :src="item.sprite" class="w-7 h-7 object-contain" />
            <span class="font-mono text-slate-400">{{ item.formattedId }}</span>
            <span class="text-slate-800 dark:text-slate-200 capitalize">{{ item.name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Comparison Content -->
    <div v-if="loading" class="text-center py-16 text-slate-400">
      <div class="inline-block w-8 h-8 border-4 border-poke-blue border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-2 text-xs font-semibold">Loading Pokémon data...</p>
    </div>

    <div v-else-if="p1 && p2" class="space-y-6">
      <!-- Side by Side Cards -->
      <div class="grid grid-cols-2 gap-4 sm:gap-6">
        <!-- Pokémon 1 Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 text-center space-y-3 relative overflow-hidden">
          <span class="font-mono text-xs font-bold text-slate-400">{{ p1.formattedId }}</span>
          <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {{ p1.displayName }}
          </h2>
          <div class="flex justify-center my-2">
            <img :src="p1.sprites.artwork" :alt="p1.displayName" class="w-28 sm:w-40 h-28 sm:h-40 object-contain drop-shadow-md" />
          </div>
          <div class="flex justify-center flex-wrap gap-1.5">
            <TypeBadge v-for="t in p1.types" :key="t.name" :type="t.name" size="sm" />
          </div>
        </div>

        <!-- Pokémon 2 Card -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 text-center space-y-3 relative overflow-hidden">
          <span class="font-mono text-xs font-bold text-slate-400">{{ p2.formattedId }}</span>
          <h2 class="text-lg sm:text-2xl font-black text-slate-900 dark:text-white truncate">
            {{ p2.displayName }}
          </h2>
          <div class="flex justify-center my-2">
            <img :src="p2.sprites.artwork" :alt="p2.displayName" class="w-28 sm:w-40 h-28 sm:h-40 object-contain drop-shadow-md" />
          </div>
          <div class="flex justify-center flex-wrap gap-1.5">
            <TypeBadge v-for="t in p2.types" :key="t.name" :type="t.name" size="sm" />
          </div>
        </div>
      </div>

      <!-- Stats Comparison Table / Bars -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy class="w-4 h-4 text-yellow-500" />
          Stat Head-to-Head
        </h3>

        <div class="space-y-4">
          <div
            v-for="(s, index) in p1.stats"
            :key="s.name"
            class="space-y-1.5"
          >
            <!-- Label & Values -->
            <div class="flex items-center justify-between text-xs font-semibold">
              <span
                class="font-mono font-bold flex items-center gap-1"
                :class="getStatWinner(index) === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'"
              >
                {{ s.base_stat }}
                <Trophy v-if="getStatWinner(index) === 1" class="w-3 h-3 text-emerald-500" />
              </span>

              <span class="text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                {{ s.label }}
              </span>

              <span
                class="font-mono font-bold flex items-center gap-1"
                :class="getStatWinner(index) === 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'"
              >
                <Trophy v-if="getStatWinner(index) === 2" class="w-3 h-3 text-emerald-500" />
                {{ p2.stats[index]?.base_stat }}
              </span>
            </div>

            <!-- Mirrored comparative bars -->
            <div class="grid grid-cols-2 gap-2">
              <!-- P1 Bar (Extends to right, flipped) -->
              <div class="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex justify-end">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getStatWinner(index) === 1 ? 'bg-emerald-500' : 'bg-poke-blue/70 dark:bg-yellow-400/70'"
                  :style="{ width: `${s.percentage}%` }"
                ></div>
              </div>

              <!-- P2 Bar (Extends to right) -->
              <div class="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getStatWinner(index) === 2 ? 'bg-emerald-500' : 'bg-poke-red/70 dark:bg-red-400/70'"
                  :style="{ width: `${p2.stats[index]?.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Total Stats Row -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-bold text-sm">
            <span
              class="font-mono text-base"
              :class="totalWinner === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'"
            >
              {{ p1.totalStats }}
            </span>

            <span class="text-xs uppercase tracking-wider text-slate-400">Total Base Stats</span>

            <span
              class="font-mono text-base"
              :class="totalWinner === 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'"
            >
              {{ p2.totalStats }}
            </span>
          </div>
        </div>
      </div>

      <!-- Physical Measurements & Abilities Comparison -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Height & Weight -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Measurements
          </h3>
          <div class="space-y-3 text-xs">
            <div class="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span class="font-bold font-mono">{{ p1.height.meters }} m</span>
              <span class="text-slate-400">Height</span>
              <span class="font-bold font-mono">{{ p2.height.meters }} m</span>
            </div>
            <div class="flex justify-between items-center py-1.5">
              <span class="font-bold font-mono">{{ p1.weight.kg }} kg</span>
              <span class="text-slate-400">Weight</span>
              <span class="font-bold font-mono">{{ p2.weight.kg }} kg</span>
            </div>
          </div>
        </div>

        <!-- Abilities -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Abilities
          </h3>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase block">{{ p1.displayName }}</span>
              <div v-for="a in p1.abilities" :key="a.name" class="font-semibold text-slate-700 dark:text-slate-300">
                • {{ a.displayName }}
              </div>
            </div>
            <div class="space-y-1">
              <span class="text-[10px] font-bold text-slate-400 uppercase block">{{ p2.displayName }}</span>
              <div v-for="a in p2.abilities" :key="a.name" class="font-semibold text-slate-700 dark:text-slate-300">
                • {{ a.displayName }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
