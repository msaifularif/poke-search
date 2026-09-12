<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  maxValue: {
    type: Number,
    default: 255,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
});

const percentage = computed(() => {
  return Math.min(100, Math.round((props.value / props.maxValue) * 100));
});

const barColor = computed(() => {
  if (props.value < 50) return 'bg-red-500 dark:bg-red-400';
  if (props.value < 80) return 'bg-amber-500 dark:bg-amber-400';
  if (props.value < 110) return 'bg-emerald-500 dark:bg-emerald-400';
  if (props.value < 140) return 'bg-sky-500 dark:bg-sky-400';
  return 'bg-purple-500 dark:bg-purple-400';
});
</script>

<template>
  <div class="space-y-1">
    <div v-if="showLabel" class="flex justify-between items-center text-xs font-semibold">
      <span class="text-slate-600 dark:text-slate-300 tracking-wide">{{ label }}</span>
      <span class="text-slate-900 dark:text-white font-mono font-bold">{{ value }}</span>
    </div>
    <div class="h-2.5 w-full bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
        :class="barColor"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>
