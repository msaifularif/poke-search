<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import {
  Heart,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Ruler,
  Weight,
  Zap,
  Shield,
  Dna,
  Users,
} from 'lucide-vue-next';
import TypeBadge from '../components/TypeBadge.vue';
import StatBar from '../components/StatBar.vue';
import EvolutionChain from '../components/EvolutionChain.vue';
import TypeEffectiveness from '../components/TypeEffectiveness.vue';
import LoadingSkeleton from '../components/LoadingSkeleton.vue';
import { getPokemonDetail, getPokemonSpecies, getEvolutionChain } from '../api/pokeapi';
import { getTypeStyle } from '../api/typeChart';
import { useFavoritesStore } from '../stores/favorites';
import { useTeamStore } from '../stores/team';
import { useAudioCry } from '../composables/useAudioCry';

const route = useRoute();
const router = useRouter();
const favoritesStore = useFavoritesStore();
const teamStore = useTeamStore();
const { isPlaying, playCry } = useAudioCry();


const loading = ref(true);
const error = ref(null);
const pokemon = ref(null);
const species = ref(null);
const evolutionChain = ref(null);

// Sprite mode: 'artwork' | 'animated' | 'shiny'
const activeSpriteTab = ref('artwork');

const isFav = computed(() => (pokemon.value ? favoritesStore.isFavorite(pokemon.value.id) : false));

const primaryType = computed(() => {
  if (pokemon.value?.types?.length > 0) {
    return pokemon.value.types[0].name;
  }
  return 'normal';
});

const typeStyle = computed(() => getTypeStyle(primaryType.value));

const currentSprite = computed(() => {
  if (!pokemon.value) return '';
  if (activeSpriteTab.value === 'animated' && pokemon.value.sprites.animated) {
    return pokemon.value.sprites.animated;
  }
  if (activeSpriteTab.value === 'shiny' && pokemon.value.sprites.shiny) {
    return pokemon.value.sprites.shiny;
  }
  return pokemon.value.sprites.artwork || pokemon.value.sprites.front;
});

const prevId = computed(() => {
  if (!pokemon.value) return null;
  return pokemon.value.id > 1 ? pokemon.value.id - 1 : null;
});

const nextId = computed(() => {
  if (!pokemon.value) return null;
  return pokemon.value.id < 1025 ? pokemon.value.id + 1 : null;
});

const loadData = async (idOrName) => {
  loading.value = true;
  error.value = null;
  activeSpriteTab.value = 'artwork';

  try {
    const detailData = await getPokemonDetail(idOrName);
    pokemon.value = detailData;

    document.title = `${detailData.displayName} (${detailData.formattedId}) — Poke-Search`;

    // Fetch species info (genus, flavor text, evolution URL)
    const speciesData = await getPokemonSpecies(detailData.id);
    species.value = speciesData;

    // Fetch evolution chain if available
    if (speciesData.evolutionChainUrl) {
      const evoData = await getEvolutionChain(speciesData.evolutionChainUrl);
      evolutionChain.value = evoData;
    } else {
      evolutionChain.value = null;
    }
  } catch (err) {
    console.error(err);
    error.value = err.message || 'Failed to load Pokémon profile';
  } finally {
    loading.value = false;
  }
};

watch(
  () => route.params.idOrName,
  (newId) => {
    if (newId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      loadData(newId);
    }
  },
  { immediate: true }
);

const onPlayCry = () => {
  if (pokemon.value?.cries?.latest) {
    playCry(pokemon.value.cries.latest);
  }
};
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
    <!-- Back Button & Prev/Next Bar -->
    <div class="flex items-center justify-between">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to Pokédex
      </RouterLink>

      <div class="flex items-center gap-2" v-if="pokemon">
        <RouterLink
          v-if="prevId"
          :to="`/pokemon/${prevId}`"
          class="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
          title="Previous Pokémon"
        >
          <ChevronLeft class="w-4 h-4" />
          <span class="hidden sm:inline">#{{ String(prevId).padStart(3, '0') }}</span>
        </RouterLink>

        <RouterLink
          v-if="nextId"
          :to="`/pokemon/${nextId}`"
          class="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
          title="Next Pokémon"
        >
          <span class="hidden sm:inline">#{{ String(nextId).padStart(3, '0') }}</span>
          <ChevronRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading">
      <LoadingSkeleton type="detail" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4"
    >
      <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">Pokémon Not Found</h2>
      <p class="text-slate-500 dark:text-slate-400 text-sm">{{ error }}</p>
      <RouterLink
        to="/"
        class="inline-block px-5 py-2.5 rounded-xl bg-poke-blue text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
      >
        Return to Pokédex
      </RouterLink>
    </div>

    <!-- Main Pokémon Profile -->
    <div v-else-if="pokemon" class="space-y-6">
      <!-- Top Card: Visual Header -->
      <div
        class="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
      >
        <!-- Large Background Type Glow -->
        <div
          class="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-15 dark:opacity-25 blur-3xl pointer-events-none"
          :style="{ backgroundColor: typeStyle.hex }"
        ></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Left Column: Artwork Showcase & Controls (5 cols) -->
          <div class="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <!-- Artwork frame with subtle radial background -->
            <div class="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
              <div
                class="absolute inset-0 m-auto w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-slate-100 dark:bg-slate-800/80 -z-0"
              ></div>
              <img
                :src="currentSprite"
                :alt="pokemon.displayName"
                class="relative z-10 max-h-56 max-w-56 sm:max-h-64 sm:max-w-64 object-contain drop-shadow-xl transition-transform duration-300 hover:scale-105"
              />
            </div>

            <!-- Sprite Form Switcher (Artwork / Showdown Animated / Shiny) -->
            <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                @click="activeSpriteTab = 'artwork'"
                class="px-3 py-1 rounded-lg transition-all"
                :class="activeSpriteTab === 'artwork'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                Official Artwork
              </button>

              <button
                v-if="pokemon.sprites.animated"
                type="button"
                @click="activeSpriteTab = 'animated'"
                class="px-3 py-1 rounded-lg transition-all"
                :class="activeSpriteTab === 'animated'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                Animated
              </button>

              <button
                v-if="pokemon.sprites.shiny"
                type="button"
                @click="activeSpriteTab = 'shiny'"
                class="inline-flex items-center gap-1 px-3 py-1 rounded-lg transition-all"
                :class="activeSpriteTab === 'shiny'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                <Sparkles class="w-3 h-3 text-yellow-500" />
                Shiny
              </button>
            </div>
          </div>

          <!-- Right Column: Profile Info & Quick Actions (7 cols) -->
          <div class="lg:col-span-7 space-y-6">
            <!-- Header row: Number, Name, Cry Sound, Favorite -->
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="font-mono text-base font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  {{ pokemon.formattedId }}
                </span>
                <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {{ pokemon.displayName }}
                </h1>
                <p v-if="species" class="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ species.genus }}
                </p>
              </div>

              <!-- Actions: Team, Sound Cry, Favorite -->
              <div class="flex items-center gap-2">
                <!-- Team Toggle (FR-17) -->
                <button
                  type="button"
                  @click="teamStore.toggleTeamMember(pokemon)"
                  class="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition-all shadow-sm"
                  :class="teamStore.isInTeam(pokemon.id)
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
                  :title="teamStore.isInTeam(pokemon.id) ? 'Remove from your 6-member Team' : 'Add to your 6-member Team'"
                >
                  <Users class="w-4 h-4" />
                  <span class="hidden sm:inline">{{ teamStore.isInTeam(pokemon.id) ? 'In Team' : '+ Team' }}</span>
                </button>

                <!-- Sound Cry (FR-14) -->
                <button
                  v-if="pokemon.cries.latest"
                  type="button"
                  @click="onPlayCry"
                  class="p-2.5 rounded-2xl border transition-all"
                  :class="isPlaying
                    ? 'bg-poke-blue text-white border-poke-blue animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
                  :title="isPlaying ? 'Playing Pokémon Cry...' : 'Play Pokémon Cry Sound'"
                  aria-label="Play sound cry"
                >
                  <Volume2 class="w-5 h-5" />
                </button>

                <!-- Favorite Toggle (FR-8) -->
                <button
                  type="button"
                  @click="favoritesStore.toggleFavorite(pokemon)"
                  class="p-2.5 rounded-2xl border transition-all"
                  :class="isFav
                    ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900 text-red-500'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500'"
                  :title="isFav ? 'Remove from favorites' : 'Add to favorites'"
                  aria-label="Toggle favorite"
                >
                  <Heart class="w-5 h-5" :class="{ 'fill-red-500': isFav }" />
                </button>
              </div>
            </div>


            <!-- Type Badges -->
            <div class="flex flex-wrap items-center gap-2">
              <TypeBadge
                v-for="t in pokemon.types"
                :key="t.name"
                :type="t.name"
                size="lg"
              />
            </div>

            <!-- Pokédex Flavor Text -->
            <div v-if="species" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
              "{{ species.flavorText }}"
            </div>

            <!-- Physical Specs & Details Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <!-- Height -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div class="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                  <Ruler class="w-3.5 h-3.5" />
                  <span>Height</span>
                </div>
                <div class="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {{ pokemon.height.meters }} m
                </div>
                <div class="text-[11px] text-slate-400">
                  ({{ pokemon.height.feet }} ft)
                </div>
              </div>

              <!-- Weight -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div class="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                  <Weight class="w-3.5 h-3.5" />
                  <span>Weight</span>
                </div>
                <div class="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {{ pokemon.weight.kg }} kg
                </div>
                <div class="text-[11px] text-slate-400">
                  ({{ pokemon.weight.lbs }} lbs)
                </div>
              </div>

              <!-- Generation -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div class="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                  <Dna class="w-3.5 h-3.5" />
                  <span>Gen</span>
                </div>
                <div class="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {{ species?.generation?.replace('GENERATION-', 'GEN ') || '—' }}
                </div>
                <div class="text-[11px] text-slate-400">
                  Origin
                </div>
              </div>

              <!-- Base Exp -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div class="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                  <Zap class="w-3.5 h-3.5" />
                  <span>Base Exp</span>
                </div>
                <div class="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {{ pokemon.baseExperience || '—' }}
                </div>
                <div class="text-[11px] text-slate-400">
                  Experience
                </div>
              </div>
            </div>

            <!-- Abilities -->
            <div class="space-y-2">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Abilities
              </span>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="a in pokemon.abilities"
                  :key="a.name"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700"
                >
                  {{ a.displayName }}
                  <span
                    v-if="a.is_hidden"
                    class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-yellow-500/20 dark:text-yellow-300"
                    title="Hidden Ability"
                  >
                    Hidden
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two-Column Grid: Base Stats & Type Effectiveness -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Base Stats Card (7 cols) -->
        <div class="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Base Stats</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Official PokéAPI combat metrics</p>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 uppercase tracking-wider block">Total</span>
              <span class="text-xl font-black font-mono text-poke-blue dark:text-yellow-400">
                {{ pokemon.totalStats }}
              </span>
            </div>
          </div>

          <div class="space-y-3.5">
            <StatBar
              v-for="s in pokemon.stats"
              :key="s.name"
              :label="s.label"
              :value="s.base_stat"
              :max-value="255"
            />
          </div>
        </div>

        <!-- Type Effectiveness Card (5 cols) (FR-11) -->
        <div class="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Type Matchups</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">Defensive damage taken from attack types</p>
          </div>

          <TypeEffectiveness :types="pokemon.typeNames" />
        </div>
      </div>

      <!-- Evolution Chain Card (FR-6) -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Evolution Chain</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Evolution stages and required triggers</p>
        </div>

        <EvolutionChain
          :chain="evolutionChain"
          :current-pokemon-id="pokemon.id"
        />
      </div>
    </div>
  </div>
</template>
