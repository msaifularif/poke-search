<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { Users, X, Shield, Sparkles, Plus, AlertCircle, Check } from 'lucide-vue-next';
import TypeBadge from './TypeBadge.vue';
import { useTeamStore } from '../stores/team';
import { usePokemonStore } from '../stores/pokemon';

const teamStore = useTeamStore();
const pokemonStore = usePokemonStore();

// Total combined base stats of team
const totalTeamStats = computed(() => {
  return teamStore.team.reduce((acc, p) => {
    return acc + pokemonStore.getBaseStatTotal(p.id);
  }, 0);
});

// Covered unique types
const uniqueTypes = computed(() => {
  const set = new Set();
  teamStore.team.forEach((p) => {
    if (p.types) {
      p.types.forEach((t) => {
        set.add(typeof t === 'string' ? t : t.name);
      });
    }
  });
  return Array.from(set);
});

const emptySlotsCount = computed(() => Math.max(0, 6 - teamStore.count));
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden">
    <!-- Background Watermark Glow -->
    <div
      class="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-poke-blue/5 dark:bg-yellow-400/5 blur-3xl pointer-events-none"
    ></div>

    <!-- Notification Toast -->
    <transition name="fade">
      <div
        v-if="teamStore.notification"
        class="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
        :class="teamStore.notification.isError
          ? 'bg-red-600 text-white'
          : 'bg-emerald-600 text-white'"
      >
        <AlertCircle v-if="teamStore.notification.isError" class="w-4 h-4" />
        <Check v-else class="w-4 h-4" />
        {{ teamStore.notification.msg }}
      </div>
    </transition>

    <!-- Header & Summary Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="p-2 rounded-xl bg-poke-blue/10 dark:bg-yellow-400/10 text-poke-blue dark:text-yellow-400">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                My Battle Team
              </h2>
              <span
                class="px-2.5 py-0.5 rounded-full text-xs font-extrabold"
                :class="teamStore.isFull
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'"
              >
                {{ teamStore.count }} / 6
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Form your custom 6-Pokémon squad from your saved favorites.
            </p>
          </div>
        </div>
      </div>

      <!-- Team Stats Breakdown -->
      <div class="flex items-center gap-4 text-xs">
        <div v-if="teamStore.count > 0" class="text-right">
          <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Party Base Stats</span>
          <span class="font-mono font-black text-poke-blue dark:text-yellow-400 text-sm">
            {{ totalTeamStats }}
          </span>
        </div>

        <div v-if="teamStore.count > 0" class="text-right">
          <span class="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Types Covered</span>
          <span class="font-mono font-black text-slate-700 dark:text-slate-200 text-sm">
            {{ uniqueTypes.length }} / 18
          </span>
        </div>

        <button
          v-if="teamStore.count > 0"
          type="button"
          @click="teamStore.clearTeam"
          class="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors underline"
        >
          Reset Team
        </button>
      </div>
    </div>

    <!-- 6 Team Slots Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <!-- Active Team Member Slots -->
      <div
        v-for="p in teamStore.team"
        :key="p.id"
        class="group relative flex flex-col justify-between bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-3 hover:shadow-md transition-all"
      >
        <!-- Remove from Team Button -->
        <button
          type="button"
          @click="teamStore.removeFromTeam(p.id)"
          class="absolute top-2 right-2 z-10 p-1 rounded-full text-slate-400 hover:text-white hover:bg-red-500 transition-colors"
          title="Remove from team"
          aria-label="Remove from team"
        >
          <X class="w-3.5 h-3.5" />
        </button>

        <RouterLink :to="`/pokemon/${p.id}`" class="block text-center space-y-2">
          <span class="font-mono text-[10px] font-bold text-slate-400 block">
            {{ p.formattedId }}
          </span>
          <div class="flex justify-center h-20">
            <img
              :src="p.sprite"
              :alt="p.displayName"
              class="h-20 w-20 object-contain drop-shadow transition-transform group-hover:scale-110"
            />
          </div>
          <h4 class="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
            {{ p.displayName }}
          </h4>
        </RouterLink>

        <!-- Types -->
        <div class="flex flex-wrap justify-center gap-1 mt-2">
          <TypeBadge
            v-for="t in p.types"
            :key="typeof t === 'string' ? t : t.name"
            :type="typeof t === 'string' ? t : t.name"
            size="sm"
          />
        </div>
      </div>

      <!-- Empty Slots -->
      <div
        v-for="i in emptySlotsCount"
        :key="'empty-' + i"
        class="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 text-center min-h-[160px] select-none"
      >
        <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
          <Plus class="w-4 h-4" />
        </div>
        <span class="text-xs font-bold text-slate-400">
          Slot {{ teamStore.count + i }}
        </span>
        <span class="text-[10px] text-slate-400/80 mt-0.5">
          Add from favorites
        </span>
      </div>
    </div>
  </div>
</template>
