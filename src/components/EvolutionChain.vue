<script setup>
import { RouterLink } from 'vue-router';
import { ArrowRight, ArrowDown } from 'lucide-vue-next';

defineProps({
  chain: {
    type: Object,
    default: null,
  },
  currentPokemonId: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div v-if="chain" class="space-y-4">
    <!-- If no evolutions -->
    <div
      v-if="!chain.evolvesTo || chain.evolvesTo.length === 0"
      class="text-sm text-slate-500 dark:text-slate-400 italic text-center py-4"
    >
      This Pokémon does not evolve.
    </div>

    <!-- Evolution Pathway -->
    <div v-else class="flex flex-col lg:flex-row items-center justify-center gap-4 py-4 overflow-x-auto">
      <!-- Stage 1 (Root) -->
      <div class="flex flex-col items-center">
        <RouterLink
          :to="`/pokemon/${chain.id}`"
          class="group flex flex-col items-center p-3 rounded-2xl border transition-all text-center"
          :class="chain.id === currentPokemonId
            ? 'bg-poke-blue/10 dark:bg-yellow-400/10 border-poke-blue dark:border-yellow-400 shadow-md ring-2 ring-poke-blue/30 dark:ring-yellow-400/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:shadow'"
        >
          <img
            :src="chain.sprite"
            :alt="chain.displayName"
            loading="lazy"
            class="w-20 h-20 object-contain drop-shadow transition-transform group-hover:scale-110"
          />
          <span class="font-mono text-[11px] font-bold text-slate-400 mt-1">
            {{ chain.formattedId }}
          </span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
            {{ chain.displayName }}
          </span>
        </RouterLink>
      </div>

      <!-- Stage 2 & 3 Branches -->
      <div
        v-if="chain.evolvesTo && chain.evolvesTo.length > 0"
        class="flex flex-col gap-4 items-center"
      >
        <div
          v-for="branch in chain.evolvesTo"
          :key="branch.id"
          class="flex flex-col lg:flex-row items-center gap-4"
        >
          <!-- Trigger Arrow -->
          <div class="flex flex-col items-center justify-center px-2 text-center">
            <span
              v-if="branch.triggerText"
              class="px-2 py-0.5 mb-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap"
            >
              {{ branch.triggerText }}
            </span>
            <ArrowRight class="hidden lg:block w-5 h-5 text-slate-400" />
            <ArrowDown class="lg:hidden w-5 h-5 text-slate-400" />
          </div>

          <!-- Stage 2 Node -->
          <RouterLink
            :to="`/pokemon/${branch.id}`"
            class="group flex flex-col items-center p-3 rounded-2xl border transition-all text-center"
            :class="branch.id === currentPokemonId
              ? 'bg-poke-blue/10 dark:bg-yellow-400/10 border-poke-blue dark:border-yellow-400 shadow-md ring-2 ring-poke-blue/30 dark:ring-yellow-400/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:shadow'"
          >
            <img
              :src="branch.sprite"
              :alt="branch.displayName"
              loading="lazy"
              class="w-20 h-20 object-contain drop-shadow transition-transform group-hover:scale-110"
            />
            <span class="font-mono text-[11px] font-bold text-slate-400 mt-1">
              {{ branch.formattedId }}
            </span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
              {{ branch.displayName }}
            </span>
          </RouterLink>

          <!-- Stage 3 (If any) -->
          <template v-if="branch.evolvesTo && branch.evolvesTo.length > 0">
            <div
              v-for="subBranch in branch.evolvesTo"
              :key="subBranch.id"
              class="flex flex-col lg:flex-row items-center gap-4"
            >
              <!-- Trigger Arrow -->
              <div class="flex flex-col items-center justify-center px-2 text-center">
                <span
                  v-if="subBranch.triggerText"
                  class="px-2 py-0.5 mb-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap"
                >
                  {{ subBranch.triggerText }}
                </span>
                <ArrowRight class="hidden lg:block w-5 h-5 text-slate-400" />
                <ArrowDown class="lg:hidden w-5 h-5 text-slate-400" />
              </div>

              <!-- Stage 3 Node -->
              <RouterLink
                :to="`/pokemon/${subBranch.id}`"
                class="group flex flex-col items-center p-3 rounded-2xl border transition-all text-center"
                :class="subBranch.id === currentPokemonId
                  ? 'bg-poke-blue/10 dark:bg-yellow-400/10 border-poke-blue dark:border-yellow-400 shadow-md ring-2 ring-poke-blue/30 dark:ring-yellow-400/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:shadow'"
              >
                <img
                  :src="subBranch.sprite"
                  :alt="subBranch.displayName"
                  loading="lazy"
                  class="w-20 h-20 object-contain drop-shadow transition-transform group-hover:scale-110"
                />
                <span class="font-mono text-[11px] font-bold text-slate-400 mt-1">
                  {{ subBranch.formattedId }}
                </span>
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {{ subBranch.displayName }}
                </span>
              </RouterLink>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
