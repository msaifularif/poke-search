<script setup>
import { computed } from 'vue';
import TypeBadge from './TypeBadge.vue';
import { calculateTypeMatchups } from '../api/typeChart';

const props = defineProps({
  types: {
    type: Array,
    required: true,
  },
});

const typeNames = computed(() => {
  return props.types.map(t => (typeof t === 'string' ? t : t.name));
});

const matchups = computed(() => calculateTypeMatchups(typeNames.value));
</script>

<template>
  <div class="space-y-4">
    <!-- Weaknesses (Takes more damage) -->
    <div class="space-y-3">
      <div v-if="matchups.superWeak.length > 0">
        <span class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block mb-1.5">
          Super Weak (4× Damage)
        </span>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in matchups.superWeak"
            :key="item.type"
            class="flex items-center gap-1.5"
          >
            <TypeBadge :type="item.type" size="sm" />
            <span class="text-[11px] font-mono font-bold text-red-600 dark:text-red-400">4×</span>
          </div>
        </div>
      </div>

      <div v-if="matchups.weak.length > 0">
        <span class="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1.5">
          Weak (2× Damage)
        </span>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in matchups.weak"
            :key="item.type"
            class="flex items-center gap-1.5"
          >
            <TypeBadge :type="item.type" size="sm" />
            <span class="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">2×</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Resistances (Takes less damage) -->
    <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
      <div v-if="matchups.resistant.length > 0">
        <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1.5">
          Resistant (½× Damage)
        </span>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in matchups.resistant"
            :key="item.type"
            class="flex items-center gap-1.5"
          >
            <TypeBadge :type="item.type" size="sm" />
            <span class="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">½×</span>
          </div>
        </div>
      </div>

      <div v-if="matchups.superResistant.length > 0">
        <span class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block mb-1.5">
          Super Resistant (¼× Damage)
        </span>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in matchups.superResistant"
            :key="item.type"
            class="flex items-center gap-1.5"
          >
            <TypeBadge :type="item.type" size="sm" />
            <span class="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">¼×</span>
          </div>
        </div>
      </div>

      <div v-if="matchups.immune.length > 0">
        <span class="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1.5">
          Immune (0× Damage)
        </span>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in matchups.immune"
            :key="item.type"
            class="flex items-center gap-1.5"
          >
            <TypeBadge :type="item.type" size="sm" />
            <span class="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400">0×</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
